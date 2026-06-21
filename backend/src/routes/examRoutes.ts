import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listExams,
  createExam,
  listResults,
  enterMarks,
} from "../controllers/examController";

const router = Router();

router.get("/", requireAuth, listExams);
router.post("/", requireAuth, createExam);
router.get("/results", requireAuth, listResults);
router.post("/marks", requireAuth, enterMarks);

export default router;
