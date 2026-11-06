"use client"

import { useEffect, useId, useState } from "react"
import { ImageUp } from "lucide-react"

export function KycFileInput({ name, label, hint, error }: { name: string; label: string; hint: string; error?: string }) {
  const id = useId()
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-aqua bg-[linear-gradient(to_left,rgba(168,218,220,.10),rgba(69,123,157,.10))] p-4 text-center transition hover:border-steel focus-within:border-steel"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-28 w-full rounded-xl object-cover" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-panel text-white">
            <ImageUp size={22} aria-hidden />
          </span>
        )}
        <span className="text-sm font-bold">
          {label} <span className="text-danger-text" aria-hidden>*</span>
        </span>
        <span className="text-xs text-muted">{fileName ?? hint}</span>
        <span className="text-xs text-muted">JPG أو PNG أو WEBP — حتى 5 ميجابايت</span>
        <input
          id={id}
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => {
            const f = e.target.files?.[0]
            setFileName(f?.name ?? null)
            setPreview(f ? URL.createObjectURL(f) : null)
          }}
        />
      </label>
      {error ? <p id={`${id}-error`} className="text-xs font-medium text-danger-text">{error}</p> : null}
    </div>
  )
}
