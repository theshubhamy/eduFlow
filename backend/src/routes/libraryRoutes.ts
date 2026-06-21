import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listBooks,
  createBook,
  listLoans,
  issueBook,
  returnBook,
} from "../controllers/libraryController";

const router = Router();

router.get("/books", requireAuth, listBooks);
router.post("/books", requireAuth, createBook);
router.get("/loans", requireAuth, listLoans);
router.post("/loans/issue", requireAuth, issueBook);
router.post("/loans/return", requireAuth, returnBook);

export default router;
