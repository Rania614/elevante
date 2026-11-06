"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { TextAreaField, TextField } from "@/components/ui/field"
import { Card, Note } from "@/components/ui/surface"
import { equityFor, feeFor, formatBps } from "@/lib/invest"
import { formatEgp, parseEgp } from "@/lib/money"
import { submitInvestmentAction, type InvestState } from "../actions"

export function InvestForm({
  roundId, target, equityBps, min, remaining, defaults, isUpdate,
}: { roundId: string; target: number; equityBps: number; min: number; remaining: number; defaults?: { amount: string; note: string }; isUpdate: boolean }) {
  const [state, action, pending] = useActionState<InvestState, FormData>(submitInvestmentAction, null)
  const [amountText, setAmountText] = useState(defaults?.amount ?? "")
  const amount = parseEgp(amountText)
  const e = state?.errors ?? {}

  return (
    <Card>
      <h2 className="font-bold">{isUpdate ? "تعديل عرضك" : "قدّم عرض استثمار"}</h2>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="roundId" value={roundId} />
        <TextField label="المبلغ (ج.م)" name="amount" inputMode="decimal" dir="ltr" value={amountText} onChange={(ev) => setAmountText(ev.target.value)} error={e.amount} hint={`من ${formatEgp(min)} لحد ${formatEgp(remaining)}`} />
        {amount ? (
          <dl className="flex flex-col gap-1.5 rounded-xl bg-brand-tile p-3 text-sm" aria-live="polite">
            <div className="flex justify-between"><dt className="text-muted">الحصة المقابلة</dt><dd className="font-bold">{formatBps(equityFor(amount, target, equityBps))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">عمولة المنصة (2%)</dt><dd className="font-bold">{formatEgp(feeFor(amount))}</dd></div>
            <div className="flex justify-between border-t border-aqua pt-1.5"><dt>الإجمالي عند التمويل</dt><dd className="font-extrabold">{formatEgp(amount + feeFor(amount))}</dd></div>
          </dl>
        ) : null}
        <TextAreaField label="ملاحظة لرائد الأعمال" name="note" optional rows={3} defaultValue={defaults?.note} maxLength={1000} />
        <Note>مفيش أي مبلغ بيتخصم دلوقتي. لما رائد الأعمال يقبل، هتموّل الصفقة في الضمان.</Note>
        {e.form ? <Note tone="danger" role="alert">{e.form}</Note> : null}
        {state?.saved ? <Note tone="success" role="status">تم حفظ عرضك.</Note> : null}
        <Button type="submit" full disabled={pending}>{pending ? "جارٍ الإرسال…" : isUpdate ? "حفظ التعديل" : "إرسال العرض"}</Button>
      </form>
    </Card>
  )
}
