import { logger } from "../utils/logger.js";
import { prisma } from "./prisma.js";

export const connectDB = async () => {
  try {
    // Lightweight health check
    await prisma.$queryRaw`SELECT 1`;
    logger.info(" Prisma connected to PostgreSQL");
  } catch (error) {
    logger.error(" Database connection failed", error);
    process.exit(1);
  }
};
