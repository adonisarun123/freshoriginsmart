import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { OrdersTable, type OrderRow } from "../../_components/orders-table";

export const metadata: Metadata = {
  title: "Order history",
  description: "Your full Fresh Origins order history.",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, public_order_number, status, total_paise, created_at, order_items(count)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const rows: OrderRow[] = (orders ?? []).map((order) => ({
    id: order.id,
    public_order_number: order.public_order_number,
    status: order.status,
    total_paise: order.total_paise,
    created_at: order.created_at,
    item_count: order.order_items?.[0]?.count ?? 0,
  }));

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders" },
        ]}
      />

      <header className="pb-6 pt-4">
        <h1 className="text-[clamp(1.7rem,2.8vw,2.2rem)]">Order history</h1>
        <p className="mt-1 text-fo-muted">
          All your orders, most recent first.
        </p>
      </header>

      <section className="fo-card p-6">
        <OrdersTable orders={rows} />
      </section>
    </div>
  );
}
