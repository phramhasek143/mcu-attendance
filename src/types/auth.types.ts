import { z } from "zod";

export const LoginSchema = z.object({
  usernameOrEmail: z.string().min(3, { message: "กรุณากรอกชื่อผู้ใช้หรืออีเมล" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: "SUPER_ADMIN" | "CAMPUS_ADMIN" | "REGISTRAR" | "INSTRUCTOR" | "STUDENT";
  userType: "MONK" | "LAYPERSON";
  displayName: string;
  campusId?: string | null;
  studentId?: string | null;
}
