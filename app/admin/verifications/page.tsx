import type { Metadata } from "next"
import Link from "next/link"
import type { AccountStatus } from "@prisma/client"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/session"
import { cn, formatDateTime } from "@/lib/utils"
import { ROLE_LABELS, STATUS_LABELS } from "@/lib/verification"

export const metadata: Metadata = { title: "طلبات التوثيق" }

const TABS: { status: AccountStatus; label: string }[] = [
  { status: "PENDING_REVIEW", label: "بانتظار المراجعة" },
  { status: "NEEDS_CHANGES", label: "مطلوب تعديل" },
  { status: "APPROVED", label: "موثّقة" },
]

export default async function VerificationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  // Layouts and pages render in parallel, so the page checks access itself too.
  await requireAdmin()
  const { status: raw } = await searchParams
  const status = TABS.find((t) => t.status === raw)?.status ?? "PENDING_REVIEW"

  const [users, counts] = await Promise.all([
    db.user.findMany({
      where: { status, role: { not: "ADMIN" } },
      // Oldest first: first come, first reviewed.
      orderBy: { updatedAt: "asc" },
      take: 50,
      select: { id: true, fullName: true, role: true, status: true, email: true, updatedAt: true },
    }),
    db.user.groupBy({ by: ["status"], where: { role: { not: "ADMIN" } }, _count: true }),
  ])
  const count = (s: AccountStatus) => counts.find((c) => c.status === s)?._count ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold">طلبات التوثيق</h1>
        <p className="mt-1 text-muted">راجع بيانات الهوية والنشاط ووافق على الحساب أو اطلب تعديل.</p>
      </div>

      <nav aria-label="حالة الطلبات" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.status}
            href={`/admin/verifications?status=${t.status}`}
            aria-current={t.status === status ? "page" : undefined}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-bold",
              t.status === status ? "border-navy bg-navy text-white" : "border-steel bg-white text-steel",
            )}
          >
            {t.label} ({count(t.status)})
          </Link>
        ))}
      </nav>

      <Card className="p-0">
        {users.length === 0 ? (
          <p className="p-10 text-center text-muted">مفيش طلبات في القائمة دي.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-steel text-white">
                <tr>
                  {["المستخدم", "الدور", "الحالة", "آخر تحديث", ""].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3.5">
                      <div className="font-bold">{u.fullName}</div>
                      <div className="text-xs text-muted" dir="ltr">{u.email}</div>
                    </td>
                    <td className="px-4 py-3.5">{ROLE_LABELS[u.role]}</td>
                    <td className="px-4 py-3.5"><Badge tone={STATUS_LABELS[u.status].tone} dot>{STATUS_LABELS[u.status].label}</Badge></td>
                    <td className="px-4 py-3.5">{formatDateTime(u.updatedAt)}</td>
                    <td className="px-4 py-3.5 text-left">
                      <Link href={`/admin/verifications/${u.id}`} className="rounded-xl border border-steel px-3 py-2 text-[13px] font-bold text-steel hover:bg-steel hover:text-white">
                        {u.status === "PENDING_REVIEW" ? "مراجعة" : "عرض"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
