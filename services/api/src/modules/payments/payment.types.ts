export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type PaymentReferenceType = "DONATION" | "ORDER";

export type CreatePaymentInput = {
  referenceType: PaymentReferenceType;
  referenceId: string;
  amount: number;
  currency: "IDR";
  description?: string;
};

export type PaymentSession = {
  paymentId: string;
  paymentUrl: string;
  status: PaymentStatus;
  provider: "MOCK";
};

export type PaymentStatusResult = {
  paymentId: string;
  status: PaymentStatus;
  referenceType: PaymentReferenceType;
  referenceId: string;
};
