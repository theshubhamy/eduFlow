import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { prisma } from "./db";
import { requireAuth, AuthRequest } from "./middleware/auth";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  deleteAccount,
  updatePassword,
} from "./controllers/authController";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  switchTeam,
  updateMemberRole,
  removeMember,
  inviteMember,
  cancelInvitation,
  acceptInvitation,
  listMembers,
} from "./controllers/teamController";
import {
  listStudents,
  createStudentData,
  storeStudent,
  listClasses,
  storeClass,
  destroyClass,
  listSubjects,
  storeSubject,
  destroySubject,
  listAttendanceClasses,
  createAttendanceSheet,
  storeAttendance,
} from "./controllers/academicController";
import {
  listFees,
  createCategory,
  allocateFee,
  listPayments,
  collectPayment,
  downloadReceipt,
} from "./controllers/feeController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(
  cors({
    origin: true, // Allow frontend origin
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// --- Dashboard Stats Endpoint ---
app.get(
  "/api/dashboard",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res
          .status(400)
          .json({ error: "Active school context required." });
      }

      const studentsCount = await prisma.student.count({ where: { schoolId } });
      const classesCount = await prisma.schoolClass.count({
        where: { schoolId },
      });
      const subjectsCount = await prisma.subject.count({ where: { schoolId } });

      const totalRevenueResult = await prisma.feePayment.aggregate({
        where: { schoolId },
        _sum: { amountPaid: true },
      });
      const revenueCollected =
        totalRevenueResult._sum.amountPaid?.toNumber() || 0;

      const recentPaymentsRaw = await prisma.feePayment.findMany({
        where: { schoolId },
        include: {
          student: {
            include: {
              user: { select: { name: true } },
            },
          },
          feeAllocation: {
            include: {
              feeCategory: true,
            },
          },
        },
        orderBy: { paymentDate: "desc" },
        take: 5,
      });

      const recentPayments = recentPaymentsRaw.map((p) => ({
        id: p.id,
        studentName: p.student.user.name,
        amount: p.amountPaid,
        date: p.paymentDate,
        categoryName: p.feeAllocation.feeCategory.name,
      }));

      return res.json({
        stats: {
          studentsCount,
          classesCount,
          subjectsCount,
          revenueCollected,
        },
        recentPayments,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error fetching dashboard." });
    }
  },
);

// --- Auth Routes ---
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.get("/api/auth/me", requireAuth, getMe);
app.patch("/api/auth/profile", requireAuth, updateProfile);
app.delete("/api/auth/profile", requireAuth, deleteAccount);
app.put("/api/auth/password", requireAuth, updatePassword);

// --- Team Routes ---
app.post("/api/teams", requireAuth, createTeam);
app.patch("/api/teams/:teamId", requireAuth, updateTeam);
app.delete("/api/teams/:teamId", requireAuth, deleteTeam);
app.post("/api/teams/:teamId/switch", requireAuth, switchTeam);
app.patch(
  "/api/teams/:teamId/members/:memberUserId",
  requireAuth,
  updateMemberRole,
);
app.delete(
  "/api/teams/:teamId/members/:memberUserId",
  requireAuth,
  removeMember,
);
app.post("/api/teams/:teamId/invitations", requireAuth, inviteMember);
app.delete(
  "/api/teams/:teamId/invitations/:inviteCode",
  requireAuth,
  cancelInvitation,
);
app.post("/api/invitations/:inviteCode/accept", requireAuth, acceptInvitation);
app.get("/api/invitations/:inviteCode/accept", requireAuth, acceptInvitation);

// --- Member List Route ---
app.get("/api/members", requireAuth, listMembers);

// --- Academic Routes ---
// Students
app.get("/api/students", requireAuth, listStudents);
app.get("/api/students/create", requireAuth, createStudentData);
app.post("/api/students", requireAuth, storeStudent);

// Classes
app.get("/api/classes", requireAuth, listClasses);
app.post("/api/classes", requireAuth, storeClass);
app.delete("/api/classes/:id", requireAuth, destroyClass);

// Subjects
app.get("/api/subjects", requireAuth, listSubjects);
app.post("/api/subjects", requireAuth, storeSubject);
app.delete("/api/subjects/:id", requireAuth, destroySubject);

// Attendance
app.get("/api/attendance", requireAuth, listAttendanceClasses);
app.get("/api/attendance/create", requireAuth, createAttendanceSheet);
app.post("/api/attendance", requireAuth, storeAttendance);

// --- Finance Routes ---
app.get("/api/fees", requireAuth, listFees);
app.post("/api/fees/category", requireAuth, createCategory);
app.post("/api/fees/allocate", requireAuth, allocateFee);

app.get("/api/payments", requireAuth, listPayments);
app.post("/api/payments/collect", requireAuth, collectPayment);
app.get("/api/payments/:id/receipt", downloadReceipt);

// Start Server
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
