import "server-only"
import { db } from "./db"
import { hashCode, safeEqual, sixDigitCode } from "./crypto"

export const OTP_TTL_MS = 10 * 60 * 1000
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000
export const OTP_MAX_ATTEMPTS = 5

/**
 * Creates a new code and invalidates older ones.
 * No SMS provider is connected yet: the caller decides how to deliver it
 * (in development it is shown on screen when DEV_SHOW_OTP=true).
 */
export async function issueOtp(userId: string) {
  const code = sixDigitCode()
  await db.$transaction([
    db.otpCode.updateMany({ where: { userId, consumedAt: null }, data: { consumedAt: new Date() } }),
    db.otpCode.create({ data: { userId, codeHash: hashCode(code), expiresAt: new Date(Date.now() + OTP_TTL_MS) } }),
  ])
  return code
}

export async function canResend(userId: string) {
  const last = await db.otpCode.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } })
  if (!last) return { ok: true as const, waitSeconds: 0 }
  const wait = last.createdAt.getTime() + OTP_RESEND_COOLDOWN_MS - Date.now()
  return wait > 0 ? { ok: false as const, waitSeconds: Math.ceil(wait / 1000) } : { ok: true as const, waitSeconds: 0 }
}

export type OtpResult = "ok" | "invalid" | "expired" | "locked" | "missing"

export async function verifyOtp(userId: string, code: string): Promise<OtpResult> {
  const otp = await db.otpCode.findFirst({ where: { userId, consumedAt: null }, orderBy: { createdAt: "desc" } })
  if (!otp) return "missing"
  if (otp.expiresAt < new Date()) return "expired"
  if (otp.attempts >= OTP_MAX_ATTEMPTS) return "locked"

  if (!safeEqual(otp.codeHash, hashCode(code))) {
    await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } })
    return otp.attempts + 1 >= OTP_MAX_ATTEMPTS ? "locked" : "invalid"
  }
  await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })
  return "ok"
}
