import { DonationStatus, OrderStatus } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/api-error.js";
import { invalidateImpactCache } from "../impact/impact.service.js";
import { MockPaymentProvider } from "./mock-payment.provider.js";
import { CreatePaymentInput, PaymentReferenceType, PaymentStatusResult } from "./payment.types.js";

const paymentProvider = new MockPaymentProvider();

function mapDonationStatus(status: DonationStatus): "PENDING" | "PAID" | "FAILED" {
  if (status === DonationStatus.PAID) return "PAID";
  if (status === DonationStatus.FAILED) return "FAILED";
  return "PENDING";
}

function mapOrderStatus(status: OrderStatus): "PENDING" | "PAID" | "FAILED" {
  if (status === OrderStatus.PAID || status === OrderStatus.COMPLETED) return "PAID";
  if (status === OrderStatus.CANCELLED) return "FAILED";
  return "PENDING";
}

async function applyDonationSuccess(paymentId: string) {
  await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.findFirst({
      where: { paymentRef: paymentId },
      include: { campaign: { select: { id: true, orphanageId: true } } }
    });
    if (!donation) throw new ApiError("Payment not found", 404, "PAYMENT_NOT_FOUND");
    if (donation.status === DonationStatus.PAID) return;

    await tx.donation.update({
      where: { id: donation.id },
      data: { status: DonationStatus.PAID }
    });

    await tx.campaign.update({
      where: { id: donation.campaignId },
      data: { collectedAmount: { increment: donation.amount } }
    });

    await tx.impactMetric.create({
      data: {
        orphanageId: donation.campaign.orphanageId,
        campaignId: donation.campaignId,
        metricDate: new Date(),
        donationTotal: donation.amount,
        notes: "Demo payment success for donation"
      }
    });
  });
}

async function applyOrderSuccess(paymentId: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { paymentRef: paymentId },
      include: {
        items: { include: { product: { select: { id: true, orphanageId: true } } } }
      }
    });
    if (!order) throw new ApiError("Payment not found", 404, "PAYMENT_NOT_FOUND");
    if (order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED) return;

    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.PAID }
    });

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });

      await tx.impactMetric.create({
        data: {
          orphanageId: item.product.orphanageId,
          metricDate: new Date(),
          productRevenue: item.totalPrice,
          notes: "Demo payment success for order"
        }
      });
    }
  });
}

export const paymentsService = {
  async createPaymentSession(input: CreatePaymentInput) {
    return paymentProvider.createPayment(input);
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    const donation = await prisma.donation.findFirst({ where: { paymentRef: paymentId } });
    if (donation) {
      return {
        paymentId,
        status: mapDonationStatus(donation.status),
        referenceType: "DONATION",
        referenceId: donation.id
      };
    }

    const order = await prisma.order.findFirst({ where: { paymentRef: paymentId } });
    if (order) {
      return {
        paymentId,
        status: mapOrderStatus(order.status),
        referenceType: "ORDER",
        referenceId: order.id
      };
    }

    throw new ApiError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  },

  async simulateSuccess(paymentId: string): Promise<PaymentStatusResult> {
    if (!env.DEMO_MODE) throw new ApiError("Simulation is disabled", 403, "DEMO_MODE_DISABLED");

    const donation = await prisma.donation.findFirst({ where: { paymentRef: paymentId } });
    if (donation) {
      await paymentProvider.simulatePaymentSuccess(paymentId);
      await applyDonationSuccess(paymentId);
      await invalidateImpactCache();
      return this.getPaymentStatus(paymentId);
    }

    const order = await prisma.order.findFirst({ where: { paymentRef: paymentId } });
    if (order) {
      await paymentProvider.simulatePaymentSuccess(paymentId);
      await applyOrderSuccess(paymentId);
      await invalidateImpactCache();
      return this.getPaymentStatus(paymentId);
    }

    throw new ApiError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  },

  async simulateFailure(paymentId: string): Promise<PaymentStatusResult> {
    if (!env.DEMO_MODE) throw new ApiError("Simulation is disabled", 403, "DEMO_MODE_DISABLED");

    const donation = await prisma.donation.findFirst({ where: { paymentRef: paymentId } });
    if (donation) {
      await paymentProvider.simulatePaymentFailure(paymentId);
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: DonationStatus.FAILED }
      });
      return this.getPaymentStatus(paymentId);
    }

    const order = await prisma.order.findFirst({ where: { paymentRef: paymentId } });
    if (order) {
      await paymentProvider.simulatePaymentFailure(paymentId);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED }
      });
      return this.getPaymentStatus(paymentId);
    }

    throw new ApiError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  },

  async attachPaymentToReference(referenceType: PaymentReferenceType, referenceId: string, amount: number, description: string) {
    const payment = await this.createPaymentSession({
      referenceType,
      referenceId,
      amount,
      currency: "IDR",
      description
    });

    if (referenceType === "DONATION") {
      await prisma.donation.update({
        where: { id: referenceId },
        data: { paymentRef: payment.paymentId, provider: payment.provider }
      });
      return payment;
    }

    await prisma.order.update({
      where: { id: referenceId },
      data: { paymentRef: payment.paymentId, provider: payment.provider }
    });
    return payment;
  }
};
