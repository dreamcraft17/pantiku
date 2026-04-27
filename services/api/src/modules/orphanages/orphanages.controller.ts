import { Request, Response } from "express";
import { orphanagesService } from "./orphanages.service.js";
import { successResponse } from "../../utils/response.js";
import { ApiError } from "../../utils/api-error.js";

function actor(req: Request) {
  return req.user ? { userId: req.user.userId, role: req.user.role } : undefined;
}

export const orphanagesController = {
  async list(req: Request, res: Response) {
    const data = await orphanagesService.list(actor(req));
    return successResponse(res, data, "Orphanages fetched");
  },

  async getById(req: Request, res: Response) {
    const data = await orphanagesService.getById(req.params.id, actor(req));
    if (!data) throw new ApiError("Orphanage not found", 404, "ORPHANAGE_NOT_FOUND");
    return successResponse(res, data, "Orphanage fetched");
  },

  async create(req: Request, res: Response) {
    const data = await orphanagesService.create(req.body, { userId: req.user!.userId, role: req.user!.role });
    return successResponse(res, data, "Orphanage created", undefined, 201);
  },

  async update(req: Request, res: Response) {
    const data = await orphanagesService.update(req.params.id, req.body, { userId: req.user!.userId, role: req.user!.role });
    return successResponse(res, data, "Orphanage updated");
  },

  async me(req: Request, res: Response) {
    const data = await orphanagesService.getMine({ userId: req.user!.userId, role: req.user!.role });
    return successResponse(res, data, "My orphanage fetched");
  },

  async updateMe(req: Request, res: Response) {
    const data = await orphanagesService.updateMine(req.body, { userId: req.user!.userId, role: req.user!.role });
    return successResponse(res, data, "My orphanage updated");
  },

  async verify(req: Request, res: Response) {
    const data = await orphanagesService.verify(req.params.id);
    return successResponse(res, data, "Orphanage verified");
  },

  async reject(req: Request, res: Response) {
    const data = await orphanagesService.reject(req.params.id);
    return successResponse(res, data, "Orphanage rejected");
  }
};
