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
} from "../_components/AdminShell";

export const metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  public_order_number: string;
  customer_name: string | null;
  pincode: string | null;
  status: string;
  payment_status: string;
  total_paise: number;
  created_at: string;
}

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, public_order_number, customer_name, pincode, status, payment_status, total_paise, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const orders = (data as OrderRow[] | null) ?? [];

  return (
    <>
      <AdminTopbar title="Orders" subtitle="Most recent 50 orders" />
      <AdminContent>
        <AdminSection>
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Order</th>
                <th className={thClass}>Customer</th>
                <th className={thClass}>Pincode</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Payment</th>
                <th className={thClass}>Total</th>
                <th className={thClass}>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <EmptyRow colSpan={7} label="No orders yet." />
              ) : (
                orders.map((order) => (
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
                    <td className={tdClass}>{order.pincode ?? "—"}</td>
                    <td className={`${tdClass} capitalize`}>
                      {order.status.replace(/_/g, " ")}
                    </td>
                    <td className={`${tdClass} capitalize`}>
                      {order.payment_status.replace(/_/g, " ")}
                    </td>
                    <td className={`${tdClass} ${tabnum}`}>
                      {formatINR(order.total_paise)}
                    </td>
                    <td className={tdClass}>
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
        </AdminSection>
      </AdminContent>
    </>
  );
}
