"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { normalizeDigits } from "@/lib/national-id"
import { canResend, issueOtp, verifyOtp } from "@/lib/otp"
import { deliverOtp } from "@/lib/otp-delivery"
import { requireUser } from "@/lib/session"

export type OtpState = { error?: string; info?: string } | null

const MESSAGES = {
  invalid: "الرمز غير صحيح",
  expired: "الرمز انتهت صلاحيته. اطلب رمز جديد.",
  locked: "محاولات كتير غلط. اطلب رمز جديد.",
  missing: "مفيش رمز صالح. اطلب رمز جديد.",
} as const

export async function verifyPhoneAction(_prev: OtpState, form: FormData): Promise<OtpState> {
  const user = await requireUser()
  if (user.status !== "PENDING_PHONE") redirect("/verification")

  const code = normalizeDigits(String(form.get("code") ?? ""))
  if (!/^\d{6}$/.test(code)) return { error: "اكتب الرمز المكوّن من 6 أرقام" }

  const result = await verifyOtp(user.id, code)
  if (result !== "ok") return { error: MESSAGES[result] }

  await db.$transaction(async (tx) => {
    // Conditional update: a second submit of the same code cannot run this twice.
    const updated = await tx.user.updateMany({
      where: { id: user.id, status: "PENDING_PHONE" },
      data: { status: "PENDING_REVIEW", phoneVerifiedAt: new Date() },
    })
    if (updated.count) await audit(tx, { actorId: user.id, action: "user.phone_verified", targetType: "User", targetId: user.id })
  })
  ;(await cookies()).delete("elv_dev_otp")
  redirect("/verification")
}

export async function resendOtpAction(_prev: OtpState): Promise<OtpState> {
  const user = await requireUser()
  if (user.status !== "PENDING_PHONE") redirect("/verification")
  const r = await canResend(user.id)
  if (!r.ok) return { error: `تقدر تطلب رمز جديد بعد ${r.waitSeconds} ثانية` }
  await deliverOtp(user.phone, await issueOtp(user.id))
  return { info: "اتبعت رمز جديد" }
}
