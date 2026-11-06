"use server"

import { revalidatePath } from "next/cache"
import type { OrderStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { accounts, orderPaymentLines, orderReleaseLines } from "@/lib/invest"
import { balance, post } from "@/lib/ledger"
import { requireApproved } from "@/lib/session"
import { nextOrderStep, stampFor } from "@/lib/supply"

type Result = { error?: string } | null

/** Simulated payment: the buyer pays amount + fee; the amount is held in the order's escrow. */
export async function payOrderAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved("ENTREPRENEUR")
  const orderId = String(form.get("orderId") ?? "")
  const order = await db.order.findFirst({ where: { id: orderId, buyerId: user.id } })
  if (!order) return { error: "الطلب غير موجود." }

  const ok = await db.$transaction(async (tx) => {
    const moved = await tx.order.updateMany({ where: { id: orderId, buyerId: user.id, status: "AWAITING_PAYMENT" }, data: { status: "ACCEPTED", paidAt: new Date() } })
    if (!moved.count) return false
    for (const t of orderPaymentLines({ orderId, buyerId: user.id, amount: order.amountPiasters, fee: order.feePiasters })) {
      await post(tx, t.kind, t.lines, { orderId, memo: t.kind === "FUNDING" ? "دفع الطلب في الضمان" : "عمولة المنصة" })
    }
    await audit(tx, { actorId: user.id, action: "order.paid", targetType: "Order", targetId: orderId, meta: { amount: order.amountPiasters, fee: order.feePiasters } })
    return true
  })
  if (!ok) return { error: "الطلب اتدفع بالفعل أو حالته اتغيّرت." }
  revalidatePath(`/orders/${orderId}`)
  return null
}

/**
 * Moves an order one step forward, if this user is the party allowed to take that step.
 * Confirming receipt releases the escrow to the supplier's wallet in the same transaction.
 */
export async function advanceOrderAction(_prev: Result, form: FormData): Promise<Result> {
  const user = await requireApproved()
  const orderId = String(form.get("orderId") ?? "")
  const from = String(form.get("from") ?? "") as OrderStatus
  if (from === "AWAITING_PAYMENT") return { error: "الطلب لازم يتدفع في الضمان الأول." }

  const order = await db.order.findUnique({ where: { id: orderId } })
  if (!order || (order.buyerId !== user.id && order.supplierId !== user.id)) return { error: "الطلب غير موجود." }

  const party = order.supplierId === user.id ? "supplier" : "buyer"
  const step = nextOrderStep(from, party)
  if (!step) return { error: "الخطوة دي مش متاحة ليك." }
  const stamp = stampFor(step.to)

  // `from` comes from the page the user saw; the conditional update rejects it if the order moved meanwhile.
  const moved = await db.$transaction(async (tx) => {
    const res = await tx.order.updateMany({
      where: { id: orderId, status: from, [party === "supplier" ? "supplierId" : "buyerId"]: user.id },
      data: { status: step.to, ...(stamp ? { [stamp]: new Date() } : {}) },
    })
    if (!res.count) return false
    if (step.to === "COMPLETED") {
      const held = await balance(accounts.orderEscrow(orderId), tx)
      // Orders accepted before payments existed have nothing in escrow; there is nothing to release for them.
      if (held > 0) {
        if (held !== order.amountPiasters) throw new Error("ESCROW_MISMATCH")
        await post(tx, "RELEASE", orderReleaseLines({ orderId, supplierId: order.supplierId, amount: held }), { orderId, memo: "تحصيل قيمة الطلب بعد تأكيد الاستلام" })
      }
    }
    await audit(tx, { actorId: user.id, action: `order.${step.to.toLowerCase()}`, targetType: "Order", targetId: orderId })
    return true
  })
  if (!moved) return { error: "حالة الطلب اتغيّرت. حدّث الصفحة." }
  revalidatePath(`/orders/${orderId}`)
  return null
}
