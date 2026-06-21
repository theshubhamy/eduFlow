import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { getCache, setCache } from "../config/redis";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "Active school context required." });
    }

    const cacheKey = `dashboard:${schoolId}`;
    let cachedDashboard = await getCache<any>(cacheKey);

    if (!cachedDashboard) {
      const studentsCount = await prisma.student.count({
        where: { schoolId },
      });
      const classesCount = await prisma.schoolClass.count({
        where: { schoolId },
      });
      const subjectsCount = await prisma.subject.count({
        where: { schoolId },
      });

      const totalRevenueResult = await prisma.feePayment.aggregate({
        where: { schoolId },
        _sum: { amountPaid: true },
      });
      const revenueCollected =
        totalRevenueResult._sum.amountPaid?.toNumber() || 0;

      const recentPaymentsRaw = await prisma.feePayment.findMany({
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
        take: 5,
      });

      const recentPayments = recentPaymentsRaw.map((p) => ({
        id: p.id,
        studentName: p.student.user.name,
        amount: p.amountPaid,
        date: p.paymentDate,
        categoryName: p.feeAllocation.feeCategory.name,
      }));

      cachedDashboard = {
        stats: {
          studentsCount,
          classesCount,
          subjectsCount,
          revenueCollected,
        },
        recentPayments,
      };

      // Cache dashboard for 10 minutes
      await setCache(cacheKey, cachedDashboard, 600);
    }

    return res.json(cachedDashboard);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error fetching dashboard." });
  }
};
