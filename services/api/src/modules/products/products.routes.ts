import { Router } from "express";
import { requireAuth, requirePermission } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { canCreateProduct } from "../../utils/permissions.js";
import { productsController } from "./products.controller.js";
import { createProductSchema } from "./products.validation.js";

const router = Router();

router.get("/", asyncHandler(productsController.list));
router.get("/:id", asyncHandler(productsController.getById));
router.post("/", requireAuth, requirePermission(canCreateProduct), validateBody(createProductSchema), asyncHandler(productsController.create));

export { router as productsRouter };
