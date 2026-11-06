import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Check, Clock, AlertCircle, ShieldCheck } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { ButtonLink } from "@/components/ui/button"
import { Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { requireUser } from "@/lib/session"
import { cn, formatDateTime } from "@/lib/utils"
import { REVIEW_FIELDS, type ReviewField } from "@/lib/verification"

export const metadata: Metadata = { title: "حالة التوثيق" }

type StepState = "done" | "now" | "fix" | "todo"

function Step({ state, title, detail }: { state: StepState; title: string; detail: string }) {
  const icon = {
    done: <Check size={16} strokeWidth={2.6} aria-hidden />,
    now: <Clock size={16} aria-hidden />,
    fix: <AlertCircle size={16} aria-hidden />,
    todo: <Clock size={16} aria-hidden />,
  }[state]
  const label = { done: "تم", now: "جارٍ", fix: "مطلوب تعديل", todo: "في الانتظار" }[state]
  return (
    <li className="flex items-center gap-3.5 border-b border-line py-3.5 last:border-0">
      <span
        className={cn(
          "flex h-8 w-8 flex-none items-center justify-center rounded-full",
          state === "done" && "bg-brand-panel text-white",
          state === "now" && "bg-warn-bg text-warn-text",
          state === "fix" && "bg-danger-bg text-danger-text",
          state === "todo" && "border border-aqua text-muted",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold">{title}</div>
        <div className="text-[13px] text-muted">{detail}</div>
      </div>
      <span className="sr-only">{label}</span>
    </li>
  )
}

export default async function VerificationPage() {
  const user = await requireUser()
  if (user.role === "ADMIN") redirect("/admin/verifications")
  if (user.status === "PENDING_PHONE") redirect("/verify-phone")

  const review = await db.verificationReview.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  const s = user.status

  const steps: [StepState, string, string][] = [
    ["done", "إنشاء الحساب", "تم استلام بياناتك ومستندات الهوية"],
    ["done", "تأكيد رقم الهاتف", "تم التحقق برمز OTP"],
    [s === "NEEDS_CHANGES" ? "fix" : s === "APPROVED" ? "done" : "now", "مراجعة الإدارة", "مطابقة الرقم القومي مع الصور، ومراجعة بيانات النشاط"],
    [s === "APPROVED" ? "done" : "todo", "تفعيل الحساب", "فتح كل مزايا لوحة التحكم"],
  ]

  return (
    <div className="min-h-screen bg-mint/40">
      <AppHeader user={user} />
      <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-10">
        <Card className="gap-6 p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl",
                s === "APPROVED" ? "bg-brand-panel text-white" : s === "NEEDS_CHANGES" ? "bg-danger-bg text-danger-text" : "bg-warn-bg text-warn-text",
              )}
            >
              {s === "APPROVED" ? <ShieldCheck size={28} aria-hidden /> : s === "NEEDS_CHANGES" ? <AlertCircle size={28} aria-hidden /> : <Clock size={28} aria-hidden />}
            </span>
            <h1 className="text-2xl font-extrabold">
              {s === "APPROVED" ? "تم توثيق حسابك" : s === "NEEDS_CHANGES" ? "مطلوب تعديل بعض البيانات" : "حسابك قيد المراجعة"}
            </h1>
            <p className="max-w-md text-sm leading-7 text-muted">
              {s === "APPROVED"
                ? "حسابك موثّق ومفعّل، وعلامة التوثيق بتظهر جنب اسمك."
                : s === "NEEDS_CHANGES"
                  ? "بياناتك محفوظة. عدّل الحقول اللي عليها ملاحظات بس وأعد الإرسال."
                  : "استلمنا بياناتك. فريق المنصة هيراجعها، وهتلاقي النتيجة هنا."}
            </p>
          </div>

          <ol>{steps.map(([st, t, d]) => <Step key={t} state={st} title={t} detail={d} />)}</ol>

          {s === "NEEDS_CHANGES" && review ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-danger/30 bg-danger-bg p-4">
              <strong className="text-sm text-danger-text">ملاحظات الإدارة · {formatDateTime(review.createdAt)}</strong>
              <ul className="flex flex-wrap gap-2">
                {review.flaggedFields.map((f) => (
                  <li key={f} className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-danger-text">{REVIEW_FIELDS[f as ReviewField] ?? f}</li>
                ))}
              </ul>
              {review.note ? <p className="text-sm leading-7 text-navy">{review.note}</p> : null}
            </div>
          ) : null}

          {s === "PENDING_REVIEW" ? (
            <Note>متاح لك دلوقتي تتصفح المنصة. نشر العروض والطلبات والاستثمار بيتفتح بعد التفعيل.</Note>
          ) : null}

          <div className="flex justify-center">
            {s === "APPROVED" ? <ButtonLink href="/dashboard">الذهاب إلى لوحة التحكم</ButtonLink> : null}
            {s === "NEEDS_CHANGES" ? <ButtonLink href="/verification/edit">تعديل البيانات وإعادة الإرسال</ButtonLink> : null}
          </div>
        </Card>
      </main>
    </div>
  )
}
