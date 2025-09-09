import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.number().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
  ledcolors: z.string().optional(),
  bodycolors: z.string().optional(),
  watts: z.string().optional(),
  reflectors: z.string().optional(),
});

const orderSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  orderItems: z.array(orderItemSchema).min(1, "At least one order item is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  orderPayment: z.string().optional(),
  customerName: z.string().optional(),
  totalAmount: z.number().min(0, "Total amount must be non-negative"),
  totalItems: z.number().min(1, "Total items must be at least 1"),
});

export default orderSchema;

export const UpdateOrderSchema = orderSchema.partial();