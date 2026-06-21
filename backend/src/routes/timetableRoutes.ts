import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listTimetable,
  createTimetableEntry,
  deleteTimetableEntry,
} from "../controllers/timetableController";

const router = Router();

router.get("/", requireAuth, listTimetable);
router.post("/", requireAuth, createTimetableEntry);
router.delete("/:id", requireAuth, deleteTimetableEntry);

export default router;
