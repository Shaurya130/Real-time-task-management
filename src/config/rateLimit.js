
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),

  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20,

  keyGenerator: (req) => {
  if (req.user?.userId) return `user:${req.user.userId}`;
  return `ip:${req.ip}`;
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
  }),

  windowMs: 15 * 60 * 1000,
  max: 100,

 keyGenerator: (req) => {
  if (req.user?.userId) return `user:${req.user.userId}`;
  return `ip:${req.ip}`;
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