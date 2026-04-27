import { z } from "zod";

export const createChildSchema = z.object({
  displayCode: z.string().min(2),
  fullName: z.string().min(2),
  age: z.number().int().min(1).max(25),
  needsSummary: z.string().min(10)
});
