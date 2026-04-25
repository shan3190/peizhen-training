import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '郑州陪诊通培训平台',
  description: '陪诊师专业培训平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
