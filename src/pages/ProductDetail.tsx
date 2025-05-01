import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductDetails } from "@/services/digitalProductsService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ShoppingCart, Download, Star } from "lucide-react";
import { authService } from "@/services/authService";
import { getPlatformImage } from "@/utils/platformImages";

// Interface for PaymentDetails
export interface PaymentDetails {
  payment_type: string;
  payment_status: string;
  payment_gateway: string;
  amount: number;
  transaction_type: string;
  user_id: string;
}

// Interface for AccountDetails
export interface AccountDetails {
  item_id: string;
  item_name: string;
  quantity: number;
  buyer_id: string;
  seller_id: string;
  amount: number;
  buyer_email: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showInput, setShowInput] = useState(false); // State to toggle input visibility
  const [inputValue, setInputValue] = useState(1); // State to store the input value
  const [couponValue, setcouponValue] = useState(""); // State to store the input value
  const [totalPriceValue, settotalPriceValue] = useState(0); // State to store the input value

  const handleDownloadClick = () => {
    setShowInput(true); // Show the input and button when "Download Sample" is clicked
  };

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  const handleLogInput = () => {
    console.log(inputValue); // Log the entered number
  };

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: () => fetchProductDetails(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      console.log(product);
      settotalPriceValue(Number(product.price));
      document.title = `${product.platform_name} | Digital Product`;
    } else {
      document.title = "Product Details";
    }
  }, [product]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response) {
          // console.log(response);
          setUserId(response.id);
          setUserEmail(response.email);
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
      }
    };

    checkAuthStatus();
  }, []);

  function downloadFiles(fileArray: []) {
    fetch(
      `https://aitool.asoroautomotive.com/api/download-digital-products?ids=${fileArray.join(
        ","
      )}`,
      {
        // method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data.files.forEach((file) => {
          const blob = new Blob(
            [Uint8Array.from(atob(file.data), (c) => c.charCodeAt(0))],
            { type: file.type }
          );
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      })
      .catch((error) => console.error("Download error:", error));
  }

  async function downloadfetchAcc(fileCount: Number) {
    try {
      const response = await fetch(
        `https://aitool.asoroautomotive.com/api/digital-products/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      // Get only the first 'fileCount' number of file IDs
      const fileIds = data.files.slice(0, fileCount).map((file) => file.id);
      console.log(fileIds);
      if (fileIds.length === 0) {
        console.warn("No files available for download.");
        return;
      }
      // console.log(object)
      downloadFiles(fileIds);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  const updateCouponCode = async (id: string, userId: string) => {
    const response = await fetch(
      `https://aitool.asoroautomotive.com/api/updateCouponUsed/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    const data = await response.json();
  };

  async function createPayment() {
    if (couponValue.length === 15) {
      // Coupon validation
      try {
        const response = await fetch(
          `https://aitool.asoroautomotive.com/api/coupon/${couponValue}`
        );
        const data = await response.json();

        // Handle invalid, used, or expired coupons
        if (response.status === 404 || data.message) {
          console.log(response);
          // responseDiv.innerHTML = `<p>Error: ${data.message || "Invalid or expired coupon"}</p>`;
          return; // Stop execution if the coupon is not valid
        }
        console.log(data);
        let discountValue = Number(data.discount_value);
        let discountedPrice =
          totalPriceValue - (discountValue / 100) * totalPriceValue;

        // Proceed with fund transfer
        const response2 = await fetch(
          "https://aitool.asoroautomotive.com/api/wallet/transfer-funds",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fromUserId: userId,
              toUserId: "678f3fa1-8b88-45ef-b945-97b06d0d8f1f",
              amount: Number(discountedPrice),
            }),
          }
        );
        const data2 = await response2.json();
        if (data2.message === "Funds transferred successfully") {
          alert("Payment received. Check downloads for txt file");
          await downloadfetchAcc(inputValue);
          await updateCouponCode(data.id, userId);
          await savePayment({
            payment_type: "order",
            payment_status: "completed",
            payment_gateway: "wallet",
            amount: Number(discountedPrice),
            transaction_type: "order",
            user_id: userId,
          });
          await createOrder({
            item_id: product.id,
            item_name: product.platform_name + "/" + product.category,
            quantity: inputValue,
            buyer_id: userId,
            seller_id: "",
            amount: Number(discountedPrice),
            buyer_email: userEmail,
          });
        } else {
          console.log(data2.messsage);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        // Proceed without a coupon
        const response = await fetch(
          "https://aitool.asoroautomotive.com/api/wallet/transfer-funds",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fromUserId: userId,
              toUserId: "678f3fa1-8b88-45ef-b945-97b06d0d8f1f",
              amount: totalPriceValue,
            }),
          }
        );

        const data = await response.json();
        if (data.message === "Funds transferred successfully") {
          alert("Payment received. Check downloads for txt file");
          await downloadfetchAcc(inputValue);
          savePayment({
            payment_type: "order",
            payment_status: "completed",
            payment_gateway: "wallet",
            amount: totalPriceValue,
            transaction_type: "order",
            user_id: userId,
          });
          await createOrder({
            item_id: product.id,
            item_name: product.platform_name + "/" + product.category,
            quantity: inputValue,
            buyer_id: userId,
            seller_id: "",
            amount: totalPriceValue,
            buyer_email: userEmail,
          });
        } else {
          console.log(data.messsage);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async function savePayment(paymentData: PaymentDetails) {
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
      if (data.meaaage === "Payment saved successfully") {
        console.log("✅ Payment saved successfully:", data);
      } else {
        console.error("❌ Error saving payment:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  }

  const createOrder = async (orderData: AccountDetails) => {
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
      } else {
        console.error("❌ Error saving payment:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/digital-products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="aspect-video w-full rounded-lg" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Unable to load product details. Please try again later.
              </AlertDescription>
            </Alert>
          ) : product ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              {/* Product Image Section */}
              <div className="w-56 md:w-1/2 overflow-hidden shadow-lg border border-gray-300 rounded-lg">
                <img
                  src={getPlatformImage(product.platform_name.toLowerCase())}
                  alt={product.platform_name}
                  className="w-full h-auto object-cover rounded-lg transition-all hover:scale-105 duration-300"
                />
              </div>

              {/* Product Details Section */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Product Title */}
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {product.platform_name}
                </h1>

                {/* Product Category & Stock */}
                <p className="text-lg text-gray-600 italic">
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category} |
                  <span className="font-semibold">
                    {" "}
                    {product.stock_quantity} items in stock
                  </span>
                </p>

                {/* Product Price */}
                <div className="text-3xl font-semibold text-gray-800">
                  ${product.price}
                </div>

                {/* Product Description Section */}
                <div className="bg-gray-100 p-1 rounded-md text-left">
                  {/* Heading with background color */}
                  <h2 className="text-xl font-extrabold text-gray-900 bg-gray-300 p-2 rounded-md">
                    Description
                  </h2>
                  {/* Description Text */}
                  <p className="text-gray-700 mt-2">{product.description}</p>
                </div>

                {/* Important Notice Section */}
                <div className="bg-red-100 p-1 rounded-md text-left">
                  <h2 className="text-xl font-extrabold text-gray-900 bg-red-300 p-2 rounded-md">
                    Important Notice
                  </h2>
                  <p className="text-gray-700">{product.important_notice}</p>
                </div>

                {/* Action Section */}
                <div className="space-y-8">
                  {/* Purchase Button */}
                  <div className="w-full bg-white p-6 rounded-md shadow-lg flex flex-col gap-4">
                    <button
                      onClick={() => setShowInput(!showInput)} // Toggle logic for purchase section
                      disabled={!product || product.stock_quantity <= 0}
                      className={`w-full py-3 px-6 rounded-md text-white font-semibold text-lg transition-all duration-300 ease-in-out transform ${
                        !product
                          ? "bg-gray-400 cursor-not-allowed"
                          : product.stock_quantity <= 0
                          ? "bg-red-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 hover:bg-blue-700"
                      }`}
                    >
                      {!product
                        ? "Product Not Available"
                        : product.stock_quantity <= 0
                        ? "Out of Stock"
                        : showInput
                        ? "Hide Purchase Options"
                        : "Purchase"}
                    </button>
                  </div>

                  {/* Download Section (if applicable) */}
                  {showInput && (
                    <div className="bg-gray-50 p-6 rounded-md shadow-md space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Purchase Details
                      </h2>

                      {/* Quantity Control */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-6 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              if (inputValue > 1) {
                                const newValue = inputValue - 1;
                                setInputValue(newValue);
                                settotalPriceValue(
                                  Number(product.price) * newValue
                                );
                              }
                            }}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-xl transition-all"
                          >
                            -
                          </button>
                          <span className="text-3xl font-semibold text-gray-800">
                            {inputValue}
                          </span>
                          <button
                            onClick={() => {
                              if (inputValue < product.stock_quantity) {
                                const newValue = inputValue + 1;
                                setInputValue(newValue);
                                settotalPriceValue(
                                  Number(product.price) * newValue
                                );
                              } else {
                                alert("You can't exceed the total stock.");
                              }
                            }}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-xl transition-all"
                          >
                            +
                          </button>
                        </div>

                        {/* Coupon Code Input */}
                        <div className="w-full sm:w-[250px]">
                          <input
                            type="text"
                            value={couponValue}
                            onChange={(e) => setcouponValue(e.target.value)}
                            placeholder="Enter coupon code (optional)"
                            className="w-full py-3 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Total Price Display */}
                      <div className="text-3xl font-semibold text-gray-900 mt-4">
                        Total Price:{" "}
                        <span className="text-blue-600">
                          ${totalPriceValue}
                        </span>
                      </div>

                      {/* Download Button */}
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => createPayment()}
                          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md flex items-center justify-center gap-4 transition-all duration-300 ease-in-out hover:scale-105"
                        >
                          <Download className="h-6 w-6" />
                          <span>Pay</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                Product not found
              </h3>
              <p className="text-gray-500 mt-2">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <Link
                to="/digital-products"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
