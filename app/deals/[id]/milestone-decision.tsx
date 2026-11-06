"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Note } from "@/components/ui/surface"
import { decideMilestoneAction } from "../actions"

type Result = { error?: string } | null

export function MilestoneDecision({ dealMilestoneId, trancheLabel }: { dealMilestoneId: string; trancheLabel: string }) {
  const [state, action, pending] = useActionState<Result, FormData>(decideMilestoneAction, null)
  const [mode, setMode] = useState<"idle" | "approve" | "changes">("idle")

  return (
    <form action={action} className="flex flex-col gap-3 rounded-2xl border border-aqua bg-white p-4">
      <input type="hidden" name="dealMilestoneId" value={dealMilestoneId} />
      <input type="hidden" name="decision" value={mode === "changes" ? "changes" : "approve"} />
      {mode === "idle" ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => setMode("approve")}>اعتماد والإفراج عن {trancheLabel}</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setMode("changes")}>طلب تعديلات</Button>
        </div>
      ) : mode === "approve" ? (
        <div className="flex flex-col gap-2" role="group" aria-label="تأكيد الإفراج">
          <p className="text-sm font-semibold">المبلغ هيتحوّل من الضمان لمحفظة رائد الأعمال فورًا، والخطوة دي نهائية. متأكد إنك راجعت الإثبات؟</p>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>{pending ? "جارٍ الإفراج…" : "تأكيد الإفراج"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setMode("idle")} disabled={pending}>إلغاء</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor={`note-${dealMilestoneId}`} className="text-sm font-semibold">إيه المطلوب تعديله؟</label>
          <textarea id={`note-${dealMilestoneId}`} name="note" rows={3} required minLength={10} maxLength={1000} className="control h-auto py-2.5" />
          <div className="flex gap-2">
            <Button type="submit" size="sm" variant="danger" disabled={pending}>{pending ? "جارٍ الإرسال…" : "إرسال الملاحظة"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setMode("idle")} disabled={pending}>إلغاء</Button>
          </div>
        </div>
      )}
      {state?.error ? <Note tone="danger" role="alert">{state.error}</Note> : null}
    </form>
  )
}
