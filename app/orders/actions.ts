"use server"

import { revalidatePath } from "next/cache"
import type { OrderStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { requireApproved } from "@/lib/session"
import { nextOrderStep, stampFor } from "@/lib/supply"

/** Moves an order one step forward, if this user is the party allowed to take that step. */
export async function advanceOrderAction(_prev: { error?: string } | null, form: FormData) {
  const user = await requireApproved()
  const orderId = String(form.get("orderId") ?? "")
  const from = String(form.get("from") ?? "") as OrderStatus

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
    if (res.count) await audit(tx, { actorId: user.id, action: `order.${step.to.toLowerCase()}`, targetType: "Order", targetId: orderId })
    return res.count > 0
  })
  if (!moved) return { error: "حالة الطلب اتغيّرت. حدّث الصفحة." }
  revalidatePath(`/orders/${orderId}`)
  return null
}
