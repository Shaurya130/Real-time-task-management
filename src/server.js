import "dotenv/config";
import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";
import { connectDB } from "./config/database.js";
import { prisma } from "./config/prisma.js";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
