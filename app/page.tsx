import { AuthShell } from "@/components/brand"
import { ButtonLink } from "@/components/ui/button"

const ROLES = [
  { title: "رواد الأعمال", text: "اعرض فكرتك، انشر طلبات التوريد والتمويل، واستقبل عروض من حسابات موثّقة." },
  { title: "الموردون ومقدمو الخدمات", text: "اعرض منتجاتك أو خدماتك وقدّم عروضك على طلبات المشاريع." },
  { title: "المستثمرون", text: "موّل مشاريع موثّقة على مراحل، والتمويل يتفرج مع اعتماد كل مرحلة." },
]

export default function HomePage() {
  return (
    <AuthShell headerAction={<ButtonLink href="/login" variant="outline" size="sm">تسجيل الدخول</ButtonLink>}>
      <div className="w-full max-w-5xl animate-fade-up self-start">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h1 className="text-4xl font-extrabold leading-snug sm:text-5xl">من الفكرة للتوريد للتمويل… في منصة واحدة</h1>
          <p className="text-lg text-navy/80">كل الحسابات موثّقة برقم البطاقة وموافقة الإدارة قبل التفعيل.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/register" size="lg">إنشاء حساب</ButtonLink>
            <ButtonLink href="/login" variant="outline" size="lg">تسجيل الدخول</ButtonLink>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.title} className="rounded-[20px] border border-aqua bg-ice/95 p-6 shadow-float">
              <h2 className="text-xl font-bold">{r.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </AuthShell>
  )
}
