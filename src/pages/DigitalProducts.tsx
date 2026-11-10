import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, PackageSearch, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import { fetchAllProducts, Product } from "@/services/digitalProductsService";
import { getPlatformImage } from "@/utils/platformImages";
import Header from "@/components/Header";
import { RatingLine } from "@/components/Ratings";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

type Sort = "featured" | "price-asc" | "price-desc" | "stock";

// Plain-text preview of a (possibly rich-text) description.
const preview = (text = "") => {
  const el = document.createElement("textarea"); // decodes &amp; etc. without rendering HTML
  el.innerHTML = text.replace(/<[^>]+>/g, " ");
  return el.value.replace(/\s+/g, " ").trim();
};
// Sellers enter formats as "Email and Password | 2FA Enabled | …"
const formats = (f?: string) => (f || "").split("|").map((x) => x.trim()).filter(Boolean);

const DigitalProducts = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");
  const platform = params.get("platform");
  const [category, setCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sort, setSort] = useState<Sort>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading, error } = useQuery({ queryKey: ["allProducts"], queryFn: fetchAllProducts });

  useEffect(() => setQuery(params.get("search") || ""), [params]);
  useEffect(() => setCategory(null), [platform]);

  const setPlatform = (p: string | null) => {
    const next = new URLSearchParams(params);
    p ? next.set("platform", p) : next.delete("platform");
    setParams(next, { replace: true });
  };

  // Platform tabs with live counts.
  const platforms = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p: Product) => (counts[p.platform_name] = (counts[p.platform_name] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const categories = useMemo(
    () => [...new Set(products.filter((p: Product) => !platform || p.platform_name === platform).map((p: Product) => p.category))],
    [products, platform]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    const list = products.filter((p: Product) => {
      const price = Number(p.price);
      return (
        (!platform || p.platform_name === platform) &&
        (!category || p.category === category) &&
        (!inStockOnly || p.stock_quantity > 0) &&
        price >= min && price <= max &&
        (!q || `${p.platform_name} ${p.category} ${preview(p.description)}`.toLowerCase().includes(q))
      );
    });
    const sorters: Record<Sort, (a: Product, b: Product) => number> = {
      featured: () => 0,
      "price-asc": (a, b) => Number(a.price) - Number(b.price),
      "price-desc": (a, b) => Number(b.price) - Number(a.price),
      stock: (a, b) => b.stock_quantity - a.stock_quantity,
    };
    return [...list].sort(sorters[sort]);
  }, [products, platform, category, inStockOnly, minPrice, maxPrice, query, sort]);

  const grouped = useMemo(() => {
    const g: Record<string, Product[]> = {};
    visible.forEach((p) => (g[p.platform_name] ||= []).push(p));
    return Object.entries(g);
  }, [visible]);

  const activeFilters = Boolean(category || minPrice || maxPrice || !inStockOnly || query);
  const clearFilters = () => {
    setCategory(null); setMinPrice(""); setMaxPrice(""); setInStockOnly(true); setQuery("");
    setPlatform(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-left">
      <Header />

      {/* Title + search */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Browse accounts</h1>
          <p className="mt-1 text-slate-600">Verified sellers, instant order chat, and payment held until you confirm delivery.</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search accounts</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search platform, category or keyword…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <div className="flex gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="Sort by"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 sm:flex-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="stock">Most in stock</option>
              </select>
              <button
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  showFilters ? "border-brand-300 bg-brand-50 text-brand-800" : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap items-end gap-4 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <label className="text-sm">
                <span className="mb-1 block text-slate-600">Min price ($)</span>
                <input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  className="w-28 rounded-md border border-slate-200 px-2 py-1.5" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-slate-600">Max price ($)</span>
                <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-28 rounded-md border border-slate-200 px-2 py-1.5" />
              </label>
              <label className="flex items-center gap-2 pb-1.5 text-sm text-slate-700">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-brand-800" />
                In stock only
              </label>
              {activeFilters && (
                <button onClick={clearFilters} className="pb-1.5 text-sm font-medium text-brand-700 hover:text-brand-900">
                  Clear all
                </button>
              )}
            </div>
          )}

          {/* Platform tabs */}
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Platforms">
            <PlatformTab active={!platform} onClick={() => setPlatform(null)} label="All" count={products.length} />
            {platforms.map(([name, count]) => (
              <PlatformTab key={name} active={platform === name} onClick={() => setPlatform(name)} label={name} count={count} icon={getPlatformImage(name)} />
            ))}
          </div>

          {categories.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(category === c ? null : c)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                    category === c ? "bg-brand-800 text-white ring-brand-800" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto flex-grow px-4 py-6">
        {/* Trust strip */}
        <div className="mb-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <Trust icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />} text="Payment held until you confirm delivery" />
          <Trust icon={<MessageCircle className="h-4 w-4 text-brand-600" />} text="Chat with the seller on every order" />
          <Trust icon={<Zap className="h-4 w-4 text-amber-500" />} text="Pay instantly from your wallet" />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : error ? (
          <p className="rounded-xl bg-red-50 p-4 text-red-700">We couldn't load the catalogue. Please refresh the page.</p>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white py-16 text-center ring-1 ring-slate-200">
            <PackageSearch className="h-10 w-10 text-slate-300" aria-hidden />
            <p className="text-slate-700">No accounts match your search.</p>
            <button onClick={clearFilters} className="text-sm font-medium text-brand-700 hover:text-brand-900">Clear filters</button>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([name, items]) => (
              <section key={name} id={name} aria-labelledby={`h-${name}`}>
                <div className="mb-3 flex items-center gap-2">
                  <img src={getPlatformImage(name)} alt="" className="h-6 w-6 object-contain" />
                  <h2 id={`h-${name}`} className="text-lg font-semibold text-slate-900">{name} accounts</h2>
                  <span className="text-sm text-slate-500">({items.length})</span>
                </div>
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                  {items.map((p) => <ListingRow key={p.id} product={p} />)}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const PlatformTab = ({ active, onClick, label, count, icon }: { active: boolean; onClick: () => void; label: string; count: number; icon?: string }) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors ${
      active ? "bg-brand-800 text-white ring-brand-800" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
    }`}
  >
    {icon && <img src={icon} alt="" className="h-4 w-4 rounded-sm bg-white object-contain" />}
    {label}
    <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{count}</span>
  </button>
);

const Trust = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">{icon}<span>{text}</span></div>
);

export const ListingRow = ({ product: p }: { product: Product }) => {
  const stock = Number(p.stock_quantity);
  const desc = preview(p.description);
  return (
    <li className="group flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
      <Link to={`/digital-products/${p.id}`} className="flex min-w-0 flex-1 items-start gap-4">
        <img src={getPlatformImage(p.platform_name)} alt="" className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-2 ring-1 ring-slate-200" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-slate-900 group-hover:text-brand-800">{p.category}</h3>
            {formats(p.data_format).slice(0, 4).map((f) => (
              <span key={f} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700">{f}</span>
            ))}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{desc}</p>
          <RatingLine productId={p.id} sellerId={p.seller_id} />
        </div>
      </Link>
      <div className="flex items-center justify-between gap-5 sm:justify-end">
        <p className={`text-sm ${stock === 0 ? "text-red-600" : stock < 5 ? "text-amber-600" : "text-slate-500"}`}>
          {stock === 0 ? "Out of stock" : `${stock} in stock`}
        </p>
        <p className="text-right">
          <span className="block font-semibold tabular-nums text-slate-900">${Number(p.price).toFixed(2)}</span>
          <span className="text-xs text-slate-500">per account</span>
        </p>
        <Link
          to={`/digital-products/${p.id}`}
          aria-disabled={stock === 0}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            stock === 0 ? "pointer-events-none bg-slate-100 text-slate-400" : "bg-brand-800 text-white hover:bg-brand-900"
          }`}
        >
          Buy
        </Link>
      </div>
    </li>
  );
};

export default DigitalProducts;
