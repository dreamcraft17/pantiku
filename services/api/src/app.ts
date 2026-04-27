import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { orphanagesRouter } from "./modules/orphanages/orphanages.routes.js";
import { childrenRouter } from "./modules/children/children.routes.js";
import { campaignsRouter } from "./modules/campaigns/campaigns.routes.js";
import { donationsRouter } from "./modules/donations/donations.routes.js";
import { productsRouter } from "./modules/products/products.routes.js";
import { ordersRouter } from "./modules/orders/orders.routes.js";
import { impactRouter } from "./modules/impact/impact.routes.js";
import { paymentsRouter } from "./modules/payments/payments.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { prisma } from "./config/db.js";

const app = express();

app.use(helmet());
const allowedOrigins = new Set<string>([env.WEB_ORIGIN]);
if (env.NODE_ENV !== "production") {
  allowedOrigins.add("http://localhost:3000");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "pantiku-api",
    timestamp: new Date().toISOString(),
  })
);

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: "ok", database: "connected" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return res.status(500).json({
      status: "error",
      database: "disconnected",
      message,
    });
  }
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orphanages", orphanagesRouter);
app.use("/api/v1/children", childrenRouter);
app.use("/api/v1/campaigns", campaignsRouter);
app.use("/api/v1/donations", donationsRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/impact", impactRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
