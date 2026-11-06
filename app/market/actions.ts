"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { flatten, type FieldErrors } from "@/lib/schemas"
import { requireApproved } from "@/lib/session"
import { isAcceptingOffers, isOfferEditable, kindsFor } from "@/lib/supply"
import { offerSchema } from "@/lib/supply-schemas"

export type OfferFormState = { errors: FieldErrors; saved?: boolean } | null

/** Creates the supplier's offer, or updates it while it is still pending/withdrawn. */
export async function submitOfferAction(_prev: OfferFormState, form: FormData): Promise<OfferFormState> {
  const user = await requireApproved("SUPPLIER")
  const parsed = offerSchema.safeParse({
    requestId: form.get("requestId"),
    price: form.get("price"),
    deliveryDays: form.get("deliveryDays"),
    note: form.get("note") ?? undefined,
  })
  if (!parsed.success) return { errors: flatten(parsed.error) }
  const { requestId, price, deliveryDays, note } = parsed.data

  const [request, profile] = await Promise.all([
    db.supplyRequest.findUnique({ where: { id: requestId } }),
    db.supplierProfile.findUnique({ where: { userId: user.id }, select: { supplyType: true } }),
  ])
  if (!request || !isAcceptingOffers(request)) return { errors: { form: "الطلب ده مش بيستقبل عروض دلوقتي." } }
  if (!kindsFor(profile?.supplyType).includes(request.kind)) return { errors: { form: "نوع الطلب مش ضمن اللي حسابك بيقدّمه." } }
  if (request.entrepreneurId === user.id) return { errors: { form: "مينفعش تقدّم عرض على طلبك." } }

  const existing = await db.offer.findUnique({ where: { requestId_supplierId: { requestId, supplierId: user.id } } })
  if (existing && !isOfferEditable(existing.status)) return { errors: { form: "العرض ده اتقفل ومينفعش يتعدّل." } }

  const ok = await db.$transaction(async (tx) => {
    // Re-check inside the transaction: the request must still be open at write time.
    const stillOpen = await tx.supplyRequest.count({ where: { id: requestId, status: "OPEN", offersDeadline: { gte: new Date() } } })
    if (!stillOpen) return false
    const data = { pricePiasters: price, deliveryDays, note, status: "PENDING" as const }
    if (existing) {
      const updated = await tx.offer.updateMany({ where: { id: existing.id, status: { in: ["PENDING", "WITHDRAWN"] } }, data })
      if (!updated.count) return false
    } else {
      await tx.offer.create({ data: { requestId, supplierId: user.id, ...data } })
    }
    await audit(tx, { actorId: user.id, action: existing ? "offer.updated" : "offer.submitted", targetType: "SupplyRequest", targetId: requestId, meta: { price } })
    return true
  })
  if (!ok) return { errors: { form: "حالة الطلب أو العرض اتغيّرت. حدّث الصفحة." } }
  revalidatePath(`/market/${requestId}`)
  return { errors: {}, saved: true }
}

export async function withdrawOfferAction(_prev: { error?: string } | null, form: FormData) {
  const user = await requireApproved("SUPPLIER")
  const offerId = String(form.get("offerId") ?? "")
  const res = await db.offer.updateMany({ where: { id: offerId, supplierId: user.id, status: "PENDING" }, data: { status: "WITHDRAWN" } })
  if (!res.count) return { error: "مينفعش تسحب العرض ده دلوقتي." }
  await audit(db, { actorId: user.id, action: "offer.withdrawn", targetType: "Offer", targetId: offerId })
  revalidatePath("/market")
  revalidatePath("/offers")
  return null
}
