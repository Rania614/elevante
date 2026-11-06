import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { ProgressBar } from "@/components/progress-bar"
import { Badge } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatBps, OFFER_LABELS } from "@/lib/invest"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { STAGES } from "@/lib/verification"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "فرص الاستثمار" }

export default async function InvestPage() {
  const user = await requireApproved("INVESTOR")
  const rounds = await db.investmentRound.findMany({
    where: { status: "OPEN", closesAt: { gte: new Date() } },
    orderBy: { closesAt: "asc" },
    take: 60,
    include: {
      entrepreneur: { select: { entrepreneurProfile: { select: { projectName: true, sector: true, stage: true } } } },
      offers: { where: { investorId: user.id }, select: { status: true } },
      _count: { select: { milestones: true } },
    },
  })

  return (
    <AppShell user={user} active="/invest">
      <PageTitle title="فرص الاستثمار" subtitle="جولات مفتوحة من رواد أعمال موثّقين. التمويل بيتحجز في الضمان ويتفرج مع اعتمادك لكل مرحلة." />
      {rounds.length === 0 ? (
        <EmptyState title="مفيش جولات مفتوحة دلوقتي" text="أول ما رائد أعمال يفتح جولة تمويل هتظهر هنا." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rounds.map((r) => {
            const p = r.entrepreneur.entrepreneurProfile
            const mine = r.offers[0]
            return (
              <li key={r.id}>
                <Link href={`/invest/${r.id}`} className="flex h-full flex-col gap-3 rounded-2xl border border-ice bg-white p-5 shadow-card transition hover:scale-[1.01] hover:shadow-float">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-lg">{p?.projectName ?? r.title}</strong>
                    {mine ? <Badge tone={OFFER_LABELS[mine.status].tone} dot>عرضك: {OFFER_LABELS[mine.status].label}</Badge> : <Badge tone="success">موثّق</Badge>}
                  </div>
                  <span className="text-sm text-muted">{r.title}</span>
                  <div className="flex flex-wrap gap-2">
                    {p ? <Badge tone="neutral">{p.sector}</Badge> : null}
                    {p ? <Badge tone="aqua">{STAGES[p.stage]}</Badge> : null}
                    <Badge tone="neutral">{r._count.milestones} مراحل</Badge>
                  </div>
                  <span className="text-sm"><strong>{formatEgp(r.targetPiasters)}</strong> <span className="text-muted">مقابل {formatBps(r.equityBps)} · أقل مساهمة {formatEgp(r.minTicketPiasters)}</span></span>
                  <ProgressBar value={Math.round((r.committedPiasters / r.targetPiasters) * 100)} label={`تُغلق ${formatDate(r.closesAt)}`} />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AppShell>
  )
}
