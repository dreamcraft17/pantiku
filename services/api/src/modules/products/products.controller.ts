import { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { successResponse } from "../../utils/response.js";
import { productsService } from "./products.service.js";

export const productsController = {
  async list(req: Request, res: Response) {
    const includeDemo = req.query.includeDemo === "true";
    const data = await productsService.list(includeDemo);
    return successResponse(res, data, "Products fetched");
  },

  async getById(req: Request, res: Response) {
    const includeDemo = req.query.includeDemo === "true";
    const data = await productsService.getById(req.params.id, includeDemo);
    if (!data) throw new ApiError("Product not found", 404, "PRODUCT_NOT_FOUND");
    return successResponse(res, data, "Product fetched");
  },

  async create(req: Request, res: Response) {
    const data = await productsService.create(req.body, { userId: req.user!.userId, role: req.user!.role });
    return successResponse(res, data, "Product created", undefined, 201);
  }
};
