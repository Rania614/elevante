import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { requireAdmin } from "@/lib/session"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  return (
    <div className="min-h-screen bg-[#F8FBFC]">
      <AppHeader
        user={admin}
        nav={
          <nav aria-label="قائمة الإدارة" className="flex gap-1">
            <Link href="/admin/verifications" className="rounded-lg bg-steel px-3 py-2 text-sm font-bold text-white">طلبات التوثيق</Link>
          </nav>
        }
      />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
