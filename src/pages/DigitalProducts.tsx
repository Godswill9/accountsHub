import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { fetchAllProducts, Product } from "@/services/digitalProductsService";
import { getPlatformImage } from "@/utils/platformImages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DigitalProducts = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQuery = searchParams.get("search") || "";

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchAllProducts,
  });

  // useEffect(() => {
  //   // Scroll to the top of the page when the component is mounted
  //   window.scrollTo(0, 0);
  // }, []);

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 10) {
      return words.slice(0, 5).join(" ") + "...";
    }
    return description;
  };

  // Updated scroll behavior
  // useEffect(() => {
  //   if (location.hash) {
  //     const element = document.querySelector(location.hash);
  //     if (element) {
  //       // Add timeout to ensure DOM is ready
  //       setTimeout(() => {
  //         const headerOffset = 100;
  //         const elementPosition = element.getBoundingClientRect().top;
  //         const offsetPosition =
  //           elementPosition + window.pageYOffset - headerOffset;

  //         window.scrollTo({
  //           top: offsetPosition,
  //           behavior: "smooth",
  //         });
  //       }, 100);
  //     }
  //   }
  // }, [location.hash, products]);

  // Group products by platform
  const groupedProducts = React.useMemo(() => {
    if (!products) return {};
    return products.reduce((acc: { [key: string]: Product[] }, product) => {
      if (!acc[product.platform_name]) {
        acc[product.platform_name] = [];
      }
      acc[product.platform_name].push(product);
      return acc;
    }, {});
  }, [products]);

  const filteredGroups = React.useMemo(() => {
    if (!groupedProducts) return {};
    const filtered: { [key: string]: Product[] } = {};

    Object.entries(groupedProducts).forEach(([platform, platformProducts]) => {
      const filteredProducts = platformProducts.filter(
        (product) =>
          product.platform_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredProducts.length > 0) {
        filtered[platform] = filteredProducts;
      }
    });
    return filtered;
  }, [groupedProducts, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Unable to load products. Please try again later.
            </AlertDescription>
          </Alert>
        ) : Object.entries(filteredGroups).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found matching your search.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredGroups).map(
              ([platform, platformProducts]) => (
                <div
                  key={platform}
                  id={platform.toLowerCase()}
                  className="bg-white w-[99%] mx-auto rounded-lg shadow-sm overflow-hidden scroll-mt-32 sm:w-[65%]"
                >
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-l font-bold">{platform} accounts</h2>
                    <span className="text-sm text-gray-500">
                      {platformProducts.reduce(
                        (total, product) => total + product.stock_quantity,
                        0
                      )}{" "}
                      total accounts
                    </span>
                  </div>
                  <div className="divide-y">
                    {platformProducts.map((product) => {
                      // Conditionally applying border and border radius
                      let borderClass = "";
                      let stockMessage = `${product.stock_quantity} in stock`;
                      if (product.stock_quantity === 0) {
                        borderClass = "border-red-800"; // Red border for 0 stock
                      } else if (product.stock_quantity < 10) {
                        borderClass = "border-yellow-800"; // Gold border for stock < 10
                      }

                      return (
                        <div
                          key={product.id}
                          className={`p-4 hover:bg-gray-50 flex items-center justify-between transition-colors border ${borderClass} rounded-lg mb-3`}
                        >
                          <div className="flex items-center space-x-4 w-full">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                              <img
                                src={getPlatformImage(product.platform_name)}
                                alt={product.platform_name}
                                className="w-6 h-6 object-contain"
                              />
                            </div>
                            <div className="w-full">
                              <h3 className="font-medium">
                                {product.category}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {truncateDescription(product.description)}
                              </p>
                              <span
                                className={`block text-sm font-bold ${borderClass} mt-2`}
                              >
                                {stockMessage}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Link
                              to={`/digital-products/${product.id}`}
                              className="px-4 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DigitalProducts;
