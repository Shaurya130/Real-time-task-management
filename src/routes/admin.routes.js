import express from "express";
import { getAuditLogs } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.middleware.js";
import { auditQuerySchema } from "../validations/audit.validation.js";

const router = express.Router();


/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Get audit logs (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs fetched successfully
 *       403:
 *         description: Forbidden
 */
router.get(
  "/audit-logs",
  requireAuth,
  requireRole("ADMIN"),
  validate(auditQuerySchema, "query"),
  getAuditLogs
);

export default router;