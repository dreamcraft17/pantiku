import { Request, Response } from "express";
import { successResponse } from "../../utils/response.js";
import { ordersService } from "./orders.service.js";

export const ordersController = {
  async create(req: Request, res: Response) {
    const data = await ordersService.create(req.body, req.user!.userId);
    return successResponse(res, data, "Order created", undefined, 201);
  }
};
