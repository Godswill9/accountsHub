import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

const SuccessPage = () => {
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  
  //   const history = useHistory();
  const location = useLocation();
  //   const { checkAuthStatus } = useAuth();
  const [userId, setUserId] = useState("");
  const [ref, setRef] = useState("");
  const transactionId = new URLSearchParams(location.search).get(
    "transactionId"
  ); // Extract transactionId from URL

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
        console.log("Auth status response:", response);
        const userDetails = response.id;
        setUserId(userDetails);
        if (!userDetails) {
          return;
        }
        realVerify(userDetails)
        // verifyPayment(userDetails);
      } catch (error) {
        console.error("Error in fetching auth status:", error);
      }
    };

    fetchAuthStatus();

    const query = new URLSearchParams(window.location.search);
const txRef = query.get("tx_ref");
setRef(txRef || ""); // Set ref from URL query parameter
const transactionId = query.get("transaction_id");

  }, []);

const realVerify = async (id) => {
  const transactionId = localStorage.getItem("transactionId")

  // ✅ Handle missing transaction_id
 if (!transactionId) {
  alert("No transaction found. If you just paid, please check your email or try again.");
  return;
}

  try {
    const response = await fetch(
      `https://aitool.asoroautomotive.com/api/flutterwave/verify?transaction_id=${transactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.status === "failed") {
      localStorage.setItem("currentPayment", "");
      localStorage.setItem("paymentDetails", "");
      localStorage.setItem("accountDetails", "");
      localStorage.setItem("transactionId", "");
      setTimeout(()=>{
          window.location.href = `/error?reason=payment_failed`;
      }, 1000)
    } else {
      verifyPayment(id);
        localStorage.setItem("transactionId", "");
    }
  } catch (err) {
    console.error("Verification error:", err);
  }
};


  const verifyPayment = async (id: String) => {
    if (
      localStorage.getItem("currentPayment") === "add_to_wallet_with_normal_currency"
    ) {
      const updatevalue = async (userId, amount) => {
        try {
          const response = await fetch(
            "https://aitool.asoroautomotive.com/api/wallet/add-funds",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: Number(amount),
                userId: id,
              }),
              credentials: "include",
            }
          );

          const data = await response.json();
          console.log(data);
          if (data.message === "Funds added successfully") {
             const query = new URLSearchParams(window.location.search);
const txRef = query.get("tx_ref");
            // savePayment(JSON.parse(localStorage.getItem("paymentDetails")));
             savePayment({...JSON.parse(localStorage.getItem("paymentDetails")), payment_status: "completed", ref: txRef});
            localStorage.setItem("paymentDetails", "");
            localStorage.setItem("currentPayment", "");
          }
        } catch (error) {
          console.error("❌ Error:", error);
        }
      };

      updatevalue(
        userId,
        JSON.parse(localStorage.getItem("paymentDetails")).amount
      );
    } else if (
      localStorage.getItem("currentPayment") === "add_to_wallet_with_crypto"
    ) {
      const updatevalue = async (userId, amount) => {
        try {
          const response = await fetch(
            "https://aitool.asoroautomotive.com/api/wallet/add-funds",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: Number(amount),
                userId: userId,
              }),
              credentials: "include",
            }
          );

          const data = await response.json();
          console.log(data);
          if (data.message === "Funds added successfully") {
            savePayment(JSON.parse(localStorage.getItem("paymentDetails")));

            localStorage.setItem("paymentDetails", "");
            localStorage.setItem("currentPayment", "");
          }
        } catch (error) {
          console.error("❌ Error:", error);
        }
      };

      updatevalue(
        userId,
        JSON.parse(localStorage.getItem("paymentDetails")).amount
      );
    } else if (
      localStorage.getItem("currentPayment") === "buy_social_media_account"
    ) {
      const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
      const accountDetails = JSON.parse(localStorage.getItem("accountDetails"));

      if (!paymentDetails || !accountDetails) {
        console.error(
          "❌ Missing paymentDetails or accountDetails in localStorage"
        );
        return;
      }

      // Call savePayment first and wait for it to complete
      savePayment(paymentDetails)
        .then(() => {
          console.log("✅ Payment saved successfully");
          // Call createOrder only after savePayment completes
          return createOrder(accountDetails);
        })
        .then(() => {
          console.log("✅ Order created successfully");
          // Clear localStorage values
          localStorage.setItem("currentPayment", "");
          localStorage.setItem("paymentDetails", "");
          localStorage.setItem("accountDetails", "");
        })
        .catch((error) => {
          console.error("❌ Error processing transaction:", error);
        });
    }
  };

  async function savePayment(paymentData) {
    try {
      const response = await fetch(
        "https://aitool.asoroautomotive.com/api/payments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();
      if (data.message === "Payment saved successfully") {
        console.log("✅ Payment saved successfully:", data);
        localStorage.setItem("currentPayment", "");
        localStorage.setItem("paymentDetails ", "");
        // setTimeout(() => {
        // window.location.href = 'profile.html';
        // }, 1000);
      } else {
        console.error("❌ Error saving payment:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  }

  const createOrder = async (orderData) => {
    try {
      const response = await fetch(
        "https://aitool.asoroautomotive.com/api/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("order created successfuflly:", data);
        // localStorage.setItem('currentPayment', '')
        // setTimeout(() => {
        // window.location.href = 'profile.html';
        // }, 1000);
      } else {
        console.error("❌ Error saving payment:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-semibold text-blue-600 mb-4">
            Success!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your transaction was completed successfully.
          </p>

          {/* Optional: Display transaction details or confirmation */}
          {transactionId && (
            <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold">Transaction ID</h2>
              <p className="text-gray-500">{transactionId}</p>
            </div>
          )}

          {/* Button to navigate back to the wallet */}
          <Link
            to="/wallet"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              {" "}
              Go to My Wallet
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;
function setUserId(userDetails: any) {
  throw new Error("Function not implemented.");
}
