"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, Note } from "@/components/ui/surface"
import { REVIEW_FIELDS, REVIEW_FIELD_KEYS } from "@/lib/verification"
import { reviewAction, type ReviewState } from "../actions"

export function ReviewForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(reviewAction, null)
  const [decision, setDecision] = useState<"APPROVED" | "NEEDS_CHANGES" | "">("")

  return (
    <Card>
      <h2 className="text-lg font-bold">القرار</h2>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="userId" value={userId} />
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">القرار</legend>
          {[
            { v: "APPROVED", l: "موافقة وتفعيل الحساب" },
            { v: "NEEDS_CHANGES", l: "رفض وطلب تعديل" },
          ].map((o) => (
            <label key={o.v} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-aqua px-4 text-sm font-bold has-[:checked]:border-steel has-[:checked]:bg-ice">
              <input type="radio" name="decision" value={o.v} required className="h-4 w-4 accent-steel" onChange={() => setDecision(o.v as typeof decision)} />
              {o.l}
            </label>
          ))}
        </fieldset>

        {decision === "NEEDS_CHANGES" ? (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-semibold">الحقول المطلوب تعديلها</legend>
              <div className="flex flex-wrap gap-2">
                {REVIEW_FIELD_KEYS.map((f) => (
                  <label key={f} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-aqua px-3 text-[13px] has-[:checked]:border-danger has-[:checked]:bg-danger-bg">
                    <input type="checkbox" name="flagged" value={f} className="h-4 w-4 accent-danger" />
                    {REVIEW_FIELDS[f]}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-2">
              <label htmlFor="note" className="text-sm font-semibold">رسالة للمستخدم</label>
              <textarea id="note" name="note" rows={3} required maxLength={1000} className="control h-auto py-2.5" placeholder="مثال: صورة وجه البطاقة غير واضحة، ارفع صورة أوضح." />
            </div>
          </>
        ) : null}

        {state?.error ? <Note tone="danger" role="alert">{state.error}</Note> : null}
        <Button type="submit" full variant={decision === "NEEDS_CHANGES" ? "danger" : "primary"} disabled={pending || !decision}>
          {pending ? "جارٍ الحفظ…" : decision === "NEEDS_CHANGES" ? "إرسال الملاحظات" : "تأكيد الموافقة"}
        </Button>
      </form>
    </Card>
  )
}
