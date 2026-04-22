import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "auth:", // 👈 unique namespace
  }),

  windowMs: 15 * 60 * 1000,
  max: 20,

  keyGenerator: (req) => {
    if (req.user?.userId) return `user:${req.user.userId}`;
    return `ip:${ipKeyGenerator(req)}`;
  },

  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many auth attempts. Please try again later.",
    },
  },

  standardHeaders: true,
  legacyHeaders: false,
});


export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "api:",
  }),

  windowMs: 15 * 60 * 1000,
  max: 100,

  keyGenerator: (req) => {
    if (req.user?.userId) return `user:${req.user.userId}`;
    return `ip:${ipKeyGenerator(req)}`;
  },

  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "API rate limit exceeded.",
    },
  },

  standardHeaders: true,
  legacyHeaders: false,
});