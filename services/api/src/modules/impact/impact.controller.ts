import { Request, Response } from "express";
import { successResponse } from "../../utils/response.js";
import { impactService } from "./impact.service.js";

export const impactController = {
  async summary(_req: Request, res: Response) {
    const data = await impactService.getImpactSummary();
    return successResponse(res, data, "Impact summary fetched");
  },

  async orphanage(req: Request, res: Response) {
    const data = await impactService.getOrphanageImpact(req.params.id);
    return successResponse(res, data, "Orphanage impact fetched");
  },

  async stories(_req: Request, res: Response) {
    const data = await impactService.getImpactStories();
    return successResponse(res, data, "Impact stories fetched");
  }
};
