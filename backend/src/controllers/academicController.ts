import { Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { delCache } from "../config/redis";

// --- STUDENTS / ADMISSIONS ---

export async function listStudents(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [students, total] = await prisma.$transaction([
      prisma.student.findMany({
        where: { schoolId },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          schoolClass: {
            select: { id: true, name: true, section: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count({ where: { schoolId } }),
    ]);

    // Format output to match Laravel paginator structure
    return res.json({
      data: students,
      current_page: page,
      per_page: limit,
      total,
      last_page: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("List students error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing students." });
  }
}

export async function createStudentData(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      select: { id: true, name: true, section: true },
    });

    return res.json(classes);
  } catch (err) {
    console.error("Get create student options error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error fetching classes." });
  }
}

export async function storeStudent(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const { name, email, password, class_id, roll_number, admission_date } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !class_id ||
      !roll_number ||
      !admission_date
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.$transaction(async (tx) => {
      // 1. Create User account for student
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "student",
          schoolId,
        },
      });

      // 2. Create Student details
      const studentRec = await tx.student.create({
        data: {
          userId: user.id,
          classId: class_id,
          rollNumber: roll_number,
          admissionDate: new Date(admission_date),
          schoolId,
        },
      });

      return studentRec;
    });

    // Invalidate dashboard stats cache
    await delCache(`dashboard:${schoolId}`);

    return res.status(201).json({
      message: "Student admitted successfully.",
      student,
    });
  } catch (err) {
    console.error("Admit student error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error admitting student." });
  }
}

// --- CLASSES ---

export async function listClasses(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      include: {
        _count: {
          select: { students: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Map to the Laravel UI expected output format
    const formatted = classes.map((c) => ({
      id: c.id,
      _id: c.id,
      name: c.name,
      section: c.section,
      room_number: c.roomNumber,
      students_count: c._count.students,
      created_at: c.createdAt,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("List classes error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing classes." });
  }
}

export async function storeClass(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const { name, section, room_number } = req.body;

    if (!name || !section) {
      return res
        .status(400)
        .json({ error: "Class name and section are required." });
    }

    const schoolClass = await prisma.schoolClass.create({
      data: {
        schoolId,
        name,
        section,
        roomNumber: room_number || null,
      },
    });

    // Invalidate dashboard stats cache
    await delCache(`dashboard:${schoolId}`);

    return res.status(201).json({
      message: "Class created successfully.",
      class: schoolClass,
    });
  } catch (err) {
    console.error("Create class error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error creating class." });
  }
}

export async function destroyClass(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const targetClass = await prisma.schoolClass.findUnique({
      where: { id },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    if (!targetClass || targetClass.schoolId !== schoolId) {
      return res.status(404).json({ error: "Class not found." });
    }

    if (targetClass._count.students > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete class with enrolled students." });
    }

    await prisma.schoolClass.delete({ where: { id } });

    // Invalidate dashboard stats cache
    await delCache(`dashboard:${schoolId}`);

    return res.json({ message: "Class deleted successfully." });
  } catch (err) {
    console.error("Delete class error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error deleting class." });
  }
}

// --- SUBJECTS ---

export async function listSubjects(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const subjects = await prisma.subject.findMany({
      where: { schoolId },
      include: {
        schoolClass: { select: { id: true, name: true, section: true } },
        teacher: { select: { id: true, name: true } },
      },
    });

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      select: { id: true, name: true, section: true },
    });

    const teachers = await prisma.user.findMany({
      where: {
        schoolId,
        role: { in: ["admin", "teacher", "faculty"] },
      },
      select: { id: true, name: true },
    });

    const formatted = subjects.map((s) => ({
      id: s.id,
      _id: s.id,
      name: s.name,
      code: s.code,
      school_class: s.schoolClass
        ? {
            id: s.schoolClass.id,
            _id: s.schoolClass.id,
            name: s.schoolClass.name,
            section: s.schoolClass.section,
          }
        : null,
      teacher: s.teacher
        ? {
            id: s.teacher.id,
            name: s.teacher.name,
          }
        : null,
    }));

    return res.json({
      subjects: formatted,
      classes,
      teachers,
    });
  } catch (err) {
    console.error("List subjects error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing subjects." });
  }
}

export async function storeSubject(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const { name, code, class_id, teacher_id } = req.body;

    if (!name || !code || !class_id || !teacher_id) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const subject = await prisma.subject.create({
      data: {
        schoolId,
        name,
        code,
        classId: class_id,
        teacherId: teacher_id,
      },
    });

    return res.status(201).json({
      message: "Subject created successfully.",
      subject,
    });
  } catch (err) {
    console.error("Create subject error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error creating subject." });
  }
}

export async function destroySubject(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject || subject.schoolId !== schoolId) {
      return res.status(404).json({ error: "Subject not found." });
    }

    await prisma.subject.delete({ where: { id } });

    return res.json({ message: "Subject deleted successfully." });
  } catch (err) {
    console.error("Delete subject error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error deleting subject." });
  }
}

// --- ATTENDANCE ---

export async function listAttendanceClasses(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      select: { id: true, name: true, section: true },
    });

    return res.json({ classes });
  } catch (err) {
    console.error("List attendance classes error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error fetching classes." });
  }
}

export async function createAttendanceSheet(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    const { class_id, date } = req.query;

    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });
    if (!class_id || !date) {
      return res.status(400).json({ error: "Class ID and Date are required." });
    }

    const classId = class_id as string;
    const parsedDate = new Date(date as string);
    parsedDate.setUTCHours(0, 0, 0, 0); // start of day

    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
    });

    if (!schoolClass || schoolClass.schoolId !== schoolId) {
      return res.status(404).json({ error: "Class not found." });
    }

    // Get all students enrolled in this class
    const students = await prisma.student.findMany({
      where: { schoolId, classId },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    // Fetch existing attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        schoolId,
        classId,
        date: parsedDate,
      },
    });

    // Convert to dictionary matching studentId to record
    const existingAttendance: Record<string, any> = {};
    attendanceRecords.forEach((r) => {
      existingAttendance[r.studentId] = {
        id: r.id,
        status: r.status,
        remarks: r.remarks,
      };
    });

    return res.json({
      class: schoolClass,
      date: date,
      students: students.map((s) => ({
        id: s.id,
        user: s.user,
      })),
      existingAttendance,
    });
  } catch (err) {
    console.error("Create attendance sheet error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error fetching attendance sheet." });
  }
}

export async function storeAttendance(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const { class_id, date, attendance } = req.body;

    if (!class_id || !date || !attendance || typeof attendance !== "object") {
      return res
        .status(400)
        .json({ error: "Class ID, date, and attendance map are required." });
    }

    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const absentNotificationsSent: string[] = [];

    // Loop over attendance status and upsert
    for (const [studentId, status] of Object.entries(attendance)) {
      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId,
            date: parsedDate,
          },
        },
        update: {
          status: status as string,
          classId: class_id,
        },
        create: {
          schoolId,
          classId: class_id,
          studentId,
          date: parsedDate,
          status: status as string,
        },
      });

      // Simulate sending notifications for absent students
      if (status === "absent") {
        const studentObj = await prisma.student.findUnique({
          where: { id: studentId },
          include: { user: true },
        });
        if (studentObj && studentObj.user) {
          console.log(
            `[ALERT] Absent Notification: Student ${studentObj.user.name} was marked absent on ${parsedDate.toDateString()}. Sending alert to parent email: ${studentObj.user.email}`,
          );
          absentNotificationsSent.push(studentObj.user.name);
        }
      }
    }

    return res.json({
      message: "Attendance updated successfully.",
      notifications: absentNotificationsSent,
    });
  } catch (err) {
    console.error("Store attendance error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error storing attendance." });
  }
}
