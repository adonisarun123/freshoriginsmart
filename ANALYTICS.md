# Analytics & structured data

What the site captures, where, and how to verify it.

## How tracking works

`track(event, { productId?, variantId?, properties? })` (src/lib/analytics/track.ts)
fires every event to **two** places, fire-and-forget, never throwing:

1. **First-party** → `POST /api/event` → `analytics_events` table in Supabase
   (session id is hashed; no raw PII). Powers the admin views.
2. **GA4** → `window.gtag('event', ...)` when the GA tag is loaded
   (`NEXT_PUBLIC_GA_MEASUREMENT_ID` set + deployed).

The `/api/event` route has an **allowlist** — an unknown event name is rejected
(400). Add new names there before firing them.

Two helper components for Server Components:
- `TrackView` — fires one event on mount (page/section views).
- `TrackedLink` — a Link that fires an event on click (e.g. select_item).

## Events captured

| Event | Fires when | Where |
| --- | --- | --- |
| `view_home` | homepage loads | `(storefront)/page.tsx` |
| `view_item` | product page loads | `products/[slug]/page.tsx` |
| `view_item_list` | shop list loads (incl. active filters) | `shop/page.tsx` |
| `view_category` | category page loads | `shop/[slug]/page.tsx` |
| `select_health_goal` | health-goal page loads | `health-goals/[slug]/page.tsx` |
| `select_item` | product card clicked | `components/commerce/ProductCard.tsx` |
| `add_to_cart` | Add to cart succeeds | `components/commerce/AddToCartButton.tsx` |
| `remove_from_cart` | cart line removed | `features/cart/CartLineControls.tsx` |
| `view_cart` | cart page loads with items | `cart/page.tsx` |
| `check_serviceability` | pincode checked (serviceable flag) | `features/cart/PincodeCheck.tsx` |
| `begin_whatsapp_order` | order form submitted | `features/cart/WhatsAppOrderForm.tsx` |
| `purchase` | order successfully created (value + order #) | `features/cart/WhatsAppOrderForm.tsx` |
| `submit_enquiry` | contact / B2B enquiry sent | `features/forms/{ContactForm,EnquiryForm}.tsx` |
| `newsletter_signup` | newsletter subscribed (source) | `features/forms/NewsletterForm.tsx` |
| `view_recipe` | recipe page loads | `recipes/[slug]/page.tsx` |

Reserved in the allowlist for later use: `search`, `click_related_product`,
`whatsapp_order_created`.

### Verify events
- **First-party:** Admin → the analytics-backed views, or query
  `select event_name, count(*) from analytics_events group by 1;` in Supabase.
- **GA4:** Reports → Realtime → trigger the action on the live site → watch the
  event appear. (Mark `purchase`, `add_to_cart`, `begin_whatsapp_order`,
  `submit_enquiry` as **conversions** in GA4 → Admin → Events.)

## Structured data (JSON-LD / schema.org)

Builders in `src/lib/seo/jsonld.ts`, rendered via `components/seo/JsonLd.tsx`.

| Schema | Pages |
| --- | --- |
| `Organization` | site-wide (layout) |
| `WebSite` + `SearchAction` | site-wide (layout) |
| `LocalBusiness` (Bangalore/Hosur) | site-wide (layout) |
| `Product` + `Offer` | product pages |
| `BreadcrumbList` | product pages |
| `ItemList` | shop, category, health-goal pages |
| `Recipe` | recipe pages |
| `Article` | learn/article pages |
| `FAQPage` | contact page (FAQ section) |

### Verify schema
Paste a deployed URL into Google's **Rich Results Test**
(https://search.google.com/test/rich-results) or the **Schema Markup Validator**
(https://validator.schema.org). Each should detect the types above with no errors.

## Adding a new event later
1. Add the name to `ALLOWED` in `src/app/api/event/route.ts`.
2. Fire it with `track("name", { properties })` (or `TrackView` / `TrackedLink`).
3. If it's a conversion, mark it as such in GA4.
