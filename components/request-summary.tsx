import type { SupplyRequest } from "@prisma/client"
import { Badge, Card } from "@/components/ui/surface"
import { formatEgp } from "@/lib/money"
import { isAcceptingOffers, KIND_LABELS, REQUEST_STATUS } from "@/lib/supply"
import { formatDateTime } from "@/lib/utils"

function budget(r: SupplyRequest) {
  const { budgetMinPiasters: min, budgetMaxPiasters: max } = r
  if (min && max) return `${formatEgp(min)} – ${formatEgp(max)}`
  if (max) return `حتى ${formatEgp(max)}`
  if (min) return `من ${formatEgp(min)}`
  return "غير محددة"
}

export function RequestSummary({ request, owner }: { request: SupplyRequest; owner?: string }) {
  const st = REQUEST_STATUS[request.status]
  const open = isAcceptingOffers(request)
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold">{request.title}</h1>
            <Badge tone={request.kind === "PRODUCT" ? "aqua" : "neutral"}>{KIND_LABELS[request.kind]}</Badge>
            <Badge tone="neutral">{request.category}</Badge>
          </div>
          {owner ? <p className="mt-1 text-sm text-muted">{owner}</p> : null}
        </div>
        <Badge tone={request.status === "OPEN" && !open ? "neutral" : st.tone} dot>
          {request.status === "OPEN" && !open ? "انتهى موعد العروض" : st.label}
        </Badge>
      </div>
      <dl className="grid gap-3 rounded-2xl bg-brand-tile p-4 text-sm sm:grid-cols-3">
        <div><dt className="text-muted">الكمية</dt><dd className="mt-1 font-bold">{request.quantity.toLocaleString("en-US")} {request.unit}</dd></div>
        <div><dt className="text-muted">الميزانية</dt><dd className="mt-1 font-bold">{budget(request)}</dd></div>
        <div><dt className="text-muted">آخر موعد للعروض</dt><dd className="mt-1 font-bold">{formatDateTime(request.offersDeadline)}</dd></div>
      </dl>
      <p className="whitespace-pre-line text-[15px] leading-8">{request.description}</p>
    </Card>
  )
}
