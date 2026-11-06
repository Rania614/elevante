"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { withdrawalLines } from "@/lib/invest"
import { post } from "@/lib/ledger"
import { requireAdmin } from "@/lib/session"

type Result = { error?: string } | null

export async function decideWithdrawalAction(_prev: Result, form: FormData): Promise<Result> {
  const admin = await requireAdmin()
  const id = String(form.get("withdrawalId") ?? "")
  const decision = String(form.get("decision") ?? "")
  const ref = String(form.get("transferRef") ?? "").trim().slice(0, 60)
  const note = String(form.get("note") ?? "").trim().slice(0, 500)

  if (decision === "pay" && ref.length < 4) return { error: "اكتب رقم مرجع التحويل البنكي." }
  if (decision === "reject" && note.length < 5) return { error: "اكتب سبب الرفض للمستخدم." }
  if (decision !== "pay" && decision !== "reject") return { error: "اختر القرار." }

  const w = await db.withdrawal.findUnique({ where: { id } })
  if (!w) return { error: "الطلب غير موجود." }

  const ok = await db.$transaction(async (tx) => {
    const moved = await tx.withdrawal.updateMany({
      where: { id, status: "PENDING" },
      data: decision === "pay"
        ? { status: "PAID", transferRef: ref, reviewerId: admin.id, decidedAt: new Date() }
        : { status: "REJECTED", adminNote: note, reviewerId: admin.id, decidedAt: new Date() },
    })
    if (!moved.count) return false
    const stage = decision === "pay" ? "paid" : "returned"
    await post(tx, decision === "pay" ? "WITHDRAWAL_PAID" : "WITHDRAWAL_RETURNED", withdrawalLines(stage, { withdrawalId: id, userId: w.userId, amount: w.amountPiasters }), {
      withdrawalId: id,
      memo: decision === "pay" ? "تم تحويل السحب للبنك" : "سحب مرفوض — المبلغ رجع للمحفظة",
    })
    await audit(tx, { actorId: admin.id, action: decision === "pay" ? "withdrawal.paid" : "withdrawal.rejected", targetType: "Withdrawal", targetId: id })
    return true
  })
  if (!ok) return { error: "الطلب ده اتعمل عليه قرار بالفعل." }
  revalidatePath("/admin/withdrawals")
  return null
}
