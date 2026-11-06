"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { encrypt } from "@/lib/crypto"
import { accounts, withdrawalError, withdrawalLines } from "@/lib/invest"
import { balance, post } from "@/lib/ledger"
import { parseEgp } from "@/lib/money"
import { normalizeDigits } from "@/lib/national-id"
import { flatten, type FieldErrors } from "@/lib/schemas"
import { requireApproved } from "@/lib/session"

export type WithdrawState = { errors: FieldErrors; done?: boolean } | null

const schema = z.object({
  amount: z.string().transform((v, ctx) => {
    const p = parseEgp(v)
    if (p == null || p <= 0) {
      ctx.addIssue({ code: "custom", message: "اكتب المبلغ بالجنيه" })
      return z.NEVER
    }
    return p
  }),
  bankName: z.string().trim().min(2, "اكتب اسم البنك").max(80),
  accountHolder: z.string().trim().min(6, "اكتب اسم صاحب الحساب كما في البنك").max(120),
  account: z
    .string()
    .transform((v) => normalizeDigits(v).replace(/[\s-]/g, "").toUpperCase())
    .refine((v) => /^[A-Z0-9]{10,34}$/.test(v), "رقم الحساب أو الـ IBAN غير صحيح"),
})

/**
 * Requests a payout. The amount is moved from the wallet to a pending-payout account immediately,
 * so it cannot be spent or withdrawn twice while the admin reviews it.
 */
export async function requestWithdrawalAction(_prev: WithdrawState, form: FormData): Promise<WithdrawState> {
  const user = await requireApproved()
  if (user.role !== "ENTREPRENEUR" && user.role !== "SUPPLIER") redirect("/dashboard")

  const parsed = schema.safeParse({ amount: form.get("amount"), bankName: form.get("bankName"), accountHolder: form.get("accountHolder"), account: form.get("account") })
  if (!parsed.success) return { errors: flatten(parsed.error) }
  const { amount, bankName, accountHolder, account } = parsed.data

  const result = await db.$transaction(async (tx) => {
    // Serialise withdrawals per user: two requests sent at once cannot both pass the balance check.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id}))`
    const available = await balance(accounts.wallet(user.id), tx)
    const err = withdrawalError(amount, available)
    if (err) return { error: err }
    const w = await tx.withdrawal.create({
      data: { userId: user.id, amountPiasters: amount, bankName, accountHolder, accountEnc: encrypt(account), accountLast4: account.slice(-4) },
    })
    await post(tx, "WITHDRAWAL_HOLD", withdrawalLines("hold", { withdrawalId: w.id, userId: user.id, amount }), { withdrawalId: w.id, memo: "طلب سحب — محجوز لحد موافقة الإدارة" })
    await audit(tx, { actorId: user.id, action: "withdrawal.requested", targetType: "Withdrawal", targetId: w.id, meta: { amount } })
    return { error: null }
  })
  if (result.error) return { errors: { amount: result.error } }
  revalidatePath("/wallet")
  return { errors: {}, done: true }
}
