import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function listLeaves(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const userId = req.user?.id;
    if (!schoolId || !userId) {
      return res
        .status(400)
        .json({ error: "Active user and school context required." });
    }

    const userRole = req.user?.role || "member";
    const isManager = ["owner", "admin", "principal"].includes(userRole);

    // If manager, fetch all. Else, fetch only current user's leaves.
    const whereClause: any = { schoolId };
    if (!isManager) {
      whereClause.userId = userId;
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true, role: true } },
        approvedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ leaves, isManager });
  } catch (err: any) {
    console.error("List leaves error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing leaves." });
  }
}

export async function applyLeave(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const userId = req.user?.id;
    if (!schoolId || !userId) {
      return res
        .status(400)
        .json({ error: "Active user and school context required." });
    }

    const { type, startDate, endDate, reason } = req.body;
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!["sick", "casual", "annual", "unpaid"].includes(type)) {
      return res.status(400).json({ error: "Invalid leave type." });
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        schoolId,
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "pending",
      },
    });

    return res
      .status(201)
      .json({ leave, message: "Leave request submitted successfully." });
  } catch (err: any) {
    console.error("Apply leave error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error submitting leave." });
  }
}

export async function approveLeave(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const approverId = req.user?.id;
    if (!schoolId || !approverId) {
      return res
        .status(400)
        .json({ error: "Active user and school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. HR or administrative access required." });
    }

    const { leaveId, status } = req.body;
    if (!leaveId || !status) {
      return res
        .status(400)
        .json({ error: "Leave ID and Status are required." });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value. Must be 'approved' or 'rejected'.",
      });
    }

    const leaveRequest = await prisma.leaveRequest.findFirst({
      where: { id: leaveId, schoolId },
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status,
        approvedById: approverId,
      },
      include: {
        user: { select: { name: true } },
        approvedBy: { select: { name: true } },
      },
    });

    return res.json({
      leave: updatedLeave,
      message: `Leave request status updated to ${status}.`,
    });
  } catch (err: any) {
    console.error("Approve leave error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error updating leave status." });
  }
}
