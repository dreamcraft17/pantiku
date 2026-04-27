import { Router } from "express";
import { requireAuth, requirePermission } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { canCreateOrder } from "../../utils/permissions.js";
import { ordersController } from "./orders.controller.js";
import { createOrderSchema } from "./orders.validation.js";

const router = Router();
router.post("/", requireAuth, requirePermission(canCreateOrder), validateBody(createOrderSchema), asyncHandler(ordersController.create));

export { router as ordersRouter };
