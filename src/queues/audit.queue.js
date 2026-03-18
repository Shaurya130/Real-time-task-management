import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const auditQueue = new Queue("auditQueue", {
  connection: {
    url: env.redisUrl,
  },
});