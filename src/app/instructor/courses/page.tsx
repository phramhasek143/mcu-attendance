"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  QrCode,
  ClipboardList,
  Clock,
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
} from "lucide-react";
import { mockOfferings, mockSessions } from "@/lib/mock-data";

export default function InstructorCoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs">
                อาจารย์ผู้สอนประจำวิชา
              </Badge>
              <span className="text-xs text-slate-500">ภาคเรียนที่ 1/2569</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ตารางสอนและรายวิชาที่รับผิดชอบ
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              พระมหาบุญเลิศ กิตฺติปญฺโญ • คณะพุทธศาสตร์ มจร วังน้อย
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/instructor/sessions/ses-104/present">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2 text-xs shadow-md">
                <QrCode className="h-4 w-4" />
                เปิดจอฉาย QR คาบนี้
              </Button>
            </Link>
            <Link href="/instructor/sessions/ses-104/roster">
              <Button variant="outline" className="gap-2 text-xs border-slate-300">
                <ClipboardList className="h-4 w-4" />
                เช็คชื่อในชั้นเรียน
              </Button>
            </Link>
          </div>
        </div>

        {/* Courses List */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockOfferings.map((off) => (
            <Card key={off.id} className="transition-all hover:shadow-lg border-slate-200 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-md border border-amber-300">
                    {off.courseCode}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    กลุ่ม {off.section}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                  {off.titleTh}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {off.roomNumber} • บังคับ {off.totalHoursRequired} ชม. (16 สัปดาห์)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>จำนวนนิสิตในกลุ่ม:</span>
                  <span className="font-semibold text-slate-900">35 รูป/คน (บรรพชิต 28, ฆราวาส 7)</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>รอบเช็คชื่อที่สอนแล้ว:</span>
                  <span className="font-semibold text-slate-900">4 / 16 คาบ</span>
                </div>
                <div className="flex justify-between">
                  <span>อัตราการเข้าเรียนเฉลี่ย:</span>
                  <span className="font-semibold text-emerald-600">89.4% (สถานะปกติ)</span>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2 rounded-b-2xl">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Link href={`/instructor/sessions/ses-104/present`} className="w-full">
                    <Button size="sm" className="w-full text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5">
                      <QrCode className="h-3.5 w-3.5" />
                      เปิดจอ QR
                    </Button>
                  </Link>
                  <Link href={`/instructor/sessions/ses-104/roster`} className="w-full">
                    <Button size="sm" variant="outline" className="w-full text-xs gap-1.5">
                      <ClipboardList className="h-3.5 w-3.5" />
                      ใบเช็คชื่อ
                    </Button>
                  </Link>
                </div>
                <Link href="/registrar/eligibility" className="w-full">
                  <Button size="sm" variant="ghost" className="w-full text-[11px] text-slate-600 hover:text-amber-800 gap-1">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    ดูสรุปสิทธิ์สอบ 80% ปลายภาค
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
