import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AuthShell } from "@/components/brand"
import { ButtonLink } from "@/components/ui/button"
import { PUBLIC_ROLES, ROLE_LABELS, SLUG_TO_ROLE, type PublicRoleSlug } from "@/lib/verification"
import { RegisterForm } from "./register-form"

type Props = { params: Promise<{ role: string }> }

function isRole(v: string): v is PublicRoleSlug {
  return (PUBLIC_ROLES as readonly string[]).includes(v)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params
  return { title: isRole(role) ? `تسجيل ${ROLE_LABELS[SLUG_TO_ROLE[role]]}` : "تسجيل" }
}

export default async function RegisterRolePage({ params }: Props) {
  const { role } = await params
  if (!isRole(role)) notFound()
  return (
    <AuthShell headerAction={<ButtonLink href="/login" variant="outline" size="sm">تسجيل الدخول</ButtonLink>}>
      <RegisterForm role={SLUG_TO_ROLE[role]} />
    </AuthShell>
  )
}
