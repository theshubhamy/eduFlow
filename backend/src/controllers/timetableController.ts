import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { getCache, setCache, delCachePattern } from "../config/redis";

export async function listTimetable(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const { class_id } = req.query;

    const cacheKey = `timetable:${schoolId}:${class_id || "all"}`;
    let entries = await getCache<any[]>(cacheKey);

    if (!entries) {
      const whereClause: any = { schoolId };
      if (class_id) {
        whereClause.classId = String(class_id);
      }

      entries = await prisma.timetableEntry.findMany({
        where: whereClause,
        include: {
          schoolClass: { select: { id: true, name: true, section: true } },
          subject: { select: { id: true, name: true, code: true } },
          teacher: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      // Cache for 1 hour
      await setCache(cacheKey, entries, 3600);
    }

    return res.json({ entries });
  } catch (err: any) {
    console.error("List timetable error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing timetable." });
  }
}

export async function createTimetableEntry(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Managerial access required." });
    }

    const {
      classId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      room,
    } = req.body;
    if (!classId || !subjectId || !dayOfWeek || !startTime || !endTime) {
      return res
        .status(400)
        .json({
          error: "Class, Subject, Day, Start Time, and End Time are required.",
        });
    }

    const dayNum = parseInt(dayOfWeek, 10);
    if (dayNum < 1 || dayNum > 7) {
      return res
        .status(400)
        .json({ error: "Day of week must be between 1 (Mon) and 7 (Sun)." });
    }

    // 1. Conflict Check: Teacher overlap
    if (teacherId) {
      const teacherConflict = await prisma.timetableEntry.findFirst({
        where: {
          schoolId,
          teacherId,
          dayOfWeek: dayNum,
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { gt: startTime },
            },
            {
              startTime: { lt: endTime },
              endTime: { gte: endTime },
            },
            {
              startTime: { gte: startTime },
              endTime: { lte: endTime },
            },
          ],
        },
        include: {
          schoolClass: { select: { name: true, section: true } },
        },
      });

      if (teacherConflict) {
        return res.status(400).json({
          error: `Teacher conflict: Teacher is already assigned to Class ${teacherConflict.schoolClass.name} (${teacherConflict.schoolClass.section}) at this time.`,
        });
      }
    }

    // 2. Conflict Check: Room / Classroom overlap
    if (room) {
      const roomConflict = await prisma.timetableEntry.findFirst({
        where: {
          schoolId,
          room,
          dayOfWeek: dayNum,
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { gt: startTime },
            },
            {
              startTime: { lt: endTime },
              endTime: { gte: endTime },
            },
            {
              startTime: { gte: startTime },
              endTime: { lte: endTime },
            },
          ],
        },
        include: {
          schoolClass: { select: { name: true, section: true } },
        },
      });

      if (roomConflict) {
        return res.status(400).json({
          error: `Room conflict: Room ${room} is already booked by Class ${roomConflict.schoolClass.name} (${roomConflict.schoolClass.section}) at this time.`,
        });
      }
    }

    // Create entry
    const entry = await prisma.timetableEntry.create({
      data: {
        schoolId,
        classId,
        subjectId,
        teacherId: teacherId || null,
        dayOfWeek: dayNum,
        startTime,
        endTime,
        room: room || null,
      },
      include: {
        schoolClass: true,
        subject: true,
        teacher: { select: { name: true } },
      },
    });

    // Invalidate all cached timetables for this school
    await delCachePattern(`timetable:${schoolId}:*`);

    return res
      .status(201)
      .json({ entry, message: "Timetable entry scheduled successfully." });
  } catch (err: any) {
    console.error("Create timetable entry error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error scheduling timetable entry." });
  }
}

export async function deleteTimetableEntry(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Managerial access required." });
    }

    const { id } = req.params;

    const entry = await prisma.timetableEntry.findFirst({
      where: { id, schoolId },
    });

    if (!entry) {
      return res.status(404).json({ error: "Timetable entry not found." });
    }

    await prisma.timetableEntry.delete({
      where: { id },
    });

    // Invalidate all cached timetables for this school
    await delCachePattern(`timetable:${schoolId}:*`);

    return res.json({ message: "Timetable entry deleted successfully." });
  } catch (err: any) {
    console.error("Delete timetable entry error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error deleting timetable entry." });
  }
}
