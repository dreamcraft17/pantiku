import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { childrenController } from "./children.controller.js";

const router = Router();

router.get("/orphanage/:id", asyncHandler(childrenController.listForOrphanage));

export { router as childrenRouter };
