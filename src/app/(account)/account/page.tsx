import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { OrdersTable, type OrderRow } from "../_components/orders-table";

export const metadata: Metadata = {
  title: "My account",
  description: "Your Fresh Origins account — profile, addresses, and orders.",
};

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Layout guarantees a user, but TS-narrow it here.
  const userId = user!.id;

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, phone, marketing_consent")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("orders")
      .select(
        "id, public_order_number, status, total_paise, created_at, order_items(count)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const greetingName =
    profile?.full_name?.split(" ")[0] ?? user!.email?.split("@")[0] ?? "there";

  const recentOrders: OrderRow[] = (orders ?? []).map((order) => ({
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
        items={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />

      <header className="pb-6 pt-4">
        <h1 className="text-[clamp(1.8rem,3vw,2.4rem)]">
          Welcome back, {greetingName}
        </h1>
        <p className="mt-1 text-fo-muted">
          Manage your profile, addresses, and orders.
        </p>
      </header>

      <section className="fo-card mb-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.25rem]">Profile</h2>
          <Link href="/account/profile" className="fo-btn-secondary !min-h-0 !px-4 !py-2 text-[0.85rem]">
            Edit
          </Link>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-[0.95rem] sm:grid-cols-[160px_1fr]">
          <dt className="text-fo-muted">Full name</dt>
          <dd className="font-bold">{profile?.full_name ?? "—"}</dd>
          <dt className="text-fo-muted">Email</dt>
          <dd className="font-bold">{profile?.email ?? user!.email}</dd>
          <dt className="text-fo-muted">Phone</dt>
          <dd className="font-bold">{profile?.phone ?? "—"}</dd>
          <dt className="text-fo-muted">Marketing emails</dt>
          <dd className="font-bold">
            {profile?.marketing_consent ? "Subscribed" : "Not subscribed"}
          </dd>
        </dl>
      </section>

      <section className="fo-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.25rem]">Recent orders</h2>
          <Link
            href="/account/orders"
            className="text-[0.9rem] font-bold text-fo-green-900 underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-4">
          <OrdersTable orders={recentOrders} />
        </div>
      </section>
    </div>
  );
}
