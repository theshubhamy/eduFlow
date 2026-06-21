import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { Prisma } from "@prisma/client";

export async function listExams(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const { class_id } = req.query;

    const whereClause: Prisma.ExamWhereInput = { schoolId };
    if (class_id) {
      whereClause.classId = String(class_id);
    }

    const exams = await prisma.exam.findMany({
      where: whereClause,
      include: {
        schoolClass: { select: { id: true, name: true, section: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
      orderBy: { examDate: "desc" },
    });

    return res.json({ exams });
  } catch (err: any) {
    console.error("List exams error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing exams." });
  }
}

export async function createExam(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal", "hod", "faculty"].includes(userRole)) {
      return res.status(403).json({ error: "Unauthorized to schedule exams." });
    }

    const { name, classId, subjectId, examDate, maxMarks } = req.body;
    if (!name || !classId || !subjectId || !examDate || !maxMarks) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const exam = await prisma.exam.create({
      data: {
        schoolId,
        name,
        classId,
        subjectId,
        examDate: new Date(examDate),
        maxMarks: parseInt(maxMarks, 10),
      },
      include: {
        schoolClass: true,
        subject: true,
      },
    });

    return res
      .status(201)
      .json({ exam, message: "Exam scheduled successfully." });
  } catch (err: any) {
    console.error("Create exam error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error scheduling exam." });
  }
}

export async function listResults(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const { examId } = req.query;
    if (!examId) {
      return res.status(400).json({ error: "Exam ID is required." });
    }

    const exam = await prisma.exam.findFirst({
      where: { id: String(examId), schoolId },
      include: {
        schoolClass: true,
        subject: true,
      },
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found." });
    }

    // Load all students in the class
    const students = await prisma.student.findMany({
      where: { classId: exam.classId, schoolId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Load recorded results
    const results = await prisma.examResult.findMany({
      where: { examId: exam.id },
    });

    const resultsMap = new Map(results.map((r) => [r.studentId, r]));

    const studentsRoster = students.map((s) => {
      const record = resultsMap.get(s.id);
      return {
        studentId: s.id,
        name: s.user.name,
        rollNumber: s.rollNumber,
        marksObtained: record ? record.marksObtained.toNumber() : null,
        grade: record ? record.grade : null,
        remarks: record ? record.remarks : "",
        resultId: record ? record.id : null,
      };
    });

    return res.json({
      exam,
      roster: studentsRoster,
    });
  } catch (err: any) {
    console.error("List results error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error loading results roster." });
  }
}

export async function enterMarks(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal", "hod", "faculty"].includes(userRole)) {
      return res.status(403).json({ error: "Unauthorized to record grades." });
    }

    const { examId, marks } = req.body; // marks is an array of { studentId, marksObtained, remarks }
    if (!examId || !Array.isArray(marks)) {
      return res
        .status(400)
        .json({ error: "Exam ID and marks roster are required." });
    }

    const exam = await prisma.exam.findFirst({
      where: { id: examId, schoolId },
    });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found in this school." });
    }

    // Helper to calculate grade letter
    const calculateGrade = (score: number, max: number): string => {
      const pct = (score / max) * 100;
      if (pct >= 90) return "A";
      if (pct >= 80) return "B";
      if (pct >= 70) return "C";
      if (pct >= 60) return "D";
      return "F";
    };

    // Upsert all marks in a transaction
    await prisma.$transaction(
      marks.map(
        (m: { studentId: string; marksObtained: number; remarks?: string }) => {
          const score = Number(m.marksObtained);
          const gradeLetter = calculateGrade(score, exam.maxMarks);

          return prisma.examResult.upsert({
            where: {
              examId_studentId: {
                examId: exam.id,
                studentId: m.studentId,
              },
            },
            update: {
              marksObtained: score,
              grade: gradeLetter,
              remarks: m.remarks || null,
            },
            create: {
              examId: exam.id,
              studentId: m.studentId,
              marksObtained: score,
              grade: gradeLetter,
              remarks: m.remarks || null,
            },
          });
        },
      ),
    );

    return res.json({ message: "Marks roster saved successfully." });
  } catch (err: any) {
    console.error("Enter marks error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error saving marks." });
  }
}
