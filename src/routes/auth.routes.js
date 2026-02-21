import { Router } from "express";
import passport from "passport";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { redis } from "../config/redis.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async(req, res) => {
    const user = req.user;

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    const refreshKey = `refresh:${user.id}`;

await redis.set(
  refreshKey,
  refreshToken,
  "EX",
  7 * 24 * 60 * 60 // 7 days
);

    res.json({
      success: true,
      message: "Google OAuth success",
      accessToken,
      refreshToken,
      user,
    });
  }
);


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async (req, res) => {
    const user = req.user;

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    const refreshKey = `refresh:${user.id}`;

await redis.set(
  refreshKey,
  refreshToken,
  "EX",
  7 * 24 * 60 * 60 // 7 days
);

    res.json({
      success: true,
      message: "GitHub OAuth success",
      accessToken,
      refreshToken,
      user,
    });
  }
);


router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "OAuth authentication failed",
  });
});

router.post("/refresh", async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError(401, "Refresh token required"));
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const key = `refresh:${payload.userId}`;
    const storedToken = await redis.get(key);

    if (!storedToken || storedToken !== refreshToken) {
      return next(new ApiError(401, "Invalid refresh token"));
    }

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch {
    next(new ApiError(401, "Refresh token expired"));
  }
});

router.post("/logout", requireAuth, async (req, res) => {
  const key = `refresh:${req.user.userId}`;
  await redis.del(key);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});


export default router;
