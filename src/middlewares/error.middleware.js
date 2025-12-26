import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (err.code === "P2002") {
      error = new ApiError(
        409,
        `Duplicate value for ${err.meta?.target?.join(", ")}`
      );
    }

    // Record not found
    else if (err.code === "P2025") {
      error = new ApiError(404, "Record not found");
    }
  }

  // pg (node-postgres) errors
  else if (err.code && err.code.startsWith("23")) {
    // 23505 → unique_violation
    if (err.code === "23505") {
      error = new ApiError(409, "Duplicate value violates unique constraint");
    }
    // 23503 → foreign_key_violation
    else if (err.code === "23503") {
      error = new ApiError(400, "Invalid foreign key reference");
    }
  }

  // Unknown / non-ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    error = new ApiError(statusCode, message);
  }

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
