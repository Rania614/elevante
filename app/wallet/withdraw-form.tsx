"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/field"
import { Card, Note } from "@/components/ui/surface"
import { requestWithdrawalAction, type WithdrawState } from "./actions"

export function WithdrawForm({ availableLabel }: { availableLabel: string }) {
  const [state, action, pending] = useActionState<WithdrawState, FormData>(requestWithdrawalAction, null)
  const e = state?.errors ?? {}
  return (
    <Card>
      <h2 className="font-bold">سحب للحساب البنكي</h2>
      <p className="text-sm text-muted">المتاح: <strong className="text-navy">{availableLabel}</strong></p>
      <form action={action} className="flex flex-col gap-4">
        <TextField label="المبلغ (ج.م)" name="amount" inputMode="decimal" dir="ltr" error={e.amount} hint="أقل مبلغ 100 ج.م" />
        <TextField label="اسم البنك" name="bankName" error={e.bankName} />
        <TextField label="اسم صاحب الحساب" name="accountHolder" error={e.accountHolder} hint="لازم يطابق اسمك الموثّق" />
        <TextField label="رقم الحساب أو IBAN" name="account" dir="ltr" autoComplete="off" error={e.account} hint="بيتخزّن مشفّر، وبيظهر آخر 4 أرقام بس" />
        <Note>المبلغ بيتحجز من رصيدك فورًا، والإدارة بتراجع الطلب وتحوّله. لو اترفض، المبلغ بيرجع للمحفظة.</Note>
        {state?.done ? <Note tone="success" role="status">تم تقديم طلب السحب.</Note> : null}
        <Button type="submit" full disabled={pending}>{pending ? "جارٍ الإرسال…" : "طلب السحب"}</Button>
      </form>
    </Card>
  )
}
