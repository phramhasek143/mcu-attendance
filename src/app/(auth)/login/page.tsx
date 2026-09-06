"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Lock, User, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Mock/Dev validation
    if (!username || !password) {
      setErrorMessage("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      // ในขั้นตอนต่อไปของ Sprint 1 จะต่อเข้ากับ NextAuth signIn
      setErrorMessage("ระบบเตรียมการเชื่อมต่อฐานข้อมูลสำหรับ Sprint 1.4 (โปรดรัน Prisma Migrate ในขั้นตอนถัดไป)");
    }, 800);
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
          เข้าสู่ระบบเช็คชื่อ มจร
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          สำหรับพระภิกษุ สามเณร นิสิตคฤหัสถ์ และคณาจารย์
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
                  placeholder="เช่น 6601201001 หรือ somchai@mcu.ac.th"
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
                  <a href="#" className="text-xs text-amber-700 hover:underline">
                    ลืมรหัสผ่าน?
                  </a>
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
          </CardContent>
          <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 p-4 text-center text-xs text-slate-500 rounded-b-2xl">
            <span>มีปัญหาการใช้งาน ติดต่อศูนย์คอมพิวเตอร์ มจร วังน้อย โทร. 035-248-000</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
