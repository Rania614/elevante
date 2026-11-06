import { Logo } from "@/components/brand"
import { LogoutButton } from "@/components/logout-button"
import { Badge } from "@/components/ui/surface"
import type { CurrentUser } from "@/lib/session"
import { ROLE_LABELS, STATUS_LABELS } from "@/lib/verification"

export function AppHeader({ user, nav }: { user: CurrentUser; nav?: React.ReactNode }) {
  const status = STATUS_LABELS[user.status]
  return (
    <header className="border-b border-line bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-6">
          <Logo />
          {nav}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left leading-tight">
            <div className="text-sm font-bold">{user.fullName}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-muted">{ROLE_LABELS[user.role]}</span>
              {user.role !== "ADMIN" ? <Badge tone={status.tone}>{status.label}</Badge> : null}
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
