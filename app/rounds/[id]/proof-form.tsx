"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { TextAreaField, TextField } from "@/components/ui/field"
import { Note } from "@/components/ui/surface"
import { submitProofAction, type ProofState } from "../actions"

export function ProofForm({ milestoneId, proofNeeded, resubmit }: { milestoneId: string; proofNeeded: string; resubmit: boolean }) {
  const [state, action, pending] = useActionState<ProofState, FormData>(submitProofAction, null)
  const e = state?.errors ?? {}
  if (state?.saved) return <Note tone="success" role="status">تم إرسال الإثبات للمستثمرين.</Note>
  return (
    <form action={action} className="flex flex-col gap-3 rounded-2xl border border-aqua bg-white p-4">
      <input type="hidden" name="milestoneId" value={milestoneId} />
      <p className="text-sm"><span className="text-muted">الإثبات المطلوب:</span> <strong>{proofNeeded}</strong></p>
      <TextAreaField label="ما تم إنجازه" name="summary" rows={3} error={e.summary} minLength={30} maxLength={3000} />
      <TextField label="رابط الإثبات" name="proofUrl" type="url" dir="ltr" optional placeholder="https://" error={e.proofUrl} hint="مثلًا: فولدر صور ومستندات على Google Drive" />
      {e.form ? <Note tone="danger" role="alert">{e.form}</Note> : null}
      <div><Button type="submit" size="sm" disabled={pending}>{pending ? "جارٍ الإرسال…" : resubmit ? "إعادة إرسال الإثبات" : "إرسال الإثبات للمستثمرين"}</Button></div>
    </form>
  )
}
