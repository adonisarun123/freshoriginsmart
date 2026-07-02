import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Disclaimer } from "@/components/content/Disclaimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
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
      className="group flex flex-col overflow-hidden rounded-card border border-fo-line bg-white no-underline transition hover:shadow-card"
    >
      <div className="relative aspect-[1200/630] overflow-hidden bg-fo-sage-100">
        <Image
          src={article.ogImage}
          alt={article.title}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
          {article.readingMinutes} min read
        </p>
        <h3 className="m-0 text-[1rem] leading-snug">{article.title}</h3>
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
  const reviewedAt = formatDate(article.reviewedAt);
  const nextReviewAt = formatDate(article.nextReviewAt);

  return (
    <div className="fo-container">
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

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: cluster.label, href: `/learn#${cluster.id}` },
          { label: article.metaTitle },
        ]}
      />

      {/* Hero */}
      <div className="mx-auto max-w-editorial pt-6">
        <p className="fo-eyebrow">Health education · {cluster.label}</p>
        <h1>{article.title}</h1>

        {article.healthGoalTags.length > 0 && (
          <div className="my-4 flex flex-wrap gap-2">
            {article.healthGoalTags.map((tag) => (
              <span key={tag} className="fo-badge">
                {healthGoalLabel(tag)}
              </span>
            ))}
          </div>
        )}

        <div className="my-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.85rem] text-fo-muted">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-fo-sage-100 text-[0.85rem] font-bold text-fo-green-900">
            FO
          </span>
          <span>Written by {article.author}</span>
          {article.reviewer && (
            <>
              <span className="opacity-40">·</span>
              <span>
                Reviewed by {article.reviewer}
                {article.reviewerCredential ? `, ${article.reviewerCredential}` : ""}
              </span>
            </>
          )}
          {reviewedAt && (
            <>
              <span className="opacity-40">·</span>
              <span>Reviewed {reviewedAt}</span>
            </>
          )}
          <span className="opacity-40">·</span>
          <span>{article.readingMinutes} min read</span>
          {nextReviewAt && (
            <>
              <span className="opacity-40">·</span>
              <span>Next review {nextReviewAt}</span>
            </>
          )}
        </div>
      </div>

      {/* AEO "in short" answer block */}
      <div className="mx-auto mt-6 max-w-editorial rounded-card border border-fo-line border-l-4 border-l-fo-green-600 bg-white p-6 shadow-soft">
        <span className="mb-2 block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
          In short
        </span>
        <p className="m-0 text-[1.02rem] leading-relaxed">{article.summary}</p>
      </div>

      {/* Article body */}
      <article
        className="fo-article-body mx-auto mt-8 max-w-editorial"
        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
      />

      <div className="mx-auto max-w-editorial">
        {/* Reviewer byline card */}
        {article.reviewer && (
          <div className="my-8 flex items-center gap-4 rounded-card border border-fo-line bg-white p-6">
            <div className="grid h-14 w-14 flex-none place-items-center rounded-full bg-fo-sage-100 text-[1.15rem] font-bold text-fo-green-900">
              {article.reviewer.charAt(0)}
            </div>
            <div>
              <h3 className="mb-0.5 mt-0 text-[1.05rem]">
                Reviewed by {article.reviewer}
                {article.reviewerCredential ? `, ${article.reviewerCredential}` : ""}
              </h3>
              <p className="m-0 text-[0.85rem] text-fo-muted">
                Scope: nutritional accuracy of this article.
                {reviewedAt ? ` Reviewed ${reviewedAt}.` : ""}
              </p>
            </div>
          </div>
        )}

        {/* References */}
        {article.references.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[1.3rem]">References</h2>
            <ol className="my-3 list-decimal pl-5 text-[0.88rem] text-fo-muted">
              {article.references.map((ref, i) => (
                <li key={i} className="mb-1.5">
                  {ref}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Products / shop */}
        {(productMentions.length > 0 || shopLinks.length > 0) && (
          <section className="mt-10">
            <h2 className="text-[1.3rem]">Shop the range</h2>
            {productMentions.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {productMentions.map((href) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-card border border-fo-line bg-white p-4 no-underline transition hover:shadow-soft"
                  >
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-card bg-fo-sage-100 text-[1.1rem]">
                      🌾
                    </span>
                    <span className="text-[0.95rem] font-bold text-fo-green-900">
                      {titleFromSlug(href)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {shopLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {shopLinks.map((href) => (
                  <Link
                    key={href}
                    href={href}
                    className="fo-badge transition hover:bg-fo-sage-100"
                  >
                    {titleFromSlug(href)} →
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mt-12">
          <Disclaimer title="Educational information, not medical advice.">
            This article explains general food choices and is not intended to
            diagnose, treat, cure, or prevent any disease. Consult a qualified
            healthcare professional for personalised dietary guidance.
          </Disclaimer>
        </div>
      </div>

      {/* Related reading */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-fo-line pt-10">
          <h2 className="mb-6 text-[1.5rem]">Keep reading</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RelatedCard key={r.slug} article={r} />
            ))}
          </div>
        </section>
      )}

      <div className="h-16" />
    </div>
  );
}
