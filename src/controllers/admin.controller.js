import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, userId, action, entityType } = req.query;

    if (!page || !limit) {
      throw new ApiError(400, "Pagination parameters missing");
    }

    const skip = (page - 1) * limit;

    const filters = {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(entityType && { entityType }),
    };

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where: filters }),
    ]);

    const responseData = {
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      logs,
    };

    return res
      .status(200)
      .json(new ApiResponse(responseData, "Audit logs fetched successfully"));

  } catch (err) {
    next(err);
  }
};