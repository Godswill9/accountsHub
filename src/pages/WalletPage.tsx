import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Clock, ArrowUpDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WalletHeader from "@/components/wallet/WalletHeader";
import TransactionItem from "@/components/wallet/TransactionItem";
import WithdrawFundsForm from "@/components/wallet/WithdrawFundsForm";
import { getUserPayments } from "@/services/paymentService";
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";

import { loadStripe } from "@stripe/stripe-js";
import { stripVTControlCharacters } from "node:util";
import { authService } from "@/services/authService";
import axios from "axios";
import { redirect } from "react-router-dom";

const currencies = {
  // paystack: ["NGN", "USD", "GHS", "ZAR"], // Nigeria, Ghana, South Africa, USD (international cards only)
  flutterwave: [
    "NGN", "USD", "GHS", "KES", "TZS", "UGX", 
    "ZAR", "XAF", "XOF", "GBP", "EUR"
  ], // Broad African & international support
  // paypal: ["USD", "EUR", "GBP", "AUD", "CAD", "JPY"] // Major currencies supported by PayPal
};

const paymentLogos = {
  paystack: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Paystack_Logo.png",
  flutterwave: "public/download.png",
  paypal: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
};

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  // const { checkAuthStatus } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [funding, setFunding] = useState(false);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [paymentType, setPaymentType] = useState("normal");
  const [cryptoPrice, setcryptoPrice] = useState("");



useEffect(() => {
  const onlyMethod = Object.keys(currencies)[0];
  setPaymentMethod(onlyMethod);
}, []);


  const [usdEquivalent, setUsdEquivalent] = useState(null);
  const [error, setError] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.verifyUser();
      if (response.message === "Please log in again.") {
        return response;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Authentication error", error);
      return error;
    }
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await checkAuthStatus();
        // console.log("Auth status response:", response); // Log the response here
        setLoading(false);
        setUserEmail(response.email || "");
        setUserName(response.fullName || "user");
        const userDetails = response.id;
        setUserId(userDetails);
        // console.log(userDetails);
        if (!userDetails) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please log in to access your wallet.",
          });
          return;
        }
        // const data = await getWalletBalance(userDetails.id);
        setBalance(Number(response.wallet_balance) || 0);

        // Fetch transactions
        setTransactionsLoading(true);
        try {
          const paymentsData = await getUserPayments(userDetails);
          // Convert payment data to transaction format
          const formattedTransactions: Transaction[] =
            paymentsData.payments.map((payment) => ({
              id: payment.id || `payment-${Date.now()}-${Math.random()}`,
              type:
                payment.transaction_type === "deposit"
                  ? "deposit"
                  : payment.transaction_type === "withdrawal"
                  ? "withdrawal"
                  : "transfer",
              amount: Number(payment.amount),
              currency: payment.currency || "USD",
              status: payment.payment_status,
              date: payment.created_at || new Date().toISOString(),
              description: payment.description,
              payment_gateway: payment.payment_gateway,
              payment_type: payment.payment_type,
              transaction_type: payment.transaction_type,
              ref: payment.ref,
              user_id: payment.user_id,
            }));

            // console.log(paymentsData.payments)

          setTransactions(formattedTransactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          // Don't show an error for transactions, just leave them empty
        } finally {
          setTransactionsLoading(false);
        }
      } catch (error) {
        console.error("Error in fetching auth status:", error);
      }
    };

    fetchAuthStatus();
  }, []);

   useEffect(() => {
    const validateAmount = async () => {
      setError("");
      setUsdEquivalent(null);

      if (amount && currency && currency !== "USD") {
        try {
          const rate = await getRate(currency, "USD");
          const usd = parseFloat(amount) * rate;
          setUsdEquivalent(usd.toFixed(2));
          if (usd < 10) {
            setError("Minimum of $10 is required.");
          }
        } catch (err) {
          console.error("Rate error:", err);
          setError("Could not fetch exchange rate.");
        }
      }

      if (currency === "USD" && parseFloat(amount) < 10) {
        setError("Minimum of $10 is required.");
        setUsdEquivalent(amount);
      }

      if (currency === "USD" && parseFloat(amount) >= 10) {
        setUsdEquivalent(amount);
        setError("");
      }
    };

    validateAmount();
  }, [amount, currency]);

// const getRate = async (from, to) => {
//   const res = await axios.get(`https://api.exchangerate.host/convert`, {
//     params: { from, to }
//   });
//   console.log("Exchange rate response:", res.data);
//   return res.data.result;
// };


const getRate = async (from, to) => {
  const res = await axios.get(`https://v6.exchangerate-api.com/v6/541b3e2b6983ed52d20e9f8e/pair/${from}/${to}`);
  // console.log("Exchange rate response:", res.data);
  return res.data.conversion_rate;
};


  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  // inside handleAddFunds
  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod || !currency || !amount) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill all fields to proceed.",
      });
      return;
    }
    try {
      setFunding(true);

      // Store initial localStorage items
      localStorage.setItem("currentPayment", "add_to_wallet_with_normal_currency");

      localStorage.setItem(
        "paymentDetails",
        JSON.stringify({
          payment_type: "wallet_funding",
          payment_status: "pending",
          payment_gateway: paymentMethod,
          // amount: amountInUSD.toFixed(2),
          amount: usdEquivalent,
          transaction_type: "deposit",
          user_id: userId,
        })
      );

      // API request
      const response = await fetch(
        // "http://localhost:8086/api/create-currency-payment",
        "https://aitool.asoroautomotive.com/api/create-currency-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email:userEmail,
            customer_name: userName,
            amount: parseFloat(amount),
            currency,
            description: `Adding ${amount} ${currency.toUpperCase()} to wallet`,
            redirect_url: "https://accountshub.onrender.com/verify-payment",
            // payment_method_types: [paymentMethod],
          }),
          credentials:"include"
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        window.location.href = data.link
        
      } else {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: data.message || "Failed to create checkout session.",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setFunding(false);
    }
  };

  const handleCryptoPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceAmount = cryptoPrice;

    try {
      const response = await fetch(
        "https://aitool.asoroautomotive.com/api/create-crypto-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price_amount: Number(priceAmount),
            order_id: `id for ${userId}`,
            order_description: "Wallet funding",
          }),
          credentials:"include"
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem(
          "paymentDetails",
          JSON.stringify({
            payment_type: "wallet_funding",
            payment_status: "pending",
            payment_gateway: "crypto currency",
            amount: priceAmount,
            transaction_type: "deposit",
            user_id: userId,
          })
        );
        window.location.href = data.data.invoice_url;
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
<main className="flex-grow w-full px-4 py-8">
  <div className="w-full lg:container lg:mx-auto lg:max-w-screen-lg">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
  <h1 className="text-2xl font-bold flex items-center mb-2">
            <Wallet className="h-6 w-6 mr-2 text-blue-600" />
            My Wallet
          </h1>
          <p className="text-gray-600">
            Manage your funds and track your transactions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <> 
            <div className="mb-8">
              <WalletHeader
                balance={balance}
                onAddFundsClick={() =>
                  document.getElementById("add-funds-tab")?.click()
                }
                onWithdrawClick={() =>
                  document.getElementById("withdraw-tab")?.click()
                }
              />

              {/* <div className="mt-4 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Refresh balance
                </button>
              </div> */}
            </div>

            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="add-funds" id="add-funds-tab">
                  Add Funds
                </TabsTrigger>
                {/* <TabsTrigger value="withdraw" id="withdraw-tab">
                  Withdraw
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="transactions" className="mt-0">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">
                      Recent Transactions
                    </h2>
                  </div>

                  {transactionsLoading ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading transactions...</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <TransactionItem key={tx.id} transaction={tx} />
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p>No transactions yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="add-funds" className="mt-0">
                <div className="max-w-xl mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Payment Method
                    </label>
                   <div className="flex mt-4 gap-4">
  <label
    className={`flex items-center cursor-pointer px-4 py-2 rounded-md border text-sm transition-all
      ${
        paymentType === "crypto"
          ? "bg-yellow-100 border-yellow-500 text-yellow-800 font-medium"
          : "bg-white border-gray-300 text-gray-700 hover:border-yellow-400"
      }`}
  >
    <input
      type="radio"
      name="payment-method"
      value="crypto"
      checked={paymentType === "crypto"}
      onChange={() => setPaymentType("crypto")}
      className="hidden"
    />
    Cryptocurrency
  </label>

  <label
    className={`flex items-center cursor-pointer px-4 py-2 rounded-md border text-sm transition-all
      ${
        paymentType === "normal"
          ? "bg-blue-100 border-blue-500 text-blue-800 font-medium"
          : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
      }`}
  >
    <input
      type="radio"
      name="payment-method"
      value="normal"
      checked={paymentType === "normal"}
      onChange={() => setPaymentType("normal")}
      className="hidden"
    />
    Normal Currencies
  </label>
</div>

                  </div>

   {/* initial one...still working */}
                  {/* {paymentType === "normal" && (
                    <div className="max-w-xl mx-auto space-y-6">
                      <form
                        onSubmit={handleAddFunds}
                        className="bg-white p-6 rounded-lg shadow-md space-y-6"
                      >
                         <div>
        <label className="block text-sm font-semibold mb-1">Payment Method</label>
        <div className="relative">
          <select
            className="w-full p-3 border rounded pl-12"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setCurrency("");
              setAmount("");
              setUsdEquivalent(null);
              setError("");
            }}
          >
            <option value="">Select a method</option>
            {Object.keys(currencies).map((method) => (
              <option key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </option>
            ))}
          </select>
          {paymentMethod && (
            <img
              src={paymentLogos[paymentMethod]}
              alt={paymentMethod}
              className="absolute w-6 h-6 left-3 top-3.5"
            />
          )}
        </div>
      </div>

      {paymentMethod && (
        <div>
          <label className="block text-sm font-semibold mb-1">Currency</label>
          <select
            className="w-full p-3 border rounded"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              setAmount("");
              setUsdEquivalent(null);
              setError("");
            }}
          >
            <option value="">Select a currency</option>
            {currencies[paymentMethod].map((cur) => (
              <option key={cur} value={cur}>
                {cur.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {currency && (
        <div>
          <label className="block text-sm font-semibold mb-1">Amount</label>
          <input
            type="number"
            min="1"
            step="any"
            className="w-full p-3 border rounded"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {usdEquivalent && (
            <p className="text-sm text-gray-600 mt-1">
              ≈ ${usdEquivalent} USD
            </p>
          )}
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      )}
<button
  type="submit"
  disabled={
    funding ||
    !amount ||
    !usdEquivalent ||
    parseFloat(usdEquivalent) < 10
  }
  className={`w-full font-semibold py-2 rounded transition ${
    funding || !amount || !usdEquivalent || parseFloat(usdEquivalent) < 10
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {funding ? "Processing..." : "Proceed to Payment"}
</button>
                      </form>
                    </div>
                  )} */}

               {/* {paymentType === "normal" && (
  <div className="max-w-xl mx-auto space-y-6">
    <form
      onSubmit={handleAddFunds}
      className="bg-white p-6 rounded-lg shadow-md space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold mb-1">
          Payment Method
        </label>
        <div className="flex items-center space-x-3 p-3 border rounded bg-gray-50">
          <img
            src={paymentLogos[paymentMethod]}
            alt={paymentMethod}
            className="w-6 h-6"
          />
          <span className="font-medium capitalize">{paymentMethod}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Currency</label>
        <select
          className="w-full p-3 border rounded"
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            setAmount("");
            setUsdEquivalent(null);
            setError("");
          }}
        >
          <option value="">Select a currency</option>
          {currencies[paymentMethod].map((cur) => (
            <option key={cur} value={cur}>
              {cur.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {currency && (
        <div>
          <label className="block text-sm font-semibold mb-1">Amount</label>
          <input
            type="number"
            min="1"
            step="any"
            className="w-full p-3 border rounded"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {usdEquivalent && (
            <p className="text-sm text-gray-600 mt-1">
              ≈ ${usdEquivalent} USD
            </p>
          )}
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={
          funding ||
          !amount ||
          !usdEquivalent ||
          parseFloat(usdEquivalent) < 10
        }
        className={`w-full font-semibold py-2 rounded transition ${
          funding || !amount || !usdEquivalent || parseFloat(usdEquivalent) < 10
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {funding ? "Processing..." : "Proceed to Payment"}
      </button>
    </form>
  </div>
)}  */}

{paymentType === "normal" && (
  <div className="max-w-xl mx-auto space-y-6">
    <form
      onSubmit={handleAddFunds}
      className="bg-white p-6 rounded-2xl shadow-lg border space-y-6"
    >
      {/* 💳 Payment Method Display */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-gray-100 shadow-inner">
          <img
            src={paymentLogos[paymentMethod]}
            alt={paymentMethod}
            className="w-8 h-8 object-contain"
          />
          <span className="text-gray-800 font-semibold capitalize text-base">
            {paymentMethod}
          </span>
        </div>
      </div>

      {/* 🌍 Currency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            setAmount("");
            setUsdEquivalent(null);
            setError("");
          }}
        >
          <option value="">Select a currency</option>
          {currencies[paymentMethod].map((cur) => (
            <option key={cur} value={cur}>
              {cur.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* 💰 Amount Input */}
      {currency && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            min="1"
            step="any"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {usdEquivalent && (
            <p className="text-sm text-green-700 mt-1">
              ≈ ${usdEquivalent} USD
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1 font-medium">{error}</p>
          )}
        </div>
      )}

      {/* ✅ Submit Button */}
      <button
        type="submit"
        disabled={
          funding ||
          !amount ||
          !usdEquivalent ||
          parseFloat(usdEquivalent) < 10
        }
        className={`w-full font-semibold py-3 rounded-xl transition text-center text-white text-sm ${
          funding || !amount || !usdEquivalent || parseFloat(usdEquivalent) < 10
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {funding ? "Processing..." : "Proceed to Payment"}
      </button>
    </form>
  </div>
)}


                 {paymentType === "crypto" && (
  <div className="max-w-md mx-auto">
    <form
      onSubmit={handleCryptoPayment}
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 rounded-2xl shadow-lg space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USD)
        </label>
        <input
          type="number"
          min="1"
          step="any"
          className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-sm"
          placeholder="e.g. 50.00"
          value={cryptoPrice}
          onChange={(e) => setcryptoPrice(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={funding}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
          funding
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {funding ? "Processing..." : "Proceed to Payment"}
      </button>
    </form>
  </div>
)}

                </div>
              </TabsContent>

              <TabsContent value="withdraw" className="mt-0">
                <div className="max-w-xl mx-auto">
                  <WithdrawFundsForm currentBalance={balance} userId={userId} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WalletPage;
