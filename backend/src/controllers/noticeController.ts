import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { getCache, setCache, delCache } from "../config/redis";

export async function listNotices(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";

    // Define filters based on user role
    let audiences = ["all"];
    if (userRole === "faculty" || userRole === "teacher") {
      audiences.push("faculty");
    } else if (userRole === "student") {
      audiences.push("student");
    } else if (["owner", "admin", "principal"].includes(userRole)) {
      audiences.push("faculty", "student", "admin");
    }

    // Try fetching school notices from Cache
    const cacheKey = `notices:${schoolId}`;
    let notices = await getCache<any[]>(cacheKey);

    if (!notices) {
      notices = await prisma.notice.findMany({
        where: { schoolId },
        include: {
          createdBy: {
            select: { name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      // Store in cache for 1 hour (3600 seconds)
      await setCache(cacheKey, notices, 3600);
    }

    // Filter notices in-memory based on audience accessibility
    const filteredNotices = notices.filter((n) =>
      audiences.includes(n.targetAudience),
    );

    return res.json({ notices: filteredNotices });
  } catch (err: any) {
    console.error("List notices error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing notices." });
  }
}

export async function createNotice(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const userId = req.user?.id;
    if (!schoolId || !userId) {
      return res
        .status(400)
        .json({ error: "Active user and school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Managerial access required." });
    }

    const { title, content, targetAudience } = req.body;
    if (!title || !content || !targetAudience) {
      return res
        .status(400)
        .json({ error: "Title, content, and targetAudience are required." });
    }

    if (!["all", "faculty", "student", "admin"].includes(targetAudience)) {
      return res.status(400).json({ error: "Invalid targetAudience." });
    }

    const notice = await prisma.notice.create({
      data: {
        schoolId,
        title,
        content,
        targetAudience,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { name: true },
        },
      },
    });

    // Invalidate Notices Cache for this school
    await delCache(`notices:${schoolId}`);

    return res
      .status(201)
      .json({ notice, message: "Notice published successfully." });
  } catch (err: any) {
    console.error("Create notice error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error creating notice." });
  }
}
