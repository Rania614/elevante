import type { Metadata } from "next"
import { AppShell, PageTitle } from "@/components/app-shell"
import { addDays, cairoToday } from "@/lib/dates"
import { requireApproved } from "@/lib/session"
import { RequestForm } from "./request-form"

export const metadata: Metadata = { title: "طلب توريد جديد" }

export default async function NewRequestPage() {
  const user = await requireApproved("ENTREPRENEUR")
  const today = cairoToday()
  return (
    <AppShell user={user} active="/requests">
      <PageTitle title="طلب توريد جديد" subtitle="وضّحي المطلوب بدقة عشان توصلك عروض مناسبة." />
      <RequestForm minDate={today} maxDate={addDays(today, 90)} defaultDate={addDays(today, 7)} />
    </AppShell>
  )
}
