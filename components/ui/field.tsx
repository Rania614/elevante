import { useId } from "react"
import { cn } from "@/lib/utils"

type BaseProps = { label: string; error?: string; hint?: string; optional?: boolean; className?: string }

function FieldShell({ id, label, error, hint, optional, className, children }: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional ? <span className="font-normal text-muted"> (اختياري)</span> : <span className="text-danger-text" aria-hidden> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-danger-text">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function describe(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined
}

export function TextField({ label, error, hint, optional, className, ...input }: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <FieldShell id={id} {...{ label, error, hint, optional, className }}>
      <input id={id} className="control" aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} required={!optional} {...input} />
    </FieldShell>
  )
}

export function TextAreaField({ label, error, hint, optional, className, ...input }: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <FieldShell id={id} {...{ label, error, hint, optional, className }}>
      <textarea id={id} rows={4} className="control h-auto py-2.5 leading-7" aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} required={!optional} {...input} />
    </FieldShell>
  )
}

export function SelectField({
  label, error, hint, optional, className, options, placeholder = "اختر…", ...select
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder?: string }) {
  const id = useId()
  return (
    <FieldShell id={id} {...{ label, error, hint, optional, className }}>
      <select id={id} className="control" aria-invalid={error ? true : undefined} aria-describedby={describe(id, error, hint)} required={!optional} {...select}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

/** Radio chips (single choice). */
export function ChoiceField({
  label, name, options, defaultValue, error, hint, className,
}: { label: string; name: string; options: { value: string; label: string }[]; defaultValue?: string; error?: string; hint?: string; className?: string }) {
  const id = useId()
  return (
    <fieldset className={cn("flex min-w-0 flex-col gap-2", className)} aria-describedby={describe(id, error, hint)}>
      <legend className="mb-2 text-sm font-semibold">
        {label}
        <span className="text-danger-text" aria-hidden> *</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-aqua bg-white px-4 text-sm font-medium has-[:checked]:border-steel has-[:checked]:bg-ice">
            <input type="radio" name={name} value={o.value} defaultChecked={defaultValue === o.value} className="h-4 w-4 accent-steel" required />
            {o.label}
          </label>
        ))}
      </div>
      {error ? <p id={`${id}-error`} className="text-xs font-medium text-danger-text">{error}</p> : hint ? <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p> : null}
    </fieldset>
  )
}
