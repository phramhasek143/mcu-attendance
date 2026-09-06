"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  FileText,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { mockOfferings, mockSessions, mockAttendances } from "@/lib/mock-data";

export default function StudentPortalPage() {
  // สถิติของ พระมหาธนภูมิ ฐิตธมฺโม (usr-student-01)
  const currentStudentId = "usr-student-01";

  // คำนวณสถิติวิชา off-001 (ภาษาไทยเพื่อการสื่อสาร)
  const totalRequired = 4; // จาก mockSessions ทั้งหมด 4 คาบ
  const records = mockAttendances.filter((a) => a.studentId === currentStudentId);

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const leaveCount = records.filter((r) => r.status === "LEAVE" || r.status === "EXCUSED").length;

  // สูตรคำนวณ % การเข้าเรียนสุทธิ (Late คิด 0.5, Leave/Excused ไม่คิดเป็นขาด)
  const effectivePresent = presentCount + lateCount * 0.5 + leaveCount;
  const attendancePercentage = Math.round((effectivePresent / totalRequired) * 100);

  // กำหนดสถานะความเสี่ยงตามเกณฑ์ 80%
  let riskStatus: "SAFE" | "WARNING" | "DANGER" = "SAFE";
  let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  let statusText = "ปกติ (มีสิทธิ์สอบ)";

  if (attendancePercentage < 80) {
    riskStatus = "DANGER";
    badgeColor = "bg-red-100 text-red-800 border-red-300";
    statusText = "วิกฤต! ขาดเรียนเกินเกณฑ์ เสี่ยงหมดสิทธิ์สอบ";
  } else if (attendancePercentage < 85) {
    riskStatus = "WARNING";
    badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
    statusText = "เฝ้าระวัง (ใกล้เกณฑ์ขั้นต่ำ 80%)";
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Welcome Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              พระภิกษุสงฆ์ • ภาคเรียนที่ 1/2569
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              พระมหาธนภูมิ ฐิตธมฺโม
            </h1>
            <p className="mt-1 text-xs text-amber-100 sm:text-sm">
              รหัสนิสิต: 6601201001 • คณะพุทธศาสตร์ สาขาวิชาพระพุทธศาสนา
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/student/scan">
              <Button size="lg" className="gap-2 bg-white text-amber-900 shadow-md hover:bg-amber-50">
                <QrCode className="h-5 w-5 text-amber-600" />
                สแกนเช็คชื่อตอนนี้
              </Button>
            </Link>
            <Link href="/student/leave/new">
              <Button size="lg" variant="outline" className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Calendar className="h-4 w-4" />
                ยื่นใบลา
              </Button>
            </Link>
          </div>
        </div>

        {/* 80% Rule Alert Banner if Warning/Danger */}
        {riskStatus !== "SAFE" && (
          <div className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${badgeColor}`}>
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <div>
              <p className="font-bold text-sm">แจ้งเตือนเกณฑ์เวลาเรียน 80% (ประกาศกระทรวง อว. และระเบียบ มจร)</p>
              <p className="text-xs mt-0.5">
                เวลาเรียนสะสมของท่านอยู่ในระดับ {statusText} กรุณาเข้าเรียนให้ครบถ้วนเพื่อรักษาสิทธิ์การสอบปลายภาค
              </p>
            </div>
          </div>
        )}

        {/* Enrolled Courses Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              รายวิชาที่ลงทะเบียนและสถิติเวลาเรียน
            </h2>
            <span className="text-xs text-slate-500">
              เกณฑ์ขั้นต่ำมีสิทธิ์สอบ: 80% ของเวลาเรียนทั้งหมด
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockOfferings.map((off, idx) => {
              // สมมติค่าสถิติสำหรับวิชาอื่น
              const pct = idx === 0 ? attendancePercentage : idx === 1 ? 88 : 75;
              const isDanger = pct < 80;
              const isWarning = pct >= 80 && pct < 85;

              return (
                <Card key={off.id} className="transition-all hover:shadow-md border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs border-amber-300 bg-amber-50/60 text-amber-900">
                        {off.courseCode} (Sec {off.section})
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          isDanger
                            ? "bg-red-50 text-red-700 border-red-200"
                            : isWarning
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }
                      >
                        {pct}% เข้าเรียน
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 mt-2">
                      {off.titleTh}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      ผู้สอน: {off.instructorName} • {off.roomNumber}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-600">ร้อยละเวลาเรียน</span>
                        <span className={isDanger ? "text-red-600 font-bold" : "text-slate-900"}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDanger ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                        <span>0%</span>
                        <span className="text-amber-600 font-semibold">เกณฑ์ 80%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Stats Counter */}
                    <div className="grid grid-cols-4 gap-2 text-center rounded-xl bg-slate-50 p-2.5 text-xs">
                      <div>
                        <span className="block font-bold text-emerald-600">{presentCount}</span>
                        <span className="text-[10px] text-slate-500">มา</span>
                      </div>
                      <div>
                        <span className="block font-bold text-amber-600">{lateCount}</span>
                        <span className="text-[10px] text-slate-500">สาย</span>
                      </div>
                      <div>
                        <span className="block font-bold text-red-600">{absentCount}</span>
                        <span className="text-[10px] text-slate-500">ขาด</span>
                      </div>
                      <div>
                        <span className="block font-bold text-blue-600">{leaveCount}</span>
                        <span className="text-[10px] text-slate-500">ลา</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Detailed Attendance History */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            ประวัติการบันทึกเวลาเรียนล่าสุด (วิชา 000 101 ภาษาไทยเพื่อการสื่อสาร)
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {mockSessions.map((session) => {
                const record = mockAttendances.find(
                  (a) => a.sessionId === session.id && a.studentId === currentStudentId
                );

                const status = record?.status || (session.isClosed ? "ABSENT" : "PENDING");

                return (
                  <div key={session.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/70">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-semibold text-sm">
                        {session.title.split(":")[0]?.replace("สัปดาห์ที่ ", "W") || "W"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{session.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          วันที่: {session.sessionDate} • เวลา {session.startTime} - {session.endTime} น.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      {status === "PRESENT" && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          มาเรียน (Ref: {record?.referenceCode})
                        </div>
                      )}
                      {status === "LATE" && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                          <Clock className="h-4 w-4 text-amber-600" />
                          มาสาย ({record?.note || "สแกนหลังเกณฑ์"})
                        </div>
                      )}
                      {status === "ABSENT" && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                          <XCircle className="h-4 w-4 text-red-600" />
                          ขาดเรียน
                        </div>
                      )}
                      {status === "PENDING" && (
                        <Link href="/student/scan">
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs">
                            <QrCode className="h-3.5 w-3.5" />
                            เช็คชื่อรอบนี้
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
