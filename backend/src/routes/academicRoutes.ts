import { Router } from "express";
import { requireAuth } from "../middleware/auth";
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
} from "../controllers/academicController";

// Student Router
export const studentRouter = Router();
studentRouter.get("/", requireAuth, listStudents);
studentRouter.get("/create", requireAuth, createStudentData);
studentRouter.post("/", requireAuth, storeStudent);

// Class Router
export const classRouter = Router();
classRouter.get("/", requireAuth, listClasses);
classRouter.post("/", requireAuth, storeClass);
classRouter.delete("/:id", requireAuth, destroyClass);

// Subject Router
export const subjectRouter = Router();
subjectRouter.get("/", requireAuth, listSubjects);
subjectRouter.post("/", requireAuth, storeSubject);
subjectRouter.delete("/:id", requireAuth, destroySubject);

// Attendance Router
export const attendanceRouter = Router();
attendanceRouter.get("/", requireAuth, listAttendanceClasses);
attendanceRouter.get("/create", requireAuth, createAttendanceSheet);
attendanceRouter.post("/", requireAuth, storeAttendance);
