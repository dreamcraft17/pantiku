import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { authController } from "./auth.controller.js";
import { clerkLoginSchema, googleLoginSchema, loginSchema, refreshSchema, registerSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validateBody(registerSchema), asyncHandler(authController.register));
router.post("/login", validateBody(loginSchema), asyncHandler(authController.login));
router.post("/google", validateBody(googleLoginSchema), asyncHandler(authController.google));
router.post("/clerk", validateBody(clerkLoginSchema), asyncHandler(authController.clerk));
router.post("/refresh", validateBody(refreshSchema), asyncHandler(authController.refresh));
router.post("/logout", validateBody(refreshSchema), asyncHandler(authController.logout));
router.get("/me", requireAuth, asyncHandler(authController.me));

export { router as authRouter };
