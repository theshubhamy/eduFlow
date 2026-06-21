import { Router } from "express";
import authRoutes from "./authRoutes";
import teamRoutes, { invitationRouter, memberRouter } from "./teamRoutes";
import {
  studentRouter,
  classRouter,
  subjectRouter,
  attendanceRouter,
} from "./academicRoutes";
import { feeRouter, paymentRouter, financeRouter } from "./financeRoutes";
import noticeRoutes from "./noticeRoutes";
import examRoutes from "./examRoutes";
import libraryRoutes from "./libraryRoutes";
import leaveRoutes from "./leaveRoutes";
import timetableRoutes from "./timetableRoutes";
import dashboardRoutes from "./dashboardRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/teams", teamRoutes);
router.use("/invitations", invitationRouter);
router.use("/members", memberRouter);
router.use("/students", studentRouter);
router.use("/classes", classRouter);
router.use("/subjects", subjectRouter);
router.use("/attendance", attendanceRouter);
router.use("/fees", feeRouter);
router.use("/payments", paymentRouter);
router.use("/finance", financeRouter);
router.use("/notices", noticeRoutes);
router.use("/exams", examRoutes);
router.use("/library", libraryRoutes);
router.use("/leaves", leaveRoutes);
router.use("/timetable", timetableRoutes);
router.use("/dashbaord", dashboardRoutes);

export default router;
