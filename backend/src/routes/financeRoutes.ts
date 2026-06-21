import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listFees,
  createCategory,
  allocateFee,
  listPayments,
  collectPayment,
  downloadReceipt,
  exportPayments,
} from "../controllers/feeController";

// Fees Router
export const feeRouter = Router();
feeRouter.get("/", requireAuth, listFees);
feeRouter.post("/category", requireAuth, createCategory);
feeRouter.post("/allocate", requireAuth, allocateFee);

// Payments Router
export const paymentRouter = Router();
paymentRouter.get("/", requireAuth, listPayments);
paymentRouter.post("/collect", requireAuth, collectPayment);
paymentRouter.get("/:id/receipt", downloadReceipt);

// Finance Ledger Export Router
export const financeRouter = Router();
financeRouter.get("/export", requireAuth, exportPayments);
