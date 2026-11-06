const ZONE = "Africa/Cairo"

/** Offset of Cairo from UTC (in minutes) at a given instant — handles daylight saving. */
function cairoOffsetMinutes(at: Date): number {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, timeZoneName: "longOffset" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value
  const m = part?.match(/GMT([+-])(\d{2}):?(\d{2})?/)
  if (!m) return 120
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0))
}

/** "2026-11-20" → the last second of that day in Cairo, as a UTC Date. */
export function cairoEndOfDay(yyyyMmDd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const naive = Date.UTC(y, mo - 1, d, 23, 59, 59)
  const check = new Date(naive)
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null
  return new Date(naive - cairoOffsetMinutes(new Date(naive)) * 60_000)
}

/** Today's date in Cairo as "YYYY-MM-DD" (for <input type="date" min>). */
export function cairoToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONE }).format(now)
}

export function addDays(yyyyMmDd: string, days: number): string {
  const [y, m, d] = yyyyMmDd.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}
