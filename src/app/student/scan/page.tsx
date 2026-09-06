"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScanConfirmationModal } from "@/components/student/ScanConfirmationModal";
import { CheckInResult } from "@/types/attendance.types";
import {
  QrCode,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export default function StudentScanPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<CheckInResult | null>(null);

  const activeSessionId = "ses-104"; // คาบปัจจุบัน (สัปดาห์ที่ 4 ภาษาไทยเพื่อการสื่อสาร)

  const handleSimulateScan = () => {
    // จำลองการสแกนรหัส Dynamic Token จากหน้าจอโปรเจกเตอร์
    const randomToken = "MCU_LIVE_TOKEN_2026_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setTokenInput(randomToken);
    setShowModal(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim().length >= 8) {
      setShowModal(true);
    }
  };

  const handleSuccess = (result: CheckInResult) => {
    setShowModal(false);
    setCheckInSuccess(result);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-xl px-4 py-8 sm:px-6">
        <Link href="/student/portal" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          กลับสู่ภาพรวมเวลาเรียน
        </Link>

        {checkInSuccess ? (
          /* Check-in Success Slip */
          <Card className="border-emerald-300 bg-white shadow-xl text-center p-6 sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              บันทึกเวลาเรียนสำเร็จแล้ว
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              ระบบตรวจสอบเวลาอ้างอิงจาก Server Clock เรียบร้อย
            </p>

            <div className="mt-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">รายวิชา:</span>
                <span className="font-semibold text-slate-800 text-xs">{checkInSuccess.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">ผู้เข้าเรียน:</span>
                <span className="font-semibold text-slate-800 text-xs">{checkInSuccess.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">สถานะ:</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
                  {checkInSuccess.status === "PRESENT" ? "มาเรียนตรงเวลา" : "มาสาย"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">เลขอ้างอิง (Reference):</span>
                <span className="font-mono font-bold text-amber-800 text-xs">{checkInSuccess.referenceCode}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link href="/student/portal">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  ดูประวัติและภาพรวมสะสม
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setCheckInSuccess(null)}>
                สแกนใหม่อีกครั้ง
              </Button>
            </div>
          </Card>
        ) : (
          /* Scanner View */
          <Card className="border-amber-200/80 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <QrCode className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold mt-2">สแกน Dynamic QR Code</CardTitle>
              <CardDescription className="text-xs">
                หันกล้องสมาร์ทโฟนไปที่จอโปรเจกเตอร์หน้าห้องเรียน หรือคลิกจำลองการสแกน
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {/* Camera Viewfinder Box */}
              <div className="relative mx-auto flex h-64 w-full max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-400/80 bg-slate-900 text-white overflow-hidden shadow-inner">
                <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />
                <Camera className="h-12 w-12 text-slate-500 mb-2" />
                <span className="text-xs text-slate-400 font-medium">
                  กำลังค้นหารหัส QR Code บนหน้าจอ...
                </span>
                <span className="text-[10px] text-amber-400/80 mt-1">
                  รหัสจะรีเฟรชทุก 20 วินาที
                </span>

                <Button
                  onClick={handleSimulateScan}
                  size="sm"
                  className="absolute bottom-4 bg-amber-600/90 hover:bg-amber-600 text-white text-xs gap-1.5 backdrop-blur-sm shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  จำลองการสแกนรหัสผ่านจอ (Demo Scan)
                </Button>
              </div>

              {/* Manual Passcode Fallback (Zero Device Barrier) */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-amber-600" />
                  หรือกรอกรหัสฉุกเฉิน / วางโทเคนจากห้องเรียน:
                </p>
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <Input
                    placeholder="กรอกรหัสโทเคน เช่น MCU_LIVE_..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="text-xs font-mono"
                  />
                  <Button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white text-xs shrink-0">
                    ยืนยัน
                  </Button>
                </form>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>ระบบป้องกันการแคปภาพหน้าจอส่งต่อด้วย Dynamic Salt Rotation</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan Confirmation Modal */}
        {showModal && (
          <ScanConfirmationModal
            sessionId={activeSessionId}
            scannedToken={tokenInput}
            onSuccess={handleSuccess}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    </div>
  );
}
