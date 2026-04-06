import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const auditQueue = new Queue("auditQueue", {
  connection: {
    url: env.redisUrl,
  },
  defaultJobOptions:{
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000
  },
  removeOnComplete: true,
  removeOnFail: false,  
}
});