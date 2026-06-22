import Link from "next/link";

import { createAdminClient } from "@/lib/supabase/admin";
import { formatINR } from "@/lib/commerce/format";
import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  EmptyRow,
  TableWrap,
  tabnum,
  tdClass,
  thClass,
} from "./_components/AdminShell";

export const metadata = { title: "Dashboard" };

// Always compute live counts from the database.
export const dynamic = "force-dynamic";

const PENDING_ORDER_STATUSES = ["whatsapp_pending", "awaiting_confirmation"];

type MetricTone = "default" | "warning" | "info" | "error" | "success";

const TONE_BORDER: Record<MetricTone, string> = {
  default: "border-t-fo-line",
  warning: "border-t-fo-warning",
  info: "border-t-fo-info",
  error: "border-t-fo-error",
  success: "border-t-fo-success",
};

const TONE_NUM: Record<MetricTone, string> = {
  default: "text-fo-green-900",
  warning: "text-fo-warning",
  info: "text-fo-info",
  error: "text-fo-error",
  success: "text-fo-green-900",
};

function MetricCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: MetricTone;
}) {
  return (
    <div
      className={`rounded-card border border-fo-line border-t-[3px] bg-white p-5 ${TONE_BORDER[tone]}`}
    >
      <div className="text-[0.82rem] font-semibold leading-snug text-fo-muted">
        {label}
      </div>
      <div
        className={`my-1.5 font-display text-[2.1rem] font-[650] leading-none ${TONE_NUM[tone]} ${tabnum}`}
      >
        {value}
      </div>
      {sub ? <div className="text-[0.78rem] text-fo-muted">{sub}</div> : null}
    </div>
  );
}

interface PendingOrderRow {
  id: string;
  public_order_number: string;
  customer_name: string | null;
  pincode: string | null;
  status: string;
  total_paise: number;
  order_items: { count: number }[] | null;
}

interface LowStockRow {
  available_quantity: number;
  low_stock_threshold: number;
  product_variants: {
    sku: string;
    title: string;
    products: { name: string } | null;
  } | null;
}

interface EnquiryRow {
  id: string;
  enquiry_type: string;
  name: string;
  organisation: string | null;
  city: string | null;
  created_at: string;
  status: string;
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // --- Widget counts (run in parallel) ---------------------------------------
  const [
    pendingOrdersCountRes,
    enquiriesCountRes,
    draftArticlesRes,
    draftRecipesRes,
    inventoryRes,
    productsMissingRes,
    pendingOrdersRes,
    enquiriesRes,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", PENDING_ORDER_STATUSES),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .neq("status", "published"),
    supabase
      .from("recipes")
      .select("id", { count: "exact", head: true })
      .neq("status", "published"),
    // Inventory: fetch threshold pairs and filter in JS (no column-to-column
    // comparison operator in PostgREST filters).
    supabase
      .from("inventory")
      .select(
        "available_quantity, low_stock_threshold, product_variants(sku, title, products(name))",
      ),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .or("allergen_information.is.null,storage_instructions.is.null"),
    supabase
      .from("orders")
      .select(
        "id, public_order_number, customer_name, pincode, status, total_paise, order_items(count)",
      )
      .in("status", PENDING_ORDER_STATUSES)
      .order("created_at", { ascending: true })
      .limit(10),
    supabase
      .from("enquiries")
      .select("id, enquiry_type, name, organisation, city, created_at, status")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const ordersAwaiting = pendingOrdersCountRes.count ?? 0;
  const newEnquiries = enquiriesCountRes.count ?? 0;
  const draftContent =
    (draftArticlesRes.count ?? 0) + (draftRecipesRes.count ?? 0);
  const productsMissing = productsMissingRes.count ?? 0;

  const lowStockRows = ((inventoryRes.data as LowStockRow[] | null) ?? []).filter(
    (row) => row.available_quantity <= row.low_stock_threshold,
  );
  const lowStockCount = lowStockRows.length;

  const pendingOrders = (pendingOrdersRes.data as PendingOrderRow[] | null) ?? [];
  const recentEnquiries = (enquiriesRes.data as EnquiryRow[] | null) ?? [];

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        subtitle="Operations overview"
        action={
          <Link
            href="/"
            className="rounded-control border-2 border-fo-green-900 bg-white px-4 py-2 text-[0.85rem] font-bold text-fo-green-900 hover:bg-fo-sage-100"
          >
            View store ↗
          </Link>
        }
      />

      <AdminContent>
        {/* Metrics ----------------------------------------------------------- */}
        <AdminSection>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <MetricCard
              label="Orders awaiting confirmation"
              value={ordersAwaiting}
              sub="WhatsApp & awaiting confirmation"
              tone="warning"
            />
            <MetricCard
              label="Low-stock variants"
              value={lowStockCount}
              sub="At or below threshold"
              tone="warning"
            />
            <MetricCard
              label="New enquiries"
              value={newEnquiries}
              sub="Across all channels"
              tone="info"
            />
            <MetricCard
              label="Draft content awaiting review"
              value={draftContent}
              sub="Articles & recipes"
            />
            <MetricCard
              label="Products missing required fields"
              value={productsMissing}
              sub="Cannot be published"
              tone="error"
            />
            <MetricCard
              label="Sales this week"
              value="—"
              sub="Reporting coming soon"
              tone="success"
            />
          </div>
        </AdminSection>

        {/* Orders awaiting confirmation -------------------------------------- */}
        <AdminSection title="Orders awaiting confirmation">
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Order</th>
                <th className={thClass}>Customer</th>
                <th className={thClass}>Items</th>
                <th className={thClass}>Total</th>
                <th className={thClass}>Pincode</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.length === 0 ? (
                <EmptyRow colSpan={6} label="No orders awaiting confirmation." />
              ) : (
                pendingOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={tdClass}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-bold text-fo-green-900 underline"
                      >
                        {order.public_order_number}
                      </Link>
                    </td>
                    <td className={tdClass}>{order.customer_name ?? "—"}</td>
                    <td className={`${tdClass} ${tabnum}`}>
                      {order.order_items?.[0]?.count ?? 0}
                    </td>
                    <td className={`${tdClass} ${tabnum}`}>
                      {formatINR(order.total_paise)}
                    </td>
                    <td className={tdClass}>{order.pincode ?? "—"}</td>
                    <td className={tdClass}>
                      <span className="rounded-pill bg-[#fbf0e2] px-2.5 py-[3px] text-[0.72rem] font-bold text-fo-warning">
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </AdminSection>

        {/* Low-stock variants ------------------------------------------------ */}
        <AdminSection title="Low-stock variants">
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>Variant</th>
                <th className={thClass}>Available</th>
                <th className={thClass}>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {lowStockRows.length === 0 ? (
                <EmptyRow colSpan={4} label="All variants are above threshold." />
              ) : (
                lowStockRows.map((row, i) => (
                  <tr key={`${row.product_variants?.sku ?? "v"}-${i}`}>
                    <td className={tdClass}>
                      {row.product_variants?.products?.name ?? "—"}
                    </td>
                    <td className={tdClass}>
                      {row.product_variants?.title ?? "—"}
                      {row.product_variants?.sku
                        ? ` · ${row.product_variants.sku}`
                        : ""}
                    </td>
                    <td className={`${tdClass} ${tabnum} text-fo-warning`}>
                      {row.available_quantity}
                    </td>
                    <td className={`${tdClass} ${tabnum}`}>
                      {row.low_stock_threshold}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </AdminSection>

        {/* Recent enquiries -------------------------------------------------- */}
        <AdminSection title="Recent enquiries">
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Type</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Organisation</th>
                <th className={thClass}>City</th>
                <th className={thClass}>Received</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <EmptyRow colSpan={6} label="No enquiries yet." />
              ) : (
                recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td className={tdClass}>
                      <span className="rounded-pill bg-fo-sage-100 px-2.5 py-[3px] text-[0.72rem] font-bold text-fo-green-900">
                        {enquiry.enquiry_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className={tdClass}>{enquiry.name}</td>
                    <td className={tdClass}>{enquiry.organisation ?? "—"}</td>
                    <td className={tdClass}>{enquiry.city ?? "—"}</td>
                    <td className={tdClass}>
                      {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className={tdClass}>
                      <span className="rounded-pill bg-[#eef3ec] px-2.5 py-[3px] text-[0.72rem] font-bold capitalize text-fo-muted">
                        {enquiry.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </AdminSection>

        {/* Product publish checklist note ------------------------------------ */}
        <AdminSection>
          <div className="max-w-[640px] rounded-card border border-fo-line bg-white p-6">
            <h2 className="mb-1.5 text-[1.2rem]">Product publish checklist</h2>
            <p className="mb-4 text-[0.88rem] text-fo-muted">
              Required before a product can go live. Products missing allergen
              information or storage instructions are counted above and cannot be
              published.
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.9rem] max-[860px]:grid-cols-1">
              {[
                "Name & slug",
                "Category",
                "Active variant",
                "Price / MRP",
                "Stock",
                "Ingredients",
                "Allergen info",
                "Storage instructions",
                "Images + alt text",
                "Nutrition status",
                "Claims approved",
                "SEO fields",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="grid h-[17px] w-[17px] flex-none place-items-center rounded-[4px] border border-fo-green-900 text-[0.65rem] font-bold text-fo-green-900"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </AdminSection>
      </AdminContent>
    </>
  );
}
