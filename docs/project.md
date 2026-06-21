# 🎓 EduSphere — School Management SaaS Platform

### Project Requirements Document & System Architecture

**Version:** 1.0 | **Status:** Draft | **Date:** June 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Stakeholders & User Roles](#2-stakeholders--user-roles)
3. [Functional Requirements — In-School (Web Portal)](#3-functional-requirements--in-school-web-portal)
4. [Functional Requirements — Outside School (Mobile Apps)](#4-functional-requirements--outside-school-mobile-apps)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design-key-entities)
7. [Security & Compliance](#7-security--compliance)
8. [Technology Stack](#8-technology-stack-summary)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Non-Functional Requirements](#10-non-functional-requirements)

---

## 1. Executive Summary

**EduSphere** is a comprehensive, cloud-based School Management SaaS platform designed to digitise and streamline every operational aspect of a modern educational institution — from classroom attendance and fee collection to real-time GPS tracking of school buses.

The platform is delivered across two surfaces:

- **Web Application** — for all in-school operations (Admin, Accounts, Faculty, Management)
- **Mobile Applications** — for stakeholders outside school premises (Parents & Bus Drivers)

> **Core Value Proposition:** One unified platform connecting school administration, teachers, students, parents, and transport management with real-time data, automated workflows, and role-based access control.

### 1.1 Platform Overview

| Surface    | Primary Users                        | Access Method              |
| ---------- | ------------------------------------ | -------------------------- |
| Web Portal | Admin, Accounts, Faculty, Management | Browser (Desktop & Tablet) |
| Parent App | Parents / Guardians                  | iOS & Android Mobile App   |
| Driver App | Bus Drivers                          | iOS & Android Mobile App   |

---

## 2. Stakeholders & User Roles

### 2.1 In-School Roles (Web Portal)

#### Department 1 — Admin

- **School Administrator** — Full system access, school-wide configuration
- **Data Entry Operator** — Student/staff registration, record management
- **IT Coordinator** — System settings, user provisioning

#### Department 2 — Accounts

- **Accounts Manager** — Fee structure configuration, financial reports
- **Fee Collector** — Daily fee transactions, receipt generation
- **Auditor** — Read-only access to all financial records

#### Department 3 — Faculty

- **Teacher / Class Teacher** — Attendance, marks, lesson plans, timetable
- **Department Head** — Department-level oversight and reports
- **Librarian** — Library management module (optional add-on)

#### Department 4 — Management

- **Principal / Director** — School-wide dashboard, reports, approvals
- **HR Manager** — Staff payroll, leave, appraisal
- **Transport Manager** — Bus routes, GPS monitoring, driver management

### 2.2 Outside-School Roles (Mobile App)

- **Parent / Guardian** — Track bus, receive notifications, view child's records, pay fees
- **Bus Driver** — Trip log, student boarding list, GPS-enabled route navigation, SOS

---

## 3. Functional Requirements — In-School (Web Portal)

### 3.1 Student Management

| Feature              | Description                                          | Department      |
| -------------------- | ---------------------------------------------------- | --------------- |
| Student Registration | Enrol new students with profile, documents, photo    | Admin           |
| Student Profile      | Academic history, health records, emergency contacts | Admin / Faculty |
| Class Assignment     | Assign students to class, section, roll number       | Admin           |
| Promotion / Transfer | Year-end promotion, TC generation, transfer records  | Admin           |
| Alumni Management    | Graduate records, certificate issuance               | Admin           |

### 3.2 Teacher & Staff Management

| Feature             | Description                                                     | Department      |
| ------------------- | --------------------------------------------------------------- | --------------- |
| Staff Registration  | Profile, qualifications, employment details                     | Admin / HR      |
| Teaching Assignment | Assign subjects and classes to teachers                         | Admin / Faculty |
| Staff Attendance    | Biometric / manual attendance for all staff                     | Admin / HR      |
| Leave Management    | Apply, approve, track leave; auto payroll deduction             | HR              |
| Payroll             | Salary structure, deductions, payslip generation, bank transfer | Accounts / HR   |
| Appraisal           | Annual performance review workflow                              | Management      |

### 3.3 Class & Timetable Management

- Create and manage classes, sections, and academic years
- Subject and curriculum mapping per class
- Automated timetable generation with conflict detection
- Substitute teacher assignment for absences
- Classroom and lab resource booking

### 3.4 Attendance Management

| Feature            | Description                                  | Method                  |
| ------------------ | -------------------------------------------- | ----------------------- |
| Student Attendance | Daily period-wise or day-wise marking        | Manual / Biometric / QR |
| Bulk Attendance    | Mark entire class at once with exceptions    | Manual                  |
| Attendance Reports | Student-wise, class-wise, date-range reports | Auto-generated          |
| Absentee Alerts    | Auto SMS/notification to parent on absence   | Push + SMS              |
| Staff Attendance   | Daily check-in/check-out with geo-fencing    | Mobile / Biometric      |

### 3.5 Fee Management

- Flexible fee structure: tuition, transport, activity, hostel, etc.
- Fee schedule and due-date configuration per academic year
- Online and offline payment collection (cash, UPI, card, NEFT)
- Automated receipt generation and WhatsApp / email delivery
- Fee defaulter list with automated reminders
- Concession and scholarship management
- Financial dashboard: collected, pending, overdue amounts
- Tally / accounting software export (CSV, JSON)

### 3.6 Examination & Results

| Feature             | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| Exam Scheduling     | Create exam timetables, hall allocation, invigilator assignment |
| Mark Entry          | Teacher enters marks per subject; auto-grade calculation        |
| Report Cards        | Customisable report card templates; PDF generation              |
| Grade Analytics     | Class-wise, subject-wise performance analytics                  |
| Merit Certificates  | Auto-generate certificates for top performers                   |
| Internal Assessment | Assignments, projects, practicals tracking                      |

### 3.7 Communication & Notifications

- **Circular & Notice Board** — School-wide or targeted announcements
- **Bulk SMS & Email** — Send to parents, staff, or specific groups
- **Push Notifications** — To Parent and Driver mobile apps
- **PTM Scheduling** — Parent-teacher meeting calendar and invites
- **Internal Messaging** — Between staff and departments

### 3.8 Library Management _(Optional Module)_

- Book catalogue with ISBN, genre, author, availability status
- Issue / return tracking with due date and fine calculation
- Student and staff borrowing history
- Low-stock alerts for critical titles

### 3.9 Management Dashboard & Reports

- Real-time KPI dashboard: enrolment, fee collection, attendance rates
- Department-wise performance summary
- Academic year comparison analytics
- Export to PDF, Excel, and print-ready formats
- Role-based report visibility (Accounts sees fees; Principal sees all)

---

## 4. Functional Requirements — Outside School (Mobile Apps)

### 4.1 Parent Mobile App

#### 4.1.1 Child Academic Overview

- View attendance records and receive real-time absence alerts
- Access exam schedules, results, and report cards
- View homework and assignment submissions
- Check timetable and teacher remarks

#### 4.1.2 Fee Module

- View outstanding fee balance and payment history
- Online fee payment via UPI, credit/debit card, net banking
- Download digital receipts
- Receive automated payment reminders and overdue alerts

#### 4.1.3 Bus Tracking (Real-Time GPS)

- Live map view showing school bus location
- ETA to child's bus stop
- Push alert when bus is 1 km / 5 mins away from stop
- Trip history and route playback
- Notification when child boards / alights (RFID / QR scan event)

#### 4.1.4 Communication

- Receive school circulars, event updates, and notices
- View and respond to PTM meeting invitations
- In-app chat with class teacher (moderated)
- CCTV live stream access (where permitted by school policy)

---

### 4.2 Bus Driver Mobile App

#### 4.2.1 Trip Management

- View assigned route, stops, and student boarding list for the day
- Start / End trip with one-tap action
- Navigate with in-app turn-by-turn directions (Google Maps integration)
- Mark student as boarded / not boarded at each stop

#### 4.2.2 GPS Tracking

- Continuous background GPS broadcast to server
- Auto-start tracking when trip begins
- Offline caching of location data when connectivity is poor
- Geo-fence alerts when bus deviates from planned route

#### 4.2.3 Safety & Communication

- **SOS Panic Button** — Instantly alerts Transport Manager and school admin
- Breakdown / delay reporting with reason and ETA update
- Attendance sync: boarding data pushed to student attendance system
- CCTV status indicator (connected / disconnected)

---

### 4.3 GPS & CCTV Integration for Buses

> **Hardware Requirements per Bus:**
>
> 1. GPS tracking device (4G SIM-enabled, tamper-proof)
> 2. IP CCTV cameras (min. 2 — front + rear)
> 3. Vehicle-mounted NVR/DVR unit with SD card storage
> 4. Optional: RFID reader for student boarding confirmation

| Feature            | Details                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| GPS Device         | Real-time coordinates every 10 seconds; supports MQTT / HTTP protocols     |
| Route Playback     | Full trip route replay from server-stored GPS history                      |
| Geo-fencing        | Virtual boundary around school; alerts on entry/exit                       |
| CCTV Live Stream   | HLS / RTSP stream from bus cameras; viewable by admin and parents (opt-in) |
| CCTV Recording     | Edge recording on-bus NVR; cloud backup at trip end                        |
| Over-speed Alert   | Alert triggered if bus exceeds configured speed limit                      |
| Ignition Detection | Auto trip start/end detection via OBD / GPS ignition signal                |

---

## 5. System Architecture

### 5.1 Architecture Pattern

> **Multi-Tenant SaaS | Microservices | Event-Driven | API-First | Cloud-Native (AWS / GCP)**

### 5.2 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                   │
│   Web Browser (Admin/Faculty/Accounts/Management)                    │
│   Parent iOS/Android App          Driver iOS/Android App             │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ HTTPS / WSS
┌───────────────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY + CDN                                 │
│   AWS CloudFront / Nginx  │  Rate Limiting  │  Auth Token Validation │
│   SSL Termination         │  Load Balancing                          │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ Internal REST / gRPC
┌───────────────────────────────▼──────────────────────────────────────┐
│                      MICROSERVICES LAYER                             │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Auth Service│  │Student Svc  │  │  Staff Svc  │  │Attend. Svc │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  Fee Svc    │  │  Exam Svc   │  │Transport Svc│  │Notif. Svc  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐                                    │
│  │ Report Svc  │  │  Media Svc  │                                    │
│  └─────────────┘  └─────────────┘                                    │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ Message Queue (RabbitMQ / SQS)
┌───────────────────────────────▼──────────────────────────────────────┐
│                         DATA LAYER                                   │
│   PostgreSQL (primary)  │  Redis (cache/sessions)                    │
│   MongoDB (logs/analytics)  │  S3 (files/media)                      │
│   TimescaleDB (GPS time-series)                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Microservices Breakdown

| Service              | Responsibility                                              | Tech Stack         |
| -------------------- | ----------------------------------------------------------- | ------------------ |
| Auth Service         | JWT/OAuth2 authentication, RBAC, SSO, multi-tenant sessions | Node.js + Passport |
| Student Service      | CRUD for students, profiles, enrolment, class assignment    | Node.js / Django   |
| Staff Service        | Teacher/staff profiles, payroll, leaves, HR workflows       | Node.js / Django   |
| Attendance Service   | Student + staff attendance, reports, biometric integration  | Node.js            |
| Fee Service          | Fee structure, payment gateway, receipts, reconciliation    | Node.js + Razorpay |
| Exam Service         | Exam scheduling, mark entry, report cards, analytics        | Python / FastAPI   |
| Transport Service    | Bus routes, GPS data ingest, driver management, geo-fencing | Go / Node.js       |
| Notification Service | Push (FCM/APNs), SMS, Email, WhatsApp delivery              | Node.js + Firebase |
| Report Service       | PDF generation, Excel exports, analytics dashboards         | Python + Puppeteer |
| Media Service        | File uploads, CCTV stream proxy, HLS video delivery         | Go + FFmpeg + S3   |

### 5.4 Frontend Architecture

| Surface                    | Technology            | Key Libraries                                             |
| -------------------------- | --------------------- | --------------------------------------------------------- |
| Web Portal (Admin/Faculty) | React.js + TypeScript | Redux Toolkit, React Query, Chart.js, Ant Design          |
| Parent Mobile App          | React Native (Expo)   | React Navigation, Google Maps SDK, Firebase, Razorpay SDK |
| Driver Mobile App          | React Native (Expo)   | Background Location, Google Maps, WebSocket, SQLite       |

### 5.5 GPS & CCTV Data Flow

```
GPS Device (on bus)
    │  MQTT every 10s
    ▼
AWS IoT Core / Mosquitto Broker
    │
    ▼
Transport Service ──► TimescaleDB (GPS time-series storage)
    │
    ├──► WebSocket Server ──► Parent App (live map)
    │                    └──► Admin Dashboard (fleet view)
    │
    └──► Geo-fence Engine ──► Alert if route deviation detected

CCTV Cameras (on bus)
    │  RTSP
    ▼
On-bus NVR (edge recording)
    │
    ├──► Media Service (RTSP → HLS relay) ──► Parent App / Admin
    │
    └──► S3 Cloud Backup (uploaded at trip end)
```

### 5.6 Multi-Tenancy Design

- Each school is a **Tenant** identified by a unique `tenant_id`
- All database tables include `tenant_id` for row-level isolation
- Custom subdomain per school: `schoolname.edusphere.in`
- School-specific branding: logo, colours, fee structure templates
- Tenant admin can configure their own roles and permissions within their school

---

## 6. Database Design (Key Entities)

| Entity       | Key Fields                                                       | Relations                       |
| ------------ | ---------------------------------------------------------------- | ------------------------------- |
| `tenants`    | id, name, subdomain, plan, created_at                            | Parent of all entities          |
| `users`      | id, tenant_id, name, email, role, dept, password_hash            | Belongs to tenant               |
| `students`   | id, tenant_id, roll_no, class_id, admission_no, guardian_id      | Has attendance, fees, results   |
| `staff`      | id, tenant_id, emp_id, designation, dept_id, salary_structure_id | Has leaves, payroll, attendance |
| `classes`    | id, tenant_id, name, section, academic_year, class_teacher_id    | Has students, timetable         |
| `attendance` | id, student_id, class_id, date, status, marked_by                | Indexed by date + student       |
| `fees`       | id, student_id, category, amount, due_date, paid_at, receipt_no  | Payment gateway ref             |
| `exams`      | id, class_id, subject_id, date, max_marks, type                  | Has results                     |
| `results`    | id, student_id, exam_id, marks_obtained, grade                   | Linked to exam + student        |
| `buses`      | id, tenant_id, reg_no, driver_id, route_id, gps_device_id        | Has GPS logs, CCTV              |
| `gps_logs`   | id, bus_id, lat, lng, speed, timestamp                           | TimescaleDB hypertable          |
| `trips`      | id, bus_id, start_time, end_time, route_id, status               | Has boarding events             |

---

## 7. Security & Compliance

### 7.1 Authentication & Authorization

- JWT-based stateless authentication with refresh token rotation
- Role-Based Access Control (RBAC) with fine-grained permissions per department
- OAuth2 / Google SSO support for staff login
- Multi-Factor Authentication (MFA) for Admin and Management roles
- Session timeout and concurrent session management

### 7.2 Data Security

- All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- PII (student/parent data) stored with field-level encryption where required
- Tenant data isolation at database level (row-level security in PostgreSQL)
- Automated daily backups with 30-day retention and point-in-time recovery
- CCTV video access restricted by role; parent access requires school opt-in

### 7.3 Compliance

- **DPDP Act 2023 (India)** compliant data handling and consent management
- **FERPA-aligned** student data privacy principles
- **GDPR-ready**: data export, deletion, and consent workflows
- Audit logs for all sensitive actions (fee waivers, mark edits, admin changes)

---

## 8. Technology Stack Summary

| Layer              | Technology / Tool                   | Purpose                                   |
| ------------------ | ----------------------------------- | ----------------------------------------- |
| Frontend Web       | React.js + TypeScript + Ant Design  | Admin/Faculty/Accounts web portal         |
| Mobile Apps        | React Native (Expo) + TypeScript    | Parent and Driver apps (iOS & Android)    |
| Backend Services   | Node.js (NestJS) + Python (FastAPI) | Core microservices                        |
| GPS Service        | Go + MQTT (AWS IoT Core)            | High-throughput GPS ingestion             |
| API Gateway        | AWS API Gateway + Nginx             | Routing, auth, rate limiting              |
| Primary Database   | PostgreSQL 15 (RDS)                 | Transactional data (students, fees, etc.) |
| Cache              | Redis (ElastiCache)                 | Sessions, real-time data, rate limiting   |
| Analytics DB       | MongoDB Atlas                       | Event logs, audit trails, reports         |
| Time-Series DB     | TimescaleDB                         | GPS location history                      |
| Object Storage     | AWS S3                              | Documents, photos, CCTV video backups     |
| Message Queue      | RabbitMQ / AWS SQS                  | Async service communication               |
| Push Notifications | Firebase Cloud Messaging (FCM)      | Android and iOS push                      |
| SMS / WhatsApp     | Twilio + MSG91 / WATI               | SMS alerts, WhatsApp receipts             |
| Email              | AWS SES / SendGrid                  | Transactional emails                      |
| Payment Gateway    | Razorpay                            | Online fee payment (India)                |
| Maps               | Google Maps Platform                | Bus tracking, route navigation            |
| CCTV Streaming     | FFmpeg + AWS IVS / Wowza            | HLS live stream relay                     |
| PDF Generation     | Puppeteer / WeasyPrint              | Report cards, receipts                    |
| CI/CD              | GitHub Actions + Docker + ECS/K8s   | Deployment pipeline                       |
| Monitoring         | Datadog / CloudWatch + Sentry       | APM, error tracking, alerts               |

---

## 9. Implementation Roadmap

| Phase                            | Duration     | Deliverables                                                                         |
| -------------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| **Phase 1 — Foundation**         | Months 1–3   | Auth, Multi-tenancy, Student & Staff Management, Class/Timetable, Admin Web Portal   |
| **Phase 2 — Operations**         | Months 4–6   | Attendance, Fee Management (online + offline), Exam & Results, Notifications         |
| **Phase 3 — Mobile Apps**        | Months 7–9   | Parent App (attendance, fees, comms), Driver App (trip management, GPS broadcast)    |
| **Phase 4 — Transport & Safety** | Months 10–12 | GPS live tracking dashboard, Geo-fencing, CCTV streaming integration, SOS system     |
| **Phase 5 — Analytics & Scale**  | Months 13–15 | Management dashboards, advanced reports, payroll, library module, performance tuning |

> **MVP = Phase 1 + Phase 2** — A fully functional school management web portal covering student/staff management, attendance, fees, and examinations for internal school use.

---

## 10. Non-Functional Requirements

| Requirement               | Target                                                  |
| ------------------------- | ------------------------------------------------------- |
| API Response Time (P95)   | < 300ms for standard queries                            |
| Page Load Time            | < 2 seconds on 4G mobile                                |
| System Availability (SLA) | 99.9% uptime (< 9 hours downtime/year)                  |
| GPS Update Frequency      | Every 10 seconds per bus                                |
| Concurrent Users          | 10,000+ concurrent users per instance                   |
| Data Retention            | 7 years for academic records; 90 days for GPS logs      |
| Scalability               | Horizontal scaling via Kubernetes; multi-region support |
| Disaster Recovery         | RPO: 1 hour \| RTO: 4 hours                             |
| Mobile Offline Support    | Driver app functions offline; syncs when connected      |

---

_EduSphere — Project Requirements Document & Architecture v1.0 | Confidential_
