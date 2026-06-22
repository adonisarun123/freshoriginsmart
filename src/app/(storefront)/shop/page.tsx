import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ProductCard } from "@/components/commerce/ProductCard";
import { getAllProducts } from "@/features/catalogue/queries";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Shop Fresh Origins ready-to-cook mixes, millets, and traditional rice. Filter by health goal, dietary preference, and pack size. Delivering in Bangalore and Hosur.",
};

const filterGroups: { title: string; options: string[] }[] = [
  { title: "Category", options: ["Ready-to-Cook Mixes", "Millets", "Traditional Rice"] },
  {
    title: "Health goal",
    options: ["Protein & Fibre", "Gut Health", "Blood-Sugar-Conscious", "Senior Nutrition"],
  },
  {
    title: "Dietary preference",
    options: ["Wheat-free", "Gluten-free", "No maida", "Vegan"],
  },
  { title: "Meal occasion", options: ["Breakfast", "Lunch / Dinner"] },
  { title: "Pack size", options: ["400 g", "500 g", "1 kg"] },
  { title: "Availability", options: ["In stock only"] },
];

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />

      <div className="py-8">
        <h1 className="mb-3">Shop all products</h1>
        <p className="max-w-[60ch] text-fo-muted">
          Purposeful millet, pulse, and whole-grain blends for familiar Indian meals —
          khichdi, adai, kanji, and roti — alongside whole millets and traditional rice.
          Convenient cooking, transparent ingredients, nutrition per serving.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-fo-line py-4">
        <span className="text-[0.9rem] font-semibold text-fo-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
        <div className="flex items-center gap-2 text-[0.9rem]">
          <label htmlFor="sort">Sort</label>
          <select
            id="sort"
            defaultValue="Featured"
            className="rounded-control border-[1.5px] border-fo-line bg-white px-3 py-2 font-semibold text-fo-charcoal-900"
          >
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside
          aria-label="Filters"
          className="hidden rounded-card border border-fo-line bg-white p-6 lg:block"
        >
          {filterGroups.map((group) => (
            <div
              key={group.title}
              className="border-b border-fo-line py-4 first:pt-0 last:border-none last:pb-0"
            >
              <h2 className="mb-3 text-[0.95rem] font-semibold">{group.title}</h2>
              {group.options.map((opt) => (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2.5 py-1 text-[0.9rem]"
                >
                  <input
                    type="checkbox"
                    className="h-[18px] w-[18px] accent-fo-green-900"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </aside>

        {/* Results */}
        <section aria-label="Products">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
