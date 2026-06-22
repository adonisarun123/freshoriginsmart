import { createAdminClient } from "@/lib/supabase/admin";
import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  EmptyRow,
  TableWrap,
  tdClass,
  thClass,
} from "../_components/AdminShell";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  product_type: string;
  status: string;
  featured: boolean;
  allergen_information: string | null;
  storage_instructions: string | null;
}

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, product_type, status, featured, allergen_information, storage_instructions",
    )
    .order("name");

  const products = (data as ProductRow[] | null) ?? [];

  return (
    <>
      <AdminTopbar title="Products" subtitle={`${products.length} products`} />
      <AdminContent>
        <AdminSection>
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Featured</th>
                <th className={thClass}>Required fields</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <EmptyRow colSpan={5} label="No products yet." />
              ) : (
                products.map((product) => {
                  const missing =
                    product.allergen_information == null ||
                    product.storage_instructions == null;
                  return (
                    <tr key={product.id}>
                      <td className={tdClass}>
                        <span className="font-semibold">{product.name}</span>
                        <span className="block text-[0.78rem] text-fo-muted">
                          /{product.slug}
                        </span>
                      </td>
                      <td className={`${tdClass} capitalize`}>
                        {product.product_type}
                      </td>
                      <td className={`${tdClass} capitalize`}>
                        {product.status}
                      </td>
                      <td className={tdClass}>
                        {product.featured ? "Yes" : "—"}
                      </td>
                      <td className={tdClass}>
                        {missing ? (
                          <span className="font-bold text-fo-error">
                            Missing
                          </span>
                        ) : (
                          <span className="text-fo-success">Complete</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableWrap>
        </AdminSection>
      </AdminContent>
    </>
  );
}
