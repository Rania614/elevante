"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/field"
import { Note } from "@/components/ui/surface"
import { loginAction, type LoginState } from "../actions/session"

export function LoginForm({ suspended }: { suspended: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, null)
  const errors = state?.errors ?? {}

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {suspended ? <Note tone="danger" role="alert">الحساب ده موقوف. تواصل مع الدعم.</Note> : null}
      {errors.form ? <Note tone="danger" role="alert">{errors.form}</Note> : null}
      <TextField label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" defaultValue={state?.email} error={errors.email} />
      <TextField label="كلمة المرور" name="password" type="password" dir="ltr" autoComplete="current-password" error={errors.password} />
      <Button type="submit" full disabled={pending}>{pending ? "جارٍ الدخول…" : "تسجيل الدخول"}</Button>
      <p className="text-center text-sm text-muted">
        ليس لديك حساب؟ <Link href="/register" className="font-bold text-steel">أنشئ حسابًا جديدًا</Link>
      </p>
    </form>
  )
}
