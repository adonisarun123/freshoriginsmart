import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Placeholder } from "@/components/ui/Placeholder";
import {
  getCategories,
  getProductsByCategory,
} from "@/features/catalogue/queries";
import type { Category } from "@/types/database";

type PageProps = { params: { slug: string } };

/* -------------------------------------------------------------------------- */
/*  Per-category content (factual, claim-disciplined — no urgency/scarcity)    */
/* -------------------------------------------------------------------------- */

type MiniCard = { title: string; body: string };
type FaqItem = { title: string; body: string };
type GoalPill = { label: string; slug: string };
type RecipeTeaser = { title: string; meta: string; href: string };

type TableSpec = {
  caption?: string;
  headers: string[];
  rows: string[][];
  /** zero-based column indices that should render with tabular-nums */
  numericCols?: number[];
};

type CategoryContent = {
  eyebrow: string;
  heroImageLabel: string;
  intro: string;
  contains: string;
  containsCards: MiniCard[];
  educationEyebrow: string;
  educationTitle: string;
  educationIntro?: string;
  table: TableSpec;
  /** Optional note shown under the education table */
  tableNote?: string;
  /** Optional secondary explainer cards under the table */
  explainerCards?: { eyebrow: string; cards: MiniCard[] };
  chooseTitle: string;
  chooseBody: string;
  chooseTips: string[];
  faqs: FaqItem[];
  goals: GoalPill[];
  recipes: RecipeTeaser[];
};

const categoryContent: Record<string, CategoryContent> = {
  millets: {
    eyebrow: "Shop by category",
    heroImageLabel: "Whole millets, flours & blends",
    intro:
      "Whole grains, flours and blends from the millet family — small, hardy grains that have been part of Indian kitchens for generations. Cook them much like rice, stir them into khichdi and pongal, or use the flours for rotis and dosas. Each pack states the grain variety and, where available, its region of origin.",
    contains:
      "This category brings together whole millet grains, freshly milled millet flours, and ready-to-cook millet blends. Whole grains keep their bran for a firmer, nuttier bite; flours suit rotis, dosas and baking; blends take the guesswork out of mixing varieties and ratios.",
    containsCards: [
      {
        title: "Whole grains",
        body: "Foxtail, barnyard, little, kodo and pearl (bajra) millet — cooked like rice or added to khichdi and pongal.",
      },
      {
        title: "Flours",
        body: "Stone-style milled millet flours for rotis, dosas and everyday baking, with no maida added.",
      },
      {
        title: "Blends",
        body: "Balanced multi-millet mixes that simplify cooking ratios — a comfortable place to start.",
      },
    ],
    educationEyebrow: "Know your millets",
    educationTitle: "A quick guide to millet types",
    educationIntro:
      "A starting point for choosing — taste, texture and cooking vary by variety. Always check the pack for the exact cooking ratio.",
    table: {
      caption: "Indicative guidance; cooking times vary by soak and stove.",
      headers: ["Millet", "Taste / texture", "Cooking ratio", "Best for", "Cooking time"],
      rows: [
        ["Foxtail", "Mild, soft, fluffy", "1 : 2.5", "First millet, pulao, khichdi", "18–20 min"],
        ["Barnyard", "Light, delicate", "1 : 3", "Upma, kheer, fasting meals", "15–18 min"],
        ["Little", "Soft, slightly nutty", "1 : 2.5", "Rice swap, lemon-style rice", "18–20 min"],
        ["Kodo", "Nutty, holds shape", "1 : 2.5", "Pilafs, salads, pongal", "20–25 min"],
        ["Pearl (Bajra)", "Hearty, full-flavoured", "1 : 3", "Rotis, bhakri, winter meals", "25–30 min"],
      ],
      numericCols: [2, 4],
    },
    tableNote:
      "New to millets? A balanced blend takes the guesswork out of ratios while you find the varieties you enjoy.",
    explainerCards: {
      eyebrow: "Whole grain, flour or blend?",
      cards: [
        {
          title: "Whole grain",
          body: "Keeps the bran for more fibre* and a firmer bite. Best for rice-style meals, khichdi and pongal. Stores longest.",
        },
        {
          title: "Flour",
          body: "Freshly milled for rotis, dosas and baking. Buy in quantities you'll use within a few weeks for the best flavour.",
        },
        {
          title: "Blend",
          body: "A balanced mix of millets at a tested ratio — convenient and consistent, ideal when you're starting out.",
        },
      ],
    },
    chooseTitle: "How to cook with millets",
    chooseBody:
      "Millets cook much like rice with a little more water and a short rest at the end. A 20–30 minute soak softens the grain, shortens cooking and improves texture.",
    chooseTips: [
      "Rinse well, then soak 20–30 minutes before cooking.",
      "Use the ratio printed on the pack — most sit between 1:2.5 and 1:3 (millet:water).",
      "Rest covered for 5 minutes off the heat so the grains finish steaming.",
      "Start with foxtail or barnyard if millets are new to your table.",
    ],
    faqs: [
      {
        title: "Are millets gluten-free?",
        body: "Most millets are naturally free from gluten. If you need strict gluten-free assurance, check each pack — processing and shared facilities are noted where relevant (gluten-free* subject to controlled processing).",
      },
      {
        title: "How are millets different from rice?",
        body: "Millets keep their bran, so they tend to be higher in fibre* and have a firmer, nuttier bite than polished white rice. They usually need a little more water and a slightly longer cook.",
      },
      {
        title: "Do I need to soak millets before cooking?",
        body: "Soaking is optional but recommended. A 20–30 minute soak softens the grain, shortens the cook time and improves texture.",
      },
      {
        title: "Which millet should I try first?",
        body: "Foxtail and barnyard millet are mild and forgiving, cooking much like rice — a comfortable first choice. A balanced blend is another easy way to start.",
      },
    ],
    goals: [
      { label: "Protein & Fibre", slug: "protein-and-fibre" },
      { label: "Gut Health", slug: "gut-health" },
      { label: "Blood-Sugar-Conscious", slug: "blood-sugar-conscious-eating" },
    ],
    recipes: [
      {
        title: "Vegetable millet khichdi bowl",
        meta: "Lunch · 25 min",
        href: "/recipes/vegetable-millet-khichdi-bowl",
      },
      { title: "Mixed millet pongal", meta: "Comfort meal · 30 min", href: "/recipes" },
      { title: "Foxtail millet lemon rice", meta: "Lunch · 20 min", href: "/recipes" },
    ],
  },

  "traditional-rice": {
    eyebrow: "Shop by category",
    heroImageLabel: "Red, black & brown traditional rice",
    intro:
      "Red, black, brown and regional rice varieties that keep more of their bran than polished white rice. The result is more fibre*, a firmer bite and a nuttier flavour, with each variety carrying its own region of origin. A short soak and a little extra water are all most of them need.",
    contains:
      "This category gathers whole and semi-polished traditional rice — red, black and brown varieties alongside regional heirlooms. They retain the bran layer for more fibre* and character, and each pack states the variety, region and recommended cooking ratio.",
    containsCards: [
      {
        title: "Coloured rice",
        body: "Red and black varieties keep their pigmented bran for a firm, nutty bite and distinctive colour.",
      },
      {
        title: "Brown rice",
        body: "Lightly milled to retain the bran — a familiar, versatile everyday swap for polished white rice.",
      },
      {
        title: "Regional heirlooms",
        body: "Traditional varieties tied to a region of origin, shown on the pack wherever available.",
      },
    ],
    educationEyebrow: "Know your rice",
    educationTitle: "A guide to traditional rice varieties",
    educationIntro:
      "A starting point for choosing. Colour, texture and cooking vary by variety — always follow the cooking ratio on the pack.",
    table: {
      caption: "Indicative guidance; soak and stove affect timing.",
      headers: ["Variety", "Region", "Colour / texture", "Typical use", "Cooking ratio"],
      rows: [
        ["Red rice", "Western Ghats / Kerala", "Russet bran, firm & nutty", "Everyday meals, biryani", "1 : 2.5"],
        ["Black rice", "North-East India", "Deep purple, chewy", "Pulao, kheer, salads", "1 : 2.5"],
        ["Brown rice", "Pan-Indian", "Tan bran, mild & versatile", "Daily rice swap", "1 : 2.25"],
        ["Sona Masoori (semi-polished)", "Karnataka / Andhra", "Light, soft, aromatic", "Daily meals, pongal", "1 : 2"],
      ],
      numericCols: [4],
    },
    tableNote:
      "Each variety has its own approved positioning — we don't automatically tie a rice to a health condition.",
    chooseTitle: "How to cook traditional rice",
    chooseBody:
      "Whole and coloured rice keep their bran, so they need a little more water and a longer cook than polished white rice. Soaking makes a noticeable difference to texture and time.",
    chooseTips: [
      "Rinse, then soak 30–45 minutes (longer for black rice) before cooking.",
      "Follow the ratio on the pack — most whole varieties sit around 1:2.25 to 1:2.5.",
      "Cook a touch longer than white rice; rest covered for 5–10 minutes.",
      "Pressure cooking works well — reduce water slightly and use 3–4 whistles.",
    ],
    faqs: [
      {
        title: "How is traditional rice different from white rice?",
        body: "Traditional red, black and brown rice keep more of their bran, so they tend to be higher in fibre* and have a firmer, nuttier bite than polished white rice. They usually need more water and a longer cook.",
      },
      {
        title: "Do I need to soak it?",
        body: "Soaking is recommended for whole and coloured rice. Allow 30–45 minutes, and a little longer for black rice, to soften the bran and shorten cooking.",
      },
      {
        title: "Can I cook it in a pressure cooker?",
        body: "Yes. Pressure cooking suits whole rice well — reduce the water slightly versus open-pot cooking and allow 3–4 whistles, then let the pressure release naturally.",
      },
      {
        title: "Is one variety healthier than another?",
        body: "Each variety has its own approved positioning. We describe colour, texture and typical use rather than tying any single rice to a specific health condition. Check each pack for verified nutrition information.",
      },
    ],
    goals: [
      { label: "Gut Health", slug: "gut-health" },
      { label: "Blood-Sugar-Conscious", slug: "blood-sugar-conscious-eating" },
      { label: "Protein & Fibre", slug: "protein-and-fibre" },
    ],
    recipes: [
      { title: "Red rice vegetable bisi bele bath", meta: "Lunch · 35 min", href: "/recipes" },
      { title: "Black rice kheer", meta: "Dessert · 40 min", href: "/recipes" },
      { title: "Brown rice curd rice", meta: "Light meal · 20 min", href: "/recipes" },
    ],
  },

  "ready-to-cook-mixes": {
    eyebrow: "Shop by category",
    heroImageLabel: "Khichdi, adai, kanji & roti mixes",
    intro:
      "Khichdi, adai, kanji and roti mixes built from whole millets, pulses and traditional grains — cooked the familiar way, with nutrition stated per serving. Each mix exists for a defensible reason: a higher-fibre* breakfast, a protein-forward tiffin, or a comforting one-pot dinner without maida or added sugar.",
    contains:
      "This category holds purposeful, ready-to-cook blends for everyday Indian meals. Each mix combines millets and pulses in a tested ratio so you can cook khichdi, adai, kanji or roti the way you already do — with the grains, allergens and nutrition spelled out on the pack.",
    containsCards: [
      {
        title: "One-pot meals",
        body: "Khichdi and kanji mixes for comforting, fibre-forward lunches and light dinners.",
      },
      {
        title: "Breakfast & tiffin",
        body: "Adai and dosa-style mixes that bring protein and pulses to the morning plate.",
      },
      {
        title: "Rotis & flatbreads",
        body: "Multi-grain roti and chapati mixes — no maida, ready to knead and roll.",
      },
    ],
    educationEyebrow: "Choosing a mix",
    educationTitle: "How to choose a ready-to-cook mix",
    educationIntro:
      "Match a mix to the meal occasion and the nutrition you're after. Protein and fibre are stated per serving on every pack.",
    table: {
      caption: "Indicative guidance; see each pack for verified nutrition per serving.",
      headers: ["Mix type", "Meal occasion", "Cook style", "Look for"],
      rows: [
        ["Khichdi", "Lunch / dinner", "One pot, ~15–18 min", "Higher fibre*, easy comfort meal"],
        ["Adai / dosa", "Breakfast / tiffin", "Batter, pan-cooked", "Protein from pulses"],
        ["Kanji", "Light dinner", "Slow-simmered porridge", "Gentle, gut-friendly grains"],
        ["Roti / chapati", "Any meal", "Knead & roll", "No maida; multi-grain base"],
      ],
    },
    explainerCards: {
      eyebrow: "Why a ready-to-cook mix",
      cards: [
        {
          title: "Convenience",
          body: "Pre-measured grains and pulses in a tested ratio — cook the familiar dish without weighing or blending.",
        },
        {
          title: "Ingredient transparency",
          body: "Every grain, pulse and allergen is listed on the pack. No maida, no added sugar, nothing hidden.",
        },
        {
          title: "Nutrition per serving",
          body: "Protein and fibre are stated per serving so you can choose a meal that matches your goal with confidence.",
        },
      ],
    },
    chooseTitle: "How to cook the mixes",
    chooseBody:
      "Each mix is made to cook the way you already prepare the dish. Follow the pack instructions — most one-pot mixes are ready in around 15–18 minutes.",
    chooseTips: [
      "Start from the meal occasion: breakfast, tiffin, or lunch/dinner.",
      "Compare protein and fibre per serving on the pack to match your goal.",
      "One-pot khichdi mixes suit pressure cooking; batter mixes need a short rest.",
      "Check the allergen line if you're cooking for specific dietary needs.",
    ],
    faqs: [
      {
        title: "What's actually in the mixes?",
        body: "Whole millets, pulses and traditional grains in a tested ratio — with every ingredient and allergen listed on the pack. There is no maida and no added sugar across the range.",
      },
      {
        title: "How long do they take to cook?",
        body: "It depends on the dish. Most one-pot khichdi mixes are ready in around 15–18 minutes; batter-based adai and dosa mixes need a short rest before pan-cooking.",
      },
      {
        title: "Are the mixes suitable for specific diets?",
        body: "Each pack states grains, pulses and allergens plainly, and notes wheat-free or gluten-free* status where it applies. Check the pack to match your dietary needs.",
      },
      {
        title: "How do I compare two mixes?",
        body: "Look at the meal occasion and the protein and fibre stated per serving. The Shop page also has a side-by-side comparison of the range to help you choose.",
      },
    ],
    goals: [
      { label: "Protein & Fibre", slug: "protein-and-fibre" },
      { label: "Gut Health", slug: "gut-health" },
      { label: "Senior Nutrition", slug: "senior-nutrition" },
    ],
    recipes: [
      {
        title: "Vegetable millet khichdi bowl",
        meta: "Lunch · 25 min",
        href: "/recipes/vegetable-millet-khichdi-bowl",
      },
      { title: "Protein adai with chutney", meta: "Breakfast · 20 min", href: "/recipes" },
      { title: "Savoury heritage kanji", meta: "Light dinner · 30 min", href: "/recipes" },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Data helpers + Next.js metadata                                            */
/* -------------------------------------------------------------------------- */

async function resolveCategory(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const category = await resolveCategory(params.slug);
  if (!category) return { title: "Category" };
  const content = categoryContent[params.slug];
  return {
    title: `Shop ${category.name}`,
    description:
      category.description ??
      content?.intro ??
      `Shop Fresh Origins ${category.name}. Transparent ingredients and nutrition, delivering across Bangalore and Hosur.`,
  };
}

/* -------------------------------------------------------------------------- */
/*  Presentational sub-components                                              */
/* -------------------------------------------------------------------------- */

function MiniCardGrid({ cards }: { cards: MiniCard[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-card border border-fo-line bg-white p-6"
        >
          <h3 className="mb-1.5 text-[1.1rem]">{card.title}</h3>
          <p className="text-[0.9rem] text-fo-muted">{card.body}</p>
        </div>
      ))}
    </div>
  );
}

function GuideTable({ table }: { table: TableSpec }) {
  const numeric = new Set(table.numericCols ?? []);
  return (
    <div className="overflow-x-auto rounded-card border border-fo-line">
      <table className="w-full min-w-[680px] border-collapse text-left text-[0.9rem]">
        {table.caption && (
          <caption className="caption-bottom px-4 py-3 text-left text-[0.8rem] text-fo-muted">
            {table.caption}
          </caption>
        )}
        <thead>
          <tr className="bg-fo-sage-100 text-fo-green-900">
            {table.headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]} className="border-t border-fo-line align-top">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="px-4 py-3 font-semibold text-fo-green-900"
                  >
                    {cell}
                  </th>
                ) : (
                  <td
                    key={i}
                    className={`px-4 py-3 text-fo-muted${
                      numeric.has(i) ? " tabular-nums" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function CategoryPage({ params }: PageProps) {
  const category = await resolveCategory(params.slug);
  if (!category) notFound();

  const products = await getProductsByCategory(params.slug);
  const content = categoryContent[params.slug];

  const intro = content?.intro ?? category.description ?? undefined;

  return (
    <>
      <div className="fo-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: category.name },
          ]}
        />
      </div>

      {/* 1. CATEGORY HERO */}
      <section className="py-12 sm:py-16">
        <div className="fo-container grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="fo-eyebrow">{content?.eyebrow ?? "Shop by category"}</p>
            <h1 className="mb-4 text-[clamp(2.1rem,4.5vw,3.1rem)]">
              {category.name}
            </h1>
            {intro && (
              <p className="mb-6 max-w-[58ch] text-[1.05rem] text-fo-muted">
                {intro}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link href="#products" className="fo-btn-primary">
                Shop {category.name.toLowerCase()}
              </Link>
              <Link href="/health-goals" className="fo-btn-secondary">
                Browse by health goal
              </Link>
            </div>
          </div>
          <div aria-hidden="true">
            <Placeholder
              ratio="4x3"
              label={content?.heroImageLabel ?? category.name}
            />
          </div>
        </div>
      </section>

      {/* 2. WHAT THIS CATEGORY CONTAINS */}
      {content && (
        <Section tight surface id="about-category">
          <SectionHead
            eyebrow="What's in this category"
            title={`What ${category.name.toLowerCase()} covers`}
          >
            <p className="mt-3 text-fo-muted">{content.contains}</p>
          </SectionHead>
          <MiniCardGrid cards={content.containsCards} />
        </Section>
      )}

      {/* 3. PER-CATEGORY EDUCATION BLOCK */}
      {content && (
        <Section id="guide">
          <SectionHead
            eyebrow={content.educationEyebrow}
            title={content.educationTitle}
          >
            {content.educationIntro && (
              <p className="mt-3 text-fo-muted">{content.educationIntro}</p>
            )}
          </SectionHead>
          <GuideTable table={content.table} />
          {content.tableNote && (
            <p className="mt-5 max-w-editorial text-[0.85rem] text-fo-muted">
              {content.tableNote}
            </p>
          )}
          {content.explainerCards && (
            <div className="mt-12">
              <p className="fo-eyebrow">{content.explainerCards.eyebrow}</p>
              <div className="mt-6">
                <MiniCardGrid cards={content.explainerCards.cards} />
              </div>
            </div>
          )}
        </Section>
      )}

      {/* 4. PRODUCT GRID */}
      <Section tight surface id="products">
        <SectionHead eyebrow="Shop the range" title={`Shop ${category.name}`} />
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-fo-line bg-white p-10 text-center">
            <p className="mb-4 text-fo-muted">
              Products in this category are coming soon. Explore the rest of the
              range in the meantime.
            </p>
            <Link href="/shop" className="fo-btn-primary">
              Browse all products
            </Link>
          </div>
        )}
      </Section>

      {/* 5. HOW TO CHOOSE / PREPARATION */}
      {content && (
        <Section id="how-to-choose">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="rounded-hero bg-fo-sage-100 p-12">
              <Placeholder ratio="4x3" label="Preparation & cooking" />
            </div>
            <div>
              <p className="fo-eyebrow">How to choose &amp; cook</p>
              <h2 className="text-[clamp(1.7rem,3vw,2.3rem)]">
                {content.chooseTitle}
              </h2>
              <p className="mt-3 text-fo-muted">{content.chooseBody}</p>
              <ul className="mt-5 grid gap-2.5 text-[0.95rem]">
                {content.chooseTips.map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <span className="font-bold text-fo-green-600">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* 6. FAQ ACCORDION */}
      {content && (
        <Section tight surface id="faq">
          <SectionHead eyebrow="Good to know" title="Frequently asked questions" />
          <div className="max-w-editorial divide-y divide-fo-line rounded-card border border-fo-line bg-white">
            {content.faqs.map((faq) => (
              <details key={faq.title} className="group px-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-semibold text-fo-green-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.title}
                  <span
                    aria-hidden="true"
                    className="text-fo-green-600 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[0.95rem] text-fo-muted">{faq.body}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* 7. RELATED HEALTH GOALS + RECIPES TEASER */}
      {content && (
        <Section id="related">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="fo-eyebrow">Find food by purpose</p>
              <h2 className="text-[clamp(1.5rem,2.6vw,2rem)]">
                Related health goals
              </h2>
              <p className="mt-3 text-[0.9rem] text-fo-muted">
                Explore food choices and educational guidance — not medical
                treatment.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {content.goals.map((goal) => (
                  <Link
                    key={goal.slug}
                    href={`/health-goals/${goal.slug}`}
                    className="inline-flex items-center rounded-pill border border-fo-line bg-white px-4 py-2 text-[0.9rem] font-semibold text-fo-green-900 transition hover:border-fo-green-600 hover:shadow-card"
                  >
                    {goal.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="fo-eyebrow">Learn</p>
                  <h2 className="text-[clamp(1.5rem,2.6vw,2rem)]">
                    Recipes to try
                  </h2>
                </div>
                <Link href="/recipes" className="fo-btn-secondary shrink-0">
                  All recipes
                </Link>
              </div>
              <ul className="mt-5 divide-y divide-fo-line rounded-card border border-fo-line bg-white">
                {content.recipes.map((recipe) => (
                  <li key={recipe.title}>
                    <Link
                      href={recipe.href}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-fo-cream-50"
                    >
                      <span>
                        <span className="block text-[0.98rem] font-semibold text-fo-green-900">
                          {recipe.title}
                        </span>
                        <span className="block text-[0.82rem] text-fo-muted">
                          {recipe.meta}
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-fo-green-600">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
