import { CreatePaymentInput, PaymentSession, PaymentStatus } from "./payment.types.js";

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  simulatePaymentSuccess(paymentId: string): Promise<PaymentStatus>;
  simulatePaymentFailure(paymentId: string): Promise<PaymentStatus>;
}
