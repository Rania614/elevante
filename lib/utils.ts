import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(d)
}

export function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(d)
}
