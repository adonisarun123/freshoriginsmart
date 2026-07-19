import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Illustration } from "@/components/brand/Illustration";
import { ProductCard } from "@/components/commerce/ProductCard";
import { WhatsAppButton } from "@/components/commerce/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
} from "@/lib/seo/jsonld";
import {
  getProductsByCategory,
  getShopProducts,
} from "@/features/catalogue/queries";
import { TrackView } from "@/components/analytics/TrackView";
import type { LocalPage } from "./types";

/**
 * Shared renderer for the local-intent landing pages (Bangalore / Hosur).
 * Fully static at build time; products come from the catalogue at build.
 */
export async function LocalLanding({ page }: { page: LocalPage }) {
  const products = page.categorySlug
    ? await getProductsByCategory(page.categorySlug)
    : await getShopProducts({ diet: page.dietFilter ?? [] });

  return (
    <>
      <TrackView event="view_local_landing" properties={{ slug: page.slug }} />
      {/* LocalBusiness schema comes from the root layout; page-level blocks below. */}
      <JsonLd
        data={[
          faqJsonLd(page.faqs.map((f) => ({ question: f.q, answer: f.a }))),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: page.title, url: `/${page.slug}` },
          ]),
          ...(products.length > 0
            ? [
                itemListJsonLd(
                  products.map((p) => ({
                    name: p.name,
                    url: `/products/${p.slug}`,
                  })),
                ),
              ]
            : []),
        ]}
      />

      {/* Hero */}
      <section className="bg-fo-sage-100 py-16">
        <div className="fo-container">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: page.title }]}
          />
          <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="fo-eyebrow">{page.eyebrow}</p>
              <h1 className="mb-4 text-[clamp(2.1rem,4.4vw,3.1rem)]">
                {page.title}
              </h1>
              <p className="mb-6 max-w-[58ch] text-[1.1rem] text-fo-muted">
                {page.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="fo-btn-primary">
                  Shop the range
                </Link>
                <WhatsAppButton />
              </div>
            </div>
            <Illustration
              name={page.illustration}
              title={page.title}
              className="aspect-[4/3] rounded-hero"
            />
          </div>
        </div>
      </section>

      {/* AEO answer block */}
      <Section tight>
        <div className="max-w-editorial">
          <div className="rounded-card border border-fo-line border-l-4 border-l-fo-green-600 bg-white p-6 shadow-soft">
            <span className="mb-2 block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
              In short
            </span>
            <p className="m-0 text-[1.08rem]">{page.inShort}</p>
          </div>
        </div>
      </Section>

      {/* Products */}
      {products.length > 0 && (
        <Section tight surface>
          <SectionHead eyebrow="Delivered to your door" title={page.productsHeading} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )}

      {/* Why us */}
      <Section tight>
        <SectionHead
          eyebrow="Why Fresh Origins"
          title={`Why ${page.city} households order from us`}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {page.whyUs.map((item) => (
            <div
              key={item.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <h3 className="mb-2 text-[1.1rem]">{item.title}</h3>
              <p className="m-0 text-[0.95rem] text-fo-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Areas */}
      <Section tight surface>
        <SectionHead eyebrow="Coverage" title={page.areasHeading}>
          <p className="mt-3 text-[0.95rem] text-fo-muted">{page.areasIntro}</p>
        </SectionHead>
        <ul className="flex max-w-editorial flex-wrap gap-2.5">
          {page.areas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-fo-line bg-fo-sage-100 px-4 py-1.5 text-[0.9rem] text-fo-green-900"
            >
              {area}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-editorial text-[0.9rem] text-fo-muted">
          Coverage grows regularly — confirm your exact pincode with the check on
          any product page before ordering.
        </p>
      </Section>

      {/* Delivery */}
      <Section tight>
        <SectionHead eyebrow="The practical bit" title={page.deliveryHeading} />
        <div className="max-w-editorial">
          {page.deliveryParagraphs.map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
          <p className="text-[0.9rem] text-fo-muted">
            Full policies: <Link href="/shipping-returns" className="underline">Shipping &amp; Returns</Link>.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section tight surface>
        <p className="fo-eyebrow">Questions</p>
        <h2 className="mb-6 text-[clamp(1.9rem,3.4vw,2.6rem)]">
          Frequently asked questions
        </h2>
        <div className="max-w-editorial">
          {page.faqs.map((faq, i) => (
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
          {page.related.map((link) => (
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
          <Disclaimer />
        </div>
      </Section>
    </>
  );
}
