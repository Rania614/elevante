import type { Role } from "@prisma/client"
import { ChoiceField, SelectField, TextAreaField, TextField } from "@/components/ui/field"
import { INVESTOR_TYPES, SECTORS, STAGES, SUPPLY_TYPES, TICKET_RANGES } from "@/lib/verification"

const opts = (r: Record<string, string>) => Object.entries(r).map(([value, label]) => ({ value, label }))
const list = (a: string[]) => a.map((v) => ({ value: v, label: v }))

type Values = Record<string, string | undefined>
type Errors = Record<string, string | undefined>

/** Role-specific profile fields, shared by registration and resubmission. */
export function ProfileFields({ role, values = {}, errors = {} }: { role: Exclude<Role, "ADMIN">; values?: Values; errors?: Errors }) {
  if (role === "SUPPLIER") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <ChoiceField className="sm:col-span-2" label="نوع ما تقدّمه" name="supplyType" options={opts(SUPPLY_TYPES)} defaultValue={values.supplyType} error={errors.supplyType} hint="بيحدد شكل العروض اللي تقدر تنشرها" />
        <TextField label="الاسم التجاري أو المهني" name="businessName" defaultValue={values.businessName} error={errors.businessName} maxLength={120} />
        <TextField label="رقم السجل التجاري" name="commercialRegNo" optional dir="ltr" defaultValue={values.commercialRegNo} error={errors.commercialRegNo} hint="مطلوب للشركات والمنشآت" maxLength={40} />
      </div>
    )
  }
  if (role === "ENTREPRENEUR") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="اسم المشروع" name="projectName" defaultValue={values.projectName} error={errors.projectName} maxLength={120} />
        <SelectField label="القطاع" name="sector" options={list(SECTORS)} defaultValue={values.sector} error={errors.sector} />
        <ChoiceField className="sm:col-span-2" label="مرحلة المشروع" name="stage" options={opts(STAGES)} defaultValue={values.stage} error={errors.stage} />
        <TextAreaField className="sm:col-span-2" label="وصف الفكرة" name="description" defaultValue={values.description} error={errors.description} minLength={150} maxLength={1500} hint="150 حرف على الأقل: المشكلة، والحل، والعميل المستهدف" />
      </div>
    )
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <ChoiceField className="sm:col-span-2" label="نوع المستثمر" name="investorType" options={opts(INVESTOR_TYPES)} defaultValue={values.investorType} error={errors.investorType} />
      <SelectField label="حجم الاستثمار المعتاد في المشروع" name="ticketRange" options={list(TICKET_RANGES)} defaultValue={values.ticketRange} error={errors.ticketRange} />
      <TextField label="اسم الجهة" name="organization" optional defaultValue={values.organization} error={errors.organization} hint="للشركات والصناديق" maxLength={120} />
    </div>
  )
}
