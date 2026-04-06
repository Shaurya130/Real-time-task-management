// middlewares/rateLimiter.js

import { redis } from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";

export const rateLimiter = ({
  windowSize = 60,   // seconds
  maxRequests = 100,
} = {}) => {

  return async (req, res, next) => {
    try {
      const identifier = req.user?.userId || req.ip;

      const key = `rate:${identifier}`;

      const current = await redis.get(key);

      if (current) {
        const count = parseInt(current);

        if (count >= maxRequests) {
          throw new ApiError(429, "Too many requests, please try again later");
        }

        // increment count
        await redis.incr(key);

      } else {
        // first request
        await redis.set(key, 1, "EX", windowSize);
      }

      next();

    } catch (err) {
      next(err);
    }
  };
};