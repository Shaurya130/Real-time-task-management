import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch {
    next(new ApiError(401, "Token expired or invalid"));
  }
};
