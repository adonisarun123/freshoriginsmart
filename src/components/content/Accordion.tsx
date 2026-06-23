/**
 * Native <details> accordion — works without JS, accessible, on-brand.
 * Used for cooking methods and FAQs on the product page.
 */
export function Accordion({
  items,
}: {
  items: { title: string; body: React.ReactNode }[];
}) {
  return (
    <div className="max-w-editorial">
      {items.map((item, i) => (
        <details
          key={i}
          className="border-b border-fo-line py-4"
          open={i === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between text-[1.02rem] font-bold text-fo-charcoal-900 [&::-webkit-details-marker]:hidden">
            {item.title}
            <span className="ml-4 text-[1.3rem] text-fo-green-600">+</span>
          </summary>
          <div className="mt-3 text-fo-muted">{item.body}</div>
        </details>
      ))}
    </div>
  );
}
