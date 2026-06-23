import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section } from "@/components/content/Section";
import { Illustration } from "@/components/brand/Illustration";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Simple, practical recipes matched to Fresh Origins products — millet khichdi bowls, protein adai, heritage kanji, and more.",
};

const recipes = [
  {
    title: "Vegetable millet khichdi bowl",
    meta: "Lunch · 25 min",
    desc: "A comforting one-pot bowl made with Metabolic Balance Khichdi and everyday vegetables.",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
  {
    title: "Protein adai with chutney",
    meta: "Breakfast · 20 min",
    desc: "A savoury multi-grain pancake combining millets and pulses.",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
  {
    title: "Savoury heritage kanji",
    meta: "Light dinner · 30 min",
    desc: "A gentle, fibre-forward porridge with red rice, black rice, and millets.",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
  {
    title: "Foxtail millet pongal",
    meta: "Breakfast · 25 min",
    desc: "A South Indian breakfast classic with a fibre-forward twist.",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
  {
    title: "Mixed millet rotis",
    meta: "Lunch / dinner · 30 min",
    desc: "Soft everyday flatbreads using a five-grain millet flour.",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
  {
    title: "Barnyard millet khichdi",
    meta: "Dinner · 20 min",
    desc: "A quick, soft one-pot meal ready in under 20 minutes.",
    href: "/recipes/vegetable-millet-khichdi-bowl",
  },
];

export default function RecipesPage() {
  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: "Recipes" },
        ]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Cook with us</p>
        <h1 className="mb-3">Recipes matched to products</h1>
        <p className="max-w-[60ch] text-fo-muted">
          Practical, everyday recipes that put traditional grains to work — each one
          matched to a Fresh Origins product so you can shop and cook in one go.
        </p>
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
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
              <div className="p-5">
                <h2 className="mb-1 text-[1.05rem]">{recipe.title}</h2>
                <p className="mb-1.5 text-[0.85rem] text-fo-muted">{recipe.desc}</p>
                <p className="m-0 text-[0.82rem] font-semibold text-fo-accent">
                  {recipe.meta}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
