import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { ConfirmAction } from "@/components/confirm-action"
import { ProgressBar } from "@/components/progress-bar"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatBps, OFFER_LABELS } from "@/lib/invest"
import { formatEgp, piastersToInput } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { STAGES } from "@/lib/verification"
import { formatDate } from "@/lib/utils"
import { withdrawInvestmentAction } from "../actions"
import { InvestForm } from "./invest-form"

export const metadata: Metadata = { title: "تفاصيل الفرصة" }

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireApproved("INVESTOR")
  const { id } = await params
  const round = await db.investmentRound.findUnique({
    where: { id },
    include: {
      entrepreneur: { select: { fullName: true, governorate: true, entrepreneurProfile: true } },
      milestones: { orderBy: { position: "asc" } },
      offers: { where: { investorId: user.id }, include: { deal: { select: { id: true } } } },
    },
  })
  if (!round) notFound()
  const mine = round.offers[0]
  const open = round.status === "OPEN" && round.closesAt >= new Date()
  if (!open && !mine) notFound()

  const p = round.entrepreneur.entrepreneurProfile
  const remaining = round.targetPiasters - round.committedPiasters
  const editable = open && (!mine || mine.status === "PENDING" || mine.status === "WITHDRAWN")

  return (
    <AppShell user={user} active="/invest">
      <Link href="/invest" className="text-sm font-bold text-steel">→ رجوع لفرص الاستثمار</Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold">{p?.projectName ?? round.title}</h1>
              <Badge tone="success">موثّق</Badge>
              {p ? <Badge tone="aqua">{STAGES[p.stage]}</Badge> : null}
              {p ? <Badge tone="neutral">{p.sector}</Badge> : null}
            </div>
            <p className="text-sm text-muted">{round.title} · {round.entrepreneur.fullName}{round.entrepreneur.governorate ? ` · ${round.entrepreneur.governorate}` : ""}</p>
            <ProgressBar value={Math.round((round.committedPiasters / round.targetPiasters) * 100)} label={`${formatEgp(round.committedPiasters)} ملتزم بها من ${formatEgp(round.targetPiasters)}`} />
            <dl className="grid gap-3 rounded-2xl bg-brand-tile p-4 text-sm sm:grid-cols-4">
              <div><dt className="text-muted">الحصة المعروضة</dt><dd className="font-bold">{formatBps(round.equityBps)}</dd></div>
              <div><dt className="text-muted">أقل مساهمة</dt><dd className="font-bold">{formatEgp(round.minTicketPiasters)}</dd></div>
              <div><dt className="text-muted">المتبقي</dt><dd className="font-bold">{formatEgp(remaining)}</dd></div>
              <div><dt className="text-muted">تُغلق</dt><dd className="font-bold">{formatDate(round.closesAt)}</dd></div>
            </dl>
            <h2 className="font-bold">عن المشروع</h2>
            <p className="whitespace-pre-line leading-8">{round.pitch}</p>
            <h2 className="font-bold">استخدام التمويل</h2>
            <p className="whitespace-pre-line leading-8">{round.useOfFunds}</p>
          </Card>
          <Card>
            <h2 className="font-bold">المراحل وتوزيع الشرائح</h2>
            <p className="text-sm text-muted">مبلغك بيتحجز في الضمان، وكل شريحة بتتفرج بعد ما تعتمد إثبات المرحلة بنفسك، بالترتيب.</p>
            <ol className="flex flex-col">
              {round.milestones.map((m) => (
                <li key={m.id} className="flex flex-wrap justify-between gap-2 border-b border-line py-3 text-sm last:border-0">
                  <span><strong>{m.position}. {m.title}</strong><span className="block text-muted">الإثبات: {m.proofNeeded} · الموعد {formatDate(m.dueDate)}</span></span>
                  <strong>{formatBps(m.shareBps)}</strong>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {mine ? (
            <Card>
              <div className="flex items-center justify-between"><h2 className="font-bold">عرضك</h2><Badge tone={OFFER_LABELS[mine.status].tone} dot>{OFFER_LABELS[mine.status].label}</Badge></div>
              <p className="text-sm">{formatEgp(mine.amountPiasters)}</p>
              {mine.deal ? <ButtonLink href={`/deals/${mine.deal.id}`} full>متابعة الصفقة</ButtonLink> : null}
              {mine.status === "PENDING" ? <ConfirmAction action={withdrawInvestmentAction} fields={{ offerId: mine.id }} label="سحب العرض" confirmLabel="سحب" question="سحب عرضك من الجولة؟ تقدر تقدّمه تاني طول ما الجولة مفتوحة." variant="outline" /> : null}
            </Card>
          ) : null}
          {editable ? (
            <InvestForm
              roundId={round.id}
              target={round.targetPiasters}
              equityBps={round.equityBps}
              min={round.minTicketPiasters}
              remaining={remaining}
              isUpdate={mine?.status === "PENDING"}
              defaults={mine ? { amount: piastersToInput(mine.amountPiasters), note: mine.note ?? "" } : undefined}
            />
          ) : !open ? <Note>الجولة دي اتقفلت.</Note> : null}
        </div>
      </div>
    </AppShell>
  )
}
