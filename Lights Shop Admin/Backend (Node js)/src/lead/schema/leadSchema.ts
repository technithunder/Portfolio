import { z } from "zod";

export const LeadSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("").transform(() => undefined)), // Handle empty string as optional

  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Customer name is too long")
    .optional(),

  mobileNumber: z.string().optional(),

  type: z.string().min(1, "Type is required").optional(),

  requirement: z.string().optional(),
  summary: z.string().optional(),

  followUpDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),

  followUpTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      "Invalid time format (HH:mm or HH:mm:ss)"
    )
    .optional(),
});
export const UpdateLeadSchema = LeadSchema.partial();
