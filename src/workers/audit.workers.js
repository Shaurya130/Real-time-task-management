import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const auditWorker = new Worker(
  "auditQueue",
  async (job) => {
    const { userId, action, entityType, entityId, metadata } = job.data;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        metadata,
      },
    });

    logger.info("Audit job processed", { jobId: job.id });
  },
  {
    connection: {
      url: env.redisUrl,
    },
  }
);

auditWorker.on("failed", (job, err) => {
  logger.error("Audit job failed", { jobId: job.id, error: err.message });
});