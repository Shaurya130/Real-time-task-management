import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { logger } from "../utils/logger.js";
import { dlqQueue } from "../queues/dlq.queue.js";

export const auditWorker = new Worker(
  "auditQueue",
  async (job) => {
    try {
      const {
        userId,
        action,
        entityType,
        entityId,
        metadata,
        requestId,
      } = job.data;

      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entityType,
          entityId,
          metadata,
        },
      });

      logger.info("Audit job processed", {
        requestId,
        jobId: job.id,
        entityType,
        entityId,
      });

    } catch (err) {
      logger.error("Audit worker processing failed", {
        requestId: job.data?.requestId,
        jobId: job.id,
        error: err.message,
        stack: err.stack,
      });

      throw err; // REQUIRED → enables retries
    }
  },
  {
    connection: redis, // shared Redis instance
    concurrency: 5,     // process multiple jobs in parallel
  }
);


auditWorker.on("completed", (job) => {
  logger.info("Audit job completed", {
    requestId: job.data?.requestId,
    jobId: job.id,
  });
});


auditWorker.on("failed", async (job, err) => {
  logger.error("Audit job failed", {
    requestId: job?.data?.requestId,
    jobId: job?.id,
    attemptsMade: job?.attemptsMade,
    error: err.message,
  });

  if (job.attemptsMade >= job.opts.attempts) {
    try {
      await dlqQueue.add("dead-audit-job", {
        originalJob: job.data,
        error: err.message,
        failedAt: new Date(),
      });

      logger.error("Audit job moved to DLQ", {
        jobId: job.id,
      });

    } catch (dlqErr) {
      logger.error("Failed to move job to DLQ", {
        jobId: job?.id,
        error: dlqErr.message,
      });
    }
  }
});



// Worker-level error (Redis / connection issues)
auditWorker.on("error", (err) => {
  logger.error("Audit worker error", {
    error: err.message,
    stack: err.stack,
  });
});