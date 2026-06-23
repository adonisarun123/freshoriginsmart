/**
 * Resolves a product's stored image reference to a full, loadable URL.
 *
 * In the DB we store a bucket-relative path (e.g. "khichdi.png") so the
 * project ref isn't baked into the data. Here we turn it into the public
 * Storage URL using NEXT_PUBLIC_SUPABASE_URL. A value that already looks like a
 * full URL (http/https) or a site-relative path (/...) is returned unchanged,
 * so you can also point at an external CDN or a /public asset if you ever want.
 *
 * Returns null when there's no image or no Supabase URL configured — callers
 * fall back to the brand SVG illustration in that case.
 */
const BUCKET = "product-images";

export function resolveProductImageUrl(
  imageRef: string | null | undefined,
): string | null {
  if (!imageRef) return null;
  const ref = imageRef.trim();
  if (!ref) return null;

  // Already a full URL or a site-relative path — use as-is.
  if (/^https?:\/\//i.test(ref) || ref.startsWith("/")) return ref;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  const path = ref.replace(/^\/+/, "");
  return `${base.replace(/\/+$/, "")}/storage/v1/object/public/${BUCKET}/${path}`;
}
