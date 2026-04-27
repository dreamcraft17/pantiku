import { ApiError } from "../../utils/api-error.js";
import { PaymentService } from "./payment-service.interface.js";
import { CreatePaymentInput, CreatePaymentResult } from "./payment.types.js";

export class XenditPaymentService implements PaymentService {
  async createPayment(_input: CreatePaymentInput): Promise<CreatePaymentResult> {
    throw new ApiError("Xendit integration is not implemented yet", 501, "PAYMENT_PROVIDER_NOT_IMPLEMENTED");
  }
}
