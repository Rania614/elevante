"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { TextAreaField, TextField } from "@/components/ui/field"
import { Card, Note } from "@/components/ui/surface"
import { submitOfferAction, type OfferFormState } from "../actions"

export function OfferForm({ requestId, defaults, isUpdate }: { requestId: string; defaults?: { price: string; deliveryDays: string; note: string }; isUpdate: boolean }) {
  const [state, action, pending] = useActionState<OfferFormState, FormData>(submitOfferAction, null)
  const e = state?.errors ?? {}

  return (
    <Card>
      <h2 className="font-bold">{isUpdate ? "تعديل عرضك" : "قدّم عرضك"}</h2>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="requestId" value={requestId} />
        <TextField label="السعر الإجمالي (ج.م)" name="price" inputMode="decimal" dir="ltr" defaultValue={defaults?.price} error={e.price} hint="السعر الكلي للكمية المطلوبة" />
        <TextField label="مدة التنفيذ / التوريد (أيام)" name="deliveryDays" inputMode="numeric" dir="ltr" defaultValue={defaults?.deliveryDays} error={e.deliveryDays} />
        <TextAreaField label="ملاحظات للعميل" name="note" optional rows={3} defaultValue={defaults?.note} error={e.note} placeholder="شروط الدفع، عينة مجانية، مكان التسليم…" maxLength={1000} />
        {e.form ? <Note tone="danger" role="alert">{e.form}</Note> : null}
        {state?.saved ? <Note tone="success" role="status">تم حفظ عرضك.</Note> : null}
        <Button type="submit" full disabled={pending}>{pending ? "جارٍ الحفظ…" : isUpdate ? "حفظ التعديل" : "إرسال العرض"}</Button>
      </form>
    </Card>
  )
}
