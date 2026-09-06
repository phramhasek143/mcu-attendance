import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "MCU-SAMS | ระบบบริหารจัดการการเช็คชื่อนิสิต มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย",
  description: "MCU-SAMS (MCU Student Attendance Management System) ระบบบริหารจัดการการเช็คชื่อนิสิต มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
