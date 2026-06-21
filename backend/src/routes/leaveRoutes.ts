import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listLeaves,
  applyLeave,
  approveLeave,
} from "../controllers/leaveController";

const router = Router();

router.get("/", requireAuth, listLeaves);
router.post("/", requireAuth, applyLeave);
router.post("/approve", requireAuth, approveLeave);

export default router;
