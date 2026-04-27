import { Request, Response } from "express";
import { childrenService } from "./children.service.js";
import { successResponse } from "../../utils/response.js";

export const childrenController = {
  async createForOrphanage(req: Request, res: Response) {
    const data = await childrenService.create(
      req.params.id,
      req.body,
      { userId: req.user!.userId, role: req.user!.role }
    );
    return successResponse(res, data, "Child profile created", undefined, 201);
  },

  async listForOrphanage(req: Request, res: Response) {
    const actor = req.user ? { userId: req.user.userId, role: req.user.role } : undefined;
    const data = await childrenService.listByOrphanage(req.params.id, actor);
    return successResponse(res, data, "Children fetched");
  }
};
