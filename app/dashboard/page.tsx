import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Badge, Card } from "@/components/ui/surface"
import { homeFor, requireUser } from "@/lib/session"

export const metadata: Metadata = { title: "لوحة التحكم" }

const NEXT_UP: Record<string, string[]> = {
  ENTREPRENEUR: ["نشر طلب توريد", "مقارنة العروض وقبولها", "طلب استثمار بمراحل"],
  SUPPLIER: ["تصفّح طلبات التوريد", "تقديم عرض", "متابعة الطلبات المقبولة"],
  INVESTOR: ["استكشاف المشاريع", "تقديم عرض استثمار", "اعتماد المراحل والإفراج من الضمان"],
}

export default async function DashboardPage() {
  const user = await requireUser()
  if (user.role === "ADMIN" || user.status !== "APPROVED") redirect(homeFor(user))

  return (
    <div className="min-h-screen bg-[#F8FBFC]">
      <AppHeader user={user} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-3xl font-extrabold">أهلاً، {user.fullName.split(" ")[0]}</h1>
          <p className="mt-1 text-muted">حسابك موثّق ومفعّل.</p>
        </div>
        <Card className="flex-row items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-panel text-white shadow-btn">
            <ShieldCheck size={24} aria-hidden />
          </span>
          <div>
            <div className="font-bold">الحساب موثّق</div>
            <div className="text-sm text-muted">علامة التوثيق ظاهرة جنب اسمك لباقي المستخدمين.</div>
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {NEXT_UP[user.role].map((t) => (
            <Card key={t} className="opacity-80">
              <Badge tone="neutral">قريبًا</Badge>
              <div className="font-bold">{t}</div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
