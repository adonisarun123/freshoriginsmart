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

function ArticleCard({ article }: { article: LearnArticle }) {
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card focus-visible:shadow-card"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-fo-sage-100">
        <Image
          src={article.ogImage}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
          {article.primaryKeyword} · {article.readingMinutes} min read
        </p>
        <h3 className="mb-1.5 text-[1.12rem] leading-snug">{article.title}</h3>
        <p className="m-0 line-clamp-3 text-[0.9rem] text-fo-muted">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  const clusters = getArticlesByCluster();
  const all = getAllArticles();

  return (
    <div className="fo-container">
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

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />

      {/* Hero */}
      <div className="max-w-editorial py-8">
        <p className="fo-eyebrow">Health education</p>
        <h1 className="mb-3">Learn about traditional grains</h1>
        <p className="text-[1.05rem] text-fo-muted">
          Practical grain knowledge, honest nutrition, and everyday cooking —
          without the wellness noise. Everything here is written to educate first.
          Health-related articles are reviewed by a qualified nutritionist or
          dietitian before publishing.
        </p>
      </div>

      {/* Cluster quick-nav */}
      <nav
        aria-label="Article categories"
        className="mb-4 flex flex-wrap gap-2 border-y border-fo-line py-4"
      >
        {clusters.map(({ cluster, articles }) => (
          <a
            key={cluster.id}
            href={`#${cluster.id}`}
            className="fo-badge transition hover:bg-fo-sage-100"
          >
            {cluster.label}
            <span className="opacity-60">{articles.length}</span>
          </a>
        ))}
      </nav>

      {/* Clusters */}
      {clusters.map(({ cluster, articles }) => (
        <section key={cluster.id} id={cluster.id} className="scroll-mt-24 py-10">
          <div className="mb-6 max-w-editorial">
            <p className="fo-eyebrow">{cluster.eyebrow}</p>
            <h2 className="mb-2 text-[clamp(1.5rem,2.6vw,2rem)]">{cluster.title}</h2>
            <p className="m-0 text-fo-muted">{cluster.description}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {cluster.shop && (
            <div className="mt-6">
              <Link
                href={cluster.shop.href}
                className="text-[0.9rem] font-bold text-fo-green-900 underline underline-offset-4 hover:text-fo-green-600"
              >
                {cluster.shop.label} →
              </Link>
            </div>
          )}
        </section>
      ))}

      <div className="pb-16 pt-2">
        <Disclaimer title="Educational information, not medical advice.">
          Our articles explain general food choices and are not intended to
          diagnose, treat, cure, or prevent any disease. Consult a qualified
          healthcare professional for personalised dietary guidance.
        </Disclaimer>
      </div>
    </div>
  );
}
