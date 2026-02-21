import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
