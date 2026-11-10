import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

type Summary = {
  products: Record<string, { sold: number; rating: number | null; reviews: number }>;
  sellers: Record<string, { rating: number; reviews: number }>;
};

// One cached request for the whole catalogue (ratings + sold counts).
export const useRatings = () =>
  useQuery<Summary>({
    queryKey: ["ratingsSummary"],
    queryFn: async () => (await axios.get(`${API}/ratings-summary`, { withCredentials: false })).data,
    staleTime: 60_000,
  });

export const Stars = ({ value, size = 14 }: { value: number; size?: number }) => (
  <span className="inline-flex items-center" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        style={{ width: size, height: size }}
        className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        aria-hidden
      />
    ))}
  </span>
);

// Compact line for listing rows: product rating, seller rating, sold count.
export const RatingLine = ({ productId, sellerId }: { productId: string; sellerId?: string }) => {
  const { data } = useRatings();
  const p = data?.products[productId];
  const s = sellerId ? data?.sellers[sellerId] : undefined;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      {p?.rating ? (
        <span className="inline-flex items-center gap-1">
          <Stars value={p.rating} size={12} />
          <span className="font-medium text-slate-700">{p.rating.toFixed(1)}</span>({p.reviews})
        </span>
      ) : (
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700">New</span>
      )}
      {s && (
        <span>
          Seller <span className="font-medium text-slate-700">★ {s.rating.toFixed(1)}</span> ({s.reviews})
        </span>
      )}
      {p?.sold ? <span>{p.sold} sold</span> : null}
    </div>
  );
};

// Product page: rating summary + latest reviews.
export const ProductReviews = ({ productId, sellerId }: { productId: string; sellerId?: string }) => {
  const { data } = useRatings();
  const { data: reviews = [] } = useQuery<{ rating: number; comment: string | null; created_at: string }[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => (await axios.get(`${API}/products/${productId}/reviews`, { withCredentials: false })).data.reviews,
  });
  const p = data?.products[productId];
  const s = sellerId ? data?.sellers[sellerId] : undefined;

  return (
    <section className="mt-10 rounded-2xl bg-white p-5 text-left ring-1 ring-slate-200 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ratings & reviews</h2>
          {p?.rating ? (
            <div className="mt-1 flex items-center gap-2">
              <Stars value={p.rating} size={18} />
              <span className="text-lg font-semibold">{p.rating.toFixed(1)}</span>
              <span className="text-sm text-slate-500">from {p.reviews} {p.reviews === 1 ? "review" : "reviews"}</span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500">No reviews yet. Buyers can rate after confirming delivery.</p>
          )}
        </div>
        <div className="flex gap-6 text-sm">
          {s && (
            <div>
              <p className="text-slate-500">Seller rating</p>
              <p className="font-semibold text-slate-900">★ {s.rating.toFixed(1)} <span className="font-normal text-slate-500">({s.reviews})</span></p>
            </div>
          )}
          {p?.sold ? (
            <div>
              <p className="text-slate-500">Sold</p>
              <p className="font-semibold text-slate-900">{p.sold}</p>
            </div>
          ) : null}
        </div>
      </div>
      {reviews.length > 0 && (
        <ul className="mt-5 divide-y divide-slate-100">
          {reviews.map((r, i) => (
            <li key={i} className="py-3">
              <div className="flex items-center gap-2">
                <Stars value={r.rating} />
                <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-slate-700">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

// Order page: let the buyer rate once delivery is confirmed.
export const RateOrder = ({ orderId }: { orderId: string }) => {
  const qc = useQueryClient();
  const [state, setState] = useState<{ enabled: boolean; review: { rating: number; comment: string | null } | null } | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${API}/orders/${orderId}/review`).then((r) => setState(r.data)).catch(() => setState(null));
  }, [orderId]);

  if (!state || !state.enabled) return null;

  if (state.review) {
    return (
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">Your review</p>
        <div className="mt-1"><Stars value={state.review.rating} size={16} /></div>
        {state.review.comment && <p className="mt-1 text-sm text-slate-600">{state.review.comment}</p>}
      </div>
    );
  }

  const submit = async () => {
    if (!rating) return setError("Pick 1 to 5 stars.");
    setSaving(true); setError("");
    try {
      await axios.post(`${API}/orders/${orderId}/review`, { rating, comment });
      setState({ enabled: true, review: { rating, comment } });
      qc.invalidateQueries({ queryKey: ["ratingsSummary"] });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Could not save your review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-900">How was this order?</p>
      <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`}>
            <Star className={`h-7 w-7 ${i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        rows={2}
        placeholder="Optional: tell other buyers about the account and the seller"
        className="mt-3 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-400"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={saving}
        className="mt-2 rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Submit review"}
      </button>
    </div>
  );
};
