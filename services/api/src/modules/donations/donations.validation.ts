import { z } from "zod";

export const donateSchema = z.object({
  amount: z.number().positive()
});
