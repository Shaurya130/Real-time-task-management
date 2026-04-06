import { randomUUID } from "crypto";

export const requestIdMiddleware = (req, res, next) => {
  const requestId = randomUUID();

  req.id = requestId;

  res.setHeader("X-Request-Id", requestId);

  next();
};