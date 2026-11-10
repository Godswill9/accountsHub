import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronRight, MessageCircle, PackageOpen } from "lucide-react";
import { getPlatformImage } from "@/utils/platformImages";

interface Order {
  amount: number;
  created_at: string;
  item_id: string;
  item_name: string;
  order_id: string;
  quantity: number;
  status: string;
  seen_by_user: string | null;
}

interface OrderListProps {
  orders: Order[];
  messagesCount?: Record<string, number>;
}

// Short, human-friendly reference instead of the full UUID.
export const orderRef = (id: string) => `#${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "In progress", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  processing: { label: "Processing", className: "bg-brand-50 text-brand-700 ring-brand-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 ring-red-200" },
};

const markSeen = (orderId: string) =>
  axios.put(`${import.meta.env.VITE_API_BASE_URL}/user-order-seen/${orderId}`, {}).catch(() => {});

const OrderList: React.FC<OrderListProps> = ({ orders, messagesCount = {} }) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <PackageOpen className="h-10 w-10 text-slate-300" aria-hidden />
        <p className="text-slate-600">You haven't bought anything yet.</p>
        <Link to="/digital-products" className="text-sm font-medium text-brand-600 hover:text-brand-800">
          Browse accounts
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {orders.map((order) => {
        const [platform, ...rest] = (order.item_name || "").split("/");
        const category = rest.join("/");
        const delivered = order.status === "pending" && (order as any).expected_completion_date;
        const status = delivered
          ? { label: "Delivered", className: "bg-blue-50 text-blue-700 ring-blue-200" }
          : STATUS[order.status] || { label: order.status, className: "bg-slate-50 text-slate-700 ring-slate-200" };
        const unread = messagesCount[order.order_id] || 0;
        const isNew = order.seen_by_user === null;
        const qty = Number(order.quantity);

        return (
          <li key={order.order_id}>
            <Link
              to={`/order/${order.order_id}`}
              onClick={() => isNew && markSeen(order.order_id)}
              className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none sm:px-6"
            >
              <div className="relative shrink-0">
                <img
                  src={getPlatformImage(platform || "")}
                  alt=""
                  className="h-11 w-11 rounded-xl bg-white object-contain p-1.5 ring-1 ring-slate-200"
                />
                {isNew && (
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-600 ring-2 ring-white" aria-label="New" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="truncate font-medium text-slate-900">{platform}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <p className="truncate text-sm text-slate-600">
                  {category || "Account"} · {qty} {qty === 1 ? "account" : "accounts"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {orderRef(order.order_id)} · {new Date(order.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="font-semibold tabular-nums text-slate-900">${Number(order.amount).toFixed(2)}</p>
                {unread > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                    <MessageCircle className="h-3 w-3" aria-hidden />
                    {unread} new
                  </span>
                )}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-slate-500" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default OrderList;
