import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  GraduationCap,
  Users,
  ShieldCheck,
  CalendarCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/60 via-slate-50 to-amber-50/30">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-amber-200/60 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 sm:text-lg">
                MCU-SAMS
              </span>
              <span className="hidden text-xs text-amber-800/80 sm:inline sm:ml-2">
                MCU Student Attendance Management System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:inline-flex border-amber-300 bg-amber-50 text-amber-800">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-amber-600" />
              มหาวิทยาลัยสงฆ์ มจร
            </Badge>
            <Link href="/login">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto flex-1 max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/60 px-4 py-1.5 text-xs font-semibold text-amber-900 shadow-sm">
            <CalendarCheck className="h-4 w-4 text-amber-700" />
            MCU-SAMS • ระบบบริหารจัดการการเช็คชื่อนิสิต มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:leading-tight">
            ระบบบริหารจัดการการเช็คชื่อนิสิต <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent">
              มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (MCU-SAMS)
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            MCU Student Attendance Management System: บันทึกเวลาเรียนและกิจกรรมวัตรปฏิบัติอย่างถูกต้อง แม่นยำ โปร่งใส ด้วย Dynamic QR Code
            และโหมดตรวจเช็คสำรอง สอดคล้องกับระเบียบมหาวิทยาลัยและเกณฑ์ อว. 80%
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/student/scan">
              <Button size="lg" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20">
                <QrCode className="h-5 w-5" />
                สแกนเช็คชื่อ (นิสิต)
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 border-slate-300 bg-white hover:bg-slate-50">
                เข้าใช้งานสำหรับอาจารย์ / บุคลากร
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Portal Entry Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Student */}
          <Card className="transition-all hover:shadow-md hover:border-amber-300">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <QrCode className="h-6 w-6" />
              </div>
              <CardTitle className="mt-3 text-xl">พระนิสิต / นิสิตคฤหัสถ์</CardTitle>
              <CardDescription>
                สแกนบันทึกเวลาเรียน ตรวจสอบสถิติร้อยละเวลาเรียนสะสม และยื่นใบลาติดศาสนกิจ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  สแกนรหัสผ่านมือถือได้ทันที
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  เตือนสถานะก่อนต่ำกว่า 80%
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  ยื่นใบลาติดกิจนิมนต์พร้อมแนบภาพ
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 2: Instructor */}
          <Card className="transition-all hover:shadow-md hover:border-amber-300">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="mt-3 text-xl">อาจารย์ผู้สอน</CardTitle>
              <CardDescription>
                เปิดรอบเช็คชื่อด้วย Dynamic QR Code ฉายขึ้นจอ และโหมดเช็คชื่อสำรองในห้องเรียน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  QR Code เปลี่ยนรหัสทุก 20 วินาที
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  เช็คชื่อแทนเมื่อผู้เรียนไม่มีโทรศัพท์
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  อนุมัติใบลาและส่งออก Excel ทันที
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 3: Registrar & Admin */}
          <Card className="transition-all hover:shadow-md hover:border-amber-300 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <GraduationCap className="h-6 w-6" />
              </div>
              <CardTitle className="mt-3 text-xl">ทะเบียนและประเมินผล</CardTitle>
              <CardDescription>
                ตัดยอดสิทธิ์สอบ 80% อัตโนมัติ นำเข้าข้อมูลรายชื่อ และรองรับงานประกันคุณภาพ AUN-QA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  คำนวณสิทธิ์สอบแยกตามคณะ/วิทยาเขต
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  นำเข้ารายชื่อผ่าน Excel ในคลิกเดียว
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  ประวัติการแก้ไขตรวจสอบได้ (Audit Trail)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2569 มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (มจร) • ศูนย์คอมพิวเตอร์และสำนักทะเบียนและวัดผล</p>
        <p className="mt-1 font-medium">MCU-SAMS (MCU Student Attendance Management System) • Production MVP v1.0.0</p>
      </footer>
    </div>
  );
}
