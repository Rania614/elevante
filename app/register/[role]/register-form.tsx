"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { Lock, ShieldCheck } from "lucide-react"
import type { Role } from "@prisma/client"
import { KycFileInput } from "@/components/forms/kyc-file-input"
import { ProfileFields } from "@/components/forms/profile-fields"
import { Button } from "@/components/ui/button"
import { SelectField, TextField } from "@/components/ui/field"
import { Card, Note, SectionHeader } from "@/components/ui/surface"
import { parseNationalId } from "@/lib/national-id"
import { GOVERNORATES, KYC_KINDS, ROLE_LABELS } from "@/lib/verification"
import { registerAction, type RegisterState } from "../actions"

type PublicRole = Exclude<Role, "ADMIN">

/** Checks that would otherwise only fail after uploading three images. */
function precheck(form: HTMLFormElement): Record<string, string> {
  const fd = new FormData(form)
  const errors: Record<string, string> = {}
  const nid = parseNationalId(String(fd.get("nationalId") ?? ""))
  if (!nid.ok) errors.nationalId = nid.error
  if (fd.get("password") !== fd.get("confirmPassword")) errors.confirmPassword = "كلمتا المرور غير متطابقتين"
  for (const { kind } of KYC_KINDS) {
    const f = fd.get(kind)
    if (f instanceof File && f.size > 5 * 1024 * 1024) errors[kind] = "حجم الصورة لازم يكون 5 ميجابايت أو أقل"
  }
  return errors
}

export function RegisterForm({ role }: { role: PublicRole }) {
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerAction, null)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const errors = { ...state?.errors, ...clientErrors }
  const v = state?.values ?? {}
  const serverFailed = Boolean(state?.errors && Object.keys(state.errors).length)

  return (
    <div className="w-full max-w-3xl animate-fade-up self-start">
      <div className="mb-6">
        <p className="text-sm font-semibold text-steel">تسجيل حساب {ROLE_LABELS[role]}</p>
        <h1 className="mt-1 text-3xl font-extrabold">بياناتك وتوثيق الهوية</h1>
        <p className="mt-2 text-navy/80">
          بعد التسجيل هنأكد رقم هاتفك، وبعدين فريق المنصة يراجع البيانات ويفعّل الحساب.{" "}
          <Link href="/register" className="font-semibold text-steel underline">تغيير نوع الحساب</Link>
        </p>
      </div>

      <form
        key={JSON.stringify(v)}
        action={action}
        onSubmit={(e) => {
          const found = precheck(e.currentTarget)
          setClientErrors(found)
          if (Object.keys(found).length) e.preventDefault()
        }}
        className="flex flex-col gap-5"
        noValidate={false}
      >
        <input type="hidden" name="role" value={role} />

        {errors.form ? <Note tone="danger" role="alert">{errors.form}</Note> : null}
        {serverFailed ? (
          <Note tone="warn" role="status">راجع الحقول المعلّمة بالأحمر. للأمان، لازم تختار الصور وكلمة المرور والرقم القومي تاني.</Note>
        ) : null}

        <Card>
          <SectionHeader step={1} title="البيانات الأساسية" description="هتُستخدم لتسجيل الدخول والتواصل معك." />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField className="sm:col-span-2" label="الاسم بالكامل (كما في البطاقة)" name="fullName" autoComplete="name" defaultValue={v.fullName} error={errors.fullName} maxLength={120} />
            <TextField label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" defaultValue={v.email} error={errors.email} />
            <TextField label="رقم الموبايل" name="phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel" placeholder="010 1234 5678" defaultValue={v.phone} error={errors.phone} hint="هنبعت عليه رمز تحقق" />
            <SelectField label="المحافظة" name="governorate" options={GOVERNORATES.map((g) => ({ value: g, label: g }))} defaultValue={v.governorate} error={errors.governorate} />
            <span className="hidden sm:block" />
            <TextField label="كلمة المرور" name="password" type="password" dir="ltr" autoComplete="new-password" minLength={8} error={errors.password} hint="8 أحرف على الأقل، حروف وأرقام" />
            <TextField label="تأكيد كلمة المرور" name="confirmPassword" type="password" dir="ltr" autoComplete="new-password" error={errors.confirmPassword} />
          </div>
        </Card>

        <Card>
          <SectionHeader step={2} title="توثيق الهوية" description="التوثيق برقم البطاقة إلزامي لكل الحسابات لحماية كل الأطراف." />
          <TextField label="الرقم القومي" name="nationalId" dir="ltr" inputMode="numeric" autoComplete="off" maxLength={14} placeholder="14 رقم" error={errors.nationalId} hint="14 رقم، ولازم يطابق صورة البطاقة" />
          <div className="grid gap-4 sm:grid-cols-3">
            {KYC_KINDS.map((k) => (
              <KycFileInput key={k.kind} name={k.kind} label={k.label} hint={k.hint} error={errors[k.kind]} />
            ))}
          </div>
          <Note>
            <span className="inline-flex items-center gap-2"><Lock size={16} aria-hidden />الرقم القومي بيتخزّن مشفّر، والصور مش بتظهر لأي حد غير فريق التوثيق.</span>
          </Note>
        </Card>

        <Card>
          <SectionHeader step={3} title="بيانات النشاط" />
          <ProfileFields role={role} values={v} errors={errors} />
        </Card>

        <Card>
          <SectionHeader step={4} title="الإقرار" />
          <label className="flex items-start gap-3 text-sm leading-7">
            <input type="checkbox" name="terms" required className="mt-1.5 h-4 w-4 accent-steel" />
            أقر بأن البيانات والمستندات صحيحة وتخصّني أو تخص الكيان اللي بمثّله، وأوافق على الشروط وسياسة الخصوصية.
          </label>
          {errors.terms ? <p className="text-xs font-medium text-danger-text">{errors.terms}</p> : null}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="inline-flex items-center gap-2 text-sm text-muted"><ShieldCheck size={18} className="text-steel" aria-hidden />الخطوة الجاية: تأكيد رقم الهاتف</span>
            <Button type="submit" disabled={pending}>{pending ? "جارٍ الإرسال…" : "إنشاء الحساب"}</Button>
          </div>
        </Card>
      </form>
    </div>
  )
}

