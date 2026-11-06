"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Note } from "@/components/ui/surface"
import { resendOtpAction, verifyPhoneAction, type OtpState } from "./actions"

export function OtpForms() {
  const [state, verify, verifying] = useActionState<OtpState, FormData>(verifyPhoneAction, null)
  const [resend, resendAction, resending] = useActionState<OtpState>(resendOtpAction, null)
  const message = state?.error ?? resend?.error

  return (
    <div className="mt-6 flex flex-col gap-4">
      <form action={verify} className="flex flex-col gap-4">
        <label htmlFor="code" className="sr-only">رمز التحقق</label>
        <input
          id="code"
          name="code"
          dir="ltr"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          placeholder="••••••"
          aria-invalid={state?.error ? true : undefined}
          className="control h-14 text-center text-2xl font-bold tracking-[0.6em]"
        />
        {message ? <Note tone="danger" role="alert">{message}</Note> : null}
        {resend?.info ? <Note tone="success" role="status">{resend.info}</Note> : null}
        <Button type="submit" full disabled={verifying}>{verifying ? "جارٍ التأكيد…" : "تأكيد ومتابعة"}</Button>
      </form>
      <form action={resendAction} className="text-center">
        <Button type="submit" variant="ghost" size="sm" disabled={resending}>إرسال رمز جديد</Button>
      </form>
    </div>
  )
}
