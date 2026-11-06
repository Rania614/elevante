import { normalizeDigits } from "./national-id"

/** Parses a user-typed EGP amount ("16,000", "4.5", "١٦٠٠٠") into integer piasters. Returns null if invalid. */
export function parseEgp(input: string | null | undefined): number | null {
  if (input == null) return null
  const clean = normalizeDigits(String(input)).replace(/[,،\s]/g, "").replace("٫", ".")
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(clean)) return null
  const [whole, frac = ""] = clean.split(".")
  return Number(whole) * 100 + Number(frac.padEnd(2, "0"))
}

export function formatEgp(piasters: number): string {
  const egp = piasters / 100
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(egp)} ج.م`
}

/** For prefilling inputs: 1600050 → "16000.5" */
export function piastersToInput(piasters: number | null | undefined): string {
  if (piasters == null) return ""
  return String(piasters / 100)
}
