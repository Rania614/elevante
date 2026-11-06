// Edge-safe (used by middleware): no Node APIs, no database access.
import { jwtVerify, SignJWT } from "jose"

export const SESSION_COOKIE = "elv_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

type Role = "ENTREPRENEUR" | "SUPPLIER" | "INVESTOR" | "ADMIN"
export type SessionPayload = { sub: string; role: Role }

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error("SESSION_SECRET is missing or shorter than 32 characters")
  return new TextEncoder().encode(s)
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret())
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] })
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null
    return { sub: payload.sub, role: payload.role as Role }
  } catch {
    return null
  }
}
