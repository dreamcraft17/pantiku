import { Router } from "express";
import { requireAuth, requirePermission } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { canManageUsers } from "../../utils/permissions.js";
import { usersController } from "./users.controller.js";

const router = Router();

router.get("/", requireAuth, requirePermission(canManageUsers), asyncHandler(usersController.list));

export { router as usersRouter };
