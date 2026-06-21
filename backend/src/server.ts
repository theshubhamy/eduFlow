import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import apiRouter from "./routes";
import { globalErrorHandler } from "./middleware/error";
import { prisma } from "./config/db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      success: false,
      status: "unhealthy",
    });
  }
});

// Routes
app.use("/api", apiRouter);

// 404 Handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use(globalErrorHandler);

async function bootstrap() {
  try {
    // Connect to PostgreSQL
    await prisma.$connect();
    console.log("✅ Database connected");

    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port http://localhost${PORT} (${process.env.NODE_ENV || "development"})`,
      );
    });

    // Port errors
    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error("❌ Server error:", err);
      }
      process.exit(1);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down...`);

      try {
        await prisma.$disconnect();
        console.log("✅ Database disconnected");

        server.close(() => {
          console.log("✅ HTTP server closed");
          process.exit(0);
        });
      } catch (error) {
        console.error("❌ Shutdown error:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (reason) => {
      console.error("❌ Unhandled Rejection:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

bootstrap();
