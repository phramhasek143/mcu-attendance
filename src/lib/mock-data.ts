/**
 * Initial Seed & In-Memory Fallback Dataset
 * ออกแบบตามโครงสร้าง schema.md และบริบทมหาวิทยาลัยสงฆ์ มจร
 */

export interface MockUser {
  id: string;
  username: string;
  email: string;
  userType: "MONK" | "LAYPERSON";
  role: "SUPER_ADMIN" | "CAMPUS_ADMIN" | "REGISTRAR" | "INSTRUCTOR" | "STUDENT";
  monasticRank?: string;
  monkTitle?: string;
  firstName: string;
  lastName?: string;
  studentId?: string;
  campusId: string;
  avatarUrl?: string;
}

export interface MockCourse {
  id: string;
  courseCode: string;
  titleTh: string;
  titleEn?: string;
  credits: number;
}

export interface MockOffering {
  id: string;
  courseId: string;
  courseCode: string;
  titleTh: string;
  section: string;
  roomNumber: string;
  instructorId: string;
  instructorName: string;
  totalHoursRequired: number;
}

export interface MockSession {
  id: string;
  offeringId: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  lateThresholdMinutes: number;
  sessionType: "ACADEMIC" | "RITUAL" | "MEDITATION" | "SPECIAL_EVENT";
  isClosed: boolean;
}

export interface MockAttendance {
  id: string;
  sessionId: string;
  studentId: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "EXCUSED";
  method: "DYNAMIC_QR" | "ROSTER_MANUAL" | "RFID_TAP" | "ADMIN_OVERRIDE";
  referenceCode: string;
  checkedInAt: Date;
  note?: string;
}

export interface MockLeave {
  id: string;
  studentId: string;
  studentName: string;
  offeringId: string;
  courseTitle: string;
  sessionId?: string;
  sessionTitle?: string;
  leaveType: "SICK" | "BUSINESS" | "RELIGIOUS_DUTY" | "OFFICIAL_DUTY";
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason: string;
  evidenceFileUrl?: string;
  createdAt: Date;
  reviewedById?: string;
  reviewNote?: string;
}

export interface MockAudit {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  reason?: string;
  ipAddress: string;
  createdAt: Date;
}

// 1. ผู้ใช้งานตัวอย่าง
export const mockUsers: MockUser[] = [
  {
    id: "usr-admin-01",
    username: "admin",
    email: "admin@mcu.ac.th",
    userType: "LAYPERSON",
    role: "SUPER_ADMIN",
    firstName: "สมชาย",
    lastName: "เทคโนโลยีสารสนเทศ",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-teacher-01",
    username: "boonlert",
    email: "boonlert@mcu.ac.th",
    userType: "MONK",
    role: "INSTRUCTOR",
    monasticRank: "พระมหา",
    monkTitle: "กิตฺติปญฺโญ",
    firstName: "บุญเลิศ",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-teacher-02",
    username: "prasit",
    email: "prasit@mcu.ac.th",
    userType: "LAYPERSON",
    role: "INSTRUCTOR",
    firstName: "ผศ.ดร.ประสิทธิ์",
    lastName: "สุขเกษม",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-student-01",
    username: "6601201001",
    email: "thanapoom@mcu.ac.th",
    userType: "MONK",
    role: "STUDENT",
    monasticRank: "พระมหา",
    monkTitle: "ฐิตธมฺโม",
    firstName: "ธนภูมิ",
    studentId: "6601201001",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-student-02",
    username: "6601201002",
    email: "wicharn@mcu.ac.th",
    userType: "MONK",
    role: "STUDENT",
    monasticRank: "พระสมุห์",
    monkTitle: "ปญฺญาวชิโร",
    firstName: "วิชาญ",
    studentId: "6601201002",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-student-03",
    username: "6601201003",
    email: "nattapol@mcu.ac.th",
    userType: "MONK",
    role: "STUDENT",
    monasticRank: "สามเณร",
    firstName: "ณัฐพล",
    lastName: "แสงแก้ว",
    studentId: "6601201003",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-student-04",
    username: "6601202001",
    email: "somsak@mcu.ac.th",
    userType: "LAYPERSON",
    role: "STUDENT",
    firstName: "นายสมศักดิ์",
    lastName: "มั่งคั่ง",
    studentId: "6601202001",
    campusId: "campus-wangnoi",
  },
  {
    id: "usr-student-05",
    username: "6601202002",
    email: "orathai@mcu.ac.th",
    userType: "LAYPERSON",
    role: "STUDENT",
    firstName: "นางสาวอรทัย",
    lastName: "บูรณศิลป์",
    studentId: "6601202002",
    campusId: "campus-wangnoi",
  },
];

// 2. รายวิชาที่เปิดสอน
export const mockOfferings: MockOffering[] = [
  {
    id: "off-001",
    courseId: "crs-001",
    courseCode: "000 101",
    titleTh: "ภาษาไทยเพื่อการสื่อสาร",
    section: "01",
    roomNumber: "อาคารเรียนรวม 302",
    instructorId: "usr-teacher-01",
    instructorName: "พระมหาบุญเลิศ กิตฺติปญฺโญ",
    totalHoursRequired: 45,
  },
  {
    id: "off-002",
    courseId: "crs-002",
    courseCode: "000 103",
    titleTh: "พระพุทธศาสนากับวิทยาศาสตร์",
    section: "01",
    roomNumber: "ห้องบรรยายรวม บว. 201",
    instructorId: "usr-teacher-02",
    instructorName: "ผศ.ดร.ประสิทธิ์ สุขเกษม",
    totalHoursRequired: 45,
  },
  {
    id: "off-003",
    courseId: "crs-003",
    courseCode: "101 201",
    titleTh: "พระวินัยปิฎก (วินัยสงฆ์และสิกขาบท)",
    section: "01",
    roomNumber: "ลานธรรมหลวงพ่อปัญญานันทะ",
    instructorId: "usr-teacher-01",
    instructorName: "พระมหาบุญเลิศ กิตฺติปญฺโญ",
    totalHoursRequired: 45,
  },
];

// 3. รอบเช็คชื่อรายคาบ
export const mockSessions: MockSession[] = [
  {
    id: "ses-101",
    offeringId: "off-001",
    title: "สัปดาห์ที่ 1: ศิลปะการใช้ภาษาเพื่อการเผยแผ่ธรรม",
    sessionDate: "2026-08-04",
    startTime: "08:30",
    endTime: "11:30",
    lateThresholdMinutes: 15,
    sessionType: "ACADEMIC",
    isClosed: true,
  },
  {
    id: "ses-102",
    offeringId: "off-001",
    title: "สัปดาห์ที่ 2: วาทศาสตร์และทักษะการเทศนา",
    sessionDate: "2026-08-11",
    startTime: "08:30",
    endTime: "11:30",
    lateThresholdMinutes: 15,
    sessionType: "ACADEMIC",
    isClosed: true,
  },
  {
    id: "ses-103",
    offeringId: "off-001",
    title: "สัปดาห์ที่ 3: การเขียนบทความวิชาการทางพระพุทธศาสนา",
    sessionDate: "2026-08-18",
    startTime: "08:30",
    endTime: "11:30",
    lateThresholdMinutes: 15,
    sessionType: "ACADEMIC",
    isClosed: true,
  },
  {
    id: "ses-104",
    offeringId: "off-001",
    title: "สัปดาห์ที่ 4: การสนทนาธรรมและการสื่อสารร่วมสมัย (รอบปัจจุบัน)",
    sessionDate: "2026-09-06",
    startTime: "08:30",
    endTime: "11:30",
    lateThresholdMinutes: 15,
    sessionType: "ACADEMIC",
    isClosed: false,
  },
];

// 4. บันทึกการเข้าเรียน
export const mockAttendances: MockAttendance[] = [
  // ses-101
  { id: "att-01", sessionId: "ses-101", studentId: "usr-student-01", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-A1001", checkedInAt: new Date("2026-08-04T08:35:00") },
  { id: "att-02", sessionId: "ses-101", studentId: "usr-student-02", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-A1002", checkedInAt: new Date("2026-08-04T08:32:00") },
  { id: "att-03", sessionId: "ses-101", studentId: "usr-student-03", status: "LATE", method: "DYNAMIC_QR", referenceCode: "MCU-2026-A1003", checkedInAt: new Date("2026-08-04T08:50:00"), note: "ติดทำวัตรเช้า" },
  { id: "att-04", sessionId: "ses-101", studentId: "usr-student-04", status: "PRESENT", method: "ROSTER_MANUAL", referenceCode: "MCU-2026-A1004", checkedInAt: new Date("2026-08-04T08:40:00") },
  { id: "att-05", sessionId: "ses-101", studentId: "usr-student-05", status: "ABSENT", method: "ADMIN_OVERRIDE", referenceCode: "MCU-2026-A1005", checkedInAt: new Date("2026-08-04T11:30:00") },

  // ses-102
  { id: "att-06", sessionId: "ses-102", studentId: "usr-student-01", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-B1001", checkedInAt: new Date("2026-08-11T08:31:00") },
  { id: "att-07", sessionId: "ses-102", studentId: "usr-student-02", status: "LEAVE", method: "ADMIN_OVERRIDE", referenceCode: "MCU-2026-B1002", checkedInAt: new Date("2026-08-11T08:30:00"), note: "ติดศาสนกิจ/กิจนิมนต์" },
  { id: "att-08", sessionId: "ses-102", studentId: "usr-student-03", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-B1003", checkedInAt: new Date("2026-08-11T08:35:00") },
  { id: "att-09", sessionId: "ses-102", studentId: "usr-student-04", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-B1004", checkedInAt: new Date("2026-08-11T08:33:00") },
  { id: "att-10", sessionId: "ses-102", studentId: "usr-student-05", status: "LATE", method: "DYNAMIC_QR", referenceCode: "MCU-2026-B1005", checkedInAt: new Date("2026-08-11T08:48:00") },

  // ses-103
  { id: "att-11", sessionId: "ses-103", studentId: "usr-student-01", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-C1001", checkedInAt: new Date("2026-08-18T08:32:00") },
  { id: "att-12", sessionId: "ses-103", studentId: "usr-student-02", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-C1002", checkedInAt: new Date("2026-08-18T08:34:00") },
  { id: "att-13", sessionId: "ses-103", studentId: "usr-student-03", status: "ABSENT", method: "ADMIN_OVERRIDE", referenceCode: "MCU-2026-C1003", checkedInAt: new Date("2026-08-18T11:30:00") },
  { id: "att-14", sessionId: "ses-103", studentId: "usr-student-04", status: "PRESENT", method: "DYNAMIC_QR", referenceCode: "MCU-2026-C1004", checkedInAt: new Date("2026-08-18T08:30:00") },
  { id: "att-15", sessionId: "ses-103", studentId: "usr-student-05", status: "ABSENT", method: "ADMIN_OVERRIDE", referenceCode: "MCU-2026-C1005", checkedInAt: new Date("2026-08-18T11:30:00") },
];

// 5. คำขอลา
export const mockLeaves: MockLeave[] = [
  {
    id: "lv-001",
    studentId: "usr-student-02",
    studentName: "พระสมุห์วิชาญ ปญฺญาวชิโร",
    offeringId: "off-001",
    courseTitle: "ภาษาไทยเพื่อการสื่อสาร",
    sessionId: "ses-102",
    sessionTitle: "สัปดาห์ที่ 2: วาทศาสตร์และทักษะการเทศนา",
    leaveType: "RELIGIOUS_DUTY",
    status: "APPROVED",
    reason: "ติดศาสนกิจพิธีเจริญพระพุทธมนต์ ณ วัดพระศรีรัตนมหาธาตุ วรมหาวิหาร",
    createdAt: new Date("2026-08-10T09:00:00"),
    reviewedById: "usr-teacher-01",
    reviewNote: "อนุโมทนาและอนุมัติให้ลาไปปฏิบัติศาสนกิจ",
  },
  {
    id: "lv-002",
    studentId: "usr-student-03",
    studentName: "สามเณรณัฐพล แสงแก้ว",
    offeringId: "off-001",
    courseTitle: "ภาษาไทยเพื่อการสื่อสาร",
    sessionId: "ses-104",
    sessionTitle: "สัปดาห์ที่ 4: การสนทนาธรรมและการสื่อสารร่วมสมัย",
    leaveType: "SICK",
    status: "PENDING",
    reason: "มีอาการไข้หวัด พักรักษาตัวที่กุฏิสงฆ์",
    createdAt: new Date("2026-09-05T18:00:00"),
  },
];

// 6. บันทึก Audit Log (Append-Only)
export const mockAuditLogs: MockAudit[] = [
  {
    id: "aud-001",
    actorId: "usr-teacher-01",
    actorName: "พระมหาบุญเลิศ กิตฺติปญฺโญ",
    action: "APPROVE_LEAVE_REQUEST",
    entityName: "LeaveRequest",
    entityId: "lv-001",
    newValue: { status: "APPROVED" },
    reason: "อนุมัติลาติดศาสนกิจ",
    ipAddress: "192.168.1.50",
    createdAt: new Date("2026-08-11T12:00:00"),
  },
  {
    id: "aud-002",
    actorId: "usr-teacher-01",
    actorName: "พระมหาบุญเลิศ กิตฺติปญฺโญ",
    action: "OPEN_ATTENDANCE_SESSION",
    entityName: "AttendanceSession",
    entityId: "ses-104",
    newValue: { isClosed: false },
    reason: "เปิดรอบเช็คชื่อคาบที่ 4",
    ipAddress: "192.168.1.50",
    createdAt: new Date("2026-09-06T08:25:00"),
  },
];

/**
 * ฟังก์ชันจัดรูปแบบชื่อตามสมณสารูป (Rule 5)
 */
export function formatMonasticDisplayName(user: {
  userType: "MONK" | "LAYPERSON";
  monasticRank?: string | null;
  monkTitle?: string | null;
  firstName: string;
  lastName?: string | null;
}): string {
  if (user.userType === "MONK") {
    const rank = user.monasticRank ? `${user.monasticRank} ` : "พระ";
    const title = user.monkTitle ? ` ${user.monkTitle}` : "";
    return `${rank}${user.firstName}${title}`.trim();
  }
  return `${user.firstName} ${user.lastName || ""}`.trim();
}
