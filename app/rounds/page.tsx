import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { ButtonLink } from "@/components/ui/button"
import { Badge } from "@/components/ui/surface"
import { ProgressBar } from "@/components/progress-bar"
import { db } from "@/lib/db"
import { formatBps } from "@/lib/invest"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "جولات التمويل" }

export default async function RoundsPage() {
  const user = await requireApproved("ENTREPRENEUR")
  const rounds = await db.investmentRound.findMany({
    where: { entrepreneurId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { offers: { where: { status: "PENDING" } } } } },
  })

  return (
    <AppShell user={user} active="/rounds">
      <PageTitle title="جولات التمويل" subtitle="اطلبي تمويل على مراحل، والمستثمرين يموّلوا في الضمان." action={<ButtonLink href="/rounds/new">جولة جديدة</ButtonLink>} />
      {rounds.length === 0 ? (
        <EmptyState title="لسه مفيش جولات" text="افتحي جولة تمويل بمراحل واضحة، وكل شريحة هتتفرج بعد ما المستثمر يعتمد إنجاز المرحلة." action={<ButtonLink href="/rounds/new">جولة جديدة</ButtonLink>} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rounds.map((r) => {
            const pct = Math.round((r.committedPiasters / r.targetPiasters) * 100)
            return (
              <li key={r.id}>
                <Link href={`/rounds/${r.id}`} className="flex h-full flex-col gap-3 rounded-2xl border border-ice bg-white p-5 shadow-card transition hover:scale-[1.01] hover:shadow-float">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-lg">{r.title}</strong>
                    <Badge tone={r.status === "OPEN" ? "success" : "neutral"} dot>{r.status === "OPEN" ? "مفتوحة" : "مغلقة"}</Badge>
                  </div>
                  <div className="text-sm text-muted">{formatEgp(r.targetPiasters)} مقابل {formatBps(r.equityBps)} · تُغلق {formatDate(r.closesAt)}</div>
                  <ProgressBar value={pct} label={`تم الالتزام بـ ${formatEgp(r.committedPiasters)}`} />
                  {r._count.offers ? <Badge tone="warn">{r._count.offers} عرض بانتظار قرارك</Badge> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AppShell>
  )
}
