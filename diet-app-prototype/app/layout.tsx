import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ダイエットアプリ - AI栄養士と共に健康習慣を",
  description: "AI栄養士があなたの健康的なダイエットをサポート。食事記録、栄養バランス分析、パーソナライズされたアドバイスで理想の体型へ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 pb-20">
          <main className="max-w-md mx-auto bg-white min-h-screen">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
