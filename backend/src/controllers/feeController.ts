import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { delCache } from "../config/redis";

export async function listFees(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const categories = await prisma.feeCategory.findMany({
      where: { schoolId },
    });

    const allocations = await prisma.feeAllocation.findMany({
      where: { schoolId },
      include: {
        feeCategory: true,
        schoolClass: { select: { id: true, name: true, section: true } },
        student: { include: { user: { select: { name: true } } } },
      },
    });

    return res.json({
      categories,
      allocations: allocations.map((a) => ({
        id: a.id,
        school_id: a.schoolId,
        fee_category: a.feeCategory,
        schoolClass: a.schoolClass,
        student: a.student
          ? {
              id: a.student.id,
              name: a.student.user.name,
            }
          : null,
        start_date: a.startDate,
        end_date: a.endDate,
      })),
    });
  } catch (err) {
    console.error("List fees error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing fees." });
  }
}

export async function createCategory(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const { name, amount, periodicity, description } = req.body;

    if (!name || amount === undefined || !periodicity) {
      return res
        .status(400)
        .json({ error: "Name, amount, and periodicity are required." });
    }

    const feeCategory = await prisma.feeCategory.create({
      data: {
        schoolId,
        name,
        amount: parseFloat(amount),
        periodicity,
        description: description || null,
      },
    });

    return res.status(201).json({
      message: "Fee category created successfully.",
      category: feeCategory,
    });
  } catch (err) {
    console.error("Create fee category error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error creating category." });
  }
}

export async function allocateFee(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const { fee_category_id, class_id, student_id, start_date, end_date } =
      req.body;

    if (!fee_category_id || !start_date || !end_date) {
      return res.status(400).json({
        error: "Fee Category ID, start date, and end date are required.",
      });
    }

    const allocation = await prisma.feeAllocation.create({
      data: {
        schoolId,
        feeCategoryId: fee_category_id,
        classId: class_id || null,
        studentId: student_id || null,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
      },
    });

    return res.status(201).json({
      message: "Fee allocated successfully.",
      allocation,
    });
  } catch (err) {
    console.error("Allocate fee error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error allocating fee." });
  }
}

export async function listPayments(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await prisma.$transaction([
      prisma.feePayment.findMany({
        where: { schoolId },
        include: {
          student: {
            include: {
              user: { select: { name: true } },
            },
          },
          feeAllocation: {
            include: {
              feeCategory: true,
            },
          },
        },
        orderBy: { paymentDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.feePayment.count({ where: { schoolId } }),
    ]);

    // Map output to match frontend structure
    const formatted = payments.map((p) => ({
      id: p.id,
      student: {
        id: p.student.id,
        user: { name: p.student.user.name },
      },
      fee_allocation: {
        id: p.feeAllocation.id,
        fee_category: p.feeAllocation.feeCategory,
      },
      amount_paid: p.amountPaid,
      payment_date: p.paymentDate,
      method: p.method,
      status: p.status,
      receipt_number: p.receiptNumber,
      period_identifier: p.periodIdentifier,
    }));

    return res.json({
      data: formatted,
      current_page: page,
      per_page: limit,
      total,
      last_page: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("List payments error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing payments." });
  }
}

export async function collectPayment(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId)
      return res.status(400).json({ error: "Active school required." });

    const {
      student_id,
      fee_allocation_id,
      amount_paid,
      method,
      period_identifier,
    } = req.body;

    if (
      !student_id ||
      !fee_allocation_id ||
      amount_paid === undefined ||
      !method ||
      !period_identifier
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const receiptNumber =
      "REC-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const payment = await prisma.feePayment.create({
      data: {
        schoolId,
        studentId: student_id,
        feeAllocationId: fee_allocation_id,
        amountPaid: parseFloat(amount_paid),
        method,
        status: "paid",
        periodIdentifier: period_identifier,
        receiptNumber,
      },
    });

    // Invalidate dashboard stats cache
    await delCache(`dashboard:${schoolId}`);

    return res.status(201).json({
      message: "Payment collected successfully.",
      payment,
    });
  } catch (err) {
    console.error("Collect payment error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error collecting payment." });
  }
}

export async function downloadReceipt(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const payment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
        feeAllocation: {
          include: {
            feeCategory: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found." });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${payment.receiptNumber}.pdf`,
    );

    doc.pipe(res);

    // Style and Design PDF
    doc
      .fillColor("#4f46e5")
      .fontSize(22)
      .text("eduFlow Academy", 50, 50)
      .fillColor("#1f2937")
      .fontSize(10)
      .text("Official Fee Payment Receipt", 50, 75);

    // Receipt header details
    doc
      .text(`Receipt Number: ${payment.receiptNumber}`, 350, 50, {
        align: "right",
      })
      .text(
        `Date: ${new Date(payment.paymentDate).toLocaleDateString()}`,
        350,
        65,
        { align: "right" },
      )
      .text(`Payment Mode: ${payment.method.toUpperCase()}`, 350, 80, {
        align: "right",
      });

    doc.moveDown(2);
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, 110)
      .lineTo(550, 110)
      .stroke();

    // Student Information
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bill To:", 50, 130)
      .font("Helvetica")
      .text(`Student Name: ${payment.student.user.name}`, 50, 150)
      .text(`Roll Number: ${payment.student.rollNumber}`, 50, 165);

    // Fee Allocation Info
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Fee Allocation Details:", 300, 130)
      .font("Helvetica")
      .text(`Category: ${payment.feeAllocation.feeCategory.name}`, 300, 150)
      .text(`Billing Period: ${payment.periodIdentifier}`, 300, 165);

    doc.moveDown(3);
    doc.strokeColor("#e5e7eb").moveTo(50, 200).lineTo(550, 200).stroke();

    // Table Header
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Description", 50, 220)
      .text("Billing Cycle", 250, 220)
      .text("Paid Amount", 450, 220, { align: "right" });

    doc.strokeColor("#d1d5db").moveTo(50, 235).lineTo(550, 235).stroke();

    // Table Content
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        `School Academic Fees - ${payment.feeAllocation.feeCategory.name}`,
        50,
        250,
      )
      .text(`${payment.periodIdentifier}`, 250, 250)
      .text(`$${payment.amountPaid}`, 450, 250, { align: "right" });

    doc.strokeColor("#e5e7eb").moveTo(50, 275).lineTo(550, 275).stroke();

    // Summary Total
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Total Paid:", 300, 305)
      .text(`$${payment.amountPaid}`, 450, 305, { align: "right" });

    // Footer signature
    doc
      .fontSize(8)
      .fillColor("#9ca3af")
      .text(
        "Thank you for your payment. This is an electronically generated receipt.",
        50,
        400,
        { align: "center" },
      );

    doc.end();
  } catch (err) {
    console.error("Download receipt error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error generating receipt PDF." });
  }
}

export async function exportPayments(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const format = req.query.format === "json" ? "json" : "csv";

    const payments = await prisma.feePayment.findMany({
      where: { schoolId },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
        feeAllocation: {
          include: {
            feeCategory: true,
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    if (format === "json") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="payments_export_${Date.now()}.json"`,
      );
      return res.json(
        payments.map((p) => ({
          receiptNumber: p.receiptNumber,
          studentName: p.student.user.name,
          feeCategory: p.feeAllocation.feeCategory.name,
          period: p.periodIdentifier,
          amount: p.amountPaid,
          method: p.method,
          status: p.status,
          date: p.paymentDate,
        })),
      );
    }

    // Default to CSV
    let csv =
      "Receipt Number,Student Name,Fee Category,Period,Amount,Method,Status,Date\n";
    payments.forEach((p) => {
      const studentName = `"${p.student.user.name.replace(/"/g, '""')}"`;
      const categoryName = `"${p.feeAllocation.feeCategory.name.replace(/"/g, '""')}"`;
      const period = `"${p.periodIdentifier.replace(/"/g, '""')}"`;
      csv += `${p.receiptNumber},${studentName},${categoryName},${period},${p.amountPaid},${p.method},${p.status},${p.paymentDate.toISOString()}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="payments_export_${Date.now()}.csv"`,
    );
    return res.status(200).send(csv);
  } catch (err) {
    console.error("Export payments error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error exporting financial ledger." });
  }
}
