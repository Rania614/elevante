import Link from "next/link"

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-navy" aria-label="Elevante — الصفحة الرئيسية">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-panel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8DADC" strokeWidth="2.2" aria-hidden>
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
        </svg>
      </span>
      <span className="text-xl font-bold">Elevante</span>
    </Link>
  )
}

// Fixed positions (no Math.random) so server and client render the same markup.
const SYMBOLS: [string, number, number, number, number][] = [
  ["ج.م", 8, 12, 26, 0], ["$", 18, 70, 34, 1.5], ["€", 30, 30, 22, 3], ["£", 44, 85, 28, 0.8],
  ["¥", 58, 18, 24, 2.2], ["₿", 70, 60, 30, 4], ["ج.م", 82, 40, 22, 1.1], ["$", 12, 45, 20, 3.6],
  ["€", 64, 90, 26, 0.4], ["£", 90, 8, 30, 2.8], ["$", 38, 55, 18, 5], ["ج.م", 50, 5, 24, 4.4],
]

export function MoneyBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SYMBOLS.map(([s, top, left, size, delay], i) => (
        <span
          key={i}
          className="absolute animate-float-sym font-bold text-steel opacity-20"
          style={{ top: `${top}%`, left: `${left}%`, fontSize: size, animationDelay: `${delay}s`, fontFamily: "Arial, sans-serif" }}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

/** Gradient background + floating symbols + header, used by every public/auth page. */
export function AuthShell({ children, headerAction }: { children: React.ReactNode; headerAction?: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-brand-auth">
      <MoneyBackground />
      <header className="relative z-10 border-b border-aqua/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Logo />
          {headerAction}
        </div>
      </header>
      <main className="relative z-10 flex flex-1 justify-center px-4 py-10 sm:py-14">{children}</main>
    </div>
  )
}

export function FloatingCard({ children, className = "max-w-md" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full ${className} animate-fade-up self-start rounded-[20px] border border-ice bg-white/95 p-7 shadow-float backdrop-blur sm:p-9`}>
      {children}
    </div>
  )
}
