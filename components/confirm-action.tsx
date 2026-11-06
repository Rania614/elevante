"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Note } from "@/components/ui/surface"

type Result = { error?: string } | null

/**
 * Two-step submit: first click asks for confirmation, second click runs the server action.
 * Used for actions that cannot be undone (accepting an offer, closing a request, withdrawing).
 */
export function ConfirmAction({
  action, fields, label, confirmLabel, question, variant = "primary", size = "sm",
}: {
  action: (prev: Result, form: FormData) => Promise<Result>
  fields: Record<string, string>
  label: string
  confirmLabel: string
  question: string
  variant?: "primary" | "outline" | "danger" | "dark" | "ghost"
  size?: "sm" | "md"
}) {
  const [state, run, pending] = useActionState<Result, FormData>(action, null)
  const [asking, setAsking] = useState(false)

  return (
    <form action={run} className="flex flex-col gap-2">
      {Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {asking ? (
        <div className="flex flex-col gap-2 rounded-xl border border-aqua bg-white p-3" role="group" aria-label={question}>
          <p className="text-[13px] font-semibold">{question}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant={variant === "danger" ? "danger" : "primary"} size="sm" disabled={pending}>{pending ? "جارٍ التنفيذ…" : confirmLabel}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAsking(false)} disabled={pending}>إلغاء</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant={variant} size={size} onClick={() => setAsking(true)}>{label}</Button>
      )}
      {state?.error ? <Note tone="danger" role="alert">{state.error}</Note> : null}
    </form>
  )
}
