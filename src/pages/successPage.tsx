import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Display-only: wallets are credited by the backend (Flutterwave verify / signed crypto IPN),
// never from this page.
const SuccessPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const credited = query.get("credited");
  const cryptoPending = query.get("pending") === "crypto";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Clear leftovers from the old client-side payment flow.
    ["currentPayment", "paymentDetails", "accountDetails", "transactionId"].forEach((k) => localStorage.removeItem(k));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          {cryptoPending ? (
            <Clock className="mx-auto h-14 w-14 text-amber-500" aria-hidden />
          ) : (
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden />
          )}
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">
            {cryptoPending ? "Payment received, confirming…" : "Payment successful"}
          </h1>
          <p className="mt-2 text-slate-600">
            {cryptoPending
              ? "Crypto payments are credited automatically once the network confirms them. This usually takes a few minutes."
              : credited
                ? `$${Number(credited).toFixed(2)} has been added to your wallet.`
                : "Your transaction was completed."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/wallet" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
              Go to my wallet
            </Link>
            <Link to="/digital-products" className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
              Browse accounts
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessPage;
