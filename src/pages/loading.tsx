import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VerifyPaymentPage = () => {
  const location = useLocation();
  const transactionId = new URLSearchParams(location.search).get("transaction_id");

  const [status, setStatus] = useState("loading"); // "loading", "success", "failed"
  const [details, setDetails] = useState(null);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  
    
useEffect(() => {
  const verifyPayment = async () => {
    localStorage.setItem("transactionId", transactionId)
    try {
      const res = await fetch(`https://aitool.asoroautomotive.com/api/flutterwave/verify?transaction_id=${transactionId}`);
      const data = await res.json();

      if (data.status === "success") {
        const queryParams = new URLSearchParams({
          tx_ref: data.data.tx_ref,
        //   amount: data.data.amount,
        //   currency: data.data.currency,
        }).toString();


        // ✅ Redirect to success page with query params
        window.location.href = `/success?${queryParams}`;
      } else {
        // ❌ Redirect to error page
        window.location.href = `/error?reason=payment_failed`;
      }
    } catch (error) {
      console.error("Verification failed:", error);
      // ❌ Redirect to error page
      window.location.href = `/error?reason=verification_error`;
    }
  };

  if (transactionId) {
    verifyPayment();
  } else {
    // ❌ Redirect to error page if no transaction ID
    window.location.href = `/error?reason=missing_transaction_id`;
  }
}, [transactionId]);


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-10 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-semibold mb-4 text-gray-700">Verifying Payment...</h1>
            <p className="text-gray-500">Please wait while we confirm your transaction.</p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VerifyPaymentPage;
