"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { canSubmitProof, equityFor, feeFor } from "@/lib/invest"
import { proofSchema, readMilestones, roundSchema } from "@/lib/invest-schemas"
import { flatten, type FieldErrors } from "@/lib/schemas"
import { requireApproved } from "@/lib/session"

export type RoundFormState = { errors: FieldErrors; values: Record<string, string>; milestones: { title: string; due: string; share: string; proof: string }[] } | null
type Result = { error?: string } | null

export async function createRoundAction(_prev: RoundFormState, form: FormData): Promise<RoundFormState> {
  const user = await requireApproved("ENTREPRENEUR")
  const values: Record<string, string> = {}
  for (const k of ["title", "pitch", "useOfFunds", "target", "equity", "minTicket", "closesAt"]) values[k] = String(form.get(k) ?? "")
  const milestones = readMilestones(form)

  const parsed = roundSchema.safeParse({ ...values, milestones })
  if (!parsed.success) {
    const errors = flatten(parsed.error)
    // Point at the specific milestone row when possible.
    for (const i of parsed.error.issues) if (i.path[0] === "milestones" && typeof i.path[1] === "number") errors[`m${i.path[1]}_${String(i.path[2])}`] = i.message
    return { errors, values, milestones }
  }
  const d = parsed.data

  const open = await db.investmentRound.count({ where: { entrepreneurId: user.id, status: "OPEN" } })
  if (open) return { errors: { form: "عندك جولة تمويل مفتوحة بالفعل. اقفليها الأول قبل ما تفتحي جولة جديدة." }, values, milestones }

  const round = await db.$transaction(async (tx) => {
    const r = await tx.investmentRound.create({
      data: {
        entrepreneurId: user.id,
        title: d.title,
        pitch: d.pitch,
        useOfFunds: d.useOfFunds,
        targetPiasters: d.target,
        equityBps: d.equity,
        minTicketPiasters: d.minTicket,
        closesAt: d.closesAt.at,
        milestones: {
          create: d.milestones.map((m, i) => ({ position: i + 1, title: m.title, dueDate: m.due.at, shareBps: m.share, proofNeeded: m.proof })),
        },
      },
    })
    await audit(tx, { actorId: user.id, action: "round.created", targetType: "InvestmentRound", targetId: r.id })
    return r
  })
  redirect(`/rounds/${round.id}`)
}

/**
 * Accepts an investor's offer without ever over-committing the round:
 * the round row is updated only if committed + amount ≤ target (a single atomic UPDATE),
 * so two acceptances racing for the last part of the round cannot both succeed.
 */
export async function acceptInvestmentAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved("ENTREPRENEUR")
  const offerId = String(form.get("offerId") ?? "")
  const offer = await db.investmentOffer.findUnique({ where: { id: offerId }, include: { round: true } })
  if (!offer || offer.round.entrepreneurId !== user.id) return { error: "العرض غير موجود." }
  const r = offer.round

  const result = await db
    .$transaction(async (tx) => {
      const reserved = await tx.investmentRound.updateMany({
        where: { id: r.id, entrepreneurId: user.id, status: "OPEN", committedPiasters: { lte: r.targetPiasters - offer.amountPiasters } },
        data: { committedPiasters: { increment: offer.amountPiasters } },
      })
      if (!reserved.count) return "FULL" as const
      const accepted = await tx.investmentOffer.updateMany({ where: { id: offer.id, status: "PENDING" }, data: { status: "ACCEPTED" } })
      if (!accepted.count) throw new Error("OFFER_NOT_PENDING")
      await tx.deal.create({
        data: {
          roundId: r.id,
          offerId: offer.id,
          investorId: offer.investorId,
          amountPiasters: offer.amountPiasters,
          feePiasters: feeFor(offer.amountPiasters),
          equityBps: equityFor(offer.amountPiasters, r.targetPiasters, r.equityBps),
        },
      })
      // Fully committed → close the round and turn down whatever is still pending.
      const full = await tx.investmentRound.updateMany({ where: { id: r.id, committedPiasters: r.targetPiasters }, data: { status: "CLOSED" } })
      if (full.count) await tx.investmentOffer.updateMany({ where: { roundId: r.id, status: "PENDING" }, data: { status: "REJECTED" } })
      await audit(tx, { actorId: user.id, action: "investment.accepted", targetType: "InvestmentOffer", targetId: offer.id })
      return "OK" as const
    })
    .catch((e: unknown) => {
      if (e instanceof Error && e.message === "OFFER_NOT_PENDING") return "STALE" as const
      throw e
    })

  if (result === "FULL") return { error: "المبلغ ده أكبر من المتبقي في الجولة، أو الجولة اتقفلت." }
  if (result === "STALE") return { error: "العرض اتغيّرت حالته. حدّث الصفحة." }
  revalidatePath(`/rounds/${r.id}`)
  return null
}

export async function rejectInvestmentAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved("ENTREPRENEUR")
  const offerId = String(form.get("offerId") ?? "")
  const res = await db.investmentOffer.updateMany({ where: { id: offerId, status: "PENDING", round: { entrepreneurId: user.id } }, data: { status: "REJECTED" } })
  if (!res.count) return { error: "مينفعش ترفضي العرض ده دلوقتي." }
  await audit(db, { actorId: user.id, action: "investment.rejected", targetType: "InvestmentOffer", targetId: offerId })
  revalidatePath("/rounds")
  return null
}

export async function closeRoundAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved("ENTREPRENEUR")
  const roundId = String(form.get("roundId") ?? "")
  const ok = await db.$transaction(async (tx) => {
    const res = await tx.investmentRound.updateMany({ where: { id: roundId, entrepreneurId: user.id, status: "OPEN" }, data: { status: "CLOSED" } })
    if (!res.count) return false
    await tx.investmentOffer.updateMany({ where: { roundId, status: "PENDING" }, data: { status: "REJECTED" } })
    await audit(tx, { actorId: user.id, action: "round.closed", targetType: "InvestmentRound", targetId: roundId })
    return true
  })
  if (!ok) return { error: "الجولة مش مفتوحة." }
  revalidatePath(`/rounds/${roundId}`)
  return null
}

export type ProofState = { errors: FieldErrors; saved?: boolean } | null

/** Submits proof for a milestone; every funded deal's tranche for it moves to "awaiting approval". */
export async function submitProofAction(_prev: ProofState, form: FormData): Promise<ProofState> {
  const user = await requireApproved("ENTREPRENEUR")
  const parsed = proofSchema.safeParse({ milestoneId: form.get("milestoneId"), summary: form.get("summary"), proofUrl: form.get("proofUrl") ?? undefined })
  if (!parsed.success) return { errors: flatten(parsed.error) }
  const { milestoneId, summary, proofUrl } = parsed.data

  const m = await db.roundMilestone.findUnique({ where: { id: milestoneId }, include: { round: true } })
  if (!m || m.round.entrepreneurId !== user.id) return { errors: { form: "المرحلة غير موجودة." } }
  const [prevProof, funded] = await Promise.all([
    m.position === 1 ? Promise.resolve(1) : db.milestoneSubmission.count({ where: { milestone: { roundId: m.roundId, position: m.position - 1 } } }),
    db.deal.count({ where: { roundId: m.roundId, status: { in: ["ACTIVE", "COMPLETED"] } } }),
  ])
  if (!canSubmitProof(m.position, prevProof > 0, funded > 0)) {
    return { errors: { form: funded ? "لازم ترفعي إثبات المرحلة اللي قبلها الأول." : "لسه مفيش تمويل متحوّل للضمان في الجولة دي." } }
  }
  const blocked = await db.dealMilestone.count({ where: { milestoneId, status: "AWAITING_APPROVAL" } })
  const pendingFix = await db.dealMilestone.count({ where: { milestoneId, status: { in: ["LOCKED", "CHANGES_REQUESTED"] }, deal: { status: "ACTIVE" } } })
  if (!pendingFix) return { errors: { form: blocked ? "الإثبات اتبعت بالفعل وبانتظار المستثمرين." : "مفيش شرائح محتاجة إثبات للمرحلة دي." } }

  await db.$transaction(async (tx) => {
    await tx.milestoneSubmission.create({ data: { milestoneId, summary, proofUrl } })
    await tx.dealMilestone.updateMany({
      where: { milestoneId, status: { in: ["LOCKED", "CHANGES_REQUESTED"] }, deal: { status: "ACTIVE" } },
      data: { status: "AWAITING_APPROVAL", investorNote: null },
    })
    await audit(tx, { actorId: user.id, action: "milestone.proof_submitted", targetType: "RoundMilestone", targetId: milestoneId })
  })
  revalidatePath(`/rounds/${m.roundId}`)
  return { errors: {}, saved: true }
}
