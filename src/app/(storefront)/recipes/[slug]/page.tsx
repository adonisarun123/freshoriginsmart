import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Illustration } from "@/components/brand/Illustration";
import { JsonLd } from "@/components/seo/JsonLd";
import { recipeJsonLd } from "@/lib/seo/jsonld";
import { TrackView } from "@/components/analytics/TrackView";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: "vegetable-millet-khichdi-bowl" }];
}

export const metadata: Metadata = {
  title: "Vegetable Millet Khichdi Bowl — Recipe",
  description:
    "A simple vegetable millet khichdi bowl made with Metabolic Balance Khichdi — ingredients, step-by-step method, nutrition estimate, allergens, and related products.",
};

const ingredients = [
  { name: "Metabolic Balance Khichdi mix", qty: "1 cup" },
  { name: "Water", qty: "3 cups" },
  { name: "Mixed vegetables (carrot, beans, peas)", qty: "1 cup" },
  { name: "Ghee or oil", qty: "1 tbsp" },
  { name: "Cumin seeds", qty: "1 tsp" },
  { name: "Ginger, grated", qty: "1 tsp" },
  { name: "Salt", qty: "to taste" },
];

const method = [
  "Rinse the khichdi mix until the water runs clear, then drain.",
  "Heat ghee in a pressure cooker, add cumin and ginger, and let them sizzle.",
  "Add the chopped vegetables and sauté for 2 minutes.",
  "Add the rinsed mix, water, and salt. Stir well.",
  "Pressure cook for 3–4 whistles, or simmer 15–18 minutes until soft.",
  "Rest 5 minutes, fluff gently, and serve warm with a spoon of ghee or curd.",
];

const nutrition = [
  ["Energy", "~260 kcal"],
  ["Protein", "~9 g"],
  ["Fibre", "~6 g"],
  ["Fat", "~6 g"],
];

const related = [
  { title: "Metabolic Balance Khichdi", meta: "₹245", href: "/products/metabolic-balance-khichdi", label: "Khichdi" },
  { title: "Protein & Fibre Adai Mix", meta: "₹220", href: "/shop", label: "Adai" },
  { title: "Protein & Fibre goal", meta: "Learn more", href: "/health-goals/protein-and-fibre", label: "Goal" },
];

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="fo-container">
      <TrackView event="view_recipe" properties={{ slug }} />
      <JsonLd
        data={recipeJsonLd({
          name: "Vegetable millet khichdi bowl",
          slug,
          description:
            "A comforting one-pot bowl made with Metabolic Balance Khichdi and everyday vegetables — fibre-forward, gentle, and ready in under half an hour.",
          prepTimeMinutes: 10,
          cookTimeMinutes: 18,
          recipeYield: "3 servings",
          ingredients: ingredients.map((ing) => `${ing.qty} ${ing.name}`),
          instructions: method,
          authorName: "Fresh Origins kitchen",
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: "Recipes", href: "/recipes" },
          { label: "Vegetable Millet Khichdi Bowl" },
        ]}
      />

      {/* Hero */}
      <div className="grid items-center gap-12 pt-6 md:grid-cols-2">
        <div>
          <p className="fo-eyebrow">Recipe · Lunch</p>
          <h1>Vegetable millet khichdi bowl</h1>
          <p className="text-fo-muted">
            A comforting one-pot bowl made with Metabolic Balance Khichdi and everyday
            vegetables — fibre-forward, gentle, and ready in under half an hour.
          </p>
          <div className="my-4 flex flex-wrap gap-6">
            {[
              ["Prep", "10 min"],
              ["Cook", "18 min"],
              ["Serves", "3"],
            ].map(([label, val]) => (
              <div key={label} className="text-[0.9rem]">
                <span className="block text-[0.78rem] uppercase tracking-[0.05em] text-fo-muted">
                  {label}
                </span>
                <span className="font-bold text-fo-green-900">{val}</span>
              </div>
            ))}
            <div className="text-[0.9rem]">
              <span className="block text-[0.78rem] uppercase tracking-[0.05em] text-fo-muted">
                Uses
              </span>
              <Link
                href="/products/metabolic-balance-khichdi"
                className="font-bold text-fo-green-900 underline"
              >
                Khichdi mix
              </Link>
            </div>
          </div>
          <Link href="/products/metabolic-balance-khichdi" className="fo-btn-primary">
            Shop the product
          </Link>
        </div>
        <Illustration
          name="bowl"
          className="aspect-[4/3] rounded-card"
          title="Prepared dish — vegetable millet khichdi bowl"
        />
      </div>

      {/* Body */}
      <div className="mt-12 grid items-start gap-12 md:grid-cols-[320px_1fr]">
        {/* Ingredients */}
        <aside className="rounded-card bg-fo-sage-100 p-6 md:sticky md:top-24">
          <h2 className="text-[1.2rem]">Ingredients</h2>
          <ul>
            {ingredients.map((ing) => (
              <li
                key={ing.name}
                className="flex justify-between gap-4 border-b border-fo-green-900/15 py-2.5 text-[0.92rem] last:border-none"
              >
                <span>{ing.name}</span>
                <span className="whitespace-nowrap font-bold text-fo-green-900">
                  {ing.qty}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Method + nutrition + related */}
        <div>
          <h2 className="text-[clamp(1.6rem,3vw,2rem)]">Method</h2>
          <ol className="grid gap-6">
            {method.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-fo-green-900 font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-[clamp(1.6rem,3vw,2rem)]">Nutrition estimate</h2>
          <div className="rounded-card border border-fo-line bg-white p-6">
            <p className="mt-0 text-[0.85rem] text-fo-muted">
              Per serving, approximate — varies with vegetables and ghee used.
            </p>
            <table className="w-full text-[0.92rem]">
              <tbody>
                {nutrition.map(([label, val]) => (
                  <tr key={label} className="border-b border-fo-line last:border-none">
                    <th scope="row" className="py-2 text-left font-semibold">
                      {label}
                    </th>
                    <td className="py-2 text-right tabular-nums">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mb-0 text-[0.85rem] text-fo-muted">
              <strong className="text-fo-charcoal-900">Allergens:</strong> contains
              pulses; may contain gluten and tree nuts depending on garnish.
            </p>
          </div>

          <p className="mt-6 text-[0.85rem] text-fo-muted">
            Recipe by Fresh Origins kitchen · Reviewed for accuracy by [reviewer name,
            placeholder].
          </p>

          <h2 className="mt-12 text-[clamp(1.6rem,3vw,2rem)]">
            Products used &amp; related
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-card border border-fo-line bg-white p-3 transition hover:shadow-soft"
              >
                <Illustration
                  name="bowl"
                  className="h-14 w-14 flex-none rounded-card"
                  title={item.label}
                />
                <div>
                  <h3 className="m-0 text-[0.9rem]">{item.title}</h3>
                  <span className="text-[0.85rem] font-bold text-fo-green-900">
                    {item.meta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
