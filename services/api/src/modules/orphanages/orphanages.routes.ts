import { Router } from "express";
import { requireAuth, requirePermission } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { childrenController } from "../children/children.controller.js";
import { createChildSchema } from "../children/children.validation.js";
import { canManageOrphanage, canManageUsers } from "../../utils/permissions.js";
import { orphanagesController } from "./orphanages.controller.js";
import { createOrphanageSchema, updateOrphanageSchema } from "./orphanages.validation.js";

const router = Router();

router.get("/", asyncHandler(orphanagesController.list));
router.get("/me", requireAuth, requirePermission(canManageOrphanage), asyncHandler(orphanagesController.me));
router.get("/:id", asyncHandler(orphanagesController.getById));
router.post("/", requireAuth, requirePermission(canManageOrphanage), validateBody(createOrphanageSchema), asyncHandler(orphanagesController.create));
router.put("/me", requireAuth, requirePermission(canManageOrphanage), validateBody(updateOrphanageSchema), asyncHandler(orphanagesController.updateMe));
router.put("/:id", requireAuth, requirePermission(canManageOrphanage), validateBody(updateOrphanageSchema), asyncHandler(orphanagesController.update));
router.patch("/:id/verify", requireAuth, requirePermission(canManageUsers), asyncHandler(orphanagesController.verify));
router.patch("/:id/reject", requireAuth, requirePermission(canManageUsers), asyncHandler(orphanagesController.reject));
router.post("/:id/children", requireAuth, requirePermission(canManageOrphanage), validateBody(createChildSchema), asyncHandler(childrenController.createForOrphanage));
router.get("/:id/children", asyncHandler(childrenController.listForOrphanage));

export { router as orphanagesRouter };
