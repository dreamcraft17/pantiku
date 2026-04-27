import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { paymentsController } from "./payments.controller.js";

const router = Router();

router.get("/:paymentId/status", requireAuth, asyncHandler(paymentsController.getStatus));
router.post("/:paymentId/simulate-success", requireAuth, asyncHandler(paymentsController.simulateSuccess));
router.post("/:paymentId/simulate-failure", requireAuth, asyncHandler(paymentsController.simulateFailure));

export { router as paymentsRouter };
