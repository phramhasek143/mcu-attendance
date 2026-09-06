"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AttendanceService } from "@/modules/attendance/attendance.service";
import {
  VerifyCheckInSchema,
  ActionResponse,
  CheckInResult,
} from "@/types/attendance.types";

export async function submitCheckInAction(
  rawInput: unknown
): Promise<ActionResponse<CheckInResult>> {
  try {
    // 1. ตรวจสอบ Session ผู้ใช้ที่ล็อกอินอยู่
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "กรุณาเข้าสู่ระบบก่อนทำการบันทึกเวลาเรียน",
        },
      };
    }

    // 2. Validate ข้อมูล Input ด้วย Zod
    const validated = VerifyCheckInSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validated.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง",
        },
      };
    }

    // 3. ดึง Client IP และ User-Agent สำหรับ Audit
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // 4. ส่งต่อไปยัง Domain Service
    const result = await AttendanceService.verifyAndRecordAttendance({
      sessionId: validated.data.sessionId,
      token: validated.data.token,
      studentId: session.user.id,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[AttendanceAction Error]:", error);
    const [code, message] = error.message ? error.message.split(": ") : ["INTERNAL_ERROR", "เกิดข้อผิดพลาดในการบันทึกเวลาเรียน"];
    return {
      success: false,
      error: {
        code: code || "INTERNAL_ERROR",
        message: message || "เกิดข้อผิดพลาดในการบันทึกเวลาเรียน กรุณาลองใหม่อีกครั้ง",
      },
    };
  }
}
