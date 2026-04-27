export const CAMPAIGN_STATUSES = ["DRAFT", "ACTIVE", "FUNDED", "COMPLETED", "CANCELLED"] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
