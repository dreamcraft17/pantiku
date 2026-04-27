import type { ProductStatus } from "../constants/product-status.js";

export type Product = {
  id: string;
  orphanageId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};
