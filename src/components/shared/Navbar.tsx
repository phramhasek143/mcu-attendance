"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  QrCode,
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  History,
  UserCheck,
  Calendar,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { mockUsers, formatMonasticDisplayName } from "@/lib/mock-data";

export function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(mockUsers[1]); // Default: พระมหาบุญเลิศ (อาจารย์)
  const [showUserMenu, setShowUserMenu] = useState(false);

  const studentLinks = [
    { href: "/student/portal", label: "ภาพรวมเวลาเรียน", icon: BookOpen },
    { href: "/student/scan", label: "สแกนเช็คชื่อ", icon: QrCode },
    { href: "/student/leave/new", label: "ยื่นใบลา", icon: Calendar },
  ];

  const instructorLinks = [
    { href: "/instructor/courses", label: "รายวิชาของฉัน", icon: BookOpen },
    { href: "/instructor/sessions/ses-104/present", label: "จอฉาย QR Code", icon: QrCode },
    { href: "/instructor/sessions/ses-104/roster", label: "เช็คชื่อในชั้นเรียน", icon: ClipboardCheck },
    { href: "/instructor/leaves", label: "พิจารณาใบลา", icon: UserCheck },
  ];

  const adminLinks = [
    { href: "/registrar/eligibility", label: "สรุปสิทธิ์สอบ (80%)", icon: FileSpreadsheet },
    { href: "/registrar/import", label: "นำเข้ารายชื่อ", icon: UserCheck },
    { href: "/admin/audit-logs", label: "ประวัติการแก้ไข (Audit)", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/80 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm shadow-amber-500/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                MCU-SAMS
              </span>
              <span className="text-[10px] text-amber-800 font-medium">
                ระบบเช็คชื่อนิสิต มจร
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-2">
              <span className="text-xs font-semibold text-slate-400 px-2">นิสิต:</span>
              {studentLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={`h-8 gap-1.5 text-xs ${
                        active
                          ? "bg-amber-600 text-white font-medium"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-2">
              <span className="text-xs font-semibold text-slate-400 px-2">อาจารย์:</span>
              {instructorLinks.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={`h-8 gap-1.5 text-xs ${
                        active
                          ? "bg-amber-600 text-white font-medium"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-400 px-2">ทะเบียน/Admin:</span>
              {adminLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={`h-8 gap-1.5 text-xs ${
                        active
                          ? "bg-amber-600 text-white font-medium"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* User Switcher / Profile */}
        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-1.5 text-left text-xs transition-colors hover:bg-amber-100/70"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white font-bold text-xs">
              {currentUser.userType === "MONK" ? "สงฆ์" : "นิสิต"}
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-slate-800 leading-tight">
                {formatMonasticDisplayName(currentUser)}
              </p>
              <p className="text-[10px] text-amber-900/70">
                {currentUser.role === "INSTRUCTOR"
                  ? "อาจารย์ผู้สอน"
                  : currentUser.role === "STUDENT"
                  ? "นิสิต"
                  : "ผู้ดูแลระบบ"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Switcher Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-400">สลับบทบาททดสอบ (Demo Switcher):</p>
              </div>
              <div className="mt-1 space-y-1">
                {mockUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      currentUser.id === u.id
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div>
                      <p>{formatMonasticDisplayName(u)}</p>
                      <p className="text-[10px] text-slate-400">{u.role} • {u.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-amber-200">
                      {u.userType}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Link href="/login">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
