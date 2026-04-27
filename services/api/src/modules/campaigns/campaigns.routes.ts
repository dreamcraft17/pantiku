import { Router } from "express";
import { requireAuth, requirePermission } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { canCreateCampaign, canDonate } from "../../utils/permissions.js";
import { campaignsController } from "./campaigns.controller.js";
import { createCampaignSchema, donateCampaignSchema } from "./campaigns.validation.js";

const router = Router();

router.get("/", asyncHandler(campaignsController.list));
router.get("/:id", asyncHandler(campaignsController.getById));
router.post("/", requireAuth, requirePermission(canCreateCampaign), validateBody(createCampaignSchema), asyncHandler(campaignsController.create));
router.post("/:id/donate", requireAuth, requirePermission(canDonate), validateBody(donateCampaignSchema), asyncHandler(campaignsController.donate));

export { router as campaignsRouter };
