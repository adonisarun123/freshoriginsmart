/**
 * Hand-maintained database types (subset used by the app).
 * For a fully generated set, run:
 *   supabase gen types typescript --local > src/types/supabase.ts
 * and import from there instead.
 */

export type PublishStatus = "draft" | "active" | "archived";
export type NutritionStatus = "estimated" | "tested" | "approved";
export type HealthGoalStatus =
  | "published"
  | "coming_soon"
  | "hidden"
  | "under_review";
export type ProductType = "mix" | "millet" | "rice";
export type OrderSource = "whatsapp" | "web" | "admin" | "subscription";
export type OrderStatus =
  | "draft"
  | "whatsapp_pending"
  | "awaiting_confirmation"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus =
  | "not_required"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";
export type UserRole =
  | "customer"
  | "editor"
  | "nutrition_reviewer"
  | "operations"
  | "admin";
export type EnquiryType =
  | "retail"
  | "distributor"
  | "apartment_community"
  | "corporate_wellness"
  | "professional"
  | "wellness_centre"
  | "general";

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  weight_value: number | null;
  weight_unit: string | null;
  mrp_paise: number;
  selling_price_paise: number;
  active: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: unknown | null;
  product_type: ProductType;
  status: PublishStatus;
  featured: boolean;
  is_wheat_free: boolean;
  is_gluten_free: boolean;
  is_vegan: boolean;
  no_added_sugar: boolean;
  no_maida: boolean;
  preparation_time_minutes: number | null;
  storage_instructions: string | null;
  allergen_information: string | null;
  suitability_text: string | null;
  disclaimer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
}

export interface ProductWithVariants extends Product {
  product_variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: PublishStatus;
  sort_order: number;
}

export interface HealthGoal {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  status: HealthGoalStatus;
  icon: string | null;
  sort_order: number;
}

export interface Order {
  id: string;
  public_order_number: string;
  user_id: string | null;
  source: OrderSource;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  shipping_address: unknown | null;
  pincode: string | null;
  subtotal_paise: number;
  discount_paise: number;
  shipping_paise: number;
  total_paise: number;
  customer_note: string | null;
  admin_note: string | null;
  created_at: string;
  confirmed_at: string | null;
  fulfilled_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  variant_name: string | null;
  sku: string | null;
  quantity: number;
  unit_price_paise: number;
  total_price_paise: number;
}
