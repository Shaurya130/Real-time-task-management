import winston from "winston";
import { env } from "../config/env.js";

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, requestId, ...meta }) => {
  return `${timestamp} [${level}] ${requestId || "no-req-id"} ${
    stack || message
  } ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

export const logger = winston.createLogger({
  level: env.nodeEnv === "production" ? "info" : "debug",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    env.nodeEnv === "production"
      ? json()
      : combine(colorize(), logFormat)
  ),
  transports: [new winston.transports.Console()],
});