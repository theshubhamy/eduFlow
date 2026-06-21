import { Router } from "express";
import { requireAuth } from "../middleware/auth";
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
} from "../controllers/teamController";

const router = Router();

// Centralized team operations
router.post("/", requireAuth, createTeam);
router.patch("/:teamId", requireAuth, updateTeam);
router.delete("/:teamId", requireAuth, deleteTeam);
router.post("/:teamId/switch", requireAuth, switchTeam);
router.patch("/:teamId/members/:memberUserId", requireAuth, updateMemberRole);
router.delete("/:teamId/members/:memberUserId", requireAuth, removeMember);
router.post("/:teamId/invitations", requireAuth, inviteMember);
router.delete("/:teamId/invitations/:inviteCode", requireAuth, cancelInvitation);

// Helper routers for separate namespaces but same controller domain
export const invitationRouter = Router();
invitationRouter.post("/:inviteCode/accept", requireAuth, acceptInvitation);
invitationRouter.get("/:inviteCode/accept", requireAuth, acceptInvitation);

export const memberRouter = Router();
memberRouter.get("/", requireAuth, listMembers);

export default router;
