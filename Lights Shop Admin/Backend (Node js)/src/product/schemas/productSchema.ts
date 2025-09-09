import { z } from 'zod';

const colorDiscountSchema = z.object({
  color: z.string(),
  discount: z.number().max(100)
});

const valueDiscountSchema = z.object({
  value: z.string(),
  discount: z.number().max(100)
});
const reflectorsDiscountSchema = z.object({
  color: z.string(),
  discount: z.number().max(100)
});
const wattDiscountSchema = z.object({
  value: z.number(),
  discount: z.number().max(100)
});

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  categoryId: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(1, 'Category is required'),
  ),
  productPrice: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(0, 'Product price must be non-negative'),
  ),
  discount: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(0, 'discount must be non-negative').max(100).optional(),
  ),
  discountPrice: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(0, 'discount price must be non-negative').optional(),
  ),
  productDescription: z.string().optional(),
  addedStock: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(0, 'Added stock must be non-negative'),
  ),
  openingStock: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().optional(),
  ),
  remainingStock: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().optional(),
  ),
  ledColors: z.array(colorDiscountSchema).optional(),
  bodyColors: z.array(colorDiscountSchema).optional(),
  watts: z.array(wattDiscountSchema).optional(),
  reflectors: z.array(reflectorsDiscountSchema).optional()
});

export default productSchema;

export const UpdateProductSchema = productSchema.partial();
