import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Illustration } from "@/components/brand/Illustration";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, recipeJsonLd } from "@/lib/seo/jsonld";
import { TrackView } from "@/components/analytics/TrackView";
import { getRecipeBySlug, getRecipeSlugs } from "@/features/recipes/content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getRecipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe" };
  return {
    title: `${recipe.title} — Recipe`,
    description: recipe.metaDescription,
    alternates: { canonical: `/recipes/${recipe.slug}` },
  };
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const productHref = `/products/${recipe.productSlug}`;

  return (
    <div className="fo-container">
      <TrackView event="view_recipe" properties={{ slug }} />
      <JsonLd
        data={[
          recipeJsonLd({
            name: recipe.title,
            slug: recipe.slug,
            description: recipe.description,
            prepTimeMinutes: recipe.prepTimeMinutes,
            cookTimeMinutes: recipe.cookTimeMinutes,
            recipeYield: recipe.servings,
            ingredients: recipe.ingredients.map(
              (ing) => `${ing.qty} ${ing.name}`,
            ),
            instructions: recipe.method,
            authorName: "Fresh Origins kitchen",
          }),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Recipes", url: "/recipes" },
            { name: recipe.title, url: `/recipes/${recipe.slug}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: "Recipes", href: "/recipes" },
          { label: recipe.title },
        ]}
      />

      {/* Hero */}
      <div className="grid items-center gap-12 pt-6 md:grid-cols-2">
        <div>
          <p className="fo-eyebrow">{recipe.eyebrow}</p>
          <h1>{recipe.title}</h1>
          <p className="text-fo-muted">{recipe.description}</p>
          <div className="my-4 flex flex-wrap gap-6">
            {[
              ["Prep", `${recipe.prepTimeMinutes} min`],
              ["Cook", `${recipe.cookTimeMinutes} min`],
              ["Makes", recipe.servings],
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
                href={productHref}
                className="font-bold text-fo-green-900 underline"
              >
                {recipe.productLinkLabel}
              </Link>
            </div>
          </div>
          <Link href={productHref} className="fo-btn-primary">
            Shop the product
          </Link>
        </div>
        <Illustration
          name="bowl"
          className="aspect-[4/3] rounded-card"
          title={`Prepared dish — ${recipe.title.toLowerCase()}`}
        />
      </div>

      {/* Body */}
      <div className="mt-12 grid items-start gap-12 md:grid-cols-[320px_1fr]">
        {/* Ingredients */}
        <aside className="rounded-card bg-fo-sage-100 p-6 md:sticky md:top-24">
          <h2 className="text-[1.2rem]">Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing) => (
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

        {/* Method + tips + nutrition + related */}
        <div>
          <h2 className="text-[clamp(1.6rem,3vw,2rem)]">Method</h2>
          <ol className="grid gap-6">
            {recipe.method.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-fo-green-900 font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {recipe.tips.length > 0 && (
            <>
              <h2 className="mt-12 text-[clamp(1.6rem,3vw,2rem)]">
                Kitchen notes
              </h2>
              <ul className="grid gap-2.5 text-[0.95rem]">
                {recipe.tips.map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="font-bold text-fo-green-600"
                    >
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="mt-12 text-[clamp(1.6rem,3vw,2rem)]">
            Nutrition estimate
          </h2>
          <div className="rounded-card border border-fo-line bg-white p-6">
            <p className="mt-0 text-[0.85rem] text-fo-muted">
              Per serving, approximate — varies with exact ingredients used.
            </p>
            <table className="w-full text-[0.92rem]">
              <tbody>
                {recipe.nutrition.map(([label, val]) => (
                  <tr
                    key={label}
                    className="border-b border-fo-line last:border-none"
                  >
                    <th scope="row" className="py-2 text-left font-semibold">
                      {label}
                    </th>
                    <td className="py-2 text-right tabular-nums">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mb-0 text-[0.85rem] text-fo-muted">
              <strong className="text-fo-charcoal-900">Allergens:</strong>{" "}
              {recipe.allergens}
            </p>
          </div>

          <p className="mt-6 text-[0.85rem] text-fo-muted">
            Recipe by Fresh Origins kitchen · Reviewed for accuracy by
            [reviewer name, placeholder].
          </p>

          <h2 className="mt-12 text-[clamp(1.6rem,3vw,2rem)]">
            Products used &amp; related
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {recipe.related.map((item) => (
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
