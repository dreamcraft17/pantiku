import { Router } from "express";
import { requireAuth, requirePermission } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { canDonate } from "../../utils/permissions.js";
import { donationsController } from "./donations.controller.js";

const router = Router();
router.get("/me", requireAuth, requirePermission(canDonate), asyncHandler(donationsController.myDonations));

export { router as donationsRouter };
