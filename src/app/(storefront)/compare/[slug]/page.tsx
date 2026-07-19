import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Illustration } from "@/components/brand/Illustration";
import { ProductCard } from "@/components/commerce/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, articleJsonLd } from "@/lib/seo/jsonld";
import { TrackView } from "@/components/analytics/TrackView";
import { getProductBySlug } from "@/features/catalogue/queries";
import {
  getComparisonBySlug,
  getComparisonSlugs,
} from "@/features/growth/comparisons";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return { title: "Comparison" };
  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    alternates: { canonical: `/compare/${comparison.slug}` },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const products = (
    await Promise.all(comparison.productSlugs.map((s) => getProductBySlug(s)))
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <>
      <TrackView event="view_comparison" properties={{ slug }} />
      <JsonLd
        data={[
          articleJsonLd({
            title: comparison.title,
            slug: comparison.slug,
            description: comparison.metaDescription,
            section: "compare",
          }),
          faqJsonLd(
            comparison.faqs.map((f) => ({ question: f.q, answer: f.a })),
          ),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Comparisons", url: "/compare" },
            { name: comparison.title, url: `/compare/${comparison.slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-fo-sage-100 py-16">
        <div className="fo-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Comparisons", href: "/compare" },
              { label: comparison.title },
            ]}
          />
          <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="fo-eyebrow">{comparison.eyebrow}</p>
              <h1 className="mb-4 text-[clamp(2rem,4.2vw,3rem)]">
                {comparison.title}
              </h1>
              <p className="mb-0 max-w-[58ch] text-[1.1rem] text-fo-muted">
                {comparison.intro}
              </p>
            </div>
            <Illustration
              name={comparison.illustration}
              title={comparison.title}
              className="aspect-[4/3] rounded-hero"
            />
          </div>
        </div>
      </section>

      {/* AEO answer */}
      <Section tight>
        <div className="max-w-editorial">
          <div className="rounded-card border border-fo-line border-l-4 border-l-fo-green-600 bg-white p-6 shadow-soft">
            <span className="mb-2 block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
              In short
            </span>
            <p className="m-0 text-[1.08rem]">{comparison.inShort}</p>
          </div>
        </div>
      </Section>

      {/* Comparison table */}
      <Section tight surface>
        <SectionHead eyebrow="Side by side" title="The numbers, side by side" />
        <div className="overflow-x-auto rounded-card border border-fo-line bg-white">
          <table className="w-full min-w-[640px] text-[0.92rem]">
            <thead>
              <tr className="border-b border-fo-line bg-fo-sage-100 text-left">
                <th scope="col" className="p-4 font-bold text-fo-green-900">
                  &nbsp;
                </th>
                {comparison.columns.map((col) => (
                  <th
                    scope="col"
                    key={col}
                    className="p-4 font-bold text-fo-green-900"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-fo-line align-top last:border-none"
                >
                  <th
                    scope="row"
                    className="p-4 text-left font-semibold text-fo-charcoal-900"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={`${row.label}-${i}`} className="p-4 text-fo-muted">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-editorial text-[0.85rem] text-fo-muted">
          {comparison.tableNote}
        </p>
      </Section>

      {/* Editorial sections */}
      <Section tight>
        <div className="max-w-editorial">
          {comparison.sections.map((section) => (
            <div key={section.heading} className="mb-10 last:mb-0">
              <h2 className="text-[1.6rem]">{section.heading}</h2>
              {section.paragraphs.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Verdict */}
      <Section tight surface>
        <SectionHead eyebrow="The verdict" title="So which should you choose?" />
        <div className="grid gap-6 md:grid-cols-3">
          {comparison.verdict.map((v) => (
            <div
              key={v.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <h3 className="mb-2 text-[1.05rem] text-fo-green-900">{v.title}</h3>
              <p className="m-0 text-[0.92rem] text-fo-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Products */}
      {products.length > 0 && (
        <Section tight>
          <SectionHead eyebrow="Put it into practice" title="From our shelf">
            <p className="mt-3 text-[0.9rem] text-fo-muted">
              {comparison.productNote}
            </p>
          </SectionHead>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section tight surface>
        <p className="fo-eyebrow">Questions</p>
        <h2 className="mb-6 text-[clamp(1.9rem,3.4vw,2.6rem)]">
          Frequently asked questions
        </h2>
        <div className="max-w-editorial">
          {comparison.faqs.map((faq, i) => (
            <details
              key={faq.q}
              open={i === 0}
              className="border-b border-fo-line py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-[1.02rem] font-bold">
                {faq.q}
              </summary>
              <p className="mt-3 text-fo-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Related */}
      <Section tight>
        <SectionHead eyebrow="Keep reading" title="Related guides & pages" />
        <div className="grid max-w-editorial gap-3">
          {comparison.related.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-card border border-fo-line bg-white px-5 py-3.5 text-[0.95rem] font-semibold text-fo-green-900 transition hover:shadow-soft"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section tight>
        <div className="max-w-editorial">
          <Disclaimer title="Educational information, not medical advice.">
            Nutrition values on this page are approximate estimates from
            published food-composition data, not label facts. This content does
            not diagnose, treat, cure, or prevent any disease. Consult a
            qualified healthcare professional for personalised guidance.
          </Disclaimer>
        </div>
      </Section>
    </>
  );
}
