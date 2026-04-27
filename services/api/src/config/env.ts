import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  LOCAL_STORAGE_PATH: z.string().default("storage"),
  DEMO_MODE: z
    .string()
    .optional()
    .transform((value) => value === "true")
    .pipe(z.boolean().default(false))
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  // Never enable demo behavior by default in production.
  DEMO_MODE: parsedEnv.NODE_ENV === "production" ? false : parsedEnv.DEMO_MODE,
} as const;
