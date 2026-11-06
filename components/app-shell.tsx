import Link from "next/link"
import type { Role } from "@prisma/client"
import { AppHeader } from "@/components/app-header"
import type { CurrentUser } from "@/lib/session"

const NAV: Record<Exclude<Role, "ADMIN">, { href: string; label: string }[]> = {
  ENTREPRENEUR: [
    { href: "/dashboard", label: "الرئيسية" },
    { href: "/requests", label: "طلبات التوريد" },
    { href: "/orders", label: "الطلبات الجارية" },
    { href: "/rounds", label: "جولات التمويل" },
    { href: "/wallet", label: "المحفظة" },
  ],
  SUPPLIER: [
    { href: "/dashboard", label: "الرئيسية" },
    { href: "/market", label: "طلبات التوريد" },
    { href: "/offers", label: "عروضي" },
    { href: "/orders", label: "الطلبات الجارية" },
    { href: "/wallet", label: "المحفظة" },
  ],
  INVESTOR: [
    { href: "/dashboard", label: "الرئيسية" },
    { href: "/invest", label: "فرص الاستثمار" },
    { href: "/portfolio", label: "محفظتي" },
  ],
}

export function AppShell({ user, active, children }: { user: CurrentUser; active: string; children: React.ReactNode }) {
  const items = user.role === "ADMIN" ? [] : NAV[user.role]
  return (
    <div className="min-h-screen bg-[#F8FBFC]">
      <AppHeader
        user={user}
        nav={
          <nav aria-label="القائمة الرئيسية" className="flex flex-wrap gap-1">
            {items.map((i) => {
              const on = i.href === active
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={on ? "page" : undefined}
                  className={on ? "rounded-lg bg-steel px-3 py-2 text-sm font-bold text-white shadow-btn" : "rounded-lg px-3 py-2 text-sm font-semibold text-navy hover:bg-steel/10"}
                >
                  {i.label}
                </Link>
              )
            })}
          </nav>
        }
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">{children}</main>
    </div>
  )
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold">{title}</h1>
        {subtitle ? <p className="mt-1 text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border-2 border-dashed border-aqua bg-[linear-gradient(to_left,rgba(168,218,220,.10),rgba(69,123,157,.10))] p-10 text-center">
      <strong className="text-lg">{title}</strong>
      <p className="max-w-md text-sm text-muted">{text}</p>
      {action}
    </div>
  )
}
