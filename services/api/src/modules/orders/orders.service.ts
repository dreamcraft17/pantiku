import { OrderStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { prisma } from "../../config/db.js";
import { paymentsService } from "../payments/payments.service.js";

export const ordersService = {
  async create(input: { productId: string; quantity: number }, buyerId: string) {
    const product = await prisma.product.findFirst({ where: { id: input.productId, isPublic: true } });
    if (!product) throw new ApiError("Product not found", 404, "PRODUCT_NOT_FOUND");
    if (product.stock < input.quantity) throw new ApiError("Insufficient stock", 400, "INSUFFICIENT_STOCK");

    const totalAmount = Number(product.price) * input.quantity;
    const order = await prisma.order.create({
      data: {
        userId: buyerId,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: [
            {
              productId: input.productId,
              quantity: input.quantity,
              unitPrice: product.price,
              totalPrice: totalAmount
            }
          ]
        }
      },
      include: { items: true }
    });

    const payment = await paymentsService.attachPaymentToReference("ORDER", order.id, totalAmount, `Order payment for product ${product.name}`);

    return {
      orderId: order.id,
      paymentId: payment.paymentId,
      paymentUrl: payment.paymentUrl,
      status: OrderStatus.PENDING
    };
  }
};
