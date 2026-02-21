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



const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

// app.use("/api", routes);

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;
