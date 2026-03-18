import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    try {
      const result = schema.parse(req[property]);

      // replace request data with sanitized data
      req[property] = result;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(400, "Validation failed", error.errors)
        );
      }

      next(error);
    }
  };
};