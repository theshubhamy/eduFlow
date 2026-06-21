import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { getCache, setCache, delCache } from "../config/redis";

export async function listBooks(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const cacheKey = `library:books:${schoolId}`;
    let books = await getCache<any[]>(cacheKey);

    if (!books) {
      books = await prisma.book.findMany({
        where: { schoolId },
        orderBy: { title: "asc" },
      });
      // Cache for 1 hour
      await setCache(cacheKey, books, 3600);
    }

    return res.json({ books });
  } catch (err: any) {
    console.error("List books error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error listing books." });
  }
}

export async function createBook(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal", "hod", "faculty"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Staff credentials required." });
    }

    const { title, author, isbn, quantity } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required." });
    }

    const qty = parseInt(quantity, 10) || 1;

    const book = await prisma.book.create({
      data: {
        schoolId,
        title,
        author,
        isbn: isbn || null,
        quantity: qty,
        available: qty,
      },
    });

    // Invalidate books cache
    await delCache(`library:books:${schoolId}`);

    return res
      .status(201)
      .json({ book, message: "Book catalogued successfully." });
  } catch (err: any) {
    console.error("Create book error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error cataloguing book." });
  }
}

export async function listLoans(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const cacheKey = `library:loans:${schoolId}`;
    let loans = await getCache<any[]>(cacheKey);

    if (!loans) {
      loans = await prisma.bookLoan.findMany({
        where: {
          book: { schoolId },
        },
        include: {
          book: true,
          student: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { loanDate: "desc" },
      });
      // Cache for 5 minutes (loans change status live with return/due dates)
      await setCache(cacheKey, loans, 300);
    }

    return res.json({ loans });
  } catch (err: any) {
    console.error("List loans error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error fetching borrow logs." });
  }
}

export async function issueBook(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal", "hod", "faculty"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Staff credentials required." });
    }

    const { bookId, studentId } = req.body;
    if (!bookId || !studentId) {
      return res
        .status(400)
        .json({ error: "Book ID and Student ID are required." });
    }

    const book = await prisma.book.findFirst({
      where: { id: bookId, schoolId },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found in this school." });
    }

    if (book.available <= 0) {
      return res
        .status(400)
        .json({ error: "No copies of this book are currently available." });
    }

    // Start checkout transaction
    const loan = await prisma.$transaction(async (tx) => {
      // 1. Decrement available count
      await tx.book.update({
        where: { id: book.id },
        data: { available: book.available - 1 },
      });

      // 2. Create BookLoan
      return tx.bookLoan.create({
        data: {
          bookId: book.id,
          studentId,
          status: "issued",
        },
        include: {
          book: true,
        },
      });
    });

    // Invalidate book inventory and loans caches
    await delCache(`library:books:${schoolId}`);
    await delCache(`library:loans:${schoolId}`);

    return res.status(201).json({ loan, message: "Book issued successfully." });
  } catch (err: any) {
    console.error("Issue book error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error issuing book." });
  }
}

export async function returnBook(req: AuthRequest, res: Response) {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const userRole = req.user?.role || "member";
    if (!["owner", "admin", "principal", "hod", "faculty"].includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Unauthorized. Staff credentials required." });
    }

    const { loanId } = req.body;
    if (!loanId) {
      return res.status(400).json({ error: "Loan ID is required." });
    }

    const loan = await prisma.bookLoan.findFirst({
      where: { id: loanId, book: { schoolId } },
      include: { book: true },
    });

    if (!loan) {
      return res.status(404).json({ error: "Borrow record not found." });
    }

    if (loan.status === "returned") {
      return res.status(400).json({ error: "Book has already been returned." });
    }

    // Calculate fine: 14 days free. $1 per overdue day.
    const now = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysBorrowed = Math.floor(
      (now.getTime() - loan.loanDate.getTime()) / millisecondsPerDay,
    );

    let fine = 0;
    if (daysBorrowed > 14) {
      fine = daysBorrowed - 14;
    }

    // Save transaction
    const updatedLoan = await prisma.$transaction(async (tx) => {
      // 1. Increment available count
      await tx.book.update({
        where: { id: loan.bookId },
        data: { available: loan.book.available + 1 },
      });

      // 2. Set loan status
      return tx.bookLoan.update({
        where: { id: loan.id },
        data: {
          status: "returned",
          returnDate: now,
          fineAmount: fine,
        },
      });
    });

    // Invalidate book inventory and loans caches
    await delCache(`library:books:${schoolId}`);
    await delCache(`library:loans:${schoolId}`);

    return res.json({
      loan: updatedLoan,
      message: `Book returned. Overdue fine: $${fine.toFixed(2)}`,
    });
  } catch (err: any) {
    console.error("Return book error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error returning book." });
  }
}
