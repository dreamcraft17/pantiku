import { PaymentProvider } from "./payment-provider.interface.js";
import { CreatePaymentInput, PaymentSession, PaymentStatus } from "./payment.types.js";

const paymentStatusStore = new Map<string, PaymentStatus>();

export class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<PaymentSession> {
    const paymentId = `mock_${input.referenceType.toLowerCase()}_${input.referenceId}_${Date.now()}`;
    paymentStatusStore.set(paymentId, "PENDING");

    return {
      paymentId,
      paymentUrl: `https://mock-pay.pantiku.local/${paymentId}`,
      status: "PENDING",
      provider: "MOCK"
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return paymentStatusStore.get(paymentId) ?? "PENDING";
  }

  async simulatePaymentSuccess(paymentId: string): Promise<PaymentStatus> {
    paymentStatusStore.set(paymentId, "PAID");
    return "PAID";
  }

  async simulatePaymentFailure(paymentId: string): Promise<PaymentStatus> {
    paymentStatusStore.set(paymentId, "FAILED");
    return "FAILED";
  }
}
