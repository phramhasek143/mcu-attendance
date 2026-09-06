"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  FileText,
  UserCheck,
  ArrowLeft,
  Search,
} from "lucide-react";
import { mockLeaves, MockLeave } from "@/lib/mock-data";

export default function InstructorLeavesPage() {
  const [leaves, setLeaves] = useState<MockLeave[]>(mockLeaves);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleApprove = (leaveId: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: "APPROVED" as const } : l))
    );
    setActionNotice("อนุมัติคำขอลาเรียบร้อยแล้ว ระบบจะปรับสถานะเวลาเรียนและไม่คิดเป็นการขาดเรียน");
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleReject = (leaveId: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: "REJECTED" as const } : l))
    );
    setActionNotice("ปฏิเสธคำขอลาเรียบร้อยแล้ว สถานะในคาบเรียนจะถูกนับเป็นขาดเรียนตามปกติ");
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Link href="/instructor/courses" className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:underline mb-1">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้ารายวิชา
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs">
                คำขอลาและการอนุมัติ
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              พิจารณาคำขอลาเรียนและกิจนิมนต์
            </h1>
            <p className="text-xs text-slate-500">
              สำหรับตรวจสอบเอกสารหลักฐาน และพิจารณาปรับสถานะเวลาเรียนของนิสิต
            </p>
          </div>
        </div>

        {actionNotice && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Leaves List */}
        <div className="mt-6 space-y-4">
          {leaves.map((leave) => {
            const isPending = leave.status === "PENDING";
            const isApproved = leave.status === "APPROVED";
            const isRejected = leave.status === "REJECTED";

            return (
              <Card key={leave.id} className="border-slate-200 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base text-slate-900">
                        {leave.studentName}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          leave.leaveType === "RELIGIOUS_DUTY"
                            ? "bg-amber-50 text-amber-900 border-amber-300 text-xs"
                            : "bg-blue-50 text-blue-900 border-blue-200 text-xs"
                        }
                      >
                        {leave.leaveType === "RELIGIOUS_DUTY" ? "📿 ติดศาสนกิจ/กิจนิมนต์" : "🏥 ลาป่วย"}
                      </Badge>
                    </div>

                    <div>
                      {isApproved && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                          อนุมัติแล้ว
                        </Badge>
                      )}
                      {isRejected && (
                        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300 text-xs">
                          <XCircle className="mr-1 h-3.5 w-3.5 text-red-600" />
                          ไม่อนุมัติ
                        </Badge>
                      )}
                      {isPending && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300 text-xs">
                          <Clock className="mr-1 h-3.5 w-3.5 text-yellow-600" />
                          รอพิจารณา
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardDescription className="text-xs text-slate-500 mt-1">
                    วิชา: {leave.courseTitle} • {leave.sessionTitle || "คาบเรียนตามตาราง"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-1">เหตุผลความจำเป็น:</span>
                    <p>{leave.reason}</p>
                    {leave.reviewNote && (
                      <p className="mt-2 text-amber-800 italic border-t border-slate-200/60 pt-2 font-medium">
                        ความเห็นอาจารย์: "{leave.reviewNote}"
                      </p>
                    )}
                  </div>

                  {isPending && (
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        onClick={() => handleReject(leave.id)}
                        variant="outline"
                        size="sm"
                        className="text-xs border-red-200 text-red-700 hover:bg-red-50"
                      >
                        ไม่อนุมัติ
                      </Button>
                      <Button
                        onClick={() => handleApprove(leave.id)}
                        size="sm"
                        className="text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        อนุมัติใบลา
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
