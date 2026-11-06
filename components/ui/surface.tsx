import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("flex min-w-0 flex-col gap-4 rounded-2xl border border-ice bg-white p-6 shadow-card", className)} {...props} />
}

export function SectionHeader({ step, title, description }: { step?: number; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-line pb-4">
      {step ? (
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-panel text-[13px] font-bold text-white">{step}</span>
      ) : null}
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
    </div>
  )
}

const tones = {
  success: "bg-success-bg text-success-text",
  warn: "bg-warn-bg text-warn-text",
  danger: "bg-danger-bg text-danger-text",
  aqua: "bg-aqua text-navy",
  neutral: "bg-mint text-navy",
} as const

export function Badge({ tone = "neutral", children, dot }: { tone?: keyof typeof tones; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-[10px] px-2.5 text-xs font-bold", tones[tone])}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

const noteTones = {
  info: "bg-brand-tile text-navy",
  warn: "bg-warn-bg text-warn-text",
  danger: "bg-danger-bg text-danger-text",
  success: "bg-success-bg text-success-text",
} as const

export function Note({ tone = "info", children, role }: { tone?: keyof typeof noteTones; children: React.ReactNode; role?: "alert" | "status" }) {
  return <div role={role} className={cn("rounded-2xl px-4 py-3 text-[13px] leading-7", noteTones[tone])}>{children}</div>
}
