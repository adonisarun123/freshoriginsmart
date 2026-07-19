import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section } from "@/components/content/Section";
import { Illustration } from "@/components/brand/Illustration";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { recipes } from "@/features/recipes/content";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Simple, practical recipes matched to Fresh Origins products — millet khichdi bowls, protein adai, heritage kanji, and more.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage() {
  return (
    <div className="fo-container">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Recipes", url: "/recipes" },
          ]),
          itemListJsonLd(
            recipes.map((r) => ({ name: r.title, url: `/recipes/${r.slug}` })),
          ),
        ]}
      />
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
          Practical, everyday recipes that put traditional grains to work — each
          one matched to a Fresh Origins product so you can shop and cook in one
          go. More recipes are added as the range grows.
        </p>
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card"
            >
              <Illustration
                name="bowl"
                className="aspect-[4/3]"
                title={recipe.title}
              />
              <div className="p-5">
                <h2 className="mb-1 text-[1.05rem]">{recipe.title}</h2>
                <p className="mb-1.5 text-[0.85rem] text-fo-muted">
                  {recipe.description}
                </p>
                <p className="m-0 text-[0.82rem] font-semibold text-fo-accent">
                  {recipe.occasion} ·{" "}
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
