import { hashToken } from "../utils/tokenHash.js";
import { redis } from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";
import  jwt  from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];

    const tokenHash = hashToken(token);

    const blacklisted = await redis.get(`blacklist:${tokenHash}`);

    if (blacklisted) {
      throw new ApiError(401, "Token revoked");
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
};