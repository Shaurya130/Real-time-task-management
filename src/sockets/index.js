import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let io;

export const initSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: env.corsOrigin || "*",
      credentials: true,
    },
  });

  // Redis clients for pub/sub
  const pubClient = createClient({
    url: env.redisUrl,
  });

  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  logger.info("Socket.IO Redis adapter connected");


  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, env.jwtAccessSecret);

      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, role } = socket.user;

    logger.info(`Socket connected: ${userId}`);

    socket.join(userId);

    if (role === "ADMIN") {
      socket.join("admins");
      logger.info(`Admin joined admin room: ${userId}`);
    }

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};