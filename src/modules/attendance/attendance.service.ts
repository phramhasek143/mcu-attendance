import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { AttendanceStatus, VerificationMethod } from "@prisma/client";
import { CheckInResult } from "@/types/attendance.types";

export class AttendanceService {
  /**
   * ตรวจสอบความถูกต้องของ Dynamic QR Token และบันทึกเวลาเรียน
   */
  static async verifyAndRecordAttendance(params: {
    sessionId: string;
    token: string;
    studentId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<CheckInResult> {
    const { sessionId, token, studentId, ipAddress, userAgent } = params;

    // 1. ดึงข้อมูล Session จากฐานข้อมูล
    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        courseOffering: {
          include: {
            course: true,
            enrollments: { where: { studentId, status: "ENROLLED" } },
          },
        },
      },
    });

    if (!session) {
      throw new Error("SESSION_NOT_FOUND: ไม่พบข้อมูลรอบการเช็คชื่อนี้");
    }

    if (session.isClosed) {
      throw new Error("SESSION_CLOSED: รอบการเช็คชื่อนี้ปิดแล้ว");
    }

    // 2. ตรวจสอบว่าผู้ใช้อยู่ในรายชื่อนิสิตที่ลงทะเบียนหรือไม่
    if (session.courseOffering.enrollments.length === 0) {
      throw new Error("NOT_ENROLLED: นิสิตไม่ได้ลงทะเบียนในรายวิชานี้");
    }

    // 3. ตรวจสอบ Dynamic QR Token จาก Redis
    const redisKey = `qr:${sessionId}:token`;
    const activeToken = await redis.get(redisKey);

    if (!activeToken || activeToken !== token) {
      throw new Error("INVALID_OR_EXPIRED_QR: รหัส QR Code หมดอายุหรือไม่ถูกต้อง กรุณาสแกนรหัสใหม่จากหน้าจอ");
    }

    // 4. ตรวจสอบการเช็คชื่อซ้ำซ้อนในรอบเดียวกัน
    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId,
        },
      },
    });

    if (existingRecord) {
      throw new Error("ALREADY_RECORDED: ท่านได้ทำการบันทึกเวลาเรียนในรอบนี้ไปแล้ว");
    }

    // 5. ตัดสินสถานะ มา (PRESENT) หรือ สาย (LATE) ตามเวลา Server
    const now = new Date();
    const lateThresholdTime = new Date(
      session.startTime.getTime() + session.lateThresholdMinutes * 60 * 1000
    );
    const status: AttendanceStatus = now > lateThresholdTime ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

    // 6. สร้างเลข Reference Code สำหรับใช้อ้างอิง (เช่น MCU-2026-X89B1)
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referenceCode = `MCU-${now.getFullYear()}-${randomSuffix}`;

    // 7. บันทึกข้อมูลลงฐานข้อมูลด้วย Transaction
    const [record, student] = await prisma.$transaction([
      prisma.attendanceRecord.create({
        data: {
          sessionId,
          studentId,
          status,
          method: VerificationMethod.DYNAMIC_QR,
          referenceCode,
          checkedInAt: now,
          ipAddress,
          userAgent,
        },
      }),
      prisma.user.findUniqueOrThrow({
        where: { id: studentId },
        select: {
          firstName: true,
          lastName: true,
          monkTitle: true,
          monasticRank: true,
          userType: true,
        },
      }),
      // สร้าง Audit Log บันทึกประวัติ (Append-Only ตาม Rule 6)
      prisma.auditLog.create({
        data: {
          actorId: studentId,
          action: "STUDENT_CHECK_IN",
          entityName: "AttendanceRecord",
          entityId: sessionId,
          newValue: { status, referenceCode, method: "DYNAMIC_QR" },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    // จัดรูปแบบชื่อตามสมณสารูป (Rule 5)
    const displayName =
      student.userType === "MONK"
        ? `${student.monasticRank || "พระ"} ${student.firstName} ${student.monkTitle || ""}`.trim()
        : `${student.firstName} ${student.lastName || ""}`.trim();

    return {
      recordId: record.id,
      referenceCode: record.referenceCode,
      status: record.status,
      method: record.method,
      checkedInAt: record.checkedInAt,
      studentName: displayName,
      courseTitle: session.courseOffering.course.titleTh,
    };
  }
}
