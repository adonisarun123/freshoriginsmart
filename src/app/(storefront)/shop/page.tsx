import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ProductCard } from "@/components/commerce/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { getShopProducts } from "@/features/catalogue/queries";
import type { ShopFilters, ShopSort } from "@/features/catalogue/queries";
import { TrackView } from "@/components/analytics/TrackView";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Shop Fresh Origins ready-to-cook mixes, millets, and traditional rice. Filter by category, health goal, and dietary preference. Delivering in Bangalore and Hosur.",
};

type SearchParams = {
  category?: string;
  goal?: string;
  diet?: string | string[];
  stock?: string;
  sort?: string;
};

const categoryOptions = [
  { label: "Ready-to-Cook Mixes", value: "ready-to-cook-mixes" },
  { label: "Millets", value: "millets" },
  { label: "Traditional Rice", value: "traditional-rice" },
];
const goalOptions = [
  { label: "Protein & Fibre", value: "protein-and-fibre" },
  { label: "Gut Health", value: "gut-health" },
  { label: "Blood-Sugar-Conscious", value: "blood-sugar-conscious-eating" },
  { label: "Senior Nutrition", value: "senior-nutrition" },
];
const dietOptions = [
  { label: "Wheat-free", value: "wheat-free" },
  { label: "Gluten-free", value: "gluten-free" },
  { label: "No maida", value: "no-maida" },
  { label: "Vegan", value: "vegan" },
];
const sortOptions: { label: string; value: ShopSort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

function parseFilters(sp: SearchParams): ShopFilters {
  const diet = !sp.diet ? [] : Array.isArray(sp.diet) ? sp.diet : [sp.diet];
  const sort = (sortOptions.find((s) => s.value === sp.sort)?.value ??
    "featured") as ShopSort;
  return {
    category: sp.category || undefined,
    goal: sp.goal || undefined,
    diet,
    inStock: sp.stock === "1",
    sort,
  };
}

const compareRows = [
  { name: "Metabolic Balance Khichdi", slug: "metabolic-balance-khichdi", protein: "13.5 g", fibre: "10.9 g", grain: "Barnyard, foxtail & little millet", pulse: "Moong dal", gluten: "Naturally wheat-free*" },
  { name: "Protein & Fibre Adai Mix", slug: "protein-and-fibre-adai-mix", protein: "14.3 g", fibre: "9.3 g", grain: "Proso, foxtail, kodo millet & red rice", pulse: "Green gram & urad", gluten: "Naturally wheat-free*" },
  { name: "Heritage Gut-Fibre Kanji Mix", slug: "heritage-gut-fibre-kanji-mix", protein: "10.7 g", fibre: "8.6 g", grain: "Red rice, black rice, kodo & little millet", pulse: "Green gram", gluten: "Naturally wheat-free*" },
  { name: "Protein & Fibre Chapati Atta", slug: "protein-and-fibre-chapati-atta", protein: "14.8 g", fibre: "11.6 g", grain: "Whole wheat, bajra & ragi", pulse: "Bengal, green & horse gram", gluten: "Contains gluten" },
  { name: "Gluten-Free Protein & Fibre Roti Mix", slug: "gluten-free-protein-and-fibre-roti-mix", protein: "13.7 g", fibre: "12.2 g", grain: "Jowar, bajra & red rice", pulse: "Bengal & green gram", gluten: "Gluten-free* (controlled processing)" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = parseFilters(searchParams);
  const products = await getShopProducts(filters);
  const productCount = products.length;

  const activeChips = [
    filters.category && {
      label: categoryOptions.find((c) => c.value === filters.category)?.label,
      param: "category",
    },
    filters.goal && {
      label: goalOptions.find((g) => g.value === filters.goal)?.label,
      param: "goal",
    },
    ...(filters.diet ?? []).map((d) => ({
      label: dietOptions.find((o) => o.value === d)?.label,
      param: `diet:${d}`,
    })),
    filters.inStock && { label: "In stock only", param: "stock" },
  ].filter(Boolean) as { label: string; param: string }[];

  const hasFilters = activeChips.length > 0;

  // The filter form (shared between desktop sidebar and mobile disclosure).
  const FilterForm = (
    <form method="get" className="text-[0.9rem]">
      {/* preserve sort when applying filters */}
      <input type="hidden" name="sort" value={filters.sort} />
      <FilterGroup title="Category">
        {categoryOptions.map((o) => (
          <RadioRow
            key={o.value}
            name="category"
            value={o.value}
            label={o.label}
            checked={filters.category === o.value}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Health goal">
        {goalOptions.map((o) => (
          <RadioRow
            key={o.value}
            name="goal"
            value={o.value}
            label={o.label}
            checked={filters.goal === o.value}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Dietary preference">
        {dietOptions.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2.5 py-1.5"
          >
            <input
              type="checkbox"
              name="diet"
              value={o.value}
              defaultChecked={filters.diet?.includes(o.value)}
              className="h-[18px] w-[18px] accent-fo-green-900"
            />
            {o.label}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
          <input
            type="checkbox"
            name="stock"
            value="1"
            defaultChecked={filters.inStock}
            className="h-[18px] w-[18px] accent-fo-green-900"
          />
          In stock only
        </label>
      </FilterGroup>
      <div className="mt-4 flex gap-2">
        <button type="submit" className="fo-btn-primary flex-1">
          Apply filters
        </button>
        {hasFilters && (
          <Link href="/shop" className="fo-btn-secondary">
            Reset
          </Link>
        )}
      </div>
    </form>
  );

  return (
    <div className="fo-container">
      <TrackView
        event="view_item_list"
        properties={{
          list: "shop",
          count: productCount,
          category: filters.category ?? null,
          goal: filters.goal ?? null,
          diet: filters.diet ?? [],
          inStock: filters.inStock,
          sort: filters.sort,
        }}
      />
      {products.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            products.map((product) => ({
              name: product.name,
              url: `/products/${product.slug}`,
            })),
          )}
        />
      )}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <header className="py-8 sm:py-10">
        <p className="fo-eyebrow">The full range</p>
        <h1 className="mb-3">Shop</h1>
        <p className="max-w-editorial text-[1.05rem] text-fo-muted">
          Purposeful millet, pulse, and whole-grain blends for familiar Indian meals —
          khichdi, adai, kanji, and roti — alongside whole millets and traditional rice.
          Convenient to cook, transparent on ingredients, with nutrition stated per
          serving so you can choose with confidence.
        </p>
      </header>

      {/* Toolbar: count + sort (sort is its own GET form preserving filters) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-fo-line py-4">
        <span className="text-[0.9rem] font-semibold text-fo-muted">
          Showing {productCount} {productCount === 1 ? "product" : "products"}
        </span>
        <form method="get" className="flex items-center gap-2 text-[0.9rem]">
          {/* preserve active filters when changing sort */}
          {filters.category && (
            <input type="hidden" name="category" value={filters.category} />
          )}
          {filters.goal && <input type="hidden" name="goal" value={filters.goal} />}
          {(filters.diet ?? []).map((d) => (
            <input key={d} type="hidden" name="diet" value={d} />
          ))}
          {filters.inStock && <input type="hidden" name="stock" value="1" />}
          <label htmlFor="sort">Sort</label>
          <select
            id="sort"
            name="sort"
            defaultValue={filters.sort}
            className="rounded-control border-[1.5px] border-fo-line bg-white px-3 py-2 font-semibold text-fo-charcoal-900"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button type="submit" className="fo-btn-secondary px-3 py-2 min-h-0">
            Go
          </button>
        </form>
      </div>

      {/* Applied filter chips */}
      {hasFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <span
              key={c.param}
              className="inline-flex items-center gap-1.5 rounded-pill bg-fo-sage-100 px-3 py-1.5 text-[0.82rem] font-semibold text-fo-green-900"
            >
              {c.label}
            </span>
          ))}
          <Link
            href="/shop"
            className="text-[0.82rem] font-bold text-fo-accent underline"
          >
            Clear all
          </Link>
        </div>
      )}

      {/* Mobile filter disclosure */}
      <details className="mb-6 rounded-card border border-fo-line bg-white p-4 lg:hidden">
        <summary className="cursor-pointer font-semibold text-fo-green-900">
          Filters
        </summary>
        <div className="mt-4">{FilterForm}</div>
      </details>

      <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop filters */}
        <aside
          aria-label="Filters"
          className="hidden rounded-card border border-fo-line bg-white p-6 lg:block"
        >
          {FilterForm}
        </aside>

        {/* Results */}
        <section aria-label="Products">
          {products.length === 0 ? (
            <div className="rounded-card border border-fo-line bg-white p-10 text-center">
              <p className="mb-2 text-[1.1rem] font-semibold text-fo-green-900">
                No products match these filters
              </p>
              <p className="mb-5 text-fo-muted">
                Try removing a filter or browse the full range.
              </p>
              <Link href="/shop" className="fo-btn-primary">
                Reset filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Compare the range */}
      <section
        aria-labelledby="compare-heading"
        className="mt-16 border-t border-fo-line pt-12"
      >
        <div className="mb-6 max-w-editorial">
          <p className="fo-eyebrow">Side by side</p>
          <h2 id="compare-heading" className="text-[clamp(1.6rem,3vw,2.2rem)]">
            Compare the range
          </h2>
          <p className="mt-3 text-fo-muted">
            A quick way to match a mix to your meal and nutrition goals. Protein and fibre
            are stated per 100 g.
          </p>
        </div>

        <div className="overflow-x-auto rounded-card border border-fo-line">
          <table className="w-full min-w-[760px] border-collapse text-left text-[0.9rem]">
            <caption className="caption-bottom px-4 py-3 text-left text-[0.8rem] text-fo-muted">
              Indicative prototype values, pending final lab validation. * subject to
              validation/controlled processing.
            </caption>
            <thead>
              <tr className="bg-fo-sage-100 text-fo-green-900">
                <th scope="col" className="px-4 py-3 font-semibold">Product</th>
                <th scope="col" className="px-4 py-3 font-semibold">Protein /100g</th>
                <th scope="col" className="px-4 py-3 font-semibold">Fibre /100g</th>
                <th scope="col" className="px-4 py-3 font-semibold">Main grain base</th>
                <th scope="col" className="px-4 py-3 font-semibold">Pulse</th>
                <th scope="col" className="px-4 py-3 font-semibold">Gluten status</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.slug} className="border-t border-fo-line align-top">
                  <th scope="row" className="px-4 py-3 font-semibold">
                    <Link
                      href={`/products/${row.slug}`}
                      className="text-fo-green-900 hover:underline"
                    >
                      {row.name}
                    </Link>
                  </th>
                  <td className="px-4 py-3 tabular-nums">{row.protein}</td>
                  <td className="px-4 py-3 tabular-nums">{row.fibre}</td>
                  <td className="px-4 py-3 text-fo-muted">{row.grain}</td>
                  <td className="px-4 py-3 text-fo-muted">{row.pulse}</td>
                  <td className="px-4 py-3 text-fo-muted">{row.gluten}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-fo-line py-4 first:pt-0 last:border-none last:pb-0">
      <h2 className="mb-2 text-[0.95rem] font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function RadioRow({
  name,
  value,
  label,
  checked,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={checked}
        className="h-[18px] w-[18px] accent-fo-green-900"
      />
      {label}
    </label>
  );
}
