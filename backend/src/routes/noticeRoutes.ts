import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listNotices, createNotice } from "../controllers/noticeController";

const router = Router();

router.get("/", requireAuth, listNotices);
router.post("/", requireAuth, createNotice);

export default router;
