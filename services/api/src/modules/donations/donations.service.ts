import { DonationStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { prisma } from "../../config/db.js";
import { paymentsService } from "../payments/payments.service.js";

export const donationsService = {
  async donate(campaignId: string, donorId: string, amount: number) {
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, isPublic: true, status: "ACTIVE" }
    });
    if (!campaign) throw new ApiError("Campaign not found", 404, "CAMPAIGN_NOT_FOUND");

    const donation = await prisma.donation.create({
      data: { campaignId, userId: donorId, amount, status: DonationStatus.PENDING }
    });

    const payment = await paymentsService.attachPaymentToReference("DONATION", donation.id, amount, `Donation for campaign ${campaign.title}`);

    const pendingDonation = await prisma.donation.findUnique({
      where: { id: donation.id },
      include: { campaign: { select: { title: true } } }
    });
    if (!pendingDonation) throw new ApiError("Donation not found", 404, "DONATION_NOT_FOUND");

    return {
      donationId: pendingDonation.id,
      paymentId: payment.paymentId,
      paymentUrl: payment.paymentUrl,
      status: DonationStatus.PENDING
    };
  }
};
