import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Wallet, ShoppingCart, MessageCircle, Star, ShieldCheck, LifeBuoy, Zap } from "lucide-react";
import { fetchAllProducts, Product } from "@/services/digitalProductsService";
import { ListingRow } from "@/pages/DigitalProducts";
import { useRatings } from "@/components/Ratings";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SELLER_SITE = import.meta.env.VITE_SELLER_URL;

export const PopularListings = () => {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["allProducts"], queryFn: fetchAllProducts });
  const { data: ratings } = useRatings();
  const top = useMemo(
    () =>
      products
        .filter((p: Product) => p.stock_quantity > 0)
        .sort((a: Product, b: Product) => (ratings?.products[b.id]?.sold || 0) - (ratings?.products[a.id]?.sold || 0))
        .slice(0, 5),
    [products, ratings]
  );
  if (!isLoading && top.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-12 text-left">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Popular right now</h2>
          <p className="text-slate-600">Best-selling listings in stock today.</p>
        </div>
        <Link to="/digital-products" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900">
          View all <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        {top.map((p) => <ListingRow key={p.id} product={p} />)}
      </ul>
    </section>
  );
};

const STEPS = [
  { icon: Wallet, title: "Fund your wallet", text: "Top up by card or crypto. Your balance is ready for instant checkout." },
  { icon: ShoppingCart, title: "Pick an account", text: "Compare price, stock, delivery format and seller ratings." },
  { icon: MessageCircle, title: "Get it in the order chat", text: "The seller delivers the account details to you in a private chat." },
  { icon: Star, title: "Confirm and rate", text: "Check the account, confirm delivery, then rate the seller." },
];

export const HowItWorks = () => (
  <section className="bg-slate-50 py-14">
    <div className="container mx-auto px-4">
      <h2 className="text-center text-2xl font-semibold text-slate-900">How it works</h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-2xl bg-white p-5 text-left ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-800"><s.icon className="h-5 w-5" aria-hidden /></span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {i + 1}</span>
            </div>
            <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const REASONS = [
  { icon: ShieldCheck, title: "Payment held until delivery", text: "Sellers are paid only after you confirm the account works." },
  { icon: Star, title: "Real buyer ratings", text: "Every rating comes from a completed order, so you know who to trust." },
  { icon: LifeBuoy, title: "Support when you need it", text: "Open a ticket any time and our team steps in on disputes." },
  { icon: Zap, title: "Instant wallet checkout", text: "No card details at checkout. Pay from your balance in one click." },
];

export const WhyUs = () => (
  <section className="container mx-auto px-4 py-14">
    <h2 className="text-center text-2xl font-semibold text-slate-900">Why buy on AccountsHub</h2>
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {REASONS.map((r) => (
        <div key={r.title} className="text-left">
          <r.icon className="h-6 w-6 text-brand-700" aria-hidden />
          <h3 className="mt-3 font-semibold text-slate-900">{r.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{r.text}</p>
        </div>
      ))}
    </div>
  </section>
);

const FAQS = [
  { q: "How do I receive my account?", a: "After you pay, an order chat opens with the seller. The seller sends the account details there, and you can ask them questions in the same chat." },
  { q: "What if the account doesn't work?", a: "Don't confirm delivery. Message the seller in the order chat or open a support ticket. Sellers are only paid after you confirm." },
  { q: "How do I pay?", a: "Fund your wallet by card (Flutterwave) or crypto, then buy instantly from your balance." },
  { q: "Can I get a refund?", a: "If a problem is reported before you confirm delivery, our team reviews it and can return the funds to your wallet." },
  { q: "Can I sell my accounts here?", a: "Yes. Create a seller account, list your stock, and get paid to your seller wallet after buyers confirm delivery." },
];

export const Faq = () => (
  <section className="bg-slate-50 py-14">
    <div className="container mx-auto max-w-3xl px-4 text-left">
      <h2 className="text-center text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="mt-6 rounded-2xl bg-white px-5 ring-1 ring-slate-200">
        {FAQS.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-slate-600">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export const SellerCta = () => (
  <section className="container mx-auto px-4 py-14">
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-brand-900 p-8 text-left text-white sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Have accounts to sell?</h2>
        <p className="mt-1 text-white/75">List them in minutes and reach buyers looking for exactly what you have.</p>
      </div>
      <a href={SELLER_SITE} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-medium text-brand-900 hover:bg-brand-50">
        Become a seller <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  </section>
);
