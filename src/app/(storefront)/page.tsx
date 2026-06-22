import Link from "next/link";
import { Section, SectionHead } from "@/components/content/Section";
import { Placeholder } from "@/components/ui/Placeholder";
import { ProductCard } from "@/components/commerce/ProductCard";
import { getHealthGoals, getFeaturedProducts } from "@/features/catalogue/queries";
import { site } from "@/config/site";

const proofCards = [
  {
    icon: "⊕",
    title: "Purposeful formulations",
    body: "Every product has a defensible nutritional reason to exist.",
  },
  {
    icon: "❀",
    title: "Traditional ingredients",
    body: "Millets, pulses, and regional grains in familiar Indian meal formats.",
  },
  {
    icon: "☰",
    title: "Transparent nutrition",
    body: "Clear ingredients, percentages, and allergen information — nothing hidden.",
  },
  {
    icon: "⌖",
    title: "Region-led sourcing",
    body: "Grain variety and region of origin shown wherever available.",
  },
];

const categoryTiles = [
  { name: "Millets", desc: "Whole grains, flours & blends", href: "/shop/millets" },
  {
    name: "Traditional Rice",
    desc: "Red, black, brown & regional varieties",
    href: "/shop/traditional-rice",
  },
  {
    name: "Ready-to-Cook Mixes",
    desc: "Khichdi, adai, kanji & roti mixes",
    href: "/shop/ready-to-cook-mixes",
  },
];

const steps = [
  { title: "Identify varieties", body: "Select suitable traditional grain varieties." },
  { title: "Source responsibly", body: "Source from verified regions and partners." },
  { title: "Clean & pack", body: "Clean, mill or blend, and pack to specification." },
  { title: "Share clearly", body: "Show nutrition, storage and pack information clearly." },
];

const b2bCards = [
  { title: "Retail & supermarkets", body: "Range, pack sizes, shelf life and wholesale enquiry." },
  { title: "Apartment communities", body: "Sampling events, group orders and wellness sessions." },
  { title: "Corporate wellness", body: "Healthy pantry products and curated gift boxes." },
  { title: "Nutrition professionals", body: "Education, content review and institutional purchase." },
];

export default async function HomePage() {
  const [goals, featured] = await Promise.all([
    getHealthGoals(),
    getFeaturedProducts(4),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="py-16">
        <div className="fo-container grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="fo-eyebrow">Healthy tradition made practical</p>
            <h1 className="mb-4 text-[clamp(2.3rem,5vw,3.4rem)]">{site.positioning}</h1>
            <p className="mb-8 max-w-[52ch] text-[1.1rem] text-fo-muted">
              Purposeful millet blends, traditional rice varieties, and ready-to-cook
              staples — thoughtfully sourced and made practical for modern Indian
              kitchens.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="fo-btn-primary">
                Shop Fresh Origins
              </Link>
              <Link href="/health-goals" className="fo-btn-secondary">
                Browse by Health Goal
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-[1.3fr_1fr] grid-rows-2 gap-4" aria-hidden="true">
            <div className="row-span-2">
              <Placeholder label="Product pack + prepared dish" className="h-full" />
            </div>
            <Placeholder label="Raw grains" />
            <Placeholder label="Cooked serving" />
          </div>
        </div>
      </section>

      {/* Browse by health goal */}
      <Section tight id="goals">
        <SectionHead eyebrow="Find food by purpose" title="Browse by health goal">
          <p className="mt-3 text-[0.9rem] text-fo-muted">
            Explore food choices and educational guidance — not medical treatment.
          </p>
        </SectionHead>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              href={`/health-goals/${goal.slug}`}
              className="block rounded-card border border-fo-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-fo-sage-100 text-[1.3rem] text-fo-green-900">
                {goal.icon ?? "◎"}
              </div>
              <h3 className="mb-1.5 text-[1.1rem]">{goal.name}</h3>
              <p className="text-[0.9rem] text-fo-muted">{goal.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured products */}
      <Section surface id="featured">
        <SectionHead eyebrow="Our launch range" title="Featured products" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {/* Why Fresh Origins */}
      <Section id="why">
        <SectionHead eyebrow="Why Fresh Origins" title="Better everyday food decisions" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {proofCards.map((card) => (
            <div
              key={card.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#eef3da] text-[1.3rem] text-fo-green-900">
                {card.icon}
              </div>
              <h3 className="mb-1.5 text-[1.1rem]">{card.title}</h3>
              <p className="text-[0.9rem] text-fo-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Browse by category */}
      <Section tight id="our-foods">
        <SectionHead eyebrow="Shop by category" title="Our foods" />
        <div className="grid gap-6 md:grid-cols-3">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              className="relative flex min-h-[280px] items-end overflow-hidden rounded-hero text-white"
            >
              <Placeholder className="absolute inset-0 !rounded-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-fo-charcoal-900/75 to-transparent" />
              <div className="relative z-10 p-6">
                <h3 className="mb-1 text-white">{tile.name}</h3>
                <p className="text-[0.9rem] text-[#e7f0e9]">{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Product in focus */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="rounded-hero bg-fo-sage-100 p-12">
            <Placeholder ratio="4x3" label="Prepared dish — khichdi bowl" />
          </div>
          <div>
            <p className="fo-eyebrow">Product in focus</p>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)]">Metabolic Balance Khichdi</h2>
            <p className="mt-3 text-fo-muted">
              Millet and moong blend for an easy, fibre-forward meal — a practical lunch
              or dinner option for families seeking higher-fibre staples.
            </p>
            <ul className="my-4 grid gap-2.5 text-[0.95rem]">
              {[
                "High fibre, no added sugar (validated badges)",
                "Ready in approximately 15–18 minutes",
                "May suit families seeking higher-fibre staples",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="font-bold text-fo-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href="/products/metabolic-balance-khichdi" className="fo-btn-primary">
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

      {/* From origin to pack */}
      <Section tight surface id="sourcing">
        <SectionHead eyebrow="How we work" title="From origin to pack" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <span className="font-display text-[2rem] font-[650] text-fo-green-600">
                {i + 1}
              </span>
              <h3 className="mb-1.5 mt-1 text-[1.1rem]">{step.title}</h3>
              <p className="text-[0.9rem] text-fo-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Recipes teaser */}
      <Section id="learn">
        <SectionHead eyebrow="Learn" title="Recipes matched to products" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Vegetable millet khichdi bowl", meta: "Lunch · 25 min", href: "/recipes/vegetable-millet-khichdi-bowl" },
            { title: "Protein adai with chutney", meta: "Breakfast · 20 min", href: "/recipes" },
            { title: "Savoury heritage kanji", meta: "Light dinner · 30 min", href: "/recipes" },
            { title: "White rice to millets: a guide", meta: "Health education · 6 min read", href: "/learn/white-rice-to-millets" },
          ].map((recipe) => (
            <Link
              key={recipe.title}
              href={recipe.href}
              className="overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card"
            >
              <Placeholder ratio="4x3" className="!rounded-none" />
              <div className="p-4">
                <h3 className="mb-1 text-[1rem]">{recipe.title}</h3>
                <p className="text-[0.82rem] text-fo-muted">{recipe.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* B2B strip */}
      <Section id="business">
        <div className="rounded-hero bg-fo-green-900 p-12 text-[#eafbef]">
          <p className="fo-eyebrow text-fo-lime-500">Partner with us</p>
          <h2 className="text-white">For business</h2>
          <p className="max-w-[60ch] text-[#c8ddce]">
            Tailored proof points and a dedicated enquiry path for every partner type.
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
