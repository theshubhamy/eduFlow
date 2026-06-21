import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  deleteAccount,
  updatePassword,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.patch("/profile", requireAuth, updateProfile);
router.delete("/profile", requireAuth, deleteAccount);
router.put("/password", requireAuth, updatePassword);

export default router;
