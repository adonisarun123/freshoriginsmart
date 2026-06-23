import Link from "next/link";
import Image from "next/image";
import { Section, SectionHead } from "@/components/content/Section";
import {
  Illustration,
  type IllustrationName,
} from "@/components/brand/Illustration";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Icon } from "@/components/ui/Icon";
import {
  getHealthGoals,
  getFeaturedProducts,
} from "@/features/catalogue/queries";
import { site } from "@/config/site";

/* -------------------------------------------------------------------------- */
/*  Static content (factual, claim-disciplined — no urgency / fake scarcity)  */
/* -------------------------------------------------------------------------- */

const heroProofChips = [
  "Traditional millets & pulses",
  "No maida",
  "No added sugar",
  "Bangalore & Hosur delivery",
] as const;

const ordinaryStaples = [
  "Refined grains & maida",
  "Often contains added sugar",
  "Lower in dietary fibre",
  "Single-grain monotony",
] as const;

const freshOriginsSwap = [
  "Whole millets & pulses",
  "No maida, no added sugar",
  "Higher in fibre*",
  "Grain + pulse variety",
] as const;

const benefits = [
  {
    icon: "sparkle",
    title: "Purposeful formulations",
    body: "Every product has a defensible nutritional reason to exist.",
  },
  {
    icon: "sprout",
    title: "Whole millets & pulses",
    body: "Traditional grains and pulses in familiar Indian meal formats.",
  },
  {
    icon: "clipboard",
    title: "Transparent nutrition & allergens",
    body: "Clear ingredients, percentages and allergen information — nothing hidden.",
  },
  {
    icon: "map-pin",
    title: "Region-led sourcing",
    body: "Grain variety and region of origin shown wherever available.",
  },
  {
    icon: "leaf",
    title: "No maida, no added sugar",
    body: "Refined-flour-free staples without added sugar across the range.",
  },
  {
    icon: "shield",
    title: "Expert-reviewed content",
    body: "Educational guidance reviewed for accuracy — never medical advice.",
  },
] as const;

const steps = [
  {
    title: "Choose your staple",
    body: "Pick a millet, traditional rice or ready-to-cook mix that suits your meal.",
  },
  {
    title: "Cook the familiar way",
    body: "Prepare it just like the staples you already know — no new habits needed.",
  },
  {
    title: "Enjoy a better everyday meal",
    body: "A higher-fibre*, whole-grain plate for the table you already cook for.",
  },
];

const focusHighlights = [
  "Whole millet & moong blend — no maida",
  "No added sugar; higher-fibre* staple",
  "Ready in approximately 15–18 minutes",
] as const;

const sampleTestimonials = [
  {
    quote:
      "Swapping our weeknight rice for the millet khichdi was effortless — the family didn't even notice the change, except it kept us full longer.",
    name: "Ananya R.",
    city: "Bangalore",
  },
  {
    quote:
      "I like that the packs spell out the grains and allergens plainly. It made choosing a higher-fibre staple a simple decision.",
    name: "Vikram S.",
    city: "Hosur",
  },
  {
    quote:
      "Delivery across Bangalore was smooth and the ready-to-cook mixes have become a regular part of our pantry.",
    name: "Meera K.",
    city: "Bangalore",
  },
] as const;

const categoryTiles: {
  name: string;
  desc: string;
  href: string;
  illu: IllustrationName;
}[] = [
  {
    name: "Millets",
    desc: "Whole grains, flours & blends",
    href: "/shop/millets",
    illu: "millets",
  },
  {
    name: "Traditional Rice",
    desc: "Red, black, brown & regional varieties",
    href: "/shop/traditional-rice",
    illu: "rice",
  },
  {
    name: "Ready-to-Cook Mixes",
    desc: "Khichdi, adai, kanji & roti mixes",
    href: "/shop/ready-to-cook-mixes",
    illu: "mixes",
  },
];

const recipeTeasers = [
  {
    title: "Vegetable millet khichdi bowl",
    meta: "Lunch · 25 min",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
  {
    title: "Protein adai with chutney",
    meta: "Breakfast · 20 min",
    href: "/recipes",
  },
  {
    title: "Savoury heritage kanji",
    meta: "Light dinner · 30 min",
    href: "/recipes",
  },
  {
    title: "Mixed millet pongal",
    meta: "Comfort meal · 30 min",
    href: "/recipes",
  },
];

const b2bCards = [
  {
    title: "Retail & supermarkets",
    body: "Range, pack sizes, shelf life and wholesale enquiry.",
  },
  {
    title: "Apartment communities",
    body: "Sampling events, group orders and wellness sessions.",
  },
  {
    title: "Corporate wellness",
    body: "Healthy pantry products and curated gift boxes.",
  },
  {
    title: "Nutrition professionals",
    body: "Education, content review and institutional purchase.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Small presentational sub-components                                        */
/* -------------------------------------------------------------------------- */

function ProofChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-fo-line bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold text-fo-green-900">
      <span className="text-fo-green-600">✓</span>
      {label}
    </span>
  );
}

function SwapRow({
  label,
  positive,
}: {
  label: string;
  positive: boolean;
}) {
  return (
    <li className="flex items-start gap-3 py-2.5 text-[0.95rem]">
      <span
        aria-hidden="true"
        className={
          positive
            ? "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fo-green-600 text-[0.8rem] font-bold text-white"
            : "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fo-sage-100 text-[0.8rem] font-bold text-fo-earth-700"
        }
      >
        {positive ? "✓" : "✕"}
      </span>
      <span className={positive ? "text-fo-green-900" : "text-fo-earth-700"}>
        {label}
      </span>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function HomePage() {
  const [goals, featured] = await Promise.all([
    getHealthGoals(),
    getFeaturedProducts(4),
  ]);

  return (
    <>
      {/* 1. HERO */}
      <section className="py-16">
        <div className="fo-container grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="fo-eyebrow">Healthy tradition made practical</p>
            <h1 className="mb-4 text-[clamp(2.3rem,5vw,3.4rem)]">
              Traditional foods for healthier everyday living.
            </h1>
            <p className="mb-6 max-w-[52ch] text-[1.1rem] text-fo-muted">
              {site.description}
            </p>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {heroProofChips.map((chip) => (
                <ProofChip key={chip} label={chip} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="fo-btn-primary">
                Shop Fresh Origins
              </Link>
              <Link href="/health-goals" className="fo-btn-secondary">
                Browse by health goal
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-hero bg-fo-cream-50">
            <Image
              src="https://ik.imagekit.io/freshoriginsmart/web%20images/hero-image-fresh-origins.png"
              alt="Fresh Origins millets, pulses and a ready-to-cook pack"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* 2. THE EVERYDAY SWAP */}
      <Section surface id="the-swap">
        <SectionHead
          eyebrow="The everyday swap"
          title="A simple change to your daily staples"
        >
          <p className="mt-3 text-fo-muted">
            Most of us cook the same refined staples out of habit. Fresh Origins
            keeps the meals familiar while quietly upgrading what goes into them.
          </p>
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-fo-line bg-fo-cream-50 p-7">
            <h3 className="mb-2 text-[1.15rem] text-fo-earth-700">
              Ordinary refined staples
            </h3>
            <ul className="divide-y divide-fo-line">
              {ordinaryStaples.map((item) => (
                <SwapRow key={item} label={item} positive={false} />
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-fo-green-500/30 bg-fo-sage-100 p-7">
            <h3 className="mb-2 text-[1.15rem] text-fo-green-900">
              The Fresh Origins swap
            </h3>
            <ul className="divide-y divide-fo-green-500/20">
              {freshOriginsSwap.map((item) => (
                <SwapRow key={item} label={item} positive={true} />
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 max-w-editorial text-[0.85rem] text-fo-muted">
          *Fibre content varies by product; see each pack for verified nutrition
          information. This is about everyday grain choices — cook what your
          family already enjoys, made with whole grains and pulses.
        </p>
      </Section>

      {/* 3. BROWSE BY HEALTH GOAL */}
      <Section tight id="goals">
        <SectionHead eyebrow="Find food by purpose" title="Browse by health goal">
          <p className="mt-3 text-[0.9rem] text-fo-muted">
            Explore food choices and educational guidance — not medical
            treatment.
          </p>
        </SectionHead>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              href={`/health-goals/${goal.slug}`}
              className="block rounded-card border border-fo-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-fo-sage-100 text-fo-green-900">
                <Icon name="leaf" size={22} />
              </div>
              <h3 className="mb-1.5 text-[1.1rem]">{goal.name}</h3>
              <p className="text-[0.9rem] text-fo-muted">{goal.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 4. FEATURED PRODUCTS */}
      <Section surface id="featured">
        <SectionHead eyebrow="Shop the range" title="Our launch range">
          <div className="mt-4">
            <Link href="/shop" className="fo-btn-secondary">
              View all products
            </Link>
          </div>
        </SectionHead>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {/* 5. WHY FRESH ORIGINS */}
      <Section id="why">
        <SectionHead
          eyebrow="Why Fresh Origins"
          title="Better everyday food decisions"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((card) => (
            <div
              key={card.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#eef3da] text-fo-green-900">
                <Icon name={card.icon} size={22} />
              </div>
              <h3 className="mb-1.5 text-[1.1rem]">{card.title}</h3>
              <p className="text-[0.9rem] text-fo-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. HOW IT WORKS */}
      <Section tight surface id="how-it-works">
        <SectionHead eyebrow="How it works" title="Three simple steps" />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-card border border-fo-line bg-white p-7"
            >
              <span className="font-display text-[2.4rem] font-[650] leading-none text-fo-green-600">
                {i + 1}
              </span>
              <h3 className="mb-1.5 mt-3 text-[1.15rem]">{step.title}</h3>
              <p className="text-[0.9rem] text-fo-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. PRODUCT IN FOCUS */}
      <Section id="in-focus">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="rounded-hero bg-fo-sage-100 p-12">
            <Illustration
              name="bowl"
              className="aspect-[4/3] rounded-card"
              title="Vegetable millet khichdi bowl"
            />
          </div>
          <div>
            <p className="fo-eyebrow">Product in focus</p>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)]">
              Metabolic Balance Khichdi
            </h2>
            <p className="mt-3 text-fo-muted">
              A whole millet and moong blend for an easy, fibre-forward meal — a
              practical lunch or dinner option for families seeking higher-fibre*
              staples, cooked exactly the way you already make khichdi.
            </p>
            <ul className="my-4 grid gap-2.5 text-[0.95rem]">
              {focusHighlights.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="font-bold text-fo-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products/metabolic-balance-khichdi"
                className="fo-btn-primary"
              >
                Shop this product
              </Link>
              <Link
                href="/recipes/vegetable-millet-khichdi-bowl"
                className="fo-btn-secondary"
              >
                View recipe
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. FOUNDER / BRAND PROMISE */}
      <Section surface id="promise">
        <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div className="mx-auto w-full max-w-[320px]">
            <Illustration
              name="field"
              className="aspect-[4/3] rounded-card"
              title="Fresh Origins sourcing fields"
            />
          </div>
          <figure className="max-w-editorial">
            <p className="fo-eyebrow">Our promise</p>
            <blockquote className="font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-snug text-fo-green-900">
              “We started Fresh Origins to make traditional, whole-grain eating
              practical again — keeping the meals our families already love, and
              quietly making them better. No maida, no added sugar, nothing
              hidden on the pack.”
            </blockquote>
            <figcaption className="mt-5 text-[0.95rem] font-semibold text-fo-earth-700">
              [Founder name], Fresh Origins
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* 9. SOCIAL PROOF */}
      <Section id="reviews">
        <SectionHead eyebrow="From our community" title="What people are saying">
          <p className="mt-3 text-[0.85rem] text-fo-muted">
            Sample testimonials shown during launch — illustrative only, until
            verified customer reviews are available.
          </p>
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-3">
          {sampleTestimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-card border border-fo-line bg-white p-6"
            >
              <div
                className="mb-3 text-[1rem] text-fo-lime-500"
                aria-label="Five out of five stars (sample rating)"
              >
                ★★★★★
              </div>
              <blockquote className="flex-1 text-[0.95rem] text-fo-earth-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-[0.85rem] font-semibold text-fo-green-900">
                {t.name}, {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* 10. BROWSE BY CATEGORY */}
      <Section tight surface id="our-foods">
        <SectionHead eyebrow="Shop by category" title="Our foods" />
        <div className="grid gap-6 md:grid-cols-3">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              className="group flex flex-col overflow-hidden rounded-hero border border-fo-line bg-white transition hover:shadow-card"
            >
              <Illustration
                name={tile.illu}
                className="aspect-[4/3] w-full"
                title={tile.name}
              />
              <div className="p-6">
                <h3 className="mb-1 text-fo-green-900 group-hover:text-fo-green-600">
                  {tile.name}
                </h3>
                <p className="text-[0.9rem] text-fo-muted">{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 11. RECIPES TEASER */}
      <Section id="learn">
        <SectionHead eyebrow="Learn" title="Recipes matched to products">
          <div className="mt-4">
            <Link href="/recipes" className="fo-btn-secondary">
              Browse all recipes
            </Link>
          </div>
        </SectionHead>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recipeTeasers.map((recipe) => (
            <Link
              key={recipe.title}
              href={recipe.href}
              className="overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card"
            >
              <Illustration
                name="bowl"
                className="aspect-[4/3]"
                title={recipe.title}
              />
              <div className="p-4">
                <h3 className="mb-1 text-[1rem]">{recipe.title}</h3>
                <p className="text-[0.82rem] text-fo-muted">{recipe.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 12. B2B STRIP */}
      <Section id="business">
        <div className="rounded-hero bg-fo-green-900 p-12 text-[#eafbef]">
          <p className="fo-eyebrow text-fo-lime-500">Partner with us</p>
          <h2 className="text-white">For business</h2>
          <p className="max-w-[60ch] text-[#c8ddce]">
            Tailored proof points and a dedicated enquiry path for every partner
            type.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {b2bCards.map((card) => (
              <div
                key={card.title}
                className="rounded-card border border-white/15 bg-white/[0.07] p-6"
              >
                <h3 className="text-[1rem] text-white">{card.title}</h3>
                <p className="text-[0.85rem] text-[#c8ddce]">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/for-business"
              className="fo-btn-secondary border-white bg-white"
            >
              Explore partnerships
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
