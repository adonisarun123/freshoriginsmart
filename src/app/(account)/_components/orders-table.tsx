import Link from "next/link";
import type { Order } from "@/types/database";
import { formatINR } from "@/lib/commerce/format";
import { formatOrderDate } from "./format";
import { OrderStatusTag } from "./order-status";

export type OrderRow = Pick<
  Order,
  | "id"
  | "public_order_number"
  | "status"
  | "total_paise"
  | "created_at"
> & { item_count: number };

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-fo-line bg-fo-cream-50 p-8 text-center">
        <p className="font-bold text-fo-green-900">No orders yet</p>
        <p className="mt-1 text-[0.9rem] text-fo-muted">
          Your orders will appear here once you place one.
        </p>
        <Link href="/shop" className="fo-btn-primary mt-5">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.92rem]">
        <thead>
          <tr className="border-b border-fo-line text-left text-fo-muted">
            <th className="py-3 pr-4 font-bold">Order</th>
            <th className="py-3 pr-4 font-bold">Date</th>
            <th className="py-3 pr-4 font-bold">Items</th>
            <th className="py-3 pr-4 font-bold">Total</th>
            <th className="py-3 pr-4 font-bold">Status</th>
            <th className="py-3 font-bold" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-fo-line/70">
              <td className="py-3 pr-4">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="font-bold text-fo-green-900 underline"
                >
                  {order.public_order_number}
                </Link>
              </td>
              <td className="py-3 pr-4 text-fo-muted">
                {formatOrderDate(order.created_at)}
              </td>
              <td className="py-3 pr-4 tabular-nums">{order.item_count}</td>
              <td className="py-3 pr-4 tabular-nums font-bold">
                {formatINR(order.total_paise)}
              </td>
              <td className="py-3 pr-4">
                <OrderStatusTag status={order.status} />
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="font-bold text-fo-green-900 underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
