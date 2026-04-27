import { Request, Response } from "express";
import { successResponse } from "../../utils/response.js";
import { paymentsService } from "./payments.service.js";

export const paymentsController = {
  async getStatus(req: Request, res: Response) {
    const data = await paymentsService.getPaymentStatus(req.params.paymentId);
    return successResponse(res, data, "Payment status fetched");
  },

  async simulateSuccess(req: Request, res: Response) {
    const data = await paymentsService.simulateSuccess(req.params.paymentId);
    return successResponse(res, data, "Payment simulated as success");
  },

  async simulateFailure(req: Request, res: Response) {
    const data = await paymentsService.simulateFailure(req.params.paymentId);
    return successResponse(res, data, "Payment simulated as failure");
  }
};
