import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { formatINR } from "@/lib/commerce/format";
import { site } from "@/config/site";
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

export const metadata = { title: "Abandoned carts" };
export const dynamic = "force-dynamic";

// Consider a cart "abandoned" if it's active, has items, and has been idle
// for at least this long.
const IDLE_MINUTES = 60;

interface CartRow {
  id: string;
  contact_email: string | null;
  contact_name: string | null;
  marketing_consent: boolean;
  last_activity_at: string;
  reminded_at: string | null;
  cart_items: { quantity: number; product_variants: { selling_price_paise: number; title: string; products: { name: string } } | null }[];
}

function idleLabel(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr`;
  return `${Math.round(hrs / 24)} d`;
}

export default async function AdminAbandonedCartsPage() {
  let carts: CartRow[] = [];
  let dataError = false;
  try {
    if (hasSupabaseAdminEnv()) {
      const supabase = createAdminClient();
      const cutoff = new Date(
        Date.now() - IDLE_MINUTES * 60000,
      ).toISOString();

      const { data, error } = await supabase
        .from("carts")
        .select(
          "id, contact_email, contact_name, marketing_consent, last_activity_at, reminded_at, cart_items(quantity, product_variants(selling_price_paise, title, products(name)))",
        )
        .eq("status", "active")
        .lt("last_activity_at", cutoff)
        .order("last_activity_at", { ascending: false })
        .limit(200);
      if (error) throw error;

      carts = ((data as unknown as CartRow[] | null) ?? []).filter(
        (c) => c.cart_items && c.cart_items.length > 0,
      );
    } else {
      dataError = true;
    }
  } catch {
    dataError = true;
  }

  function cartTotal(c: CartRow): number {
    return c.cart_items.reduce(
      (s, it) => s + (it.product_variants?.selling_price_paise ?? 0) * it.quantity,
      0,
    );
  }
  function itemsLabel(c: CartRow): string {
    return c.cart_items
      .map(
        (it) =>
          `${it.quantity}× ${it.product_variants?.products?.name ?? "item"}`,
      )
      .join(", ");
  }

  const contactable = carts.filter((c) => c.contact_email);

  return (
    <>
      <AdminTopbar
        title="Abandoned carts"
        subtitle={
          dataError
            ? "Data unavailable"
            : `${carts.length} idle > ${IDLE_MINUTES} min · ${contactable.length} contactable`
        }
      />
      <AdminContent>
        <AdminSection>
          {dataError ? (
            <DataUnavailableNotice />
          ) : (
          <>
          <p style={{ fontSize: "0.85rem", color: "var(--fo-muted)", marginBottom: "12px" }}>
            Active carts with items, idle for over {IDLE_MINUTES} minutes. Only
            carts where the customer left an email can be reached out to — and
            only message offers to those who ticked marketing consent.
          </p>
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Idle</th>
                <th className={thClass}>Items</th>
                <th className={thClass}>Total</th>
                <th className={thClass}>Contact</th>
                <th className={thClass}>Consent</th>
                <th className={thClass}>Reminded</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {carts.length === 0 ? (
                <EmptyRow colSpan={7} label="No abandoned carts right now." />
              ) : (
                carts.map((c) => {
                  const total = cartTotal(c);
                  const waText = encodeURIComponent(
                    `Hi${c.contact_name ? " " + c.contact_name : ""}, this is Fresh Origins — you left some items in your cart (${itemsLabel(c)}). Want a hand completing your order?`,
                  );
                  return (
                    <tr key={c.id}>
                      <td className={tdClass}>{idleLabel(c.last_activity_at)}</td>
                      <td className={tdClass}>{itemsLabel(c)}</td>
                      <td className={tdClass}>{formatINR(total)}</td>
                      <td className={tdClass}>
                        {c.contact_email ? (
                          <>
                            {c.contact_name ? `${c.contact_name} · ` : ""}
                            {c.contact_email}
                          </>
                        ) : (
                          <span style={{ color: "var(--fo-muted)" }}>No email</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        {c.marketing_consent ? "Yes" : "No"}
                      </td>
                      <td className={tdClass}>
                        {c.reminded_at
                          ? new Date(c.reminded_at).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className={tdClass}>
                        {c.contact_email ? (
                          <a
                            href={`mailto:${c.contact_email}?subject=${encodeURIComponent("Your Fresh Origins cart")}&body=${waText}`}
                            className="fo-btn-secondary"
                            style={{ minHeight: 0, padding: "6px 12px", fontSize: "0.8rem" }}
                          >
                            Email
                          </a>
                        ) : (
                          <span style={{ color: "var(--fo-muted)", fontSize: "0.8rem" }}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableWrap>
          <p style={{ fontSize: "0.78rem", color: "var(--fo-muted)", marginTop: "12px" }}>
            WhatsApp number on file is captured at the order step, not the cart
            step — so cart reach-out here is by email. Send to {site.name} customers
            responsibly and honour unsubscribe requests.
          </p>
          </>
          )}
        </AdminSection>
      </AdminContent>
    </>
  );
}
