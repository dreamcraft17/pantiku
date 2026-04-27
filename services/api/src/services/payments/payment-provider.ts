import { MockPaymentService } from "./mock-payment.service.js";
import { PaymentService } from "./payment-service.interface.js";

let instance: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!instance) {
    instance = new MockPaymentService();
  }
  return instance;
}
