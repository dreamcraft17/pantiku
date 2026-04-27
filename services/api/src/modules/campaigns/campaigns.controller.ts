import { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { successResponse } from "../../utils/response.js";
import { campaignsService } from "./campaigns.service.js";

export const campaignsController = {
  async list(req: Request, res: Response) {
    const includeDemo = req.query.includeDemo === "true";
    const data = await campaignsService.list(includeDemo);
    return successResponse(res, data, "Campaigns fetched");
  },

  async getById(req: Request, res: Response) {
    const includeDemo = req.query.includeDemo === "true";
    const data = await campaignsService.getById(req.params.id, includeDemo);
    if (!data) throw new ApiError("Campaign not found", 404, "CAMPAIGN_NOT_FOUND");
    return successResponse(res, data, "Campaign fetched");
  },

  async create(req: Request, res: Response) {
    const data = await campaignsService.create(req.body, { userId: req.user!.userId, role: req.user!.role });
    return successResponse(res, data, "Campaign created", undefined, 201);
  },

  async donate(req: Request, res: Response) {
    const data = await campaignsService.donate(req.params.id, req.user!.userId, req.body.amount);
    return successResponse(res, data, "Donation initiated", undefined, 201);
  }
};
