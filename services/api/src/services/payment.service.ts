type CreatePaymentInput = {
  referenceType: "DONATION" | "ORDER";
  referenceId: string;
  amount: number;
};

type CreatePaymentResult = {
  provider: "MOCK";
  paymentRef: string;
  paymentUrl: string;
  status: "PENDING";
};

export class PaymentService {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentRef = `mock-${input.referenceType.toLowerCase()}-${input.referenceId}`;
    return {
      provider: "MOCK",
      paymentRef,
      paymentUrl: `https://example-payment.local/${paymentRef}`,
      status: "PENDING"
    };
  }
}
