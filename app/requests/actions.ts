"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { flatten, type FieldErrors } from "@/lib/schemas"
import { requireApproved } from "@/lib/session"
import { requestSchema } from "@/lib/supply-schemas"

export type RequestFormState = { errors: FieldErrors; values: Record<string, string> } | null
export type ActionResult = { error?: string } | null

export async function createRequestAction(_prev: RequestFormState, form: FormData): Promise<RequestFormState> {
  const user = await requireApproved("ENTREPRENEUR")
  const raw: Record<string, string> = {}
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v

  const parsed = requestSchema.safeParse(raw)
  if (!parsed.success) return { errors: flatten(parsed.error), values: raw }
  const d = parsed.data

  const created = await db.$transaction(async (tx) => {
    const r = await tx.supplyRequest.create({
      data: {
        entrepreneurId: user.id,
        kind: d.kind,
        title: d.title,
        category: d.category,
        quantity: d.quantity,
        unit: d.unit,
        budgetMinPiasters: d.budgetMin,
        budgetMaxPiasters: d.budgetMax,
        offersDeadline: d.offersDeadline,
        description: d.description,
      },
    })
    await audit(tx, { actorId: user.id, action: "request.created", targetType: "SupplyRequest", targetId: r.id })
    return r
  })
  redirect(`/requests/${created.id}`)
}

/** Closes an open request without awarding it; pending offers are rejected. */
export async function closeRequestAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const user = await requireApproved("ENTREPRENEUR")
  const requestId = String(form.get("requestId") ?? "")

  const ok = await db.$transaction(async (tx) => {
    const moved = await tx.supplyRequest.updateMany({
      where: { id: requestId, entrepreneurId: user.id, status: "OPEN" },
      data: { status: "CLOSED" },
    })
    if (!moved.count) return false
    await tx.offer.updateMany({ where: { requestId, status: "PENDING" }, data: { status: "REJECTED" } })
    await audit(tx, { actorId: user.id, action: "request.closed", targetType: "SupplyRequest", targetId: requestId })
    return true
  })
  if (!ok) return { error: "الطلب ده مش مفتوح دلوقتي." }
  revalidatePath(`/requests/${requestId}`)
  return null
}

/**
 * Accepts one offer. In a single transaction:
 *   request OPEN → AWARDED, offer PENDING → ACCEPTED, other pending offers → REJECTED, order created.
 * Every step is a conditional update, so a double click or a second tab cannot award twice.
 */
export async function acceptOfferAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const user = await requireApproved("ENTREPRENEUR")
  const offerId = String(form.get("offerId") ?? "")

  const offer = await db.offer.findUnique({ where: { id: offerId }, include: { request: true } })
  if (!offer || offer.request.entrepreneurId !== user.id) return { error: "العرض غير موجود." }

  const orderId = await db.$transaction(async (tx) => {
    const awarded = await tx.supplyRequest.updateMany({
      where: { id: offer.requestId, entrepreneurId: user.id, status: "OPEN" },
      data: { status: "AWARDED" },
    })
    if (!awarded.count) return null
    const accepted = await tx.offer.updateMany({ where: { id: offer.id, status: "PENDING" }, data: { status: "ACCEPTED" } })
    if (!accepted.count) throw new Error("OFFER_NOT_PENDING") // rolls back the award
    await tx.offer.updateMany({
      where: { requestId: offer.requestId, status: "PENDING", NOT: { id: offer.id } },
      data: { status: "REJECTED" },
    })
    const order = await tx.order.create({
      data: {
        requestId: offer.requestId,
        offerId: offer.id,
        buyerId: user.id,
        supplierId: offer.supplierId,
        amountPiasters: offer.pricePiasters,
      },
    })
    await audit(tx, { actorId: user.id, action: "offer.accepted", targetType: "Offer", targetId: offer.id, meta: { orderId: order.id } })
    return order.id
  }).catch((e: unknown) => {
    if (e instanceof Error && e.message === "OFFER_NOT_PENDING") return null
    throw e
  })

  if (!orderId) return { error: "مينفعش تقبل العرض ده: الطلب أو العرض اتغيّرت حالته. حدّث الصفحة." }
  redirect(`/orders/${orderId}`)
}
