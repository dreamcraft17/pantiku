import { Request, Response } from "express";
import { successResponse } from "../../utils/response.js";
import { prisma } from "../../config/db.js";

export const donationsController = {
  async myDonations(req: Request, res: Response) {
    const data = await prisma.donation.findMany({
      where: { userId: req.user!.userId },
      include: { campaign: { select: { title: true } } }
    });
    return successResponse(res, data, "Donations fetched");
  }
};
