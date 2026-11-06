import type { Metadata } from "next"
import { AppShell, PageTitle } from "@/components/app-shell"
import { addDays, cairoToday } from "@/lib/dates"
import { requireApproved } from "@/lib/session"
import { RoundForm } from "./round-form"

export const metadata: Metadata = { title: "جولة تمويل جديدة" }

export default async function NewRoundPage() {
  const user = await requireApproved("ENTREPRENEUR")
  const today = cairoToday()
  return (
    <AppShell user={user} active="/rounds">
      <PageTitle title="جولة تمويل جديدة" subtitle="حدّدي المبلغ والنسبة والمراحل اللي التمويل هيتفرج عليها." />
      <RoundForm minDate={today} maxDate={addDays(today, 90)} defaultClose={addDays(today, 30)} />
    </AppShell>
  )
}
