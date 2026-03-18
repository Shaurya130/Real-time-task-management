import "dotenv/config";
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";
import { connectDB } from "./config/database.js";
import { prisma } from "./config/prisma.js";
import { logger } from "./utils/logger.js";


const startServer = async () => {
  try {
    await connectDB();
    // await connectRedis();

    const server = http.createServer(app);
    await initSocket(server);

    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });

  } catch (err) {
    logger.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});