import { z } from "zod";

// DTO สำหรับรับข้อมูลการสแกนเช็คชื่อจากนิสิต
export const VerifyCheckInSchema = z.object({
  sessionId: z.string().uuid({ message: "รหัสรอบเช็คชื่อไม่ถูกต้อง" }),
  token: z.string().min(16, { message: "โทเคนเช็คชื่อไม่ถูกต้องหรือสั้นเกินไป" }),
  deviceFingerprint: z.string().optional(),
});

export type VerifyCheckInInput = z.infer<typeof VerifyCheckInSchema>;

// DTO สำหรับอาจารย์เช็คชื่อแทน (Manual Roster)
export const ManualRosterCheckInSchema = z.object({
  sessionId: z.string().uuid({ message: "รหัสรอบเช็คชื่อไม่ถูกต้อง" }),
  studentId: z.string().uuid({ message: "รหัสนิสิตไม่ถูกต้อง" }),
  status: z.enum(["PRESENT", "LATE", "ABSENT", "LEAVE", "EXCUSED"]),
  note: z.string().max(255).optional(),
});

export type ManualRosterCheckInInput = z.infer<typeof ManualRosterCheckInSchema>;

// รูปแบบผลลัพธ์การเช็คชื่อ
export interface CheckInResult {
  recordId: string;
  referenceCode: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "EXCUSED";
  method: "DYNAMIC_QR" | "ROSTER_MANUAL" | "RFID_TAP" | "ADMIN_OVERRIDE";
  checkedInAt: Date;
  studentName: string;
  courseTitle: string;
}

// รูปแบบมาตรฐาน Standard Response
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
