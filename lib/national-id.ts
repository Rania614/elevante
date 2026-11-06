// Egyptian national ID: 14 digits  C YYMMDD GG SSSS K
//   C     century (2 = 1900s, 3 = 2000s)
//   YYMMDD birth date
//   GG    governorate of birth registration
//   SSSS  sequence (the 13th digit is odd for males, even for females)
//   K     check digit — its algorithm is not officially published, so it is not verified here.

export const GOVERNORATE_CODES: Record<string, string> = {
  "01": "القاهرة", "02": "الإسكندرية", "03": "بورسعيد", "04": "السويس",
  "11": "دمياط", "12": "الدقهلية", "13": "الشرقية", "14": "القليوبية", "15": "كفر الشيخ",
  "16": "الغربية", "17": "المنوفية", "18": "البحيرة", "19": "الإسماعيلية",
  "21": "الجيزة", "22": "بني سويف", "23": "الفيوم", "24": "المنيا", "25": "أسيوط",
  "26": "سوهاج", "27": "قنا", "28": "أسوان", "29": "الأقصر",
  "31": "البحر الأحمر", "32": "الوادي الجديد", "33": "مطروح", "34": "شمال سيناء", "35": "جنوب سيناء",
  "88": "خارج الجمهورية",
}

export type NationalIdInfo = { birthDate: Date; governorate: string; age: number }
export type NationalIdResult = { ok: true; value: string; info: NationalIdInfo } | { ok: false; error: string }

/** Converts Arabic-Indic digits (٠-٩) to ASCII so users can type either. */
export function normalizeDigits(input: string): string {
  return input.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/\s+/g, "")
}

export function parseNationalId(raw: string, now = new Date()): NationalIdResult {
  const value = normalizeDigits(raw)
  if (!/^\d{14}$/.test(value)) return { ok: false, error: "الرقم القومي لازم يكون 14 رقم" }

  const century = value[0] === "2" ? 1900 : value[0] === "3" ? 2000 : null
  if (!century) return { ok: false, error: "أول رقم في الرقم القومي غير صحيح" }

  const year = century + Number(value.slice(1, 3))
  const month = Number(value.slice(3, 5))
  const day = Number(value.slice(5, 7))
  const birthDate = new Date(Date.UTC(year, month - 1, day))
  const validDate =
    birthDate.getUTCFullYear() === year && birthDate.getUTCMonth() === month - 1 && birthDate.getUTCDate() === day
  if (!validDate || birthDate > now) return { ok: false, error: "تاريخ الميلاد في الرقم القومي غير صحيح" }

  const governorate = GOVERNORATE_CODES[value.slice(7, 9)]
  if (!governorate) return { ok: false, error: "كود المحافظة في الرقم القومي غير صحيح" }

  let age = now.getUTCFullYear() - year
  const beforeBirthday =
    now.getUTCMonth() < month - 1 || (now.getUTCMonth() === month - 1 && now.getUTCDate() < day)
  if (beforeBirthday) age -= 1
  if (age < 18) return { ok: false, error: "لازم يكون عمرك 18 سنة أو أكثر" }

  return { ok: true, value, info: { birthDate, governorate, age } }
}
