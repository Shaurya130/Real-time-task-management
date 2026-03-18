import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),

  description: z
    .string()
    .max(500, "Description too long")
    .optional(),

  status: z
    .enum(["PENDING", "IN_PROGRESS", "DONE"])
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
});

export const assignTaskSchema = z.object({
  assigneeId: z.string().uuid("Invalid user ID format"),
});