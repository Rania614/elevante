import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, X } from "lucide-react"
import { Badge, Card } from "@/components/ui/surface"
import { audit } from "@/lib/audit"
import { decrypt } from "@/lib/crypto"
import { db } from "@/lib/db"
import { parseNationalId } from "@/lib/national-id"
import { requireAdmin } from "@/lib/session"
import { formatDate, formatDateTime } from "@/lib/utils"
import { INVESTOR_TYPES, KYC_KINDS, REVIEW_FIELDS, ROLE_LABELS, STAGES, STATUS_LABELS, SUPPLY_TYPES, type ReviewField } from "@/lib/verification"
import { ReviewForm } from "./review-form"

export const metadata: Metadata = { title: "مراجعة طلب توثيق" }

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-line py-2.5 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-bold">{children}</span>
    </div>
  )
}

function Check_({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-[13px]">
      {ok ? <Check size={16} className="text-steel" strokeWidth={2.6} aria-label="ناجح" /> : <X size={16} className="text-danger-text" strokeWidth={2.6} aria-label="فشل" />}
      {children}
    </li>
  )
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  const { id } = await params
  const user = await db.user.findUnique({
    where: { id },
    include: {
      supplierProfile: true,
      entrepreneurProfile: true,
      investorProfile: true,
      kycDocuments: { where: { current: true }, orderBy: { createdAt: "desc" } },
      reviewsReceived: { orderBy: { createdAt: "desc" }, include: { reviewer: { select: { fullName: true } } } },
    },
  })
  if (!user || user.role === "ADMIN") notFound()

  // Decrypting the national ID is itself logged.
  const nationalId = user.nationalIdEnc ? decrypt(user.nationalIdEnc) : null
  await audit(db, { actorId: admin.id, action: "national_id.viewed", targetType: "User", targetId: user.id })
  const nid = nationalId ? parseNationalId(nationalId) : null
  const status = STATUS_LABELS[user.status]

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/verifications" className="text-sm font-bold text-steel">→ رجوع للطلبات</Link>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">{user.fullName}</h1>
            <p className="mt-1 text-sm text-muted">{ROLE_LABELS[user.role]} · سجّل {formatDateTime(user.createdAt)}</p>
          </div>
          <Badge tone={status.tone} dot>{status.label}</Badge>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-lg font-bold">صور الهوية</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {KYC_KINDS.map((k) => {
                const doc = user.kycDocuments.find((d) => d.kind === k.kind)
                return (
                  <figure key={k.kind} className="flex flex-col gap-2">
                    {doc ? (
                      <a href={`/api/admin/kyc/${doc.id}`} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-ice bg-mint">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/api/admin/kyc/${doc.id}`} alt={k.label} className="h-44 w-full object-cover" />
                      </a>
                    ) : (
                      <div className="flex h-44 items-center justify-center rounded-xl bg-danger-bg text-sm text-danger-text">مش مرفوعة</div>
                    )}
                    <figcaption className="text-[13px] font-bold">{k.label}</figcaption>
                  </figure>
                )
              })}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold">البيانات</h2>
            <div>
              <Row label="الاسم">{user.fullName}</Row>
              <Row label="الرقم القومي"><span dir="ltr">{nationalId ?? "—"}</span></Row>
              <Row label="البريد"><span dir="ltr">{user.email}</span></Row>
              <Row label="الهاتف"><span dir="ltr">{user.phone}</span></Row>
              <Row label="المحافظة">{user.governorate ?? "—"}</Row>
              {user.supplierProfile ? (
                <>
                  <Row label="نوع ما يقدّمه">{SUPPLY_TYPES[user.supplierProfile.supplyType]}</Row>
                  <Row label="الاسم التجاري">{user.supplierProfile.businessName}</Row>
                  <Row label="السجل التجاري">{user.supplierProfile.commercialRegNo ?? "—"}</Row>
                </>
              ) : null}
              {user.entrepreneurProfile ? (
                <>
                  <Row label="المشروع">{user.entrepreneurProfile.projectName}</Row>
                  <Row label="القطاع">{user.entrepreneurProfile.sector}</Row>
                  <Row label="المرحلة">{STAGES[user.entrepreneurProfile.stage]}</Row>
                </>
              ) : null}
              {user.investorProfile ? (
                <>
                  <Row label="نوع المستثمر">{INVESTOR_TYPES[user.investorProfile.investorType]}</Row>
                  <Row label="حجم الاستثمار">{user.investorProfile.ticketRange}</Row>
                  <Row label="الجهة">{user.investorProfile.organization ?? "—"}</Row>
                </>
              ) : null}
            </div>
            {user.entrepreneurProfile ? <p className="rounded-xl bg-brand-tile p-3 text-sm leading-7">{user.entrepreneurProfile.description}</p> : null}
          </Card>

          {user.reviewsReceived.length ? (
            <Card>
              <h2 className="text-lg font-bold">سجل المراجعات</h2>
              <ul className="flex flex-col gap-3">
                {user.reviewsReceived.map((r) => (
                  <li key={r.id} className="rounded-xl border border-line p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={r.decision === "APPROVED" ? "success" : "danger"}>{r.decision === "APPROVED" ? "موافقة" : "مطلوب تعديل"}</Badge>
                      <span className="text-muted">{r.reviewer.fullName} · {formatDateTime(r.createdAt)}</span>
                    </div>
                    {r.flaggedFields.length ? <p className="mt-2">الحقول: {r.flaggedFields.map((f) => REVIEW_FIELDS[f as ReviewField] ?? f).join("، ")}</p> : null}
                    {r.note ? <p className="mt-1 text-muted">{r.note}</p> : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-lg font-bold">فحص تلقائي</h2>
            <ul className="flex flex-col gap-2">
              <Check_ ok={Boolean(nid?.ok)}>{nid?.ok ? "صيغة الرقم القومي صحيحة" : "صيغة الرقم القومي غير صحيحة"}</Check_>
              {nid?.ok ? (
                <>
                  <Check_ ok>تاريخ الميلاد من الرقم: {formatDate(nid.info.birthDate)} ({nid.info.age} سنة)</Check_>
                  <Check_ ok={nid.info.governorate === user.governorate}>
                    محافظة الميلاد من الرقم: {nid.info.governorate}
                    {nid.info.governorate !== user.governorate ? " — مختلفة عن المحافظة المسجّلة (ممكن تكون طبيعية)" : ""}
                  </Check_>
                </>
              ) : null}
              <Check_ ok>الرقم القومي مش مستخدم في حساب تاني</Check_>
              <Check_ ok={Boolean(user.phoneVerifiedAt)}>رقم الهاتف مؤكَّد برمز OTP</Check_>
              <Check_ ok={user.kycDocuments.length === 3}>الصور التلاتة مرفوعة</Check_>
            </ul>
            <p className="text-xs leading-6 text-muted">الفحص التلقائي بيراجع الصيغة بس. مطابقة الصور مع الرقم والاسم مسؤولية المراجِع.</p>
          </Card>

          {user.status === "PENDING_REVIEW" ? (
            <ReviewForm userId={user.id} />
          ) : (
            <Card>
              <p className="text-sm text-muted">الطلب ده مش بانتظار المراجعة دلوقتي.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
