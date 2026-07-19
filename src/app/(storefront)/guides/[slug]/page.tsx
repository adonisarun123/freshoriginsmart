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
import { getGuideBySlug, getGuideSlugs } from "@/features/growth/guides";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide" };
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const products = (
    await Promise.all(guide.productSlugs.map((s) => getProductBySlug(s)))
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <>
      <TrackView event="view_guide" properties={{ slug }} />
      <JsonLd
        data={[
          articleJsonLd({
            title: guide.title,
            slug: guide.slug,
            description: guide.metaDescription,
            section: "guides",
          }),
          faqJsonLd(guide.faqs.map((f) => ({ question: f.q, answer: f.a }))),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Buying guides", url: "/guides" },
            { name: guide.title, url: `/guides/${guide.slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-fo-sage-100 py-16">
        <div className="fo-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Buying guides", href: "/guides" },
              { label: guide.title },
            ]}
          />
          <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="fo-eyebrow">{guide.eyebrow}</p>
              <h1 className="mb-4 text-[clamp(2rem,4.2vw,3rem)]">
                {guide.title}
              </h1>
              <p className="mb-0 max-w-[58ch] text-[1.1rem] text-fo-muted">
                {guide.intro}
              </p>
            </div>
            <Illustration
              name={guide.illustration}
              title={guide.title}
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
            <p className="m-0 text-[1.08rem]">{guide.inShort}</p>
          </div>
        </div>
      </Section>

      {/* Entries */}
      <Section tight surface>
        <SectionHead eyebrow="The list" title={guide.entriesHeading} />
        <div className="grid max-w-editorial gap-6">
          {guide.entries.map((entry) => (
            <div
              key={entry.name}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <h3 className="mb-2 text-[1.15rem] text-fo-green-900">
                {entry.name}
              </h3>
              <p className="mb-3 text-[0.95rem]">{entry.why}</p>
              <p className="mb-0 text-[0.92rem] text-fo-muted">
                <strong className="text-fo-charcoal-900">Use it:</strong>{" "}
                {entry.useIt}
              </p>
              {entry.learnHref && (
                <p className="mb-0 mt-3">
                  <Link
                    href={entry.learnHref}
                    className="text-[0.9rem] font-semibold text-fo-green-900 underline"
                  >
                    Read the full grain guide →
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Editorial sections */}
      <Section tight>
        <div className="max-w-editorial">
          {guide.sections.map((section) => (
            <div key={section.heading} className="mb-10 last:mb-0">
              <h2 className="text-[1.6rem]">{section.heading}</h2>
              {section.paragraphs.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Products */}
      {products.length > 0 && (
        <Section tight surface>
          <SectionHead eyebrow="Put it into practice" title="From our shelf">
            <p className="mt-3 text-[0.9rem] text-fo-muted">
              {guide.productNote}
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
      <Section tight>
        <p className="fo-eyebrow">Questions</p>
        <h2 className="mb-6 text-[clamp(1.9rem,3.4vw,2.6rem)]">
          Frequently asked questions
        </h2>
        <div className="max-w-editorial">
          {guide.faqs.map((faq, i) => (
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
      <Section tight surface>
        <SectionHead eyebrow="Keep reading" title="Related guides & pages" />
        <div className="grid max-w-editorial gap-3">
          {guide.related.map((link) => (
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
            This guide describes general food choices and approximate nutrition
            estimates. It does not diagnose, treat, cure, or prevent any
            disease, and it is not a substitute for advice from a qualified
            healthcare professional or registered dietitian.
          </Disclaimer>
        </div>
      </Section>
    </>
  );
}
