/**
 * Shared types for the growth (SEO money-page) content packs:
 * comparisons, buying guides, and local landing pages.
 *
 * All content is static TypeScript data — reviewed in code, rendered fully
 * static at build time, no CMS/DB dependency. Nutrition figures are
 * approximate (per 100 g raw unless stated) and follow the site's
 * health-claim governance: educational framing, no treatment claims.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export type IllustrationName =
  | "millets"
  | "rice"
  | "mixes"
  | "bowl"
  | "hero"
  | "origin"
  | "goal"
  | "field";

/* ── Comparison pages (/compare/[slug]) ─────────────────────────────── */

export interface ComparisonRow {
  label: string;
  /** One value per comparison column, in order. */
  values: string[];
}

export interface Comparison {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  /** H1 */
  title: string;
  intro: string;
  /** AEO "In short" direct-answer block. */
  inShort: string;
  /** Table column headers (the items being compared). */
  columns: string[];
  rows: ComparisonRow[];
  tableNote: string;
  sections: ContentSection[];
  verdict: { title: string; text: string }[];
  /** Product slugs to surface as CTAs. */
  productSlugs: string[];
  productNote: string;
  faqs: Faq[];
  related: RelatedLink[];
  illustration: IllustrationName;
}

/* ── Buying guides (/guides/[slug]) ─────────────────────────────────── */

export interface GuideEntry {
  name: string;
  /** Why it earns its place on this list. */
  why: string;
  /** Practical way to use it in an Indian kitchen. */
  useIt: string;
  /** Optional deep-dive article link. */
  learnHref?: string;
}

export interface Guide {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  inShort: string;
  /** Ranked or curated list at the heart of the guide. */
  entries: GuideEntry[];
  entriesHeading: string;
  sections: ContentSection[];
  productSlugs: string[];
  productNote: string;
  faqs: Faq[];
  related: RelatedLink[];
  illustration: IllustrationName;
}

/* ── Local landing pages (top-level city routes) ────────────────────── */

export interface LocalPage {
  /** Route segment, e.g. "millets-online-bangalore". */
  slug: string;
  city: "Bangalore" | "Hosur";
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  inShort: string;
  /** Product sourcing for the grid: category slug or dietary filter. */
  categorySlug?: string;
  dietFilter?: string[];
  productsHeading: string;
  whyUs: { title: string; text: string }[];
  areasHeading: string;
  areasIntro: string;
  areas: string[];
  deliveryHeading: string;
  deliveryParagraphs: string[];
  faqs: Faq[];
  related: RelatedLink[];
  illustration: IllustrationName;
}
