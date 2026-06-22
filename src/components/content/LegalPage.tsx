import { Breadcrumbs } from "@/components/content/Breadcrumbs";

/**
 * Shared layout for policy / legal pages (privacy, terms, shipping-returns,
 * disclaimer). Editorial max-width, eyebrow, last-updated line, and an optional
 * "on this page" table of contents. Body content is supplied by each page.
 */
export function LegalPage({
  eyebrow,
  title,
  toc,
  children,
}: {
  eyebrow: string;
  title: string;
  toc?: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="fo-container">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div className="max-w-editorial py-8">
        <p className="fo-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="mt-2 text-[0.9rem] text-fo-muted">
          Last updated: [date to be confirmed before launch]
        </p>

        {toc && (
          <nav
            aria-label="On this page"
            className="my-8 rounded-card border border-fo-line bg-fo-cream-50 p-6"
          >
            <h2 className="mb-3 text-[1.05rem]">On this page</h2>
            <ol className="grid list-decimal gap-1.5 pl-5 sm:grid-cols-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-fo-green-900 underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="fo-legal-body">{children}</div>
      </div>
    </div>
  );
}
