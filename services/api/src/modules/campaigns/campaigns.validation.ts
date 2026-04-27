import { z } from "zod";

export const createCampaignSchema = z.object({
  orphanageId: z.string().uuid(),
  title: z.string().min(5),
  description: z.string().min(20),
  goalAmount: z.number().positive(),
  isPublic: z.boolean().default(true)
});

export const donateCampaignSchema = z.object({
  amount: z.number().positive()
});
