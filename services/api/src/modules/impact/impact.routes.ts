import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { impactController } from "./impact.controller.js";

const router = Router();

router.get("/summary", asyncHandler(impactController.summary));
router.get("/stories", asyncHandler(impactController.stories));
router.get("/orphanage/:id", asyncHandler(impactController.orphanage));

export { router as impactRouter };
