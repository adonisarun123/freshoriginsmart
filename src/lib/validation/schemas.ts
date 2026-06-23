import { z } from "zod";

/** Server-side validation (spec §52) — never trust client input. */

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a valid 6-digit pincode");

export const cartItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
});

export const whatsappOrderSchema = z.object({
  cartId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email().optional().or(z.literal("")),
  pincode: pincodeSchema,
  addressLine: z.string().trim().max(300).optional(),
  note: z.string().trim().max(500).optional(),
});

export const enquirySchema = z.object({
  enquiryType: z.enum([
    "retail",
    "distributor",
    "apartment_community",
    "corporate_wellness",
    "professional",
    "wellness_centre",
    "general",
  ]),
  name: z.string().trim().min(1).max(120),
  organisation: z.string().trim().max(160).optional(),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/)
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email(),
  source: z.string().trim().max(80).optional(),
});

export const cartContactSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(120).optional(),
  marketingConsent: z.boolean(),
});

export type WhatsAppOrderInput = z.infer<typeof whatsappOrderSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
