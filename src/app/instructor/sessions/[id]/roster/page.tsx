"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Search,
  ArrowLeft,
  QrCode,
  Save,
  CheckCheck,
  UserCheck,
} from "lucide-react";
import { mockUsers, mockSessions, mockOfferings, formatMonasticDisplayName } from "@/lib/mock-data";

export default function InstructorRosterPage() {
  const session = mockSessions[3]; // สัปดาห์ที่ 4
  const offering = mockOfferings[0];

  // นิสิตในวิชา (ดึงเฉพาะ role === "STUDENT")
  const enrolledStudents = mockUsers.filter((u) => u.role === "STUDENT");

  // State เก็บสถานะของนิสิตแต่ละคนในคาบนี้
  const [attendanceState, setAttendanceState] = useState<Record<string, "PRESENT" | "LATE" | "ABSENT" | "LEAVE">>({
    "usr-student-01": "PRESENT",
    "usr-student-02": "PRESENT",
    "usr-student-03": "LEAVE", // มีใบลา
    "usr-student-04": "PRESENT",
    "usr-student-05": "ABSENT",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStatusChange = (studentId: string, status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE") => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setSaveSuccess(false);
  };

  const handleMarkAllRemainingPresent = () => {
    const updated = { ...attendanceState };
    enrolledStudents.forEach((s) => {
      if (!updated[s.id] || updated[s.id] === "ABSENT") {
        updated[s.id] = "PRESENT";
      }
    });
    setAttendanceState(updated);
  };

  const handleSaveAll = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredStudents = enrolledStudents.filter((s) => {
    const name = formatMonasticDisplayName(s).toLowerCase();
    const id = (s.studentId || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || id.includes(q);
  });

  const presentCount = Object.values(attendanceState).filter((s) => s === "PRESENT").length;
  const lateCount = Object.values(attendanceState).filter((s) => s === "LATE").length;
  const absentCount = Object.values(attendanceState).filter((s) => s === "ABSENT").length;
  const leaveCount = Object.values(attendanceState).filter((s) => s === "LEAVE").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Link href="/instructor/courses" className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:underline mb-1">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้ารายวิชา
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs">
                โหมดเช็คชื่อรายบุคคล (Roster View)
              </Badge>
              <span className="text-xs text-slate-500">
                {offering.courseCode} {offering.titleTh} (Sec {offering.section})
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {session.title}
            </h1>
            <p className="text-xs text-slate-500">
              วันที่ {session.sessionDate} • เวลา {session.startTime} - {session.endTime} น. • {offering.roomNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/instructor/sessions/${session.id}/present`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs border-amber-300 bg-amber-50/50 text-amber-900">
                <QrCode className="h-4 w-4 text-amber-700" />
                สลับไปหน้าจอ QR Code
              </Button>
            </Link>
            <Button
              onClick={handleSaveAll}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs shadow-md"
            >
              <Save className="h-4 w-4" />
              บันทึกผลเวลาเรียน
            </Button>
          </div>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>บันทึกสถานะการเช็คชื่อทั้งหมดและบันทึกประวัติการแก้ไข (Audit Trail) สำเร็จแล้ว</span>
          </div>
        )}

        {/* Stats Summary Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">มาเรียน</span>
              <p className="text-xl font-bold text-emerald-700">{presentCount} รูป/คน</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">มาสาย</span>
              <p className="text-xl font-bold text-amber-700">{lateCount} รูป/คน</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">ขาดเรียน</span>
              <p className="text-xl font-bold text-red-700">{absentCount} รูป/คน</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">ลา/ศาสนกิจ</span>
              <p className="text-xl font-bold text-blue-700">{leaveCount} รูป/คน</p>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="ค้นหาชื่อ, ฉายา, หรือรหัสนิสิต..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleMarkAllRemainingPresent}
              variant="outline"
              size="sm"
              className="text-xs border-slate-300 gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              ติ๊ก "มาเรียน" คนที่เหลือ
            </Button>
          </div>
        </div>

        {/* Roster Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 font-semibold text-slate-600">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
                  <th className="py-3 px-4 w-32">รหัสนิสิต</th>
                  <th className="py-3 px-4">ชื่อ - นามสกุล / สมณสารูป</th>
                  <th className="py-3 px-4 w-28">ประเภท</th>
                  <th className="py-3 px-4 w-72 text-center">บันทึกสถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => {
                  const currentStatus = attendanceState[student.id] || "ABSENT";

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {student.studentId || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {formatMonasticDisplayName(student)}
                        </div>
                        <span className="text-[11px] text-slate-400">{student.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={
                            student.userType === "MONK"
                              ? "bg-amber-50 text-amber-800 border-amber-300 text-[10px]"
                              : "bg-slate-50 text-slate-700 border-slate-200 text-[10px]"
                          }
                        >
                          {student.userType === "MONK" ? "พระภิกษุ/สามเณร" : "คฤหัสถ์"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "PRESENT")}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                              currentStatus === "PRESENT"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            มา
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "LATE")}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                              currentStatus === "LATE"
                                ? "bg-amber-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                            }`}
                          >
                            สาย
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "ABSENT")}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                              currentStatus === "ABSENT"
                                ? "bg-red-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700"
                            }`}
                          >
                            ขาด
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "LEAVE")}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                              currentStatus === "LEAVE"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            ลา
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
