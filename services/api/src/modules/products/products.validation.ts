import { z } from "zod";

export const createProductSchema = z.object({
  orphanageId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  isPublic: z.boolean().default(true)
});
