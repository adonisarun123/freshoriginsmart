import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import MarkdownIt from "markdown-it";

import seoMetadata from "../../../blog/seo-metadata.json";
import articleSchema from "../../../blog/article-schema.json";

/**
 * Fresh Origins — Learn / Blog content library.
 *
 * Source of truth is the `blog/` content pack at the repo root:
 *   - `blog/*.md`               — 17 articles (frontmatter + markdown body)
 *   - `blog/seo-metadata.json`  — per-slug SEO + internal-linking map
 *   - `blog/article-schema.json`— per-slug Article JSON-LD (injected verbatim)
 *   - `public/og/{slug}.png`    — 1200×630 Open Graph images
 *
 * Everything here runs at BUILD TIME only: the `/learn` routes are fully static
 * (see `generateStaticParams`), so no filesystem access happens at runtime.
 */

const CONTENT_DIR = path.join(process.cwd(), "blog");

const md = new MarkdownIt({
  html: true, // keep the inline branded <figure><svg> illustrations
  linkify: true,
  typographer: true,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LearnClusterId = "millets" | "traditional-rice" | "blends" | "how-to";

export interface LearnCluster {
  id: LearnClusterId;
  eyebrow: string;
  label: string;
  title: string;
  description: string;
  /** Optional "shop the range" link shown under the cluster. */
  shop?: { label: string; href: string };
}

interface SeoInternalLinks {
  articles: string[];
  commerce: string[];
}

interface SeoArticleMeta {
  slug: string;
  canonical: string;
  cluster: LearnClusterId;
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  internalLinks: SeoInternalLinks;
}

interface ArticleFrontmatter {
  title: string;
  slug: string;
  summary: string;
  author?: string;
  reviewer?: string;
  reviewer_credential?: string;
  reviewed_at?: string;
  next_review_at?: string;
  health_goal_tags?: string[];
  product_links?: string[];
  references?: string[];
  status?: string;
}

export interface ArticleHeading {
  /** Anchor id injected into the rendered heading tag. */
  id: string;
  /** Plain-text heading label (tags stripped, entities decoded). */
  text: string;
  level: 2 | 3;
}

export interface LearnArticle {
  slug: string;
  title: string;
  /** Short marketing meta title (brand-suffix-free). */
  metaTitle: string;
  metaDescription: string;
  summary: string;
  cluster: LearnClusterId;
  primaryKeyword: string;
  secondaryKeywords: string[];
  canonical: string;
  author: string;
  reviewer?: string;
  reviewerCredential?: string;
  reviewedAt?: string;
  nextReviewAt?: string;
  datePublished?: string;
  dateModified?: string;
  healthGoalTags: string[];
  productLinks: string[];
  references: string[];
  relatedSlugs: string[];
  commerceLinks: string[];
  /** Absolute path to the OG image, e.g. "/og/millet-foxtail.png". */
  ogImage: string;
  /** Rendered, cleaned article HTML (no duplicate H1, no internal notes). */
  bodyHtml: string;
  /** The leading branded <figure> illustration, extracted for the hero. */
  heroFigureHtml?: string;
  /** h2/h3 outline for the table of contents (ids match bodyHtml anchors). */
  headings: ArticleHeading[];
  readingMinutes: number;
  /** The Article JSON-LD object for this slug, ready for <JsonLd>. */
  schema: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Cluster presentation (mirrors blog/_learn-index.md)
// ---------------------------------------------------------------------------

export const LEARN_CLUSTERS: LearnCluster[] = [
  {
    id: "millets",
    eyebrow: "Grain guide",
    label: "Millets",
    title: "Grain Guide — Millets",
    description:
      "The traditional millets behind our blends: what they are, how they taste, and how to cook them well.",
    shop: { label: "Shop Millets", href: "/shop/millets" },
  },
  {
    id: "traditional-rice",
    eyebrow: "Grain guide",
    label: "Traditional Rice",
    title: "Grain Guide — Traditional Rice",
    description:
      "Heritage and unpolished rice varieties: colour, character, and how to cook them.",
    shop: { label: "Shop Traditional Rice", href: "/shop/traditional-rice" },
  },
  {
    id: "blends",
    eyebrow: "Inside our blends",
    label: "Inside Our Blends",
    title: "Inside Our Blends",
    description:
      "A transparent look at each ready-to-cook mix — every ingredient, why it's there, and how to cook it.",
    shop: { label: "Shop Ready-to-Cook Mixes", href: "/shop/ready-to-cook-mixes" },
  },
  {
    id: "how-to",
    eyebrow: "Practical nutrition",
    label: "Practical Nutrition & How-To",
    title: "Practical Nutrition & How-To",
    description:
      "Everyday guidance for cooking with whole grains and pulses.",
  },
];

const CLUSTER_BY_ID = new Map(LEARN_CLUSTERS.map((c) => [c.id, c]));

export function getCluster(id: LearnClusterId): LearnCluster {
  const cluster = CLUSTER_BY_ID.get(id);
  if (!cluster) throw new Error(`Unknown learn cluster: ${id}`);
  return cluster;
}

/** Friendly labels for health-goal tag slugs used in article frontmatter. */
const HEALTH_GOAL_LABELS: Record<string, string> = {
  "protein-fibre": "Protein & Fibre",
  "blood-sugar-conscious-eating": "Blood-Sugar-Conscious",
  "gut-health": "Gut Health",
  "senior-nutrition": "Senior Nutrition",
  "weight-management": "Weight Management",
  "gluten-free": "Wheat-Free",
};

export function healthGoalLabel(tag: string): string {
  return (
    HEALTH_GOAL_LABELS[tag] ??
    tag
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

// ---------------------------------------------------------------------------
// Loading + parsing (memoised for the build)
// ---------------------------------------------------------------------------

const seoBySlug = new Map<string, SeoArticleMeta>(
  (seoMetadata.articles as SeoArticleMeta[]).map((a) => [a.slug, a]),
);

const schemaBySlug = (articleSchema as { articles: Record<string, Record<string, unknown>> })
  .articles;

/** Strip internal/duplicate content before rendering the public article body. */
function cleanBody(raw: string): string {
  let body = raw;
  // Remove the first H1 (rendered separately as the page title).
  body = body.replace(/^#\s+.+$/m, "").trimStart();
  // Remove the internal "PHOTO SLOT" art-direction note and anything after it.
  body = body.replace(/\n>\s*\*\*PHOTO SLOT\*\*[\s\S]*$/i, "").trimEnd();
  // Remove the trailing inline disclaimer (we render the Disclaimer component).
  body = body
    .replace(
      /\n-{3,}\s*\n\s*\*[^\n]*(?:not a medicine|not medical advice)[^\n]*\*\s*$/i,
      "",
    )
    .trimEnd();
  return body;
}

/** Decode the few HTML entities markdown-it emits inside heading text. */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Inject anchor ids into rendered <h2>/<h3> tags and collect the outline
 * for the table of contents.
 */
function annotateHeadings(html: string): {
  html: string;
  headings: ArticleHeading[];
} {
  const headings: ArticleHeading[] = [];
  const seen = new Map<string, number>();
  const annotated = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_match, lvl: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
      let id = slugifyHeading(text) || "section";
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      if (n > 0) id = `${id}-${n + 1}`;
      headings.push({ id, text, level: lvl === "2" ? 2 : 3 });
      return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
    },
  );
  return { html: annotated, headings };
}

/**
 * Pull the leading branded <figure> illustration out of the body so the
 * page can place it in the hero instead of the text column.
 */
function extractHeroFigure(html: string): {
  heroFigureHtml?: string;
  html: string;
} {
  const match = html.match(/^\s*<figure>[\s\S]*?<\/figure>/);
  if (!match) return { html };
  return {
    heroFigureHtml: match[0].trim(),
    html: html.slice(match[0].length).trimStart(),
  };
}

function readingMinutes(raw: string): number {
  const text = raw
    .replace(/<[^>]+>/g, " ") // drop inline HTML/SVG
    .replace(/[#>*_`|-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

function buildArticle(fileContent: string): LearnArticle | null {
  const parsed = matter(fileContent);
  const fm = parsed.data as ArticleFrontmatter;
  const slug = fm?.slug;
  if (!slug) return null;

  const seo = seoBySlug.get(slug);
  if (!seo) return null; // only the 17 canonical /learn articles

  const schema = schemaBySlug[slug] ?? {};
  const cleaned = cleanBody(parsed.content);
  const { heroFigureHtml, html: withoutHero } = extractHeroFigure(
    md.render(cleaned),
  );
  const { html: bodyHtml, headings } = annotateHeadings(withoutHero);

  return {
    slug,
    title: fm.title,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    summary: fm.summary,
    cluster: seo.cluster,
    primaryKeyword: seo.primaryKeyword,
    secondaryKeywords: seo.secondaryKeywords ?? [],
    canonical: seo.canonical,
    author: fm.author ?? "Fresh Origins Editorial",
    reviewer: fm.reviewer && fm.reviewer !== "TBD" ? fm.reviewer : undefined,
    reviewerCredential: fm.reviewer_credential,
    reviewedAt: fm.reviewed_at,
    nextReviewAt: fm.next_review_at,
    datePublished: (schema.datePublished as string) ?? fm.reviewed_at,
    dateModified:
      (schema.dateModified as string) ?? (schema.datePublished as string) ?? fm.reviewed_at,
    healthGoalTags: fm.health_goal_tags ?? [],
    productLinks: fm.product_links ?? [],
    references: fm.references ?? [],
    relatedSlugs: seo.internalLinks?.articles ?? [],
    commerceLinks: seo.internalLinks?.commerce ?? [],
    ogImage: `/og/${slug}.png`,
    bodyHtml,
    heroFigureHtml,
    headings,
    readingMinutes: readingMinutes(parsed.content),
    schema,
  };
}

let cache: Map<string, LearnArticle> | null = null;

function loadAll(): Map<string, LearnArticle> {
  if (cache) return cache;
  const map = new Map<string, LearnArticle>();

  let files: string[] = [];
  try {
    files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    files = [];
  }

  for (const file of files) {
    if (file.startsWith("_") || file.toLowerCase() === "readme.md") continue;
    const full = path.join(CONTENT_DIR, file);
    const article = buildArticle(fs.readFileSync(full, "utf8"));
    if (article) map.set(article.slug, article);
  }

  cache = map;
  return map;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All articles, ordered by the editorial order in seo-metadata.json. */
export function getAllArticles(): LearnArticle[] {
  const map = loadAll();
  const order = (seoMetadata.articles as SeoArticleMeta[]).map((a) => a.slug);
  return order
    .map((slug) => map.get(slug))
    .filter((a): a is LearnArticle => Boolean(a));
}

export function getArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

export function getArticleBySlug(slug: string): LearnArticle | undefined {
  return loadAll().get(slug);
}

export interface ClusterWithArticles {
  cluster: LearnCluster;
  articles: LearnArticle[];
}

/** Articles grouped into their four clusters, in editorial order. */
export function getArticlesByCluster(): ClusterWithArticles[] {
  const all = getAllArticles();
  return LEARN_CLUSTERS.map((cluster) => ({
    cluster,
    articles: all.filter((a) => a.cluster === cluster.id),
  }));
}

/** Resolve a small set of related-article cards for a given article. */
export function getRelatedArticles(article: LearnArticle, limit = 3): LearnArticle[] {
  const map = loadAll();
  const related = article.relatedSlugs
    .map((slug) => map.get(slug))
    .filter((a): a is LearnArticle => Boolean(a));
  if (related.length >= limit) return related.slice(0, limit);

  // Backfill with same-cluster articles if the curated list is short.
  const fill = getAllArticles().filter(
    (a) => a.cluster === article.cluster && a.slug !== article.slug && !related.includes(a),
  );
  return [...related, ...fill].slice(0, limit);
}
