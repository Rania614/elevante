"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { canResend, issueOtp } from "@/lib/otp"
import { deliverOtp } from "@/lib/otp-delivery"
import { flatten, loginSchema, type FieldErrors } from "@/lib/schemas"
import { endSession, homeFor, startSession } from "@/lib/session"

export type LoginState = { errors: FieldErrors; email?: string } | null

// Compared against when the email does not exist, so both paths take similar time.
const DUMMY_HASH = "$2b$12$yR0N39Ewb.PFGaos2M.yDOrc4d84Sq.CItc4qOfKo9aZBEwdaHsfS"

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") })
  if (!parsed.success) return { errors: flatten(parsed.error), email: String(form.get("email") ?? "") }

  const { email, password } = parsed.data
  const user = await db.user.findUnique({ where: { email } })
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !ok) return { errors: { form: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, email }
  if (user.status === "SUSPENDED") return { errors: { form: "الحساب ده موقوف. تواصل مع الدعم." }, email }

  await startSession(user.id, user.role)
  await audit(db, { actorId: user.id, action: "user.login", targetType: "User", targetId: user.id })

  if (user.status === "PENDING_PHONE" && (await canResend(user.id)).ok) {
    await deliverOtp(user.phone, await issueOtp(user.id))
  }
  redirect(homeFor(user))
}

export async function logoutAction() {
  await endSession()
  redirect("/login")
}
