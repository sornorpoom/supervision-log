import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบบันทึกการนิเทศออนไลน์ - ศน.รัชภูมิ สมสมัย",
  description: "Supervision Log System - ศธจ.เชียงใหม่",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
