import { auditQueue } from "../queues/audit.queue.js";

export const logAuditEvent = async (payload, options = {}) => {
  try {
    await auditQueue.add(
      "logAudit",
      payload,
      {
        jobId: `audit:${payload.entityType}:${payload.entityId}:${Date.now()}`, //  unique job tracking
        ...options, // allow overrides if needed
      }
    );
  } catch (err) {
    console.error("Failed to enqueue audit log", {
      error: err.message,
      payload,
    });
  }
};