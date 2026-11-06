"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { accounts, canRelease, fundingLines, releaseLines, splitTranches } from "@/lib/invest"
import { balance, post } from "@/lib/ledger"
import { requireApproved } from "@/lib/session"

type Result = { error?: string } | null

/**
 * Simulated payment: the investor pays amount + fee. In one transaction the deal becomes ACTIVE,
 * the money is posted to the deal's escrow account, and the tranche schedule is created.
 */
export async function fundDealAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved("INVESTOR")
  const dealId = String(form.get("dealId") ?? "")
  const deal = await db.deal.findFirst({
    where: { id: dealId, investorId: user.id },
    include: { round: { include: { milestones: { orderBy: { position: "asc" }, include: { _count: { select: { submissions: true } } } } } } },
  })
  if (!deal) return { error: "الصفقة غير موجودة." }

  const ms = deal.round.milestones
  const tranches = splitTranches(deal.amountPiasters, ms.map((m) => m.shareBps))

  const ok = await db.$transaction(async (tx) => {
    const moved = await tx.deal.updateMany({ where: { id: deal.id, investorId: user.id, status: "AWAITING_FUNDING" }, data: { status: "ACTIVE", fundedAt: new Date() } })
    if (!moved.count) return false
    await tx.dealMilestone.createMany({
      data: ms.map((m, i) => ({
        dealId: deal.id,
        milestoneId: m.id,
        position: m.position,
        tranchePiasters: tranches[i],
        // Proof already submitted before this investor funded → ready for their decision.
        status: m._count.submissions > 0 ? ("AWAITING_APPROVAL" as const) : ("LOCKED" as const),
      })),
    })
    for (const t of fundingLines({ dealId: deal.id, investorId: user.id, amount: deal.amountPiasters, fee: deal.feePiasters })) {
      await post(tx, t.kind, t.lines, { dealId: deal.id, memo: t.kind === "FUNDING" ? "تمويل الصفقة في الضمان" : "عمولة المنصة" })
    }
    await audit(tx, { actorId: user.id, action: "deal.funded", targetType: "Deal", targetId: deal.id, meta: { amount: deal.amountPiasters, fee: deal.feePiasters } })
    return true
  })
  if (!ok) return { error: "الصفقة اتموّلت بالفعل أو حالتها اتغيّرت." }
  revalidatePath(`/deals/${deal.id}`)
  return null
}

/** Investor approves a milestone (releases its tranche from escrow) or asks for changes. */
export async function decideMilestoneAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved("INVESTOR")
  const id = String(form.get("dealMilestoneId") ?? "")
  const decision = String(form.get("decision") ?? "")
  const note = String(form.get("note") ?? "").trim().slice(0, 1000)

  const dm = await db.dealMilestone.findFirst({
    where: { id, deal: { investorId: user.id, status: "ACTIVE" } },
    include: { deal: { include: { round: { select: { entrepreneurId: true } } } }, milestone: { select: { title: true } } },
  })
  if (!dm) return { error: "المرحلة غير موجودة." }

  if (decision === "changes") {
    if (note.length < 10) return { error: "اكتب ملاحظة واضحة لرائد الأعمال (10 حروف على الأقل)." }
    const res = await db.dealMilestone.updateMany({ where: { id, status: "AWAITING_APPROVAL" }, data: { status: "CHANGES_REQUESTED", investorNote: note, decidedAt: new Date() } })
    if (!res.count) return { error: "حالة المرحلة اتغيّرت. حدّث الصفحة." }
    await audit(db, { actorId: user.id, action: "milestone.changes_requested", targetType: "DealMilestone", targetId: id })
    revalidatePath(`/deals/${dm.dealId}`)
    return null
  }

  const prevReleased =
    dm.position === 1 || (await db.dealMilestone.count({ where: { dealId: dm.dealId, position: dm.position - 1, status: "RELEASED" } })) > 0
  if (!canRelease(dm.status, prevReleased)) return { error: "لازم تعتمد المرحلة اللي قبلها الأول." }

  const ok = await db.$transaction(async (tx) => {
    const res = await tx.dealMilestone.updateMany({ where: { id, status: "AWAITING_APPROVAL" }, data: { status: "RELEASED", decidedAt: new Date(), investorNote: note || null } })
    if (!res.count) return false
    // Defensive: escrow can never go negative.
    if ((await balance(accounts.escrow(dm.dealId), tx)) < dm.tranchePiasters) throw new Error("ESCROW_SHORT")
    await post(tx, "RELEASE", releaseLines({ dealId: dm.dealId, entrepreneurId: dm.deal.round.entrepreneurId, tranche: dm.tranchePiasters }), {
      dealId: dm.dealId,
      memo: `إفراج شريحة: ${dm.milestone.title}`,
    })
    const left = await tx.dealMilestone.count({ where: { dealId: dm.dealId, status: { not: "RELEASED" } } })
    if (!left) await tx.deal.update({ where: { id: dm.dealId }, data: { status: "COMPLETED", completedAt: new Date() } })
    await audit(tx, { actorId: user.id, action: "milestone.released", targetType: "DealMilestone", targetId: id, meta: { tranche: dm.tranchePiasters } })
    return true
  })
  if (!ok) return { error: "المرحلة اتعمل عليها قرار بالفعل." }
  revalidatePath(`/deals/${dm.dealId}`)
  return null
}
