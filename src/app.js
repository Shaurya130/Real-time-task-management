import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import authRoutes from "./routes/auth.routes.js";

// import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import "./auth/google.strategy.js";
import "./auth/github.strategy.js";
import protectedRoutes from "./routes/protected.routes.js"
import taskRoutes from "./routes/task.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";


import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middlewares/requestId.js";
import { requestLogger } from "./middlewares/requestLogger.js";



const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.corsOrigin];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);
app.use(express.json());

app.use(requestIdMiddleware);
app.use(requestLogger);

app.use(morgan("dev"));
app.use(passport.initialize());
app.disable("x-powered-by"); // Security best practice: hide Express signature


// app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);
app.use("/", healthRoutes);
app.use(errorHandler);

export default app;
