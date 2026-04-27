import { z } from "zod";

export const createOrphanageSchema = z.object({
  name: z.string().min(2),
  publicAlias: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  province: z.string().min(2).optional(),
  contactPhone: z.string().min(6).optional(),
  estimatedChildrenCount: z.number().int().positive().optional()
});

export const updateOrphanageSchema = createOrphanageSchema.partial();
