"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { investmentOfferSchema } from "@/lib/invest-schemas"
import { formatEgp } from "@/lib/money"
import { flatten, type FieldErrors } from "@/lib/schemas"
import { requireApproved } from "@/lib/session"

export type InvestState = { errors: FieldErrors; saved?: boolean } | null

export async function submitInvestmentAction(_prev: InvestState, form: FormData): Promise<InvestState> {
  const user = await requireApproved("INVESTOR")
  const parsed = investmentOfferSchema.safeParse({ roundId: form.get("roundId"), amount: form.get("amount"), note: form.get("note") ?? undefined })
  if (!parsed.success) return { errors: flatten(parsed.error) }
  const { roundId, amount, note } = parsed.data

  const round = await db.investmentRound.findUnique({ where: { id: roundId } })
  if (!round || round.status !== "OPEN" || round.closesAt < new Date()) return { errors: { form: "الجولة دي مش بتستقبل عروض." } }
  if (amount < round.minTicketPiasters) return { errors: { amount: `أقل مساهمة ${formatEgp(round.minTicketPiasters)}` } }
  const remaining = round.targetPiasters - round.committedPiasters
  if (amount > remaining) return { errors: { amount: `المتبقي في الجولة ${formatEgp(remaining)}` } }

  const existing = await db.investmentOffer.findUnique({ where: { roundId_investorId: { roundId, investorId: user.id } } })
  if (existing && !["PENDING", "WITHDRAWN"].includes(existing.status)) return { errors: { form: "عرضك على الجولة دي اتقفل ومينفعش يتعدّل." } }

  await db.$transaction(async (tx) => {
    if (existing) {
      const res = await tx.investmentOffer.updateMany({ where: { id: existing.id, status: { in: ["PENDING", "WITHDRAWN"] } }, data: { amountPiasters: amount, note, status: "PENDING" } })
      if (!res.count) throw new Error("STALE")
    } else {
      await tx.investmentOffer.create({ data: { roundId, investorId: user.id, amountPiasters: amount, note } })
    }
    await audit(tx, { actorId: user.id, action: existing ? "investment.updated" : "investment.offered", targetType: "InvestmentRound", targetId: roundId, meta: { amount } })
  })
  revalidatePath(`/invest/${roundId}`)
  return { errors: {}, saved: true }
}

export async function withdrawInvestmentAction(_prev: { error?: string } | null, form: FormData) {
  const user = await requireApproved("INVESTOR")
  const offerId = String(form.get("offerId") ?? "")
  const res = await db.investmentOffer.updateMany({ where: { id: offerId, investorId: user.id, status: "PENDING" }, data: { status: "WITHDRAWN" } })
  if (!res.count) return { error: "مينفعش تسحب العرض ده دلوقتي." }
  await audit(db, { actorId: user.id, action: "investment.withdrawn", targetType: "InvestmentOffer", targetId: offerId })
  revalidatePath("/invest")
  return null
}
