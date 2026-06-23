import Image from "next/image";
import {
  Illustration,
  productIllustration,
} from "@/components/brand/Illustration";
import { resolveProductImageUrl } from "@/lib/commerce/product-image";
import type { Product } from "@/types/database";

/**
 * Primary product visual. Renders the real packshot (object-contain on a cream
 * backdrop, so nothing is cropped) when the product has an image_url; otherwise
 * falls back to the brand SVG illustration. Always a square frame.
 *
 * `sizes` should reflect the rendered width at each breakpoint so next/image
 * serves an appropriately sized file (defaults suit a 3-up grid card).
 */
export function ProductImage({
  product,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 360px, 90vw",
}: {
  product: Pick<Product, "name" | "slug" | "image_url" | "product_type">;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const src = resolveProductImageUrl(product.image_url);

  if (!src) {
    return (
      <Illustration
        name={productIllustration(product)}
        className={`aspect-square ${className}`}
        title={product.name}
      />
    );
  }

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-card bg-fo-cream-50 ${className}`}
    >
      <Image
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
