"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Note } from "@/components/ui/surface"
import { decideWithdrawalAction } from "./actions"

type Result = { error?: string } | null

export function WithdrawalDecision({ withdrawalId }: { withdrawalId: string }) {
  const [state, run, pending] = useActionState<Result, FormData>(decideWithdrawalAction, null)
  const [mode, setMode] = useState<"pay" | "reject" | null>(null)
  if (!mode) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => setMode("pay")}>تم التحويل</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setMode("reject")}>رفض</Button>
      </div>
    )
  }
  return (
    <form action={run} className="flex flex-col gap-2 rounded-xl border border-aqua bg-white p-3">
      <input type="hidden" name="withdrawalId" value={withdrawalId} />
      <input type="hidden" name="decision" value={mode} />
      {mode === "pay" ? (
        <label className="flex flex-col gap-1 text-[13px] font-semibold">
          رقم مرجع التحويل البنكي
          <input name="transferRef" dir="ltr" required minLength={4} maxLength={60} className="control" />
        </label>
      ) : (
        <label className="flex flex-col gap-1 text-[13px] font-semibold">
          سبب الرفض (هيظهر للمستخدم)
          <textarea name="note" required minLength={5} maxLength={500} rows={2} className="control" />
        </label>
      )}
      {state?.error ? <Note tone="danger" role="alert">{state.error}</Note> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" variant={mode === "reject" ? "danger" : "primary"} disabled={pending}>{pending ? "جارٍ التنفيذ…" : mode === "pay" ? "تأكيد التحويل" : "تأكيد الرفض"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setMode(null)} disabled={pending}>إلغاء</Button>
      </div>
    </form>
  )
}
