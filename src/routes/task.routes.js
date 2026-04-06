import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
 import {requireRole} from "../middlewares/requireRole.js";  
import { validate } from "../middlewares/validate.middleware.js";

import { createTaskSchema,
   updateTaskSchema, 
   assignTaskSchema } 
   from "../validations/task.validation.js";   //invalid data never reaches controller

import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
  assignTask,
} from "../controllers/task.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";



const router = Router();

router.post("/", requireAuth, validate(createTaskSchema), createTask);
router.get("/", requireAuth, rateLimiter({ windowSize: 60, maxRequests: 50 }),getMyTasks);
router.patch("/:id", requireAuth, validate(updateTaskSchema), updateTask);
router.delete("/:id", requireAuth, deleteTask);

router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("ADMIN"),
  validate(assignTaskSchema),
  assignTask
);

export default router;
