import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Disclaimer } from "@/components/content/Disclaimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import {
  getArticlesByCluster,
  getAllArticles,
  getArticleBySlug,
  type LearnArticle,
} from "@/features/learn/content";

export const metadata: Metadata = {
  title: "Learn — Grain Guides, Recipes & Practical Nutrition",
  description:
    "Grain guides, cooking how-tos, and practical, expert-reviewed nutrition education from Fresh Origins — millets, traditional rice, and the everyday meals they make.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learn — Grain Guides & Practical Nutrition | Fresh Origins",
    description:
      "Millets, traditional rice, and the everyday meals they make — clear, expert-reviewed guides without the wellness noise.",
    url: "/learn",
    type: "website",
  },
};

/** Editorial pick for the hero. Falls back to the first article. */
const FEATURED_SLUG = "switching-from-white-rice-to-millets";

function ArticleCard({ article }: { article: LearnArticle }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-fo-line bg-white transition hover:-translate-y-0.5 hover:shadow-card focus-visible:shadow-card"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-fo-sage-100">
        <Image
          src={article.ogImage}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.05em] text-fo-green-900 backdrop-blur">
          {article.readingMinutes} min read
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
          {article.primaryKeyword}
        </p>
        <h3 className="mb-1.5 text-[1.12rem] leading-snug transition-colors group-hover:text-fo-green-600">
          {article.title}
        </h3>
        <p className="m-0 line-clamp-3 text-[0.9rem] text-fo-muted">
          {article.summary}
        </p>
        <span className="mt-auto pt-4 text-[0.84rem] font-bold text-fo-accent">
          Read the guide →
        </span>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  const clusters = getArticlesByCluster();
  const all = getAllArticles();
  const featured = getArticleBySlug(FEATURED_SLUG) ?? all[0];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Learn", url: "/learn" },
          ]),
          itemListJsonLd(
            all.map((a) => ({ name: a.title, url: `/learn/${a.slug}` })),
          ),
        ]}
      />

      {/* ================= Hero ================= */}
      <header className="border-b border-fo-line bg-gradient-to-b from-fo-sage-100/80 via-fo-sage-100/35 to-fo-cream-50">
        <div className="fo-container">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Learn" }]}
          />

          <div className="grid items-center gap-10 pb-12 pt-4 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:pb-16 lg:pt-8">
            <div>
              <p className="fo-eyebrow">Health education</p>
              <h1 className="max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.2rem)] leading-[1.06]">
                Learn about traditional grains
              </h1>
              <p className="mt-4 max-w-[54ch] text-[1.08rem] leading-relaxed text-fo-muted">
                Practical grain knowledge, honest nutrition, and everyday
                cooking — without the wellness noise. Written to educate
                first, and reviewed by a qualified nutritionist or dietitian
                before publishing.
              </p>

              {/* Trust / stats row */}
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-[1.9rem] font-bold leading-none text-fo-green-900">
                    {all.length}
                  </span>
                  <span className="text-[0.85rem] font-semibold text-fo-muted">
                    in-depth guides
                  </span>
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-[1.9rem] font-bold leading-none text-fo-green-900">
                    {clusters.length}
                  </span>
                  <span className="text-[0.85rem] font-semibold text-fo-muted">
                    collections
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-fo-green-600/40 bg-white px-3 py-1.5 text-[0.78rem] font-semibold text-fo-green-900">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden
                    className="h-3.5 w-3.5 fill-fo-green-600"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.7 6.2-4.2 4.4a.75.75 0 0 1-1.1 0L4.3 8.4a.75.75 0 1 1 1.08-1.04l1.56 1.62 3.66-3.82a.75.75 0 0 1 1.1 1.04Z" />
                  </svg>
                  Expert-reviewed
                </span>
              </div>
            </div>

            {/* Featured guide */}
            {featured && (
              <Link
                href={`/learn/${featured.slug}`}
                className="group relative hidden overflow-hidden rounded-hero border border-fo-line bg-white shadow-card transition hover:-translate-y-0.5 lg:block"
              >
                <div className="relative aspect-[1200/630] overflow-hidden bg-fo-sage-100">
                  <Image
                    src={featured.ogImage}
                    alt={featured.title}
                    fill
                    priority
                    sizes="440px"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-fo-accent">
                    Start here · {featured.readingMinutes} min read
                  </p>
                  <h2 className="m-0 text-[1.25rem] leading-snug transition-colors group-hover:text-fo-green-600">
                    {featured.title}
                  </h2>
                  <span className="mt-3 inline-block text-[0.85rem] font-bold text-fo-accent">
                    Read the guide →
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= Sticky cluster nav ================= */}
      <nav
        aria-label="Article categories"
        className="sticky top-[70px] z-40 border-b border-fo-line bg-fo-cream-50/95 backdrop-blur"
      >
        <div className="fo-container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {clusters.map(({ cluster, articles }) => (
            <a
              key={cluster.id}
              href={`#${cluster.id}`}
              className="flex-none rounded-pill border border-fo-line bg-white px-4 py-2 text-[0.85rem] font-bold text-fo-green-900 transition hover:border-fo-green-600 hover:bg-fo-sage-100"
            >
              {cluster.label}
              <span className="ml-1.5 text-fo-green-600">{articles.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* ================= Clusters ================= */}
      {clusters.map(({ cluster, articles }, i) => (
        <section
          key={cluster.id}
          id={cluster.id}
          className={`scroll-mt-32 ${i % 2 === 1 ? "bg-white" : ""}`}
        >
          <div className="fo-container py-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-editorial">
                <span
                  aria-hidden
                  className="mb-3.5 block h-[5px] w-11 rounded-pill bg-gradient-to-r from-fo-green-600 to-fo-lime-500"
                />
                <p className="fo-eyebrow mb-2">{cluster.eyebrow}</p>
                <h2 className="mb-2 text-[clamp(1.5rem,2.6vw,2rem)]">
                  {cluster.title}
                </h2>
                <p className="m-0 text-fo-muted">{cluster.description}</p>
              </div>
              {cluster.shop && (
                <Link
                  href={cluster.shop.href}
                  className="inline-flex flex-none items-center gap-1.5 rounded-pill border-2 border-fo-green-900 bg-white px-5 py-2.5 text-[0.88rem] font-bold text-fo-green-900 transition hover:bg-fo-sage-100"
                >
                  {cluster.shop.label} →
                </Link>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ================= Expert trust band ================= */}
      <div className="fo-container">
        <section className="mt-4 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-hero bg-fo-green-900 p-7 text-white sm:p-9">
          <div className="max-w-[58ch]">
            <p className="m-0 text-[0.74rem] font-bold uppercase tracking-[0.09em] text-fo-lime-300">
              Responsible health content
            </p>
            <h2 className="mb-2 mt-2 text-[1.4rem] text-white">
              Reviewed by qualified experts, not influencers
            </h2>
            <p className="m-0 text-[0.92rem] leading-relaxed text-white/75">
              Every health-related article is checked for nutritional accuracy
              by a qualified nutritionist or dietitian before it is published —
              and re-reviewed every year.
            </p>
          </div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-1.5 rounded-pill border border-white/30 px-5 py-2.5 text-[0.88rem] font-bold text-white no-underline transition hover:bg-white hover:text-fo-green-900"
          >
            Meet the experts →
          </Link>
        </section>

        <div className="pb-16 pt-10">
          <Disclaimer title="Educational information, not medical advice.">
            Our articles explain general food choices and are not intended to
            diagnose, treat, cure, or prevent any disease. Consult a qualified
            healthcare professional for personalised dietary guidance.
          </Disclaimer>
        </div>
      </div>
    </>
  );
}
