"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { mockOfferings, mockSessions } from "@/lib/mock-data";

export default function StudentLeavePage() {
  const [selectedOffering, setSelectedOffering] = useState(mockOfferings[0].id);
  const [selectedSession, setSelectedSession] = useState(mockSessions[3].id);
  const [leaveType, setLeaveType] = useState<"RELIGIOUS_DUTY" | "SICK" | "BUSINESS">("RELIGIOUS_DUTY");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link href="/student/portal" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          กลับสู่ภาพรวมเวลาเรียน
        </Link>

        {isSubmitted ? (
          <Card className="border-emerald-300 bg-white shadow-xl text-center p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              ส่งคำขอลาเรียบร้อยแล้ว
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              คำขอของท่านถูกส่งต่อไปยังอาจารย์ผู้สอนประจำวิชาเพื่อพิจารณาอนุมัติ
              เมื่อได้รับการอนุมัติ เวลาเรียนในคาบนี้จะไม่ถูกคิดเป็นการขาดเรียน
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link href="/student/portal">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  กลับสู่หน้าหลักนิสิต
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border-slate-200 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-xs">
                  ระบบคำขอลาออนไลน์
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold mt-1">ยื่นคำขอลาเรียน / ลาศาสนกิจ</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                สำหรับพระภิกษุสามเณรที่ติดกิจนิมนต์ และนิสิตที่มีเหตุจำเป็นตามระเบียบมหาวิทยาลัย
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Offering Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">รายวิชาที่ขอลา</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={selectedOffering}
                    onChange={(e) => setSelectedOffering(e.target.value)}
                  >
                    {mockOfferings.map((off) => (
                      <option key={off.id} value={off.id}>
                        {off.courseCode} {off.titleTh} (Sec {off.section}) - {off.instructorName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Session Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">คาบเรียนที่ต้องการขอลา</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                  >
                    {mockSessions.map((ses) => (
                      <option key={ses.id} value={ses.id}>
                        {ses.title} ({ses.sessionDate} เวลา {ses.startTime} - {ses.endTime} น.)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leave Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">ประเภทการลา</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLeaveType("RELIGIOUS_DUTY")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs transition-all ${
                        leaveType === "RELIGIOUS_DUTY"
                          ? "border-amber-500 bg-amber-50/80 font-bold text-amber-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base mb-1">📿</span>
                      ติดศาสนกิจ / กิจนิมนต์
                    </button>

                    <button
                      type="button"
                      onClick={() => setLeaveType("SICK")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs transition-all ${
                        leaveType === "SICK"
                          ? "border-amber-500 bg-amber-50/80 font-bold text-amber-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base mb-1">🏥</span>
                      ลาป่วย
                    </button>

                    <button
                      type="button"
                      onClick={() => setLeaveType("BUSINESS")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs transition-all ${
                        leaveType === "BUSINESS"
                          ? "border-amber-500 bg-amber-50/80 font-bold text-amber-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base mb-1">📋</span>
                      ลากิจธุระจำเป็น
                    </button>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    เหตุผลความจำเป็นในการลา <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="เช่น ติดศาสนกิจพิธีเจริญพระพุทธมนต์ ณ วัด... หรือมีอาการป่วยพักรักษาตัว"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                {/* File Upload Attachment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    เอกสารหลักฐานประกอบ (ใบฎีกานิมนต์ / ใบรับรองแพทย์)
                  </label>
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center hover:bg-slate-50 cursor-pointer">
                    <UploadCloud className="h-8 w-8 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-700">คลิกเพื่ออัปโหลดไฟล์ภาพหรือ PDF</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">รองรับ .jpg, .png, .pdf ขนาดไม่เกิน 5MB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>การลาที่ได้รับอนุมัติจะไม่ถูกหักเวลาเรียนเป็น "ขาด" โดยจะได้รับการยกเว้นตามเกณฑ์</span>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !reason.trim()}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      กำลังส่งคำขอลา...
                    </>
                  ) : (
                    "ยืนยันส่งคำขอลา"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
