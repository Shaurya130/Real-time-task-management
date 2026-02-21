import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
  assignTask,
} from "../controllers/task.controller.js";
 import {requireRole} from "../middlewares/requireRole.js";  

const router = Router();

router.post("/", requireAuth, createTask);
router.get("/", requireAuth, getMyTasks);
router.patch("/:id", requireAuth, updateTask);
router.delete("/:id", requireAuth, deleteTask);

router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("ADMIN"),
  assignTask
);

export default router;
