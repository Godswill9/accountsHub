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
import ReactMarkdown from "react-markdown";
import ImageCarouselViewer from "@/components/ImageCarouselViewer";

// Interface for PaymentDetails
export interface PaymentDetails {
  payment_type: string;
  payment_status: string;
  payment_gateway: string;
  amount: number;
  transaction_type: string;
  user_id: string;
  ref: string;
}

export interface ConversationDetails {
    order_id:string, 
    buyer_id:string, 
    seller_id:string, 
    product_id:string, 
}

export interface ChatDetails {
     order_id:string, 
     sender_id:string, 
     sender_role:string,
     message:string
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
  ref: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState("");
  const [sellerId, setsellerId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showInput, setShowInput] = useState(false); // State to toggle input visibility
  const [inputValue, setInputValue] = useState(1); // State to store the input value
  const [couponValue, setcouponValue] = useState(""); // State to store the input value
  const [totalPriceValue, settotalPriceValue] = useState(0); // State to store the input value
  const [carouselImages, setCarouselImages] = useState([]);
    const [isBanned, setIsBanned] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [loading, setLoading] = useState(false)

const showOrderThankYouPopup = () => {
  setShowThankYou(true);
  setTimeout(() => setShowThankYou(false), 4000); // auto close after 4s
};


  const handleDownloadClick = () => {
    setShowInput(true); // Show the input and button when "Download Sample" is clicked
  };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const fetchImages = async (arr) => {
    try {
      const imagePromises = arr.map(async (item) => {
        const response = await fetch(
          `https://aitool.asoroautomotive.com/api/get-product-image/${item.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const imageSrc = await response.text(); // or response.blob() if needed
        return imageSrc;
      });

      const imageBlobs = await Promise.all(imagePromises);
      // setImages(imageBlobs); // Store the fetched images in state
      return imageBlobs;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  useEffect(() => {
    async function loadImages() {
      if (product?.images && product.images.length > 0) {
        const imgs = await fetchImages(product.images);
        setCarouselImages(imgs);
      } else if (product?.imageUrl) {
        setCarouselImages([product.imageUrl]);
      } else {
        setCarouselImages([]);
      }
    }

    loadImages();
  }, [product]);

  useEffect(() => {
    if (product) {
      // console.log(product);
      setsellerId(product.seller_id);
      settotalPriceValue(Number(product.price));
      document.title = `${product.platform_name} | Digital Product`;
      // fetchImages(product.images || []); // Fetch images if available
      // console.log(images);
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
           if (response?.acc_status && response.acc_status !== "Okay") {
            setIsBanned(true);
          }
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
        `https://aitool.asoroautomotive.com/api/digital-products-FS/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();
      // console.log(data.product);

      // Get only the first 'fileCount' number of file IDs
      const fileIds = data.product.files
        .slice(0, fileCount)
        .map((file) => file.id);
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
         credentials:"include"
      }
    );

    const data = await response.json();
  };

  const createOrder = async (orderData: AccountDetails) => {
    try {
      const response = await fetch(
        "https://aitool.asoroautomotive.com/api/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
           credentials:"include"
        }
      );

      const data = await response.json();
      if (response.ok) {
        // console.log("order created successfuflly:", data);
        await createConversation({order_id: data.order_id, buyer_id: orderData.buyer_id, seller_id: orderData.seller_id, product_id: orderData.item_id});
      } else {
        console.error("❌ Error saving payment:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  };

  async function createPayment() {
    if(!userId || userId ===" "){
      alert("Login and fund wallet to Purchase")
      return;
    }
    setLoading(true)
    if (couponValue.length === 15) {
      // Coupon validation
      try {
        const response = await fetch(
          `https://aitool.asoroautomotive.com/api/coupon/${couponValue}`,{credentials:"include"}
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
             credentials:"include"
          }
        );
        const data2 = await response2.json();
        if (data2.message === "Funds transferred successfully") {
          // alert("Payment received. View details in orders page");
          // await downloadfetchAcc(inputValue);
          await updateCouponCode(data.id, userId);
          await savePayment({
            payment_type: "order",
            payment_status: "completed",
            payment_gateway: "wallet",
            amount: Number(discountedPrice),
            transaction_type: "order",
            user_id: userId,
            ref: "ref",
          });
          await createOrder({
            item_id: product.id,
            item_name: product.platform_name + "/" + product.category,
            quantity: inputValue,
            buyer_id: userId,
            seller_id: sellerId,
            amount: Number(discountedPrice),
            buyer_email: userEmail,
            ref: "ref",
          });
        } else {
          alert(data2.error);
          console.log(data2);
          setLoading(false)
        }
      } catch (error) {
        alert(error.message)
        console.log(error.message);
         setLoading(false)
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
             credentials:"include"
          }
        );

        const data = await response.json();
        if (data.message === "Funds transferred successfully") {
          // alert("Payment received. View details in orders page");
          // await downloadfetchAcc(inputValue);
          savePayment({
            payment_type: "order",
            payment_status: "completed",
            payment_gateway: "wallet",
            amount: totalPriceValue,
            transaction_type: "order",
            user_id: userId,
            ref: "ref",
          });
          await createOrder({
            item_id: product.id,
            item_name: product.platform_name + "/" + product.category,
            quantity: inputValue,
            buyer_id: userId,
            seller_id: sellerId,
            amount: totalPriceValue,
            buyer_email: userEmail,
            ref: "ref",
          });
        } else {
          alert(data.error)
          console.log(data);
           setLoading(false)
        }
      } catch (error) {
         setLoading(false)
         alert(error.message)
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
           credentials:"include"
        }
      );

      const data = await response.json();
      if (data.message === "Payment saved successfully") {
        console.log("✅ Payment saved successfully:", data);
      } else {
        console.error("❌ Error saving payment:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  }
  async function createConversation(conversationData: ConversationDetails) {
    try {
      const response = await fetch(
        "https://aitool.asoroautomotive.com/api/conversations",
        // "http://localhost:8086/api/conversations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conversationData),
           credentials:"include"
        }
      );

      const data = await response.json();
      if (data.message === "Conversation created successfully") {
        console.log("✅ Conversation created successfully:", data); 
       await sendMessage({order_id: data.order_id, sender_id: userId, sender_role: "buyer", message: "Hello, I would like to purchase this product."});
      } else {
        console.error("❌ Error creating conversation:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  }
 
  async function sendMessage(chatData: ChatDetails) {
    try {
      const response = await fetch(
        "https://aitool.asoroautomotive.com/api/sendMessage",
        // "http://localhost:8086/api/sendMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatData),
           credentials:"include"
        }
      );

      const data = await response.json();
      if (data.success) {
          setLoading(false)
        // console.log("✅ Message sent successfully:", data);
          setTimeout(()=>{
            showOrderThankYouPopup()
          }, 10)
        setTimeout(() => {
  window.location.href = "/orders"; 
}, 200);
      } else {
        console.error("❌ Error sending message:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error.message);
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/digital-products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-8">
            <Skeleton className="h-10 w-1/4 rounded-full" />
            <Skeleton className="h-56 w-full rounded-lg" />
            <Skeleton className="h-6 w-1/2 rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        )}

        {/* Error state */}
        {/* {error && (
          <Alert status="error" variant="left-accent" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}

        {/* Product details */}
        {!isLoading && !error && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start min-h-[500px]">
            {/* Left column: logo + carousel */}
            <div className="flex flex-col items-center space-y-6 min-w-0">
              {/* Logo image */}
              <div className="w-full max-w-md rounded-lg overflow-hidden border border-gray-300 shadow-lg">
                <img
                  src={getPlatformImage(product.platform_name.toLowerCase())}
                  alt={product.platform_name}
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Carousel container */}
            <ImageCarouselViewer images={carouselImages} />

{product && (
  sellerId !== "admin" && sellerId !== null ? (
    <Link
      to={`/about-seller/${sellerId}`}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition mb-4"
    >
      View Seller
    </Link>
  ) : (
    <p className="text-sm text-gray-600 mb-4 italic">
      This product was added by the <span className="font-semibold text-gray-800">Admin</span>.
    </p>
  )
)}

            </div>

            {/* Right column: details + description */}
            <div className="flex flex-col space-y-6 min-w-0">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {product.platform_name}
              </h1>

              <p className="text-lg text-gray-600 italic">
                <span className="font-semibold">Category:</span>{" "}
                {product.category} |{" "}
                <span className="font-semibold">
                  {product.stock_quantity} items in stock
                </span>
              </p>

              <div className="text-3xl font-semibold text-gray-800">
                ${product.price}
              </div>
<div className="bg-gray-100 p-3 rounded-md">
  <h2 className="text-xl font-extrabold text-gray-900 bg-gray-300 p-2 rounded-md">
    Description
  </h2>
  <div
    className="mt-2 text-gray-700 prose max-w-none text-left"
    dangerouslySetInnerHTML={{ __html: product.description }}
  />
</div>

{product.important_notice?.trim() && (
  <div className="bg-red-100 p-3 rounded-md">
    <h2 className="text-xl font-extrabold text-gray-900 bg-red-300 p-2 rounded-md">
      Important Notice
    </h2>
    <div
      className="text-gray-700 mt-2 text-left prose max-w-none"
      dangerouslySetInnerHTML={{ __html: product.important_notice }}
    />
  </div>
)}

       <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-lg font-bold text-gray-800">Data Format</h2>
  </div>
  <div className="flex flex-wrap gap-2">
    {(product.data_format || "Email & Password")
      .split("|")
      .map((item, index) => (
        <span
          key={index}
          className="inline-block text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium border border-blue-200"
        >
          {item.trim()}
        </span>
      ))}
  </div>
</div>



              {/* Purchase section */}
                   <div className="space-y-8">
                     {isBanned? (
              <div className="bg-red-100 text-red-800 border border-red-300 p-4 rounded-md text-center font-medium">
      🚫 You cannot make a purchase because your account has been <span className="font-semibold">banned</span>. Please contact support for more information.
    </div>
            ):(
                <div className="w-full bg-white p-6 rounded-md shadow-lg flex flex-col gap-4">
                  <button
                    onClick={() => setShowInput(!showInput)}
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
  )}
                {showInput && (
                  <div className="bg-gray-50 p-6 rounded-md shadow-md space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Purchase Details
                    </h2>

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

                      <div className="text-3xl font-semibold text-gray-900">
                        Total: ${totalPriceValue.toFixed(2)}
                      </div>
                    </div>
                    <button
                      disabled={!product || product.stock_quantity <= 0}
                      onClick={createPayment}
                      className={`w-full py-3 px-6 rounded-md text-white font-semibold text-lg transition-all duration-300 ease-in-out transform ${
                        !product || product.stock_quantity <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 hover:scale-105"
                      }`}
                    >
                      Confirm Purchase
                    </button>
                    
                  </div>
                )}
              </div>
            


            </div>
          </div>
        )}

        {/* If no product found */}
        {!isLoading && !error && !product && (
          <div className="text-center text-xl font-semibold text-red-600">
            Product not found.
          </div>
        )}
      </main>
{showThankYou && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div
      className="relative bg-cover bg-center rounded-2xl shadow-xl max-w-sm w-full p-6 text-center text-white overflow-hidden"
      style={{
        backgroundImage:
          "url('https://accountshub.onrender.com/lovable-uploads/b8bc2363-f8b3-49a4-bec6-1490e3aa106a-removebg-preview.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-400 bg-opacity-100 rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <h2 className="text-2xl font-bold">Thank you! 😊</h2>
        <p className="text-sm">
          Order placed! We’ll email you shortly. ✨
        </p>
        <button
          onClick={() => setShowThankYou(false)}
          className="mt-2 px-4 py-2 bg-white text-blue-800 font-semibold rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
{loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white font-medium">Loading...</p>
    </div>
  </div>
)}





      <Footer />
    </div>
  );
};

export default ProductDetail;
