"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Users,
  Clock,
  ArrowLeft,
  Maximize2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { mockOfferings, mockSessions } from "@/lib/mock-data";

export default function ProjectorPresentPage() {
  const session = mockSessions[3]; // คาบปัจจุบัน (สัปดาห์ที่ 4)
  const offering = mockOfferings[0];

  const [timer, setTimer] = useState(20);
  const [token, setToken] = useState("MCU-LIVE-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [attendeeCount, setAttendeeCount] = useState(4);
  const totalEnrolled = 35;

  // Countdown timer for Dynamic QR rotation (every 20 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // หมุนเวียนรหัสใหม่
          setToken("MCU-LIVE-" + Math.random().toString(36).substring(2, 8).toUpperCase());
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateNewCheckIn = () => {
    setAttendeeCount((prev) => (prev < totalEnrolled ? prev + 1 : prev));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10">
      {/* Top Bar Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses">
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              กลับ
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600 text-white hover:bg-amber-600 text-xs">
                ห้องเรียนสด (Live Classroom)
              </Badge>
              <span className="text-xs text-slate-400">
                {offering.courseCode} {offering.titleTh} (Sec {offering.section})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              {session.title}
            </h1>
          </div>
        </div>

        {/* Live Attendance Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3">
            <Users className="h-6 w-6 text-amber-500" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-400">{attendeeCount}</span>
                <span className="text-sm text-slate-400">/ {totalEnrolled} รูป/คน</span>
              </div>
              <span className="text-[10px] text-slate-500">เช็คชื่อแล้วแบบ Real-time</span>
            </div>
          </div>

          <Link href={`/instructor/sessions/${session.id}/roster`}>
            <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs gap-1.5">
              <ClipboardList className="h-4 w-4" />
              เช็คชื่อแทน
            </Button>
          </Link>
        </div>
      </header>

      {/* Main QR Display Section */}
      <main className="my-auto flex flex-col items-center justify-center py-6 text-center">
        <div className="relative rounded-3xl bg-white p-8 sm:p-10 shadow-2xl shadow-amber-500/10 border-4 border-amber-500/80">
          {/* Rotating Dynamic QR Code Graphic */}
          <div className="flex h-64 w-64 sm:h-80 sm:w-80 flex-col items-center justify-center rounded-2xl bg-slate-900 text-white p-4 relative overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

            <QrCode className="h-44 w-44 sm:h-56 sm:w-56 text-amber-400 animate-fade" />

            <div className="absolute bottom-3 inset-x-4 bg-slate-950/80 backdrop-blur-md rounded-xl py-1.5 px-3 border border-amber-500/40">
              <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                {token}
              </span>
            </div>
          </div>

          {/* Countdown Ring Indicator */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-600" />
              รหัสหมุนเวียนในอีก:
            </span>
            <span className="font-mono font-bold text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {timer} วินาที
            </span>
          </div>
        </div>

        {/* Monastic Respect Instructions */}
        <div className="mt-6 max-w-xl text-center space-y-2">
          <p className="text-base sm:text-lg font-medium text-slate-200">
            ขออาราธนาพระภิกษุสามเณร และเชิญนิสิตทุกท่าน สแกน QR Code บนจอนี้เพื่อบันทึกเวลาเรียน
          </p>
          <p className="text-xs text-slate-400">
            รหัสจะเปลี่ยนอัตโนมัติทุก 20 วินาทีเพื่อความปลอดภัย • หากไม่มีโทรศัพท์ อาจารย์สามารถเช็คชื่อแทนได้ที่ปุ่ม "เช็คชื่อแทน"
          </p>

          <Button
            onClick={handleSimulateNewCheckIn}
            size="sm"
            variant="outline"
            className="mt-4 border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            จำลองนิสิตสแกนสำเร็จ (+1 คน)
          </Button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>ระบบป้องกัน Replay Attack และตรวจสอบอ้างอิงเวลา Server NTP Clock</span>
        </div>
        <span>มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย • MCU Smart Attendance</span>
      </footer>
    </div>
  );
}
