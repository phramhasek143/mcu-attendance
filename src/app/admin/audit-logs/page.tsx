"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  History,
  ShieldCheck,
  Search,
  Lock,
  ArrowLeft,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { mockAuditLogs } from "@/lib/mock-data";
import { formatBuddhistDate } from "@/lib/utils";

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-xs">
                ศูนย์คอมพิวเตอร์และสารสนเทศ มจร
              </Badge>
              <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-xs">
                <Lock className="mr-1 h-3 w-3" />
                Immutable Append-Only Trail
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              บันทึกประวัติการตรวจสอบย้อนหลัง (System Audit Logs)
            </h1>
            <p className="text-xs text-slate-500">
              เก็บบันทึกประวัติการเปลี่ยนแปลงสถานะเวลาเรียน การอนุมัติใบลา และการเปิดรอบเช็คชื่ออย่างถาวร
            </p>
          </div>
        </div>

        {/* Rule 6 Reminder Banner */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900">
          <ShieldCheck className="h-6 w-6 text-amber-700 shrink-0" />
          <div>
            <span className="font-bold">นโยบายความโปร่งใส (Rule 6 - Immutable Audit Trail):</span>
            <p className="mt-0.5 text-amber-800">
              ตาราง audit_logs บันทึกแบบสร้างใหม่อย่างเดียว (Append-Only) ห้ามมิให้มีการแก้ไข (UPDATE) หรือลบ (DELETE)
              ข้อมูลใดๆ เพื่อใช้เป็นหลักฐานเชิงประจักษ์ในการตรวจประเมินคุณภาพการศึกษา (AUN-QA) และการตรวจสอบของ สตง.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="ค้นหาการกระทำ, ผู้ดำเนินการ, หรือ Entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <span className="text-xs text-slate-400">
            แสดง {filteredLogs.length} รายการ
          </span>
        </div>

        {/* Logs Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="py-3 px-3">วันเวลา (พ.ศ.)</th>
                  <th className="py-3 px-3">ผู้ดำเนินการ (Actor)</th>
                  <th className="py-3 px-3">การกระทำ (Action)</th>
                  <th className="py-3 px-3">เป้าหมาย (Entity)</th>
                  <th className="py-3 px-3">เหตุผล / ค่าใหม่</th>
                  <th className="py-3 px-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-sans">
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-xs">
                      {formatBuddhistDate(log.createdAt)}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {log.actorName}
                      <span className="block font-mono font-normal text-[10px] text-slate-400">
                        {log.actorId}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-mono">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <span className="font-semibold text-slate-800">{log.entityName}</span>
                      <span className="block font-mono text-[10px] text-slate-400">{log.entityId}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {log.reason || "-"}
                      {log.newValue && (
                        <span className="block font-mono text-[10px] text-emerald-700 mt-0.5">
                          {JSON.stringify(log.newValue)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
