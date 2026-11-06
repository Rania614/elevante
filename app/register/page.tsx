import type { Metadata } from "next"
import Link from "next/link"
import { Briefcase, Lightbulb, TrendingUp, Check } from "lucide-react"
import { AuthShell } from "@/components/brand"
import { ButtonLink } from "@/components/ui/button"

export const metadata: Metadata = { title: "اختيار نوع الحساب" }

const ROLES = [
  { slug: "supplier", icon: Briefcase, title: "مورد / مقدم خدمة", text: "تورّد مواد خام وسلعًا، أو تقدّم خدمات، أو الاتنين", points: ["اعرض منتجاتك أو خدماتك", "قدّم عروضك على طلبات التوريد"] },
  { slug: "entrepreneur", icon: Lightbulb, title: "رائد أعمال", text: "عندك فكرة أو مشروع ومحتاج توريد أو تمويل", points: ["انشر طلبات توريد واستثمار", "تابع مراحل مشروعك"] },
  { slug: "investor", icon: TrendingUp, title: "مستثمر", text: "موّل مشاريع موثّقة وتابع إنجازها", points: ["موّل على شرائح في الضمان", "راجع إثبات كل مرحلة"] },
] as const

export default function RoleSelectionPage() {
  return (
    <AuthShell headerAction={<ButtonLink href="/login" variant="outline" size="sm">لديك حساب؟ تسجيل الدخول</ButtonLink>}>
      <div className="w-full max-w-5xl animate-fade-up self-start">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">اختر نوع حسابك</h1>
          <p className="mt-3 text-navy/80">كل نوع ليه نموذج تسجيل خاص، وكل الحسابات بتتوثق برقم البطاقة قبل التفعيل.</p>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {ROLES.map(({ slug, icon: Icon, title, text, points }) => (
            <li key={slug}>
              <Link
                href={`/register/${slug}`}
                className="flex h-full flex-col gap-4 rounded-[20px] border border-ice bg-white p-6 shadow-card transition hover:scale-[1.02] hover:shadow-float"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-panel text-white shadow-btn">
                  <Icon size={24} aria-hidden />
                </span>
                <span>
                  <span className="block text-xl font-bold">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                </span>
                <span className="flex flex-1 flex-col gap-2">
                  {points.map((p) => (
                    <span key={p} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-steel" aria-hidden />
                      {p}
                    </span>
                  ))}
                </span>
                <span className="text-sm font-bold text-steel">ابدأ التسجيل ←</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AuthShell>
  )
}
