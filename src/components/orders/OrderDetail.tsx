import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, Store } from "lucide-react";
import { getPlatformImage } from "@/utils/platformImages";
import { orderRef } from "./OrderList";
import { RateOrder } from "@/components/Ratings";

interface OrderDetailProps {
  order: {
    order_id: string;
    status: "pending" | "processing" | "completed" | "cancelled";
    created_at: string;
    updated_at?: string;
    item_name: string;
    item_id: string;
    amount: string;
    quantity: number;
    seller_id?: string;
    has_issue?: number;
    expected_completion_date?: string | null;
    notes?: string;
  };
}

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "";

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const navigate = useNavigate();
  const [platform, ...rest] = (order.item_name || "").split("/");
  const category = rest.join("/");
  const qty = Number(order.quantity);
  const confirmed = Boolean(order.expected_completion_date);
  const completed = order.status === "completed";

  // Real lifecycle: paid at purchase -> seller delivers in chat -> buyer confirms -> seller paid after hold.
  const steps = [
    { title: "Paid", detail: `$${Number(order.amount).toFixed(2)} from your wallet · ${fmt(order.created_at)}`, done: true },
    { title: "Seller delivers your account details", detail: "Delivery happens in the order chat.", done: confirmed || completed },
    {
      title: "You confirm delivery",
      detail: confirmed ? "Thanks! The seller is paid after a short hold period." : "Confirm in the order chat once you've checked the account.",
      done: confirmed || completed,
    },
    { title: "Completed", detail: completed ? fmt(order.updated_at) : "", done: completed },
  ];
  const current = steps.findIndex((s) => !s.done);

  const statusLabel = completed ? "Completed" : order.status === "cancelled" ? "Cancelled" : confirmed ? "Delivered" : "Awaiting delivery";
  const statusClass = completed
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : order.status === "cancelled"
      ? "bg-red-50 text-red-700 ring-red-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button onClick={() => navigate("/orders")} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden /> My orders
      </button>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex items-start gap-4">
          <img src={getPlatformImage(platform || "")} alt="" className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-2 ring-1 ring-slate-200" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{platform}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusClass}`}>{statusLabel}</span>
            </div>
            <p className="text-slate-600">{category || "Account"}</p>
            <p className="mt-1 text-xs text-slate-400">Order {orderRef(order.order_id)} · {fmt(order.created_at)}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center">
          <div>
            <dt className="text-xs text-slate-500">Total</dt>
            <dd className="mt-1 font-semibold tabular-nums text-slate-900">${Number(order.amount).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Quantity</dt>
            <dd className="mt-1 font-semibold text-slate-900">{qty} {qty === 1 ? "account" : "accounts"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Payment</dt>
            <dd className="mt-1 font-semibold text-emerald-700">Paid</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate(`/conversation/${order.order_id}`)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> Open order chat
          </button>
          {order.seller_id && (
            <Link
              to={`/about-seller/${order.seller_id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <Store className="h-4 w-4" aria-hidden /> View seller
            </Link>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <h2 className="text-sm font-semibold text-slate-900">Progress</h2>
        <ol className="mt-4 space-y-0">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-3 pb-5 last:pb-0">
              {i < steps.length - 1 && (
                <span className={`absolute left-[11px] top-6 h-full w-px ${s.done ? "bg-emerald-300" : "bg-slate-200"}`} aria-hidden />
              )}
              <span
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  s.done ? "bg-emerald-500 text-white" : i === current ? "bg-brand-800 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                {s.done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${s.done || i === current ? "text-slate-900" : "text-slate-400"}`}>{s.title}</p>
                {s.detail && <p className="text-sm text-slate-500">{s.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
        {(confirmed || completed) && <RateOrder orderId={order.order_id} />}
        {order.has_issue === 1 && confirmed && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">An issue was raised on this order; payout is on hold until it's resolved.</p>
        )}
      </section>
    </div>
  );
};

export default OrderDetail;
