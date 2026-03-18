import { ApiError } from "../utils/ApiError.js";

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new ApiError(403, "Access denied"));
    }

    next();
  };
};