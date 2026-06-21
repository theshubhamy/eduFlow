# eduFlow

**eduFlow** is a modern, comprehensive School Management SaaS application. Migrated from Laravel to a high-performance JavaScript/TypeScript stack:
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL.
- **Frontend**: React 19 (SPA), Vite, Tailwind CSS v4, and React Router.
- **Authentication**: JWT & Cookie-based sessions.

---

## 🚀 Features

- **Role-Based Access Control:** Portals and permissions for Admins, Principals, HoDs, Admission Officers, Accounts, and Faculty members.
- **Academic Management Module:** Manage student enrollments, school classes, and subjects.
- **Attendance Tracker:** Track daily class attendance with parental alert logging.
- **Finance Portal:** Setup fee categories, allocate fees to classes/students, collect payments, and download official PDF receipts.
- **Multi-Tenant Teams:** Create teams, switch active teams, invite members with specific roles, and manage roles.
- **Seamless Inertia Compatibility:** Utilizes a custom compatibility shim to support the existing page views with minimal modifications.

---

## 🛠️ Project Structure

```
eduFlow/
  ├── backend/          # Express.js Server
  │    ├── prisma/      # Prisma Schema & Database Seeder
  │    ├── src/         # API Controllers, Middlewares, and Router
  │    └── package.json
  └── frontend/         # Vite + React SPA Client
       ├── src/         # React Components, Pages, Layouts, and Inertia Shim
       └── package.json
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v20+)
- PostgreSQL running locally

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Configure Environment Variables**:
   Create a `.env` file based on `.env` template:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eduflow?schema=public"
   JWT_SECRET="your-super-secret-key"
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Database Migrations & Seed**:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Vite will serve the client at `http://localhost:3000` (which automatically proxies `/api/*` to the Express backend).

---

## 💻 Default Credentials

To log in after database seeding, use the following administrator account:
- **Email**: `admin@example.com`
- **Password**: `password`
