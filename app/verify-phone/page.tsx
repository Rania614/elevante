import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Smartphone } from "lucide-react"
import { AuthShell, FloatingCard } from "@/components/brand"
import { Note } from "@/components/ui/surface"
import { readDevOtp } from "@/lib/otp-delivery"
import { homeFor, requireUser } from "@/lib/session"
import { LogoutButton } from "@/components/logout-button"
import { OtpForms } from "./otp-forms"

export const metadata: Metadata = { title: "تأكيد رقم الهاتف" }

function mask(phone: string) {
  return `${phone.slice(0, 5)}•• ••• ${phone.slice(-4)}`
}

export default async function VerifyPhonePage() {
  const user = await requireUser()
  if (user.status !== "PENDING_PHONE") redirect(homeFor(user))
  const devCode = await readDevOtp()

  return (
    <AuthShell headerAction={<LogoutButton />}>
      <FloatingCard>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-panel text-white shadow-btn">
            <Smartphone size={28} aria-hidden />
          </span>
          <h1 className="text-2xl font-extrabold">تأكيد رقم الهاتف</h1>
          <p className="text-sm leading-7 text-muted">
            اكتب الرمز المكوّن من 6 أرقام المرسل إلى <span dir="ltr" className="font-bold text-navy">{mask(user.phone)}</span>
          </p>
        </div>
        {devCode ? (
          <div className="mt-5">
            <Note tone="warn" role="status">
              وضع التطوير: مفيش مزوّد رسائل متوصّل. الرمز هو <strong dir="ltr" className="text-base tracking-widest">{devCode}</strong>
            </Note>
          </div>
        ) : null}
        <OtpForms />
      </FloatingCard>
    </AuthShell>
  )
}
