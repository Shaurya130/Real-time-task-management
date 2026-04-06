import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";

export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is alive",
    timestamp: new Date().toISOString(),
  });
};

export const readinessCheck = async (req, res) => {
  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    await redis.ping();

    res.status(200).json({
      success: true,
      message: "System is ready",
      services: {
        database: "up",
        redis: "up",
      },
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    res.status(503).json({
      success: false,
      message: "System not ready",
      error: err.message,
    });
  }
};