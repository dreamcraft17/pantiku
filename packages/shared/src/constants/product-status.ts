export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "SOLD_OUT", "ARCHIVED"] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
