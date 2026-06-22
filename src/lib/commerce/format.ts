/** Currency + pricing helpers. All money is stored as integer paise. */

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

export function discountPercent(mrpPaise: number, sellingPaise: number): number {
  if (mrpPaise <= 0 || sellingPaise >= mrpPaise) return 0;
  return Math.round(((mrpPaise - sellingPaise) / mrpPaise) * 100);
}

export interface CartLine {
  unit_price_paise: number;
  quantity: number;
}

export function cartSubtotalPaise(lines: CartLine[]): number {
  return lines.reduce(
    (sum, l) => sum + l.unit_price_paise * l.quantity,
    0,
  );
}
