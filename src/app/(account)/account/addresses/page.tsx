import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";

export const metadata: Metadata = {
  title: "Saved addresses",
  description: "Manage your saved delivery addresses.",
};

type Address = {
  id: string;
  label: string | null;
  recipient_name: string | null;
  phone: string | null;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  is_default: boolean;
};

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  const { data: addresses } = await supabase
    .from("addresses")
    .select(
      "id, label, recipient_name, phone, line1, line2, landmark, city, state, pincode, is_default",
    )
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .returns<Address[]>();

  const rows = addresses ?? [];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Addresses" },
        ]}
      />

      <header className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-4">
        <div>
          <h1 className="text-[clamp(1.7rem,2.8vw,2.2rem)]">Saved addresses</h1>
          <p className="mt-1 text-fo-muted">
            Delivery addresses for faster checkout.
          </p>
        </div>
        <button
          type="button"
          className="fo-btn-secondary !min-h-0 !px-4 !py-2 text-[0.85rem]"
          disabled
          title="Coming soon"
        >
          Add address
        </button>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-card border border-dashed border-fo-line bg-fo-cream-50 p-8 text-center">
          <p className="font-bold text-fo-green-900">No saved addresses yet</p>
          <p className="mt-1 text-[0.9rem] text-fo-muted">
            You can save an address when you place your next order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rows.map((address) => (
            <div key={address.id} className="fo-card p-5">
              <span className="fo-badge">
                {[address.is_default ? "Default" : null, address.label]
                  .filter(Boolean)
                  .join(" · ") || "Address"}
              </span>
              <address className="mt-3 text-[0.9rem] not-italic leading-relaxed text-fo-charcoal-900">
                {address.recipient_name && (
                  <>
                    {address.recipient_name}
                    <br />
                  </>
                )}
                {address.line1}
                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}
                {address.landmark && (
                  <>
                    <br />
                    {address.landmark}
                  </>
                )}
                <br />
                {[address.city, address.state].filter(Boolean).join(", ")}
                {address.pincode ? ` — ${address.pincode}` : ""}
                {address.phone && (
                  <>
                    <br />
                    {address.phone}
                  </>
                )}
              </address>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
