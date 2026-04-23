import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "郑州陪诊通培训平台",
  description: "陪诊师专业培训平台 - 学习、考核、取证一站式服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
