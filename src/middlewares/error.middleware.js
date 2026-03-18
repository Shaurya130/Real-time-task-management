import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 🔎 Central logging
  logger.error("Request Error", {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  // 🔵 Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      error = new ApiError(
        409,
        `Duplicate value for ${err.meta?.target?.join(", ")}`
      );
    } else if (err.code === "P2025") {
      error = new ApiError(404, "Record not found");
    }
  }

  // 🟣 PostgreSQL Errors
  else if (err.code && err.code.startsWith("23")) {
    if (err.code === "23505") {
      error = new ApiError(409, "Duplicate value violates unique constraint");
    } else if (err.code === "23503") {
      error = new ApiError(400, "Invalid foreign key reference");
    }
  }

  // 🔴 Wrap Unknown Errors
  if (!(error instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    error = new ApiError(statusCode, message);
  }

  return res.status(error.statusCode).json({
    success: false,
    error: {
      code:
        error.statusCode === 400 && error.errors?.length
          ? "VALIDATION_ERROR"
          : error.statusCode === 500
          ? "INTERNAL_ERROR"
          : "REQUEST_ERROR",
      message: error.message,
      ...(error.errors?.length && { details: error.errors }),
      ...(env.nodeEnv === "development" && { stack: error.stack }),
    },
  });
};

export { errorHandler };