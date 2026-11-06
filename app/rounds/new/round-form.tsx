"use client"

import { useActionState, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { TextAreaField, TextField } from "@/components/ui/field"
import { Card, Note, SectionHeader } from "@/components/ui/surface"
import { MAX_MILESTONES, MIN_MILESTONES } from "@/lib/invest"
import { createRoundAction, type RoundFormState } from "../actions"

type Row = { key: number; title: string; due: string; share: string; proof: string }

export function RoundForm({ minDate, maxDate, defaultClose }: { minDate: string; maxDate: string; defaultClose: string }) {
  const [state, action, pending] = useActionState<RoundFormState, FormData>(createRoundAction, null)
  const v = state?.values ?? {}
  const e = state?.errors ?? {}
  const initial = state?.milestones?.length
    ? state.milestones
    : [
        { title: "", due: "", share: "50", proof: "" },
        { title: "", due: "", share: "50", proof: "" },
      ]
  const [rows, setRows] = useState<Row[]>(initial.map((m, i) => ({ key: i, ...m })))
  const total = rows.reduce((a, r) => a + (Number(r.share) || 0), 0)
  const update = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))

  return (
    <form key={JSON.stringify(v)} action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <Card>
          <SectionHeader step={1} title="الجولة" description="المستثمرين بيشوفوا البيانات دي في صفحة الفرصة." />
          <TextField label="عنوان الجولة" name="title" placeholder="مثال: جولة تمويل حَبّة — التوسع في منافذ البيع" defaultValue={v.title} error={e.title} maxLength={120} />
          <TextAreaField label="عن المشروع" name="pitch" rows={5} defaultValue={v.pitch} error={e.pitch} minLength={100} maxLength={3000} hint="المشكلة، والحل، والعميل، وإيه اللي اتعمل لحد دلوقتي — 100 حرف على الأقل" />
          <TextAreaField label="استخدام التمويل" name="useOfFunds" rows={3} defaultValue={v.useOfFunds} error={e.useOfFunds} maxLength={2000} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="المبلغ المطلوب (ج.م)" name="target" inputMode="decimal" dir="ltr" defaultValue={v.target} error={e.target} />
            <TextField label="نسبة الملكية المعروضة (%)" name="equity" inputMode="decimal" dir="ltr" defaultValue={v.equity} error={e.equity} hint="مقابل المبلغ كامل؛ كل مستثمر ياخد نسبة بحجم مساهمته" />
            <TextField label="أقل مساهمة لمستثمر (ج.م)" name="minTicket" inputMode="decimal" dir="ltr" defaultValue={v.minTicket} error={e.minTicket} />
            <TextField label="آخر موعد لاستقبال العروض" name="closesAt" type="date" dir="ltr" min={minDate} max={maxDate} defaultValue={v.closesAt ?? defaultClose} error={e.closesAt} />
          </div>
        </Card>

        <Card>
          <SectionHeader step={2} title="المراحل وشرائح التمويل" description="التمويل بيتحجز في الضمان، وكل شريحة بتتفرج بعد ما المستثمر يعتمد إثبات المرحلة. المراحل بتمشي بالترتيب." />
          <ol className="flex flex-col gap-4">
            {rows.map((r, i) => (
              <li key={r.key} className="flex flex-col gap-3 rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <strong>المرحلة {i + 1}</strong>
                  {rows.length > MIN_MILESTONES ? (
                    <Button type="button" variant="ghost" size="sm" aria-label={`حذف المرحلة ${i + 1}`} onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}>
                      <Trash2 size={16} aria-hidden />
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_170px_120px]">
                  <TextField label="عنوان المرحلة" name="mTitle" value={r.title} onChange={(ev) => update(r.key, { title: ev.target.value })} error={e[`m${i}_title`]} maxLength={120} />
                  <TextField label="الموعد" name="mDue" type="date" dir="ltr" min={minDate} value={r.due} onChange={(ev) => update(r.key, { due: ev.target.value })} error={e[`m${i}_due`]} />
                  <TextField label="النسبة %" name="mShare" inputMode="decimal" dir="ltr" value={r.share} onChange={(ev) => update(r.key, { share: ev.target.value })} error={e[`m${i}_share`]} />
                </div>
                <TextField label="الإثبات المطلوب" name="mProof" placeholder="مثال: صور وفواتير المعدات" value={r.proof} onChange={(ev) => update(r.key, { proof: ev.target.value })} error={e[`m${i}_proof`]} maxLength={200} />
              </li>
            ))}
          </ol>
          {rows.length < MAX_MILESTONES ? (
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => setRows((rs) => [...rs, { key: Date.now(), title: "", due: "", share: "", proof: "" }])}>
                <Plus size={16} aria-hidden />
                إضافة مرحلة
              </Button>
            </div>
          ) : null}
          {e.milestones ? <Note tone="danger" role="alert">{e.milestones}</Note> : null}
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Card>
          <h2 className="font-bold">ملخص</h2>
          <div className="flex justify-between text-sm"><span className="text-muted">عدد المراحل</span><strong>{rows.length}</strong></div>
          <div className="flex justify-between text-sm" aria-live="polite">
            <span className="text-muted">مجموع النسب</span>
            <strong className={Math.abs(total - 100) < 0.001 ? "text-success-text" : "text-danger-text"}>{Number(total.toFixed(2))}%</strong>
          </div>
          {e.form ? <Note tone="danger" role="alert">{e.form}</Note> : null}
          <Button type="submit" full disabled={pending}>{pending ? "جارٍ النشر…" : "نشر الجولة"}</Button>
          <ButtonLink href="/rounds" variant="outline" full>إلغاء</ButtonLink>
        </Card>
      </div>
    </form>
  )
}
