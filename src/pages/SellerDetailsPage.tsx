import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeCheck, MapPin, Truck, RefreshCw, AlertTriangle, Star, MessageCircle, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlatformImage } from "@/utils/platformImages";


export interface Seller {
  seller_id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  preferred_currency: string;
  preferred_language: string;
  rating: string; // consider changing to number if needed
  total_sales: number;
  wallet_balance: string; // consider changing to number or Decimal if doing calculations
  verification_status: "true" | "false";
  acc_status: "Okay" | "Suspended" | string;
  is_user: 0 | 1;
  seen: "SEEN" | "NOT-SEEN" | string;
  bio: string | null;
  created_at: string; // ISO timestamp
  date_suspended: string | null;
  date_unsuspended: string | null;
  user_id: string; // can be empty string if not linked to a user
}

export interface Listing {
  id: string;
  platform_name: string;
  category: string;
  data_format: string;
  description: string;
  important_notice: string;
  price: string; // consider using number for price calculations
  stock_quantity: number;
  status: "pending" | "approved" | "rejected" | string;
  seller_id: string;
  date_created: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  on_homepage: "true" | "false"; // could be boolean
  homepage_position: number;
  seen: "SEEN" | "NOT-SEEN" | string;
  review_comments: string | null;
}


// Mock fetch function (replace with your real API call)
async function fetchSellerDetails(sellerId:string) {
  // Replace with your API call
  const response = await fetch(
        `https://aitool.asoroautomotive.com/api/sellers/${sellerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials:"include"
        }
      );

      const data = await response.json();
      return data
}

async function fetchSellerListings(sellerId:string) {
  // Replace with your API call
  const response = await fetch(
        `https://aitool.asoroautomotive.com/api/seller-digital-products/${sellerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials:"include"
        }
      );

      const data = await response.json();
      return data
}


const SellerDetailsPage = () => {
  const { sellerId } = useParams<{ sellerId:string }>();
  const [seller, setSeller] = useState<Seller>(null);
  const [loading, setLoading] = useState(true);
const [sellerListings, setSellerListings]= useState<Listing[]>([])

  useEffect(() => {
    async function loadSeller() {
      setLoading(true);
      console.log(sellerId)
      const data = await fetchSellerDetails(sellerId || "");
      const listings = await fetchSellerListings(sellerId)
      setSeller(data.seller);
      console.log(listings)
      setSellerListings(listings)
      setLoading(false);
    }
    loadSeller();
  }, [sellerId]);
return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-10 flex-grow">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-10 space-y-8">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900">Seller Profile</h1>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2 rounded-md" />
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : !seller ? (
            <Alert variant="destructive">
              <AlertDescription>Seller not found.</AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Seller Info */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 bg-blue-100 text-blue-700 border-2 border-blue-300 rounded-full flex items-center justify-center font-bold text-2xl">
                  {seller.fullName?.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    {seller.fullName}
                    {seller.verification_status === "true" && (
                      <BadgeCheck className="text-green-600 w-5 h-5">
                        <title>Verified Seller</title>
                      </BadgeCheck>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    {seller.country || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                {/* <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 w-5 h-5" />
                  <span>{seller.rating || "0.0"} <span className="text-gray-400">(Rating)</span></span>
                </div> */}
                <div className="flex items-center gap-2">
                  <MessageCircle className="text-blue-500 w-5 h-5" />
                  <span>Replies in under 1hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Joined:</span>
                  <span>{new Date(seller.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Country:</span>
                  <span>{seller.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Language:</span>
                  <span>{seller.preferred_language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Account Status:</span>
                  <span className="text-green-600">{seller.acc_status}</span>
                </div>
              </div>

              {/* Listings */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {/* <Truck className="text-blue-700 w-5 h-5" /> */}
                  <h2 className="text-lg font-semibold text-gray-800">
                    Other accounts from seller({sellerListings.length})
                  </h2>
                </div>
                {sellerListings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No listings available</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                   {sellerListings.map((item) => (
  <a key={item.id} href={`/digital-products/${item.id}`}>
    <div className="p-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md cursor-pointer transition">
        <img
        src={getPlatformImage(item.platform_name)}
        alt={item.platform_name}
        className="w-6 h-6 object-contain"
    />
      <h3 className="text-lg font-semibold text-gray-800">{item.platform_name}</h3>
      <p className="text-sm text-gray-600">{item.category}</p>
      <p className="text-sm text-gray-600">{item.stock_quantity}</p>
      <p className="text-base text-black font-bold mt-2">${item.price}</p>
    </div>
 </a>
))}

                  </div>
                )}
              </div>

              {/* Orders & Policy */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <span>Successful Orders:</span>
                  <span>{seller.total_sales}</span>
                </div>

                {/* <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm">
                  <RefreshCw className="text-green-600 w-5 h-5" />
                  <span>Return & Refund Policy: <span className="text-gray-700 ml-1">Not available</span></span>
                </div> */}
              </div>

              {/* Report Button */}
              <div className="flex items-center justify-end mt-4">
                <Button variant="destructive">
                  <AlertTriangle className="mr-2 w-4 h-4" />
                  Report Seller
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDetailsPage;