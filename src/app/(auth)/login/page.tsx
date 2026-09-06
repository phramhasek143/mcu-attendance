"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Lock, User, AlertCircle, Loader2, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleQuickLogin = (u: string, p: string, redirectUrl: string) => {
    setUsername(u);
    setPassword(p);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(redirectUrl);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    const inputLower = username.trim().toLowerCase();

    setTimeout(() => {
      setIsLoading(false);

      // Routing ตามบทบาทที่ระบุ
      if (inputLower.includes("admin")) {
        router.push("/registrar/eligibility");
      } else if (
        inputLower.includes("boonlert") ||
        inputLower.includes("prasit") ||
        inputLower.includes("teacher") ||
        inputLower.includes("instructor")
      ) {
        router.push("/instructor/courses");
      } else {
        // ค่าเริ่มต้นเป็นนิสิต (รหัสนิสิต เช่น 6601201001 หรือชื่อนิสิต)
        router.push("/student/portal");
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-amber-50/70 via-slate-50 to-amber-100/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-amber-800 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าหลัก
        </Link>
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/25">
            <GraduationCap className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          เข้าสู่ระบบ MCU-SAMS
        </h2>
        <p className="mt-2 text-center text-xs text-slate-600 sm:text-sm">
          ระบบบริหารจัดการการเช็คชื่อนิสิต มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-amber-200/80 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">ยืนยันตัวตน</CardTitle>
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-xs">
                MCU Single Sign-On
              </Badge>
            </div>
            <CardDescription>
              ใช้อีเมลมหาวิทยาลัย (@mcu.ac.th) หรือรหัสนิสิต
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 border border-amber-200">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" />
                  ชื่อผู้ใช้ / รหัสนิสิต / อีเมล
                </label>
                <Input
                  type="text"
                  placeholder="เช่น 6601201001 หรือ boonlert@mcu.ac.th"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-slate-400" />
                    รหัสผ่าน
                  </label>
                  <span className="text-[11px] text-slate-400">
                    (รหัสทดสอบ: อะไรก็ได้ 6 ตัวอักษรขึ้นไป)
                  </span>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </form>

            {/* Quick Login Shortcut Buttons */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2.5 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบทดสอบทันที (Quick Login):
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("6601201001", "123456", "/student/portal")}
                  className="w-full flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 text-left text-xs hover:bg-amber-100/60 transition-colors"
                >
                  <div>
                    <span className="font-bold text-amber-950">1. เข้าสู่ระบบเป็น พระนิสิต</span>
                    <p className="text-[11px] text-slate-500">พระมหาธนภูมิ ฐิตธมฺโม (6601201001)</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white border-amber-300">
                    Student
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("boonlert", "123456", "/instructor/courses")}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left text-xs hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900">2. เข้าสู่ระบบเป็น อาจารย์ผู้สอน</span>
                    <p className="text-[11px] text-slate-500">พระมหาบุญเลิศ กิตฺติปญฺโญ (boonlert)</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white border-slate-300">
                    Instructor
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin", "123456", "/registrar/eligibility")}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left text-xs hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900">3. เข้าสู่ระบบเป็น ทะเบียน / Admin</span>
                    <p className="text-[11px] text-slate-500">นายสมชาย แอดมิน (admin)</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white border-slate-300">
                    Registrar
                  </Badge>
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 p-4 text-center text-xs text-slate-500 rounded-b-2xl">
            <span>ศูนย์คอมพิวเตอร์และสำนักทะเบียนและวัดผล มจร วังน้อย</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
