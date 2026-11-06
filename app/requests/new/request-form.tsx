"use client"

import { useActionState, useState } from "react"
import { Button, ButtonLink } from "@/components/ui/button"
import { ChoiceField, SelectField, TextAreaField, TextField } from "@/components/ui/field"
import { Card, Note, SectionHeader } from "@/components/ui/surface"
import { KIND_LABELS, PRODUCT_CATEGORIES, SERVICE_CATEGORIES, UNITS } from "@/lib/supply"
import { createRequestAction, type RequestFormState } from "../actions"

const list = (a: string[]) => a.map((v) => ({ value: v, label: v }))

export function RequestForm({ minDate, maxDate, defaultDate }: { minDate: string; maxDate: string; defaultDate: string }) {
  const [state, action, pending] = useActionState<RequestFormState, FormData>(createRequestAction, null)
  const v = state?.values ?? {}
  const e = state?.errors ?? {}
  const [kind, setKind] = useState(v.kind ?? "PRODUCT")

  return (
    <form key={JSON.stringify(v)} action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <Card>
          <SectionHeader step={1} title="تفاصيل الطلب" />
          <div onChange={(ev) => { const t = ev.target as HTMLInputElement; if (t.name === "kind") setKind(t.value) }}>
            <ChoiceField label="نوع الطلب" name="kind" options={Object.entries(KIND_LABELS).map(([value, label]) => ({ value, label }))} defaultValue={kind} error={e.kind} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField className="sm:col-span-2" label="عنوان الطلب" name="title" placeholder="مثال: دقيق شعير كامل" defaultValue={v.title} error={e.title} maxLength={120} />
            <SelectField key={kind} label="التصنيف" name="category" options={list(kind === "SERVICE" ? SERVICE_CATEGORIES : PRODUCT_CATEGORIES)} defaultValue={v.category} error={e.category} />
            <div className="grid grid-cols-[1fr_140px] gap-3">
              <TextField label="الكمية" name="quantity" inputMode="numeric" dir="ltr" defaultValue={v.quantity} error={e.quantity} />
              <SelectField label="الوحدة" name="unit" options={list(UNITS)} defaultValue={v.unit} error={e.unit} />
            </div>
            <TextAreaField className="sm:col-span-2" label="الوصف والمواصفات" name="description" placeholder="المقاس، الخامة، الجودة، مواعيد ومكان التسليم…" defaultValue={v.description} error={e.description} minLength={30} maxLength={3000} />
          </div>
        </Card>

        <Card>
          <SectionHeader step={2} title="الميزانية والمواعيد" description="الميزانية اختيارية، بس بتساعد الموردين يقدّموا عروض مناسبة." />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="الميزانية من (ج.م)" name="budgetMin" optional inputMode="decimal" dir="ltr" defaultValue={v.budgetMin} error={e.budgetMin} />
            <TextField label="الميزانية إلى (ج.م)" name="budgetMax" optional inputMode="decimal" dir="ltr" defaultValue={v.budgetMax} error={e.budgetMax} />
            <TextField label="آخر موعد لاستقبال العروض" name="offersDeadline" type="date" dir="ltr" min={minDate} max={maxDate} defaultValue={v.offersDeadline ?? defaultDate} error={e.offersDeadline} hint="العروض بتتقفل آخر اليوم ده بتوقيت القاهرة" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Card>
          <h2 className="font-bold">قبل النشر</h2>
          <ul className="list-disc space-y-2 pr-5 text-sm leading-7 text-muted">
            <li>اكتبي المواصفات بالأرقام (مقاس، وزن، خامة).</li>
            <li>كل الموردين الموثّقين هيشوفوا الطلب ويقدروا يقدّموا عرض.</li>
            <li>لما تقبلي عرض، باقي العروض بتترفض تلقائيًا.</li>
          </ul>
          {e.form ? <Note tone="danger" role="alert">{e.form}</Note> : null}
          <Button type="submit" full disabled={pending}>{pending ? "جارٍ النشر…" : "نشر الطلب"}</Button>
          <ButtonLink href="/requests" variant="outline" full>إلغاء</ButtonLink>
        </Card>
      </div>
    </form>
  )
}
