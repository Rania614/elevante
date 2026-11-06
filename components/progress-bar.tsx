export function ProgressBar({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <strong>{v}%</strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-mint" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-brand-btn" style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}
