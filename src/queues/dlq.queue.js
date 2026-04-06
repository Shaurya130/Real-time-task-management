import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const dlqQueue = new Queue("dlqQueue", {
  connection: redis,
});