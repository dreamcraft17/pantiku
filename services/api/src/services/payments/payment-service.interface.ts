import { CreatePaymentInput, CreatePaymentResult } from "./payment.types.js";

export interface PaymentService {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}
