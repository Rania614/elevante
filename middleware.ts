import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token"

// First line of defence only: every protected page and action also checks
// the session and the account status against the database on the server.
const PROTECTED = ["/dashboard", "/verification", "/verify-phone", "/admin", "/requests", "/market", "/offers", "/orders", "/rounds", "/wallet", "/invest", "/portfolio", "/deals"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)

  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!session) {
      const url = new URL("/login", req.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
    if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/verification/:path*", "/verify-phone", "/admin/:path*", "/requests/:path*", "/market/:path*", "/offers/:path*", "/orders/:path*", "/rounds/:path*", "/wallet/:path*", "/invest/:path*", "/portfolio/:path*", "/deals/:path*"],
}
