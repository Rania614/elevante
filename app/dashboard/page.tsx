import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { AppShell, PageTitle } from "@/components/app-shell"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { requireApproved } from "@/lib/session"

export const metadata: Metadata = { title: "لوحة التحكم" }

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="flex flex-col gap-1 rounded-2xl border border-ice bg-white p-5 shadow-card transition hover:scale-[1.02] hover:shadow-float">
      <span className="text-sm font-semibold text-muted">{label}</span>
      <span className="text-3xl font-extrabold">{value}</span>
    </Link>
  )
}

export default async function DashboardPage() {
  const user = await requireApproved()
  const first = user.fullName.split(" ")[0]

  let stats: React.ReactNode = null
  let action: React.ReactNode = null
  if (user.role === "ENTREPRENEUR") {
    const [open, pendingOffers, active] = await Promise.all([
      db.supplyRequest.count({ where: { entrepreneurId: user.id, status: "OPEN" } }),
      db.offer.count({ where: { status: "PENDING", request: { entrepreneurId: user.id, status: "OPEN" } } }),
      db.order.count({ where: { buyerId: user.id, status: { not: "COMPLETED" } } }),
    ])
    stats = (<><Stat label="طلبات مفتوحة" value={open} href="/requests" /><Stat label="عروض بانتظار قرارك" value={pendingOffers} href="/requests" /><Stat label="طلبات قيد التنفيذ" value={active} href="/orders" /></>)
    action = <ButtonLink href="/requests/new">طلب توريد جديد</ButtonLink>
  } else if (user.role === "SUPPLIER") {
    const [pending, active, toAct] = await Promise.all([
      db.offer.count({ where: { supplierId: user.id, status: "PENDING" } }),
      db.order.count({ where: { supplierId: user.id, status: { not: "COMPLETED" } } }),
      db.order.count({ where: { supplierId: user.id, status: { in: ["ACCEPTED", "IN_PROGRESS"] } } }),
    ])
    stats = (<><Stat label="عروض قيد الانتظار" value={pending} href="/offers" /><Stat label="طلبات جارية" value={active} href="/orders" /><Stat label="محتاجة خطوة منك" value={toAct} href="/orders" /></>)
    action = <ButtonLink href="/market">تصفّح طلبات التوريد</ButtonLink>
  }

  return (
    <AppShell user={user} active="/dashboard">
      <PageTitle title={`أهلاً، ${first}`} subtitle="حسابك موثّق ومفعّل." action={action} />
      <Card className="flex-row items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-panel text-white shadow-btn"><ShieldCheck size={24} aria-hidden /></span>
        <div>
          <div className="font-bold">الحساب موثّق</div>
          <div className="text-sm text-muted">علامة التوثيق ظاهرة جنب اسمك لباقي المستخدمين.</div>
        </div>
      </Card>
      {stats ? <div className="grid gap-4 sm:grid-cols-3">{stats}</div> : null}
      {user.role === "INVESTOR" ? (
        <div className="grid gap-4 md:grid-cols-3">
          {["استكشاف المشاريع", "تقديم عرض استثمار", "اعتماد المراحل والإفراج من الضمان"].map((t) => (
            <Card key={t} className="opacity-80"><Badge tone="neutral">قريبًا</Badge><div className="font-bold">{t}</div></Card>
          ))}
        </div>
      ) : null}
    </AppShell>
  )
}
