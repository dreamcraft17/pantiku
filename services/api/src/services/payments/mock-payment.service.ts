import { PaymentService } from "./payment-service.interface.js";
import { CreatePaymentInput, CreatePaymentResult } from "./payment.types.js";

export class MockPaymentService implements PaymentService {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = `mock-${input.referenceType.toLowerCase()}-${input.referenceId}`;
    return {
      provider: "MOCK",
      paymentRef,
      paymentUrl: `https://mock-payments.pantiku.local/pay/${paymentRef}`,
      status: "PENDING"
    };
  }
}
