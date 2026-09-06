"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function BulkImportPage() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // ข้อมูลตัวอย่างที่ถูกอ่านจากไฟล์
  const previewData = [
    { row: 1, studentId: "6601201004", name: "พระมหาธีรภัทร", title: "เขมปญฺโญ", type: "MONK", email: "theerapat@mcu.ac.th", status: "VALID" },
    { row: 2, studentId: "6601201005", name: "สามเณรพิชิตชัย", title: "ศรีสุข", type: "MONK", email: "pichit@mcu.ac.th", status: "VALID" },
    { row: 3, studentId: "6601202003", name: "นายเกรียงไกร", title: "เจริญสุข", type: "LAYPERSON", email: "kriangkrai@mcu.ac.th", status: "VALID" },
    { row: 4, studentId: "6601201001", name: "พระมหาธนภูมิ", title: "ฐิตธมฺโม", type: "MONK", email: "thanapoom@mcu.ac.th", status: "DUPLICATE" },
  ];

  const handleSimulateUpload = () => {
    setFileUploaded(true);
  };

  const handleConfirmImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setImportSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs">
                MOD-01: Identity & Access Management
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              นำเข้ารายชื่อนิสิตและคณาจารย์ (Bulk Import)
            </h1>
            <p className="text-xs text-slate-500">
              นำเข้าผู้ใช้ครั้งละหลายคนจากไฟล์ Excel/CSV พร้อมระบบตรวจจับข้อมูลซ้ำซ้อนและแยกสมณสารูป
            </p>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-300">
            <Download className="h-4 w-4 text-slate-600" />
            ดาวน์โหลดแม่แบบ Excel (.xlsx)
          </Button>
        </div>

        {importSuccess ? (
          <Card className="mt-8 border-emerald-300 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              นำเข้าข้อมูลสำเร็จ 3 รายการ
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              ระบบได้สร้างบัญชีผู้ใช้และกำหนดสิทธิ์เรียบร้อยแล้ว (ข้ามรายการที่ซ้ำซ้อน 1 รายการ)
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => { setFileUploaded(false); setImportSuccess(false); }} className="bg-amber-600 hover:bg-amber-700 text-white">
                นำเข้าไฟล์อื่นเพิ่มเติม
              </Button>
            </div>
          </Card>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Upload Box */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">1. เลือกไฟล์ข้อมูลรายชื่อ</CardTitle>
                <CardDescription className="text-xs">
                  รองรับไฟล์ Excel (.xlsx, .xls) หรือไฟล์ CSV ขนาดไม่เกิน 10MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onClick={handleSimulateUpload}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-8 text-center hover:bg-amber-50 cursor-pointer transition-colors"
                >
                  <UploadCloud className="h-10 w-10 text-amber-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    {fileUploaded ? "ไฟล์พร้อมประมวลผล: mcu_student_admissions_2569.xlsx" : "ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์"}
                  </p>
                  <span className="text-xs text-slate-400 mt-1">
                    {fileUploaded ? "ขนาด 42 KB • พบ 4 รายการ" : "มีคอลัมน์: รหัสนิสิต, คำนำหน้า, ชื่อ, ฉายา/นามสกุล, ประเภท, อีเมล"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            {fileUploaded && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">2. ตรวจสอบข้อมูลก่อนยืนยันนำเข้า (Data Validation Preview)</CardTitle>
                    <Badge variant="outline" className="text-xs border-amber-300 bg-amber-50 text-amber-900">
                      ตรวจพบ 4 รายการ (ถูกต้อง 3, ซ้ำซ้อน 1)
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    ระบบจะบันทึกเฉพาะรายการที่ถูกต้อง และข้ามรายการที่รหัสนิสิตหรืออีเมลซ้ำในระบบ
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">แถว</th>
                          <th className="py-2.5 px-3">รหัสนิสิต</th>
                          <th className="py-2.5 px-3">ชื่อ</th>
                          <th className="py-2.5 px-3">ฉายา / นามสกุล</th>
                          <th className="py-2.5 px-3">ประเภท</th>
                          <th className="py-2.5 px-3">อีเมล</th>
                          <th className="py-2.5 px-3 text-center">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewData.map((row) => (
                          <tr key={row.row} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-slate-400">{row.row}</td>
                            <td className="py-2.5 px-3 font-mono font-semibold">{row.studentId}</td>
                            <td className="py-2.5 px-3 font-medium">{row.name}</td>
                            <td className="py-2.5 px-3">{row.title}</td>
                            <td className="py-2.5 px-3">
                              <Badge variant="outline" className="text-[10px]">
                                {row.type === "MONK" ? "พระ/เณร" : "คฤหัสถ์"}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{row.email}</td>
                            <td className="py-2.5 px-3 text-center">
                              {row.status === "VALID" ? (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                  พร้อมนำเข้า
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                                  รหัสซ้ำในระบบ
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={() => setFileUploaded(false)}>
                      ยกเลิก
                    </Button>
                    <Button
                      onClick={handleConfirmImport}
                      disabled={isProcessing}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          กำลังนำเข้าฐานข้อมูล...
                        </>
                      ) : (
                        "ยืนยันการนำเข้ารายชื่อ"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
