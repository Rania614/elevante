import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { db } from "@/lib/db"
import { requireUser } from "@/lib/session"
import type { ReviewField } from "@/lib/verification"
import { ResubmitForm } from "./resubmit-form"

export const metadata: Metadata = { title: "تعديل بيانات التوثيق" }

export default async function ResubmitPage() {
  const user = await requireUser()
  if (user.role === "ADMIN" || user.status !== "NEEDS_CHANGES") redirect("/verification")

  const [review, full] = await Promise.all([
    db.verificationReview.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { fullName: true, supplierProfile: true, entrepreneurProfile: true, investorProfile: true },
    }),
  ])
  if (!review?.flaggedFields.length) redirect("/verification")

  const profile = (full.supplierProfile ?? full.entrepreneurProfile ?? full.investorProfile ?? {}) as Record<string, unknown>
  const values: Record<string, string> = { fullName: full.fullName }
  for (const [k, v] of Object.entries(profile)) if (typeof v === "string") values[k] = v

  return (
    <div className="min-h-screen bg-mint/40">
      <AppHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ResubmitForm role={user.role} flagged={review.flaggedFields as ReviewField[]} note={review.note} values={values} />
      </main>
    </div>
  )
}
