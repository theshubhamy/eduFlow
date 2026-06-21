import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

export function globalErrorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Global Error Handler caught:", err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error.";

  return res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
