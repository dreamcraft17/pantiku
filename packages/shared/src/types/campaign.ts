import type { CampaignStatus } from "../constants/campaign-status.js";

export type Campaign = {
  id: string;
  orphanageId: string;
  title: string;
  description: string;
  goalAmount: number;
  collectedAmount: number;
  status: CampaignStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};
