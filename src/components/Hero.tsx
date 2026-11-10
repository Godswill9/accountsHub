import React, { useMemo, useState } from "react";
import { Search, ShieldCheck, Star, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RotatingWords } from "@/components/RotatingWords";
import { fetchAllProducts, Product } from "@/services/digitalProductsService";
import { getPlatformImage } from "@/utils/platformImages";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({ queryKey: ["allProducts"], queryFn: fetchAllProducts });

  const stats = useMemo(() => ({ platforms: [...new Set(products.map((p: Product) => p.platform_name))] }), [products]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/digital-products?search=${encodeURIComponent(searchQuery.trim())}` : "/digital-products");
  };

  return (
    <div className="bg-hero-pattern text-white">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <h1 className="mb-5 text-4xl font-extrabold tracking-wide sm:text-5xl md:text-6xl">
            Accounts <span style={{ fontWeight: 100 }}>Hub</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-white/85 sm:text-xl">
            Ready-to-use social media accounts from rated sellers. Your payment is held until you confirm delivery.
          </p>

          <div className="mb-8 flex items-center justify-center gap-2">
            <RotatingWords />
          </div>

          <form onSubmit={search} className="mx-auto flex max-w-xl overflow-hidden rounded-xl bg-white p-1.5 shadow-lg">
            <label className="relative flex-1">
              <span className="sr-only">Search accounts</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try “aged Facebook” or “TikTok followers”"
                className="w-full bg-transparent py-3 pl-10 pr-3 text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <button type="submit" className="rounded-lg bg-brand-800 px-5 font-medium text-white hover:bg-brand-900">
              Search
            </button>
          </form>

          {stats.platforms.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {stats.platforms.map((name) => (
                <button
                  key={name}
                  onClick={() => navigate(`/digital-products?platform=${encodeURIComponent(name)}`)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm hover:bg-white/20"
                >
                  <img src={getPlatformImage(name)} alt="" className="h-4 w-4 rounded-sm bg-white object-contain" />
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Reassurance instead of live counts: stock/platform/rating numbers reveal more than they sell. */}
          <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-white/80">
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />Payment held until delivery</li>
            <li className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" aria-hidden />Rated sellers</li>
            <li className="inline-flex items-center gap-2"><LifeBuoy className="h-4 w-4 text-sky-300" aria-hidden />Ticket support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hero;
