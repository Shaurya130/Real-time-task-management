import { apiLimiter } from "../config/rateLimit.js";

app.use("/api", apiLimiter);