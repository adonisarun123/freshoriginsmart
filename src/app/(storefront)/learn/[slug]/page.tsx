import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Disclaimer } from "@/components/content/Disclaimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { ArticleToc } from "@/features/learn/ArticleToc";
import { HERO_IMAGES } from "@/features/learn/heroImages";
import { ReadingProgress } from "@/features/learn/ReadingProgress";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
  getCluster,
  healthGoalLabel,
  type LearnArticle,
} from "@/features/learn/content";

const BRAND_SUFFIX = " | Fresh Origins";

// Next 15+/16: `params` is a Promise and must be awaited.
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const withSuffix = article.metaTitle + BRAND_SUFFIX;
  const title =
    withSuffix.length <= 60
      ? { absolute: withSuffix }
      : { absolute: article.metaTitle };

  return {
    title,
    description: article.metaDescription,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords],
    alternates: { canonical: article.canonical },
    openGraph: {
      type: "article",
      title: article.metaTitle,
      description: article.metaDescription,
      url: article.canonical,
      images: [{ url: article.ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: [article.ogImage],
    },
  };
}

/** "2026-07-01" → "1 Jul 2026". Falls back to the raw string. */
function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "metabolic-balance-khichdi" → "Metabolic Balance Khichdi". */
function titleFromSlug(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .pop()!
    .split("-")
    .map((w) => (w === "and" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function RelatedCard({ article }: { article: LearnArticle }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-fo-line bg-white no-underline transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-fo-sage-100">
        <Image
          src={article.ogImage}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
          {getCluster(article.cluster).label} · {article.readingMinutes} min read
        </p>
        <h3 className="m-0 text-[1.02rem] leading-snug transition-colors group-hover:text-fo-green-600">
          {article.title}
        </h3>
        <span className="mt-auto pt-3 text-[0.82rem] font-bold text-fo-accent">
          Read the guide →
        </span>
      </div>
    </Link>
  );
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cluster = getCluster(article.cluster);
  const related = getRelatedArticles(article, 3);
  const productMentions = article.commerceLinks.filter((l) =>
    l.startsWith("/products/"),
  );
  const shopLinks = article.commerceLinks.filter((l) => l.startsWith("/shop/"));
  const primaryShopLink = shopLinks[0] ?? "/shop";
  const reviewedAt = formatDate(article.reviewedAt);
  const nextReviewAt = formatDate(article.nextReviewAt);
  const tocHeadings = article.headings.filter((h) => h.level === 2);
  const heroImage = HERO_IMAGES[article.slug];

  return (
    <>
      <ReadingProgress targetId="fo-article-column" />
      <JsonLd
        data={[
          article.schema,
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Learn", url: "/learn" },
            { name: article.title, url: article.canonical },
          ]),
        ]}
      />

      {/* ================= Hero ================= */}
      <header className="border-b border-fo-line bg-gradient-to-b from-fo-sage-100/80 via-fo-sage-100/35 to-fo-cream-50">
        <div className="fo-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Learn", href: "/learn" },
              { label: cluster.label, href: `/learn#${cluster.id}` },
              { label: article.metaTitle },
            ]}
          />

          <div className="grid items-center gap-10 pb-12 pt-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:pb-16 lg:pt-8">
            <div>
              <p className="fo-eyebrow">Health education · {cluster.label}</p>
              <h1 className="max-w-[22ch] text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.06]">
                {article.title}
              </h1>

              {article.healthGoalTags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {article.healthGoalTags.map((tag) => (
                    <span key={tag} className="fo-badge">
                      {healthGoalLabel(tag)}
                    </span>
                  ))}
                </div>
              )}

              {/* Byline / trust row */}
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-[0.85rem] text-fo-muted">
                <span className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-fo-green-900 text-[0.8rem] font-bold text-fo-lime-300">
                    FO
                  </span>
                  <span>
                    <span className="block font-semibold text-fo-charcoal-900">
                      {article.author}
                    </span>
                    <span className="block text-[0.78rem]">
                      {article.readingMinutes} min read
                      {reviewedAt ? ` · Updated ${reviewedAt}` : ""}
                    </span>
                  </span>
                </span>

                {article.reviewer && (
                  <span className="inline-flex items-center gap-1.5 rounded-pill border border-fo-green-600/40 bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-fo-green-900">
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden
                      className="h-3.5 w-3.5 fill-fo-green-600"
                    >
                      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.7 6.2-4.2 4.4a.75.75 0 0 1-1.1 0L4.3 8.4a.75.75 0 1 1 1.08-1.04l1.56 1.62 3.66-3.82a.75.75 0 0 1 1.1 1.04Z" />
                    </svg>
                    Expert-reviewed by {article.reviewer}
                    {article.reviewerCredential
                      ? `, ${article.reviewerCredential}`
                      : ""}
                  </span>
                )}
              </div>
            </div>

            {heroImage ? (
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-hero border border-fo-line shadow-card lg:block">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            ) : (
              article.heroFigureHtml && (
                <div
                  className="fo-hero-figure hidden lg:block"
                  dangerouslySetInnerHTML={{ __html: article.heroFigureHtml }}
                />
              )
            )}
          </div>
        </div>
      </header>

      {/* ================= Body + side rail ================= */}
      <div className="fo-container">
        <div className="mx-auto max-w-editorial xl:mx-0 xl:grid xl:max-w-none xl:grid-cols-[minmax(0,1fr)_272px] xl:gap-16">
          {/* -------- Article column -------- */}
          <div id="fo-article-column" className="mx-auto w-full max-w-editorial">
            {/* AEO "in short" answer block */}
            <div className="mt-8 rounded-card border border-fo-line border-l-4 border-l-fo-green-600 bg-white p-6 shadow-soft">
              <span className="mb-2 flex items-center gap-2 text-[0.76rem] font-bold uppercase tracking-[0.07em] text-fo-accent">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="h-4 w-4 fill-fo-green-600"
                >
                  <path d="M8 1.5c-2.7 0-5 2.1-5 4.8 0 1.6.8 3 2 3.9v1.3c0 .4.3.75.7.75h4.6c.4 0 .7-.35.7-.75v-1.3c1.2-.9 2-2.3 2-3.9 0-2.7-2.3-4.8-5-4.8ZM6.2 13.5c0 .55.45 1 1 1h1.6c.55 0 1-.45 1-1v-.25H6.2v.25Z" />
                </svg>
                In short
              </span>
              <p className="m-0 text-[1.02rem] leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Hero image / illustration inline on small screens */}
            {heroImage ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card border border-fo-line shadow-soft lg:hidden">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              article.heroFigureHtml && (
                <div
                  className="fo-hero-figure mt-8 lg:hidden"
                  dangerouslySetInnerHTML={{ __html: article.heroFigureHtml }}
                />
              )
            )}

            {/* Mobile / tablet table of contents (no JS needed) */}
            {tocHeadings.length > 1 && (
              <details className="group mt-8 rounded-card border border-fo-line bg-white px-5 py-4 xl:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[0.8rem] font-bold uppercase tracking-[0.07em] text-fo-accent [&::-webkit-details-marker]:hidden">
                  On this page
                  <span className="text-fo-green-600 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <ul className="mt-3 space-y-2 border-t border-fo-line pt-3 text-[0.92rem]">
                  {tocHeadings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-fo-muted hover:text-fo-green-900"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Article body */}
            <article
              className="fo-article-body mt-4"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />

            {/* Reviewer byline card */}
            {article.reviewer && (
              <div className="mt-12 flex flex-wrap items-center gap-4 rounded-card border border-fo-line bg-white p-6 shadow-soft">
                <div className="grid h-14 w-14 flex-none place-items-center rounded-full bg-fo-green-900 text-[1.15rem] font-bold text-fo-lime-300 ring-2 ring-fo-lime-500/50 ring-offset-2">
                  {article.reviewer.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="fo-badge mb-1.5">✓ Expert reviewed</span>
                  <h3 className="mb-0.5 mt-0 text-[1.05rem]">
                    {article.reviewer}
                    {article.reviewerCredential
                      ? `, ${article.reviewerCredential}`
                      : ""}
                  </h3>
                  <p className="m-0 text-[0.85rem] text-fo-muted">
                    Scope: nutritional accuracy of this article.
                    {reviewedAt ? ` Reviewed ${reviewedAt}.` : ""}
                    {nextReviewAt ? ` Next review ${nextReviewAt}.` : ""}
                  </p>
                </div>
              </div>
            )}

            {/* References */}
            {article.references.length > 0 && (
              <section className="mt-10">
                <h2 className="text-[1.25rem]">References</h2>
                <ol className="my-3 list-decimal pl-5 text-[0.88rem] text-fo-muted">
                  {article.references.map((ref, i) => (
                    <li key={i} className="mb-1.5">
                      {ref}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Commerce band */}
            {(productMentions.length > 0 || shopLinks.length > 0) && (
              <section className="mt-12 overflow-hidden rounded-hero bg-fo-green-900 p-7 text-white sm:p-9">
                <p className="m-0 text-[0.74rem] font-bold uppercase tracking-[0.09em] text-fo-lime-300">
                  From the article to your kitchen
                </p>
                <h2 className="mb-2 mt-2 text-[1.5rem] text-white">
                  Cook with the grains you just read about
                </h2>
                <p className="m-0 max-w-[52ch] text-[0.92rem] leading-relaxed text-white/75">
                  Thoughtfully sourced, transparently labelled, and delivered
                  across Bangalore and Hosur.
                </p>

                {productMentions.length > 0 && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {productMentions.map((href) => (
                      <Link
                        key={href}
                        href={href}
                        className="group flex items-center gap-3 rounded-card border border-white/15 bg-white/10 p-4 no-underline transition hover:bg-white/20"
                      >
                        <span className="grid h-11 w-11 flex-none place-items-center rounded-card bg-fo-lime-300/20 text-[1.1rem]">
                          🌾
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[0.95rem] font-bold text-white">
                            {titleFromSlug(href)}
                          </span>
                          <span className="text-[0.78rem] text-fo-lime-300">
                            View product →
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {shopLinks.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {shopLinks.map((href) => (
                      <Link
                        key={href}
                        href={href}
                        className="inline-flex items-center gap-1.5 rounded-pill border border-white/25 px-4 py-2 text-[0.85rem] font-bold text-white no-underline transition hover:bg-white hover:text-fo-green-900"
                      >
                        Shop {titleFromSlug(href)} →
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            <div className="mt-10">
              <Disclaimer title="Educational information, not medical advice.">
                This article explains general food choices and is not intended
                to diagnose, treat, cure, or prevent any disease. Consult a
                qualified healthcare professional for personalised dietary
                guidance.
              </Disclaimer>
            </div>
          </div>

          {/* -------- Desktop side rail -------- */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6 pt-8">
              <ArticleToc headings={tocHeadings} />

              {productMentions.length > 0 && (
                <div className="rounded-card border border-fo-line bg-white p-5 shadow-soft">
                  <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.09em] text-fo-accent">
                    Featured in this guide
                  </p>
                  <ul className="space-y-2.5">
                    {productMentions.map((href) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-fo-green-900 no-underline hover:text-fo-green-600"
                        >
                          <span className="grid h-9 w-9 flex-none place-items-center rounded-control bg-fo-sage-100 text-[0.95rem]">
                            🌾
                          </span>
                          {titleFromSlug(href)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={primaryShopLink}
                    className="fo-btn-primary mt-4 w-full text-[0.85rem]"
                  >
                    Shop {titleFromSlug(primaryShopLink)}
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ================= Related reading ================= */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-fo-line pt-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="fo-eyebrow mb-1">Keep learning</p>
                <h2 className="m-0 text-[1.5rem]">Keep reading</h2>
              </div>
              <Link
                href="/learn"
                className="text-[0.88rem] font-bold text-fo-accent no-underline hover:text-fo-green-900"
              >
                All guides →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RelatedCard key={r.slug} article={r} />
              ))}
            </div>
          </section>
        )}

        <div className="h-16" />
      </div>
    </>
  );
}
