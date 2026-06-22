export const site = {
  name: "Fresh Origins",
  domain: "www.freshoriginsmart.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.freshoriginsmart.com",
  positioning: "Traditional foods, thoughtfully sourced for healthier everyday living.",
  description:
    "Purposeful millet blends, traditional rice varieties, and ready-to-cook staples — thoughtfully sourced and made practical for modern Indian kitchens. Delivering across Bangalore and Hosur.",
  announcement:
    "Delivering across Bangalore and Hosur · Order online or complete your purchase on WhatsApp",
  serviceCities: ["Bangalore", "Hosur"],
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  features: {
    onlineCheckout: process.env.NEXT_PUBLIC_FEATURE_ONLINE_CHECKOUT === "true",
  },
} as const;

export type Site = typeof site;
