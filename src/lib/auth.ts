import { getServerSession } from "next-auth";
import type { AuthUser } from "@/types/auth.types";

export interface SessionData {
  user: AuthUser;
}

/**
 * ดึงข้อมูล Session ของผู้ใช้ปัจจุบันจาก Server Side
 */
export async function auth(): Promise<SessionData | null> {
  try {
    const session = await getServerSession();
    if (session && session.user) {
      return session as unknown as SessionData;
    }
  } catch {
    // Fallback สำหรับ Local Development / Test
  }

  // หากไม่มี Session ในโหมด Dev หรือยังไม่ได้ล็อกอิน
  return null;
}
