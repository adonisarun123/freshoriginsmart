import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  EmptyRow,
  TableWrap,
  tdClass,
  thClass,
} from "../_components/AdminShell";

function DataUnavailableNotice() {
  return (
    <div className="max-w-[640px] rounded-card border border-fo-line bg-white p-6">
      <p className="text-[0.9rem] text-fo-muted">
        Admin data is unavailable. Confirm SUPABASE_SERVICE_ROLE_KEY is set in
        the environment.
      </p>
    </div>
  );
}

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
  let products: ProductRow[] = [];
  let dataError = false;
  try {
    if (hasSupabaseAdminEnv()) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, product_type, status, featured, allergen_information, storage_instructions",
        )
        .order("name");
      if (error) throw error;
      products = (data as ProductRow[] | null) ?? [];
    } else {
      dataError = true;
    }
  } catch {
    dataError = true;
  }

  return (
    <>
      <AdminTopbar
        title="Products"
        subtitle={dataError ? "Data unavailable" : `${products.length} products`}
      />
      <AdminContent>
        <AdminSection>
          {dataError ? (
            <DataUnavailableNotice />
          ) : (
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
          )}
        </AdminSection>
      </AdminContent>
    </>
  );
}
