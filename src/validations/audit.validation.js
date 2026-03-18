import { z } from "zod";

export const auditQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),  //coerce to number and set default
  limit: z.coerce.number().min(1).max(100).default(10),     //coerce to number and set default
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
});