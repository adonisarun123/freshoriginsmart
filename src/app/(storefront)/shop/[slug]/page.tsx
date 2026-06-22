import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { ProductCard } from "@/components/commerce/ProductCard";
import {
  getCategories,
  getProductsByCategory,
} from "@/features/catalogue/queries";
import type { Category } from "@/types/database";

type PageProps = { params: { slug: string } };

const comparisonNotes: Record<string, { title: string; body: string }> = {
  millets: {
    title: "Choosing between the millets",
    body: "Foxtail and barnyard millet are mild, soft, and forgiving — comfortable first millets that cook much like rice. Kodo holds its shape for pilafs and salads, while pearl/bajra is hearty and full-flavoured. Whole grains keep longer than flour, so buy flour in quantities you will use within a few weeks. New to millets? A balanced blend takes the guesswork out of ratios.",
  },
  "traditional-rice": {
    title: "Comparing traditional rice varieties",
    body: "Red, black, and brown traditional rice keep more of the bran than polished white rice, which means more fibre and a firmer, nuttier bite. They generally need a little more water and a longer cook than polished rice — soaking helps. Each variety carries its own region of origin and cooking ratio on the pack.",
  },
};

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
  return {
    title: `Shop ${category.name}`,
    description:
      category.description ??
      `Shop Fresh Origins ${category.name}. Transparent ingredients and nutrition, delivering across Bangalore and Hosur.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await resolveCategory(params.slug);
  if (!category) notFound();

  const products = await getProductsByCategory(params.slug);
  const note = comparisonNotes[params.slug];

  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Shop the category</p>
        <h1 className="mb-3">{category.name}</h1>
        {category.description && (
          <p className="max-w-[62ch] text-fo-muted">{category.description}</p>
        )}
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-fo-muted">
              Products in this category are coming soon.
            </p>
          )}
        </div>
      </Section>

      {note && (
        <Section tight surface>
          <div className="max-w-editorial">
            <SectionHead eyebrow="A quick comparison" title={note.title} />
            <p className="text-fo-muted">{note.body}</p>
          </div>
        </Section>
      )}
    </div>
  );
}
