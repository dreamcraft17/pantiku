export type PaymentReferenceType = "DONATION" | "ORDER";

export type CreatePaymentInput = {
  referenceType: PaymentReferenceType;
  referenceId: string;
  amount: number;
  currency: "IDR";
  description?: string;
};

export type CreatePaymentResult = {
  provider: string;
  paymentRef: string;
  paymentUrl: string;
  status: "PENDING";
};
