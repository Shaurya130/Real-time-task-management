import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.accessExpiry,
    }
  );
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshExpiry,
  });
};
