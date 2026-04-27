export type DonationStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type Donation = {
  id: string;
  campaignId: string;
  userId: string;
  amount: number;
  status: DonationStatus;
  paymentRef?: string | null;
  provider?: string | null;
  createdAt: string;
  updatedAt: string;
};
