import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Role } from "@prisma/client"
import { db } from "./db"
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, verifySessionToken } from "./session-token"

export async function startSession(userId: string, role: Role) {
  const token = await createSessionToken({ sub: userId, role })
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function endSession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

/** Reads the session and loads the user fresh from the database (status is never trusted from the token). */
export async function getCurrentUser() {
  const jar = await cookies()
  const payload = await verifySessionToken(jar.get(SESSION_COOKIE)?.value)
  if (!payload) return null
  return db.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true, status: true, fullName: true, email: true, phone: true },
  })
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>

/** Where a signed-in user belongs right now, based on role and account status. */
export function homeFor(user: Pick<CurrentUser, "role" | "status">): string {
  if (user.role === "ADMIN") return "/admin/verifications"
  if (user.status === "PENDING_PHONE") return "/verify-phone"
  if (user.status === "APPROVED") return "/dashboard"
  return "/verification"
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (user.status === "SUSPENDED") redirect("/login?suspended=1")
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== "ADMIN") redirect(homeFor(user))
  return user
}
