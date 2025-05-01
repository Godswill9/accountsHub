import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const GuestHomePage: React.FC = () => {
  const [status, setstatus] = React.useState(false);
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await checkAuthStatus();
        // console.log(response);
        if (response.message === "Please log in again.") {
          setstatus(false);
        } else {
          setstatus(true);
        }
      } catch (error) {
        console.error("Error in fetching auth status:", error);
      }
    };

    fetchAuthStatus();
  }, []);

  useEffect(() => {
    if (!status) {
      navigate("/"); // Redirect to the visitors' page
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to Accounts hub
        </h1>
        <p className="text-center mb-8">
          Explore our products and discover amazing deals.
        </p>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Browse Featured Products
          </h2>
          <FeaturedProducts />
          <div className="flex justify-center mt-8">
            <Link to="/digital-products">
              <Button variant="default">View All Products</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GuestHomePage;
