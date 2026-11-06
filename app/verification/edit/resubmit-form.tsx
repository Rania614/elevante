"use client"

import { useActionState } from "react"
import type { Role } from "@prisma/client"
import { KycFileInput } from "@/components/forms/kyc-file-input"
import { ProfileFields } from "@/components/forms/profile-fields"
import { Button, ButtonLink } from "@/components/ui/button"
import { TextField } from "@/components/ui/field"
import { Card, Note, SectionHeader } from "@/components/ui/surface"
import { KYC_KINDS, REVIEW_FIELDS, type ReviewField } from "@/lib/verification"
import { resubmitAction, type ResubmitState } from "../actions"

export function ResubmitForm({
  role, flagged, note, values,
}: { role: Exclude<Role, "ADMIN">; flagged: ReviewField[]; note: string | null; values: Record<string, string> }) {
  const [state, action, pending] = useActionState<ResubmitState, FormData>(resubmitAction, null)
  const errors = state?.errors ?? {}
  const has = (f: ReviewField) => flagged.includes(f)

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold">تعديل البيانات</h1>
        <p className="mt-2 text-navy/80">ظاهر هنا بس الحقول اللي الإدارة طلبت تعديلها: {flagged.map((f) => REVIEW_FIELDS[f]).join("، ")}.</p>
      </div>
      {note ? <Note tone="danger">{note}</Note> : null}

      {has("fullName") || has("nationalId") ? (
        <Card>
          <SectionHeader title="بيانات الهوية" />
          {has("fullName") ? <TextField label="الاسم بالكامل (كما في البطاقة)" name="fullName" defaultValue={values.fullName} error={errors.fullName} /> : null}
          {has("nationalId") ? <TextField label="الرقم القومي" name="nationalId" dir="ltr" inputMode="numeric" maxLength={14} autoComplete="off" error={errors.nationalId} hint="14 رقم، ولازم يطابق صورة البطاقة" /> : null}
        </Card>
      ) : null}

      {KYC_KINDS.some((k) => has(k.kind)) ? (
        <Card>
          <SectionHeader title="صور جديدة" description="الصور القديمة بتفضل محفوظة في السجل، والإدارة بتراجع الجديدة." />
          <div className="grid gap-4 sm:grid-cols-3">
            {KYC_KINDS.filter((k) => has(k.kind)).map((k) => (
              <KycFileInput key={k.kind} name={k.kind} label={k.label} hint={k.hint} error={errors[k.kind]} />
            ))}
          </div>
        </Card>
      ) : null}

      {has("profile") ? (
        <Card>
          <SectionHeader title="بيانات النشاط" />
          <ProfileFields role={role} values={values} errors={errors} />
        </Card>
      ) : null}

      <div className="flex justify-between gap-3">
        <ButtonLink href="/verification" variant="outline">رجوع</ButtonLink>
        <Button type="submit" disabled={pending}>{pending ? "جارٍ الإرسال…" : "إعادة الإرسال للمراجعة"}</Button>
      </div>
    </form>
  )
}
