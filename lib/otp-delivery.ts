import "server-only"
import { cookies } from "next/headers"
import { env } from "./env"

const DEV_COOKIE = "elv_dev_otp"

/**
 * Delivery seam for OTP codes. Replace the body with an SMS/WhatsApp provider call.
 * Until then, in development only, the code is kept in a short-lived httpOnly cookie
 * so the verify page can display it.
 */
export async function deliverOtp(phone: string, code: string) {
  if (env.showOtp) {
    const jar = await cookies()
    jar.set(DEV_COOKIE, code, { httpOnly: true, sameSite: "lax", path: "/verify-phone", maxAge: 10 * 60 })
    return
  }
  // TODO(provider): send `code` to `phone` via the SMS provider.
  console.warn(`[otp] No SMS provider configured; code for ${phone.slice(0, 4)}•••• was not sent.`)
}

export async function readDevOtp() {
  if (!env.showOtp) return null
  const jar = await cookies()
  return jar.get(DEV_COOKIE)?.value ?? null
}
