import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { logAuditEvent } from "../services/audit.service.js";
import { getIO } from "../sockets/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId: req.user.userId,
      },
    });

    await redis.del(`tasks:${req.user.userId}`);

    await logAuditEvent({
      userId: req.user.userId,
      action: "TASK_CREATED",
      entityType: "TASK",
      entityId: task.id,
      metadata: {
        title: task.title,
        status: task.status,
      },
    });

    const io = getIO();
    io.to(task.assigneeId).emit("task:created", task);
    io.to("admins").emit("task:created", task);

    return res
      .status(201)
      .json(new ApiResponse(task, "Task created successfully"));

  } catch (err) {
    next(err);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `tasks:${userId}`;

    const cached = await redis.get(cacheKey);

    //if cache hit, return cached data
    if (cached) {
      return res.json(
        new ApiResponse(JSON.parse(cached), "Tasks fetched from cache")
      );
    }

    // Fetch from DB
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: "desc" },
    });

    //Store in Redis with TTL
    await redis.set(cacheKey, JSON.stringify(tasks), "EX", 60);

    return res.json(
      new ApiResponse(tasks, "Tasks fetched from database")
    );

  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const isOwner = task.assigneeId === req.user.userId;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Forbidden");
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "No fields provided to update");
    }

    const oldTask = { ...task };

    const updated = await prisma.task.update({
      where: { id },
      data,
    });

    await redis.del(`tasks:${updated.assigneeId}`);

    await logAuditEvent({
      userId: req.user.userId,
      action: "TASK_UPDATED",
      entityType: "TASK",
      entityId: id,
      metadata: {
        before: {
          title: oldTask.title,
          status: oldTask.status,
        },
        after: {
          title: updated.title,
          status: updated.status,
        },
        adminOverride: isAdmin && !isOwner,
      },
    });

    const io = getIO();
    io.to(updated.assigneeId).emit("task:updated", updated);
    io.to("admins").emit("task:updated", updated);

    return res
      .status(200)
      .json(new ApiResponse(updated, "Task updated successfully"));

  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const isOwner = task.assigneeId === req.user.userId;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "Not allowed to delete this task");
    }

    await prisma.task.delete({ where: { id } });

    await redis.del(`tasks:${task.assigneeId}`);

    await logAuditEvent({
      userId: req.user.userId,
      action: "TASK_DELETED",
      entityType: "TASK",
      entityId: task.id,
    });

    const io = getIO();
    io.to(task.assigneeId).emit("task:deleted", id);
    io.to("admins").emit("task:deleted", id);

    return res
      .status(200)
      .json(new ApiResponse(null, "Task deleted successfully"));

  } catch (err) {
    next(err);
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const [user, task] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.task.findUnique({ where: { id } }),
    ]);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const oldAssignee = task.assigneeId;

    const updated = await prisma.task.update({
      where: { id },
      data: { assigneeId: userId },
    });

    await logAuditEvent({
      userId: req.user.userId,
      action: "TASK_ASSIGNED",
      entityType: "TASK",
      entityId: id,
      metadata: {
        assignedTo: userId,
        previousAssignee: oldAssignee,
        adminOverride: req.user.role === "ADMIN",
      },
    });

    const io = getIO();
    io.to(userId).emit("task:assigned", updated);
    io.to(oldAssignee).emit("task:unassigned", id);
    io.to("admins").emit("task:assigned", updated);

    return res
      .status(200)
      .json(new ApiResponse(updated, "Task assigned successfully"));

  } catch (err) {
    next(err);
  }
};
