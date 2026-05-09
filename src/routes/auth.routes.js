import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { redis } from "../config/redis.js";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../config/rateLimit.js";
import { hashToken } from "../utils/tokenHash.js";

const router = Router();

router.use(authLimiter);


router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken({ userId: user.id });

      await redis.set(
        `refresh:${user.id}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
      );

      return res.status(200).json(
        new ApiResponse(
          { accessToken, refreshToken, user },
          "Google OAuth success"
        )
      );

    } catch (err) {
      next(err);
    }
  }
);


router.get( "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken({ userId: user.id });

      await redis.set(
        `refresh:${user.id}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
      );

      return res.status(200).json(
        new ApiResponse(
          { accessToken, refreshToken, user },
          "GitHub OAuth success"
        )
      );

    } catch (err) {
      next(err);
    }
  }
);


router.get("/failed", (req, res, next) => {
  next(new ApiError(401, "OAuth authentication failed"));
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token required");
    }

    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);

    const key = `refresh:${payload.userId}`;
    const storedToken = await redis.get(key);

    if (!storedToken || storedToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const newAccessToken = signAccessToken(user);

    return res.status(200).json(
      new ApiResponse(
        { accessToken: newAccessToken },
        "Access token refreshed"
      )
    );

  } catch (err) {
    next(new ApiError(401, "Refresh token expired or invalid"));
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", requireAuth, async (req, res) => {
  const refreshKey = `refresh:${req.user.userId}`;
  await redis.del(refreshKey);

  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const decoded = jwt.decode(token);

    const expiry = decoded.exp - Math.floor(Date.now() / 1000);

    if (expiry > 0) {
      const tokenHash = hashToken(token);

      await redis.set(`blacklist:${tokenHash}`, "1", "EX", expiry);
    }
  }

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;