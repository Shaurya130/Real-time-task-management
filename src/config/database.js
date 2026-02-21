import { prisma } from "./prisma.js";

export const connectDB = async () => {
  try {
    // Lightweight health check
    await prisma.$queryRaw`SELECT 1`;
    console.log(" Prisma connected to PostgreSQL");
  } catch (error) {
    console.error(" Database connection failed", error);
    process.exit(1);
  }
};
