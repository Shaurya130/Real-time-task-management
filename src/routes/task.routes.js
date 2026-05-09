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

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete backend deployment
 *               description:
 *                 type: string
 *                 example: Setup Swagger and CI/CD
 *               priority:
 *                 type: string
 *                 example: HIGH
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth, validate(createTaskSchema), createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks for logged in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, rateLimiter({ windowSize: 60, maxRequests: 50 }),getMyTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id", requireAuth, validate(updateTaskSchema), updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", requireAuth, deleteTask);

/**
 * @swagger
 * /tasks/{id}/assign:
 *   patch:
 *     summary: Assign task to user (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("ADMIN"),
  validate(assignTaskSchema),
  assignTask
);

export default router;
