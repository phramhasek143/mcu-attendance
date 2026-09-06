"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Users,
} from "lucide-react";
import { mockUsers, mockOfferings, formatMonasticDisplayName } from "@/lib/mock-data";

export default function ExamEligibilityPage() {
  const [selectedOfferingId, setSelectedOfferingId] = useState("off-001");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const offering = mockOfferings.find((o) => o.id === selectedOfferingId) || mockOfferings[0];
  const students = mockUsers.filter((u) => u.role === "STUDENT");

  // คำนวณสถิติของนิสิตแต่ละคนในวิชานี้ (จำลอง 4 คาบ)
  const studentReports = [
    { student: students[0], present: 3, late: 0, absent: 0, leave: 1, total: 4, pct: 100, eligible: true },
    { student: students[1], present: 2, late: 0, absent: 0, leave: 1, total: 4, pct: 88, eligible: true },
    { student: students[2], present: 2, late: 1, absent: 1, leave: 0, total: 4, pct: 63, eligible: false }, // สาย 1, ขาด 1 -> 63%
    { student: students[3], present: 3, late: 0, absent: 0, leave: 0, total: 4, pct: 100, eligible: true },
    { student: students[4], present: 0, late: 1, absent: 2, leave: 0, total: 4, pct: 13, eligible: false }, // ขาด 2 สาย 1 -> 13%
  ];

  const totalStudents = studentReports.length;
  const eligibleCount = studentReports.filter((r) => r.eligible).length;
  const ineligibleCount = studentReports.filter((r) => !r.eligible).length;

  const handleExportExcel = () => {
    setExportNotification("สร้างไฟล์ Excel สรุปสิทธิ์สอบ (MCU-Attendance-Report-2569.xlsx) เรียบร้อยแล้ว");
    setTimeout(() => setExportNotification(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!isPrintMode && <Navbar />}

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs">
                สำนักทะเบียนและประเมินผล มจร
              </Badge>
              <span className="text-xs text-slate-500">เกณฑ์มาตรฐาน อว. 80%</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              รายงานสรุปเวลาเรียนและสิทธิ์เข้าสอบปลายภาค
            </h1>
            <p className="text-xs text-slate-500">
              {offering.courseCode} {offering.titleTh} (Sec {offering.section}) • ผู้สอน: {offering.instructorName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100"
            >
              <Download className="h-4 w-4 text-emerald-700" />
              ส่งออก Excel (.xlsx)
            </Button>
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs shadow-md"
            >
              <Printer className="h-4 w-4" />
              พิมพ์ใบสรุปรับรองผล (A4)
            </Button>
          </div>
        </div>

        {exportNotification && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-semibold text-emerald-800 print:hidden">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{exportNotification}</span>
          </div>
        )}

        {/* Printable Official Header (Shows when printing) */}
        <div className="hidden print:block text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h2 className="text-lg font-bold">มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย</h2>
          <h3 className="text-base font-semibold">ใบสรุปผลการเข้าชั้นเรียนและรายชื่อผู้มีสิทธิ์สอบไล่ปลายภาค</h3>
          <p className="text-xs mt-1">
            ภาคเรียนที่ 1 ปีการศึกษา 2569 • วิชา: {offering.courseCode} {offering.titleTh} (กลุ่ม {offering.section})
          </p>
          <p className="text-xs">
            อาจารย์ผู้สอน: {offering.instructorName} • ห้องเรียน: {offering.roomNumber}
          </p>
        </div>

        {/* Summary Metric Cards (Hidden in print) */}
        <div className="mt-6 grid grid-cols-3 gap-4 print:hidden">
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500">นิสิตทั้งหมด</span>
                <p className="text-xl font-bold text-slate-900">{totalStudents} รูป/คน</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-700 font-medium">มีสิทธิ์สอบ (≥ 80%)</span>
                <p className="text-xl font-bold text-emerald-800">{eligibleCount} รูป/คน</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-red-700 font-medium">หมดสิทธิ์สอบ (&lt; 80%)</span>
                <p className="text-xl font-bold text-red-800">{ineligibleCount} รูป/คน</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table of Eligibility */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/90 font-semibold text-slate-700 print:bg-slate-100">
                <tr>
                  <th className="py-3 px-3 text-center w-10">ลำดับ</th>
                  <th className="py-3 px-3 w-28">รหัสนิสิต</th>
                  <th className="py-3 px-4">ชื่อ - นามสกุล / สมณสารูป</th>
                  <th className="py-3 px-2 text-center w-14">มา (ครั้ง)</th>
                  <th className="py-3 px-2 text-center w-14">สาย (ครั้ง)</th>
                  <th className="py-3 px-2 text-center w-14">ขาด (ครั้ง)</th>
                  <th className="py-3 px-2 text-center w-14">ลา (ครั้ง)</th>
                  <th className="py-3 px-3 text-center w-20">% เข้าเรียน</th>
                  <th className="py-3 px-4 text-center w-28">การพิจารณา</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentReports.map((report, idx) => (
                  <tr key={report.student.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                      {report.student.studentId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 text-sm">
                        {formatMonasticDisplayName(report.student)}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {report.student.userType === "MONK" ? "พระภิกษุ/สามเณร" : "คฤหัสถ์"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-emerald-700 font-bold">{report.present}</td>
                    <td className="py-3 px-2 text-center text-amber-700 font-bold">{report.late}</td>
                    <td className="py-3 px-2 text-center text-red-700 font-bold">{report.absent}</td>
                    <td className="py-3 px-2 text-center text-blue-700 font-bold">{report.leave}</td>
                    <td className="py-3 px-3 text-center font-bold text-sm">
                      <span className={report.eligible ? "text-emerald-700" : "text-red-600"}>
                        {report.pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {report.eligible ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[11px]">
                          <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
                          มีสิทธิ์สอบ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300 text-[11px]">
                          <XCircle className="mr-1 h-3 w-3 text-red-600" />
                          หมดสิทธิ์สอบ
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable Official Signatures Block */}
        <div className="mt-12 hidden print:grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-8">
            <p>ลงนาม....................................................</p>
            <p>( {offering.instructorName} )<br />อาจารย์ผู้สอนประจำวิชา<br />วันที่ ......./......./.......</p>
          </div>
          <div className="space-y-8">
            <p>ลงนาม....................................................</p>
            <p>( พระมหาบุญเลิศ กิตฺติปญฺโญ )<br />หัวหน้าภาควิชาพระพุทธศาสนา<br />วันที่ ......./......./.......</p>
          </div>
        </div>
      </main>
    </div>
  );
}
