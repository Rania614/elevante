import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthShell, FloatingCard } from "@/components/brand"
import { ButtonLink } from "@/components/ui/button"
import { getCurrentUser, homeFor } from "@/lib/session"
import { LoginForm } from "./login-form"

export const metadata: Metadata = { title: "تسجيل الدخول" }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suspended?: string }> }) {
  const user = await getCurrentUser()
  if (user && user.status !== "SUSPENDED") redirect(homeFor(user))
  const { suspended } = await searchParams

  return (
    <AuthShell headerAction={<ButtonLink href="/register" variant="outline" size="sm">إنشاء حساب</ButtonLink>}>
      <FloatingCard>
        <h1 className="text-3xl font-extrabold">أهلاً بعودتك</h1>
        <p className="mt-2 text-sm text-muted">ادخل لحسابك عشان تكمّل.</p>
        <LoginForm suspended={suspended === "1"} />
      </FloatingCard>
    </AuthShell>
  )
}
