import Redis from "ioredis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redis = new Redis({
  host: env.redisHost,
  port: env.redisPort,

  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error("Redis error", err);
});

redis.on("ready", () => {
  logger.info("Redis ready to use");
});