import { auditQueue } from "../queues/audit.queue.js";

export const logAuditEvent = async (payload) => {
  await auditQueue.add("logAudit", payload, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
};