# System Architecture & Technical Blueprint
## โครงการ: ระบบเช็คชื่อ มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (MCU Smart Attendance System)
**เวอร์ชัน:** 1.0.0 (MVP)  
**สถาปัตยกรรม:** Modular Monolith on Next.js 15 (App Router) & Clean Architecture  
**เป้าหมาย:** ออกแบบสำหรับทีมพัฒนา Vibe Coding (AI-Native Engineering) มี Type-Safety สูง, Scalable, และ Zero-Lock-in

---

## 1. Monorepo / Directory Layout

ระบบถูกจัดโครงสร้างเป็น **Modular Monolith** อยู่ในโครงสร้างโฟลเดอร์เดียวเพื่อลดความซับซ้อนของ Tooling ในช่วง Vibe Coding แต่แยกขอบเขตของโมดูล (Domain Boundaries) ชัดเจนระดับ Service Layer:

```text
mcu-attendance/
├── .github/                      # CI/CD Workflows (GitHub Actions)
├── docs/                         # เอกสารประกอบการออกแบบและคู่มือระบบ
│   ├── 01_MVP_PainPoints...
│   ├── 02_System_Architecture...
│   └── 03_Documentation_Memory...
├── prisma/                       # Database Schema & Migrations
│   ├── schema.prisma             # Primary Prisma Data Model
│   ├── seed.ts                   # Initial Seed Data (Campuses, Faculties, Admin)
│   └── migrations/               # SQL Migration History
├── public/                       # Static Assets (Logos, Icons, Audio feedback)
├── src/
│   ├── app/                      # Next.js 15 App Router (Presentation & Routing)
│   │   ├── (auth)/               # Auth Group: /login, /forgot-password
│   │   ├── (dashboard)/          # Protected Group with Layout Wrapper
│   │   │   ├── student/          # /student/portal, /student/leave, /student/scan
│   │   │   ├── instructor/       # /instructor/courses, /instructor/sessions, /instructor/roster
│   │   │   ├── registrar/        # /registrar/import, /registrar/reports, /registrar/eligibility
│   │   │   └── admin/            # /admin/users, /admin/campuses, /admin/audit-logs
│   │   ├── api/                  # API Route Handlers (SSE, Webhooks, Public endpoints)
│   │   │   ├── attendance/qr/    # Streaming Dynamic QR Code SSE endpoint
│   │   │   ├── health/           # Container Liveness & Readiness Probe
│   │   │   └── webhooks/         # Integration Ingest Endpoints
│   │   ├── layout.tsx            # Root Layout with Font & Theme Providers
│   │   └── page.tsx              # Landing / Redirect Page
│   ├── components/               # UI Components
│   │   ├── ui/                   # Primitive UI (shadcn/ui: button, dialog, table, badge)
│   │   ├── shared/               # Shared Components (Navbar, Sidebar, UserAvatar, BuddhistDate)
│   │   ├── student/              # Student-specific Components (AttendanceCard, ScannerModal)
│   │   └── instructor/           # Instructor-specific Components (QRDisplay, RosterTable)
│   ├── lib/                      # Core Infrastructure & Utilities
│   │   ├── auth/                 # Auth.js Config, Session Helpers, RBAC Middleware
│   │   ├── db/                   # Prisma Client Singleton (`db.ts`)
│   │   ├── redis/                # Redis Client & Token Store (`redis.ts`)
│   │   ├── storage/              # MinIO / S3 Client for Uploading Evidence
│   │   ├── time/                 # Buddhist Era Formatter & NTP Server Clock
│   │   └── utils.ts              # Styling helpers (clsx, twMerge)
│   ├── modules/                  # Core Business Domain Services (Clean Architecture)
│   │   ├── iam/                  # MOD-01: IAM & User Management Service
│   │   ├── scheduling/           # MOD-02: Course, Term & Session Management
│   │   ├── attendance/           # MOD-03: Dual-Engine Verification & Anti-Cheat
│   │   ├── leave/                # MOD-04: Leave Workflow & Document Handling
│   │   ├── student/              # MOD-05: Attendance Aggregation & 80% Rule Calc
│   │   ├── reporting/            # MOD-06: Exam Eligibility & Excel Generator
│   │   └── audit/                # Centralized Immutable Audit Logger
│   ├── server-actions/           # Next.js Server Actions (Controller Entrypoints)
│   │   ├── auth.actions.ts
│   │   ├── attendance.actions.ts
│   │   ├── leave.actions.ts
│   │   └── course.actions.ts
│   └── types/                    # Global TypeScript Types & DTO Schemas
│       ├── auth.types.ts
│       ├── attendance.types.ts
│       └── report.types.ts
├── .env.example                  # Environment Variables Template
├── docker-compose.yml            # Local/Production Multi-Container Definition
├── Dockerfile                    # Multi-stage Production Build for Next.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 2. Mermaid Diagrams

### 2.1 Layered Architecture Diagram (Mermaid graph TB)

```mermaid
graph TB
    subgraph ClientLayer ["1. Client Layer (Responsive Web & Classroom Display)"]
        UI_Student["📱 Student Mobile PWA<br>(Scan QR / View % Status)"]
        UI_Teacher["💻 Instructor Console<br>(Roster Check / Generate QR)"]
        UI_Projector["📺 Classroom Smart TV / Display<br>(Dynamic QR Broadcaster)"]
        UI_Admin["🖥️ Registrar & Admin Dashboard<br>(Data Import / Reports)"]
    end

    subgraph EdgeLayer ["2. Edge & Security Gateway"]
        Proxy["Reverse Proxy & SSL Termination<br>(Nginx / Traefik / Docker)"]
        WAF["Rate Limiter & Bot Guard<br>(Up to 1,500 req/min peak)"]
    end

    subgraph AppLayer ["3. Application Layer (Next.js 15 Server-side Engine)"]
        subgraph ServerActions ["Server Actions & Controllers (Entrypoints)"]
            ACT_Auth["Auth & IAM Controller"]
            ACT_Attend["Attendance Controller"]
            ACT_Leave["Leave & Workflow Controller"]
            ACT_Report["Reporting & Export Controller"]
        end
        subgraph DomainServices ["Domain Service Layer (Business Logic)"]
            SVC_IAM["IAM Service<br>(RBAC & Scope Guard)"]
            SVC_Sched["Schedule Service<br>(16-Week Generator)"]
            SVC_Engine["Attendance Engine<br>(HMAC Dynamic QR & Roster)"]
            SVC_Leave["Leave Service<br>(Workflow & Evidence)"]
            SVC_Stat["Student Portal Service<br>(80% Threshold Engine)"]
            SVC_Report["Reporting Service<br>(Excel & Eligibility Matrix)"]
            SVC_Audit["Audit Service<br>(Immutable Event Logger)"]
        end
    end

    subgraph DataLayer ["4. Persistence & Caching Layer"]
        DB_Postgres[("PostgreSQL 16 Primary<br>(ACID Relational Core)")]
        Cache_Redis[("Redis 7 Cache<br>(QR Token TTL 20s & Sessions)")]
        Storage_Minio[("MinIO / S3 Object Storage<br>(Medical & Monk Leave Slips)")]
    end

    subgraph CampusLegacy ["5. MCU Legacy & External Campus Systems"]
        SYS_LDAP["Central LDAP / Active Directory<br>(Campus Auth Provider)"]
        SYS_SIS["MCU SIS / REG API<br>(Curriculum & Student Registry)"]
    end

    %% Wiring
    UI_Student & UI_Teacher & UI_Projector & UI_Admin -->|HTTPS / WSS| Proxy
    Proxy --> WAF
    WAF --> ACT_Auth & ACT_Attend & ACT_Leave & ACT_Report

    ACT_Auth --> SVC_IAM
    ACT_Attend --> SVC_Engine & SVC_Sched
    ACT_Leave --> SVC_Leave
    ACT_Report --> SVC_Report & SVC_Stat

    SVC_IAM --> DB_Postgres & SYS_LDAP
    SVC_Engine --> Cache_Redis & DB_Postgres & SVC_Audit
    SVC_Sched --> DB_Postgres
    SVC_Leave --> DB_Postgres & Storage_Minio & SVC_Audit
    SVC_Stat --> DB_Postgres
    SVC_Report --> DB_Postgres & SYS_SIS
    SVC_Audit --> DB_Postgres
```

### 2.2 Dynamic QR Code Lifecycle & Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    actor T as อาจารย์ผู้สอน (Instructor)
    participant TV as หน้าจอห้องเรียน (Projector Web)
    actor S as พระนิสิต / ฆราวาส (Student)
    participant API as Next.js Attendance Engine
    participant Redis as Redis Cache (TTL Store)
    participant DB as PostgreSQL Database

    Note over T,TV: ขั้นตอนที่ 1: การเปิดรอบและหมุนเวียน QR Code (Token Rotation)
    T->>API: สั่งเปิดรอบเช็คชื่อ (Session ID = 101)
    API->>Redis: บันทึก Session Active = True
    loop ทุกๆ 20 วินาที (Token Rotation Loop)
        API->>API: คำนวณ Secret Token = HMAC_SHA256(SessionID + Salt + TimestampWindow, SecretKey)
        API->>Redis: SETEX "qr:101:token" 25 (Token)
        API->>TV: สตรีม Token ใหม่ผ่าน SSE / WebSocket
        TV->>TV: Render ภาพ QR Code ชุดใหม่บนหน้าจอ
    end

    Note over S,DB: ขั้นตอนที่ 2: นิสิตสแกนและยืนยันตัวตน
    S->>API: ยิง HTTP POST /api/attendance/verify<br>{ sessionId: 101, token: "HMAC_...", studentId: 901 }
    activate API
    API->>API: ตรวจสอบ Timestamp จาก Server NTP Clock
    API->>Redis: GET "qr:101:token"
    alt Token ถูกต้องและยังไม่หมดอายุ
        Redis-->>API: Match! (Token ถูกต้อง)
        API->>DB: ตรวจสอบว่าเช็คชื่อไปแล้วหรือยัง (Duplicate Check)
        alt ยังไม่เคยเช็คชื่อในรอบนี้
            API->>DB: INSERT INTO attendance_records (Status = PRESENT, Method = DYNAMIC_QR)
            API->>DB: บันทึก AuditLog
            API-->>S: ผลลัพธ์: สำเร็จ! ได้รับ Reference Code: "MCU-2026-X89B1"
            API->>TV: Push Live Headcount Update (Count = Count + 1)
        else เช็คชื่อซ้ำในรอบเดียวกัน
            API-->>S: แจ้งเตือน: "ท่านได้บันทึกเวลาเรียนในรอบนี้ไปแล้ว"
        end
    else Token หมดอายุ หรือเป็นรูปแคปส่งต่อ
        Redis-->>API: Mismatch or Key Expired
        API-->>S: ปฏิเสธ: "QR Code หมดอายุ กรุณาสแกนรหัสใหม่จากหน้าจอห้องเรียน"
    end
    deactivate API
```

---

## 3. Technology Stack Table

| Layer | Technology | Version | Rationale & Enterprise Fit | License |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | 15.x (App Router) | Fullstack React ในตัวเดียว รองรับ Server Actions, Server-Side Rendering (SSR) ป้องกันปัญหา SEO/Auth Leakage | MIT |
| **Language** | **TypeScript** | 5.x | End-to-end Type Safety ตั้งแต่ DB Schema ถึง Frontend Component ลดปัญหา Runtime Type Error สำหรับ Vibe Coding | Apache 2.0 |
| **UI System** | **Tailwind CSS + shadcn/ui** | Latest | Design System ระดับมืออาชีพ ปรับแต่ง Theme และโทนสีสุภาพสำหรับมหาวิทยาลัยสงฆ์ได้ง่าย มี Accessibility (a11y) ในตัว | MIT |
| **State & Forms** | **React Hook Form + Zod** | Latest | จัดการฟอร์มแบบ Zero Re-render พร้อม Schema Validation ชุดเดียวกันทั้งฝั่ง Client และ Server | MIT |
| **ORM** | **Prisma ORM** | 6.x | Schema ชัดเจน AI Tooling สร้างโค้ดได้แม่นยำสูง มี Migration Engine ที่ปลอดภัย | Apache 2.0 |
| **Database** | **PostgreSQL** | 16.x | ระบบฐานข้อมูลเชิงสัมพันธ์มาตรฐานสากล รองรับ ACID Transactions, Composite Indexing, และฟิลด์ JSONB สำหรับ Audit Log | PostgreSQL |
| **In-Memory Cache** | **Redis** | 7.x | ทำ In-memory Caching สำหรับ Dynamic QR Token (TTL 20 วินาที) และจัดคิว Rate Limiting รองรับ Peak Load เช้า | BSD 3-Clause |
| **Object Storage** | **MinIO (Self-hosted)** | Latest | สำหรับเก็บเอกสารใบรับรองแพทย์และใบฎีกานิมนต์ รองรับ S3 API ติดตั้งฟรีบน On-Premise มจร | AGPLv3 / Apache 2.0 |
| **Authentication** | **Auth.js (NextAuth)** | 5.x | รองรับ Stateless JWT Strategy และสามารถต่อขยาย LDAP/OAuth2 SSO ของ มจร ได้อย่างราบรื่น | ISC |
| **Container Engine**| **Docker & Compose** | Latest | บรรจุแพ็กเกจทุก Service ให้อยู่ใน Container เพื่อความง่ายในการ Deployment บนเซิร์ฟเวอร์ มจร ส่วนกลาง | Apache 2.0 |

---

## 4. API & Communication Patterns

### 4.1 Server Actions vs Route Handlers
* **Next.js Server Actions (`/src/server-actions/`):** ใช้สำหรับการทำ **Data Mutation** และฟอร์มทั้งหมด (เช่น บันทึกเช็คชื่อ, ยื่นใบลา, สร้างตารางสอน, แก้ไขสถานะ)
  * *ข้อดี:* มี Type-Safe ส่งผ่าน Data Schema ด้วย Zod โดยตรง ป้องกัน CSRF อัตโนมัติ ไม่ต้องเขียน boilerplate fetcher
* **Route Handlers (`/src/app/api/`):** ใช้สำหรับกรณีเฉพาะ:
  * `GET /api/attendance/qr/stream`: ใช้ Server-Sent Events (SSE) ในการสตรีม QR Code ไปยังหน้าจอโปรเจกเตอร์
  * `GET /api/health`: Health Check สำหรับ Docker/Kubernetes Liveness Probe
  * `POST /api/webhooks/sis`: จุดรับซิงก์ข้อมูลจากระบบทะเบียนภายนอก

### 4.2 Standard API Response & Error Handling Format
ทุก Server Action และ API Response ต้องส่งผลลัพธ์ในรูปแบบ Generic Envelope:

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;       // เช่น "QR_EXPIRED", "UNAUTHORIZED", "ALREADY_CHECKED_IN"
    message: string;    // ข้อความภาษาไทยสำหรับแสดงผลแก่ผู้ใช้งาน
    details?: any;
  };
  timestamp: string;    // Server ISO Timestamp (UTC+7)
}
```

### 4.3 Validation Strategy ด้วย Zod
ข้อมูล Input ทุกชนิดต้องถูก Validate ผ่าน Zod Schema ก่อนถึง Service Layer เสมอ ตัวอย่าง:

```typescript
export const CheckInPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  token: z.string().min(16),
  deviceFingerprint: z.string().optional(),
});
export type CheckInPayload = z.infer<typeof CheckInPayloadSchema>;
```

---

## 5. Security & Compliance Architecture

1. **Role-Based Access Control (RBAC):**
   * ควบคุมผ่าน Next.js Middleware (`/src/middleware.ts`) ตรวจสอบ JWT Claims ก่อนอนุญาตให้เรนเดอร์หน้าจอ
   * เสริมด้วย Method-Level Guard ใน Domain Service Layer เพื่อป้องกันกรณี Client พยายามเรียก Server Action ข้ามบทบาท
2. **Anti-Replay Attack Dynamic QR:**
   * QR Token แต่ละชุดมีอายุ 20 วินาทีบวกระยะผ่อนผัน 5 วินาทีสำหรับ Network Latency (รวม TTL = 25 วินาที)
   * บันทึก Token ที่ถูกใช้งานแล้ว (Used Tokens) ใน Redis เพื่อป้องกันการนำ Token เดิมมา Replay ยิงซ้ำในเสี้ยววินาที
3. **Server Clock Authority (NTP Sync):**
   * เซิร์ฟเวอร์ของระบบเช็คชื่อ มจร ต้องซิงก์เวลากับ NTP Server ของสถาบันมาตรวิทยาแห่งชาติ หรือ Server กลางของ มจร อย่างสม่ำเสมอ ความคลาดเคลื่อนต้องไม่เกิน $\pm 500$ มิลลิวินาที
4. **Data Privacy (PDPA Compliance):**
   * จัดเก็บเฉพาะข้อมูลที่จำเป็นต่อการจัดการศึกษา (Data Minimization)
   * ไฟล์ภาพหลักฐานการลา (ใบรับรองแพทย์/ใบฎีกา) จะถูกเข้ารหัสชื่อไฟล์แบบ UUID และอนุญาตให้เข้าถึงได้เฉพาะอาจารย์ผู้สอนวิชานั้นและเจ้าหน้าที่ทะเบียนผ่าน Pre-signed URL ที่มีอายุจำกัด (15 นาที) เท่านั้น

---

## 6. Resilience & Fallback Architecture

| กรณีความล้มเหลว (Failure Mode) | กลยุทธ์การฟื้นตัวและทำงานต่อเนื่อง (Fallback Strategy) |
| :--- | :--- |
| **ระบบกลาง LDAP / SSO มจร ล่ม** | ระบบใช้ **Stateless Long-lived JWT** บนเบราว์เซอร์ของผู้ใช้ (อายุ 7 วัน) จึงไม่ได้รับผลกระทบ สำหรับอาจารย์ใหม่หรือกรณีฉุกเฉิน มี **Emergency Local Staff PIN** ที่เข้ารหัสระดับ Argon2 ในฐานข้อมูลของระบบเช็คชื่อเอง |
| **ระบบทะเบียนกลาง (SIS) ขัดข้อง** | ระบบเช็คชื่อทำงานบน **Local PostgreSQL Shadow Database** ไม่พึ่งพาการดึงข้อมูลสดจาก SIS ระหว่างเรียน สามารถนำเข้าตารางเรียนผ่าน Excel ทดแทนได้ทันที และผลเวลาเรียนจะถูกพักไว้ในตาราง Outbox เพื่อรอซิงก์กลับ SIS เมื่อระบบทะเบียนเปิดทำการ |
| **อินเทอร์เน็ตในห้องเรียน/วัด ล่ม** | อาจารย์สามารถสลับเข้าสู่โหมด **Manual Roster Check-in** ผ่านเครื่องของผู้สอนเพียงเครื่องเดียว (หรือเปิด Hotspot มือถือ) หรือใช้ใบพิมพ์รายชื่อกระดาษประจำคาบที่ระบบสร้างไว้ล่วงหน้าเพื่อให้นิสิตเซ็นชื่อ แล้วนำมาบันทึกย้อนหลัง |
| **Redis Cache ดับ** | ระบบมีโหมด Fallback สลับไปใช้ Local In-Memory Cache (LRU Cache บน Node.js Process) สำหรับการคำนวณ Dynamic QR ชั่วคราว โดยระบบจะบันทึก Warning ไปยังศูนย์คอมพิวเตอร์เพื่อรีสตาร์ต Redis Container |
