import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "Elevante", template: "%s · Elevante" },
  description: "منصة بتجمع رواد الأعمال والموردين ومقدمي الخدمات والمستثمرين، مع توثيق الحسابات وتمويل على مراحل.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
