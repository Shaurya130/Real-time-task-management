import { prisma } from "../config/prisma.js";

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

    res.status(201).json({
      success: true,
      task,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // allow only assignee to edit
    if (task.assigneeId !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const data = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (status !== undefined) data.status = status;

    const updated = await prisma.task.update({
    where: { id },
    data,
    });


    res.json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const isOwner = task.assigneeId === req.user.userId;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this task",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
  where: { id: userId },
});

if (!user) {
  return res.status(404).json({ success: false, message: "User not found" });
}


    const updated = await prisma.task.update({
      where: { id },
      data: { assigneeId: userId },
    });

    res.json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
};
