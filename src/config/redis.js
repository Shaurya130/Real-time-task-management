import Redis from "ioredis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
  enableReadyCheck: true,

  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});


redis.on("connect", () => {
  logger.info("Redis connecting...");
});

redis.on("ready", () => {
  logger.info("Redis ready to use");
});

redis.on("error", (err) => {
  logger.error("Redis error", {
    message: err.message,
    stack: err.stack,
  });
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});


//  GRACEFUL SHUTDOWN
const shutdown = async () => {
  try {
    await redis.quit();
    logger.info("Redis connection closed");
  } catch (err) {
    logger.error("Error closing Redis", {
      message: err.message,
    });
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);