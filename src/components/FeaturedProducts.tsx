import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFeaturedProducts,
  Product,
} from "@/services/digitalProductsService";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPlatformImage } from "@/utils/platformImages";

const FeaturedProducts = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 10) {
      return words.slice(0, 8).join(" ") + "...";
    }
    return description;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 mb-12">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden border border-border h-36 w-full"
          >
            <div className="flex items-center h-full p-6 gap-6">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-24 ml-auto" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Unable to load featured products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-10 mb-12">
      {products &&
        Object.entries(products).map(([platform, productArray]) => {
          const items = Array.isArray(productArray)
            ? (productArray as Product[])
            : []; // Ensure productArray is an array
          return (
            <div key={platform} className="flex flex-col gap-4">
              {/* Platform Header */}
              <div className="flex items-center justify-between px-4">
                <h2 className="text-xl font-bold">{platform} Accounts</h2>
                {/* <span className="text-muted-foreground text-sm">
                  {items.length} total
                </span> */}
              </div>

              {/* List of Products */}
              <div className="flex flex-col gap-4">
                {items.map((product) => (
                  <Card
                    key={product.id}
                    className="w-full flex items-center justify-between p-6 border border-border rounded-lg hover:shadow-md transition-all gap-6 bg-white h-22"
                  >
                    {/* Left Image */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-md flex items-center justify-center overflow-hidden">
                        {/* <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden"> */}
                        <img
                          src={getPlatformImage(
                            product.platform_name.toLocaleLowerCase()
                          )}
                          alt={product.platform_name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>

                      {/* Middle Text */}
                      <div className="flex flex-col justify-center min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          {product.platform_name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {product.category} · {product.stock_quantity} in stock
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {truncateDescription(product.description)}
                        </p>
                      </div>
                    </div>

                    {/* Right Price & Button */}
                    <div className="flex flex-col items-end justify-center gap-2 min-w-fit">
                      <span className="font-bold text-xl text-primary whitespace-nowrap">
                        ${product.price}
                      </span>
                      <Link
                        to={`/digital-products/${product.id}`}
                        className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90 transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FeaturedProducts;
