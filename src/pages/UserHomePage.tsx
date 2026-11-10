import React, { useEffect } from "react";
// import Header from "@/components/UserHeader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import { HowItWorks, WhyUs, Faq, SellerCta } from "@/components/HomeSections";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const UserHomePage = () => {
  const [status, setstatus] = React.useState(false);
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response.message === "Please log in again.") {
          setstatus(false);
        } else {
          setstatus(true);
        }
      } catch (error) {
        console.error("Authentication error", error);
        return;
      }
    };

    checkAuthStatus();
  }, []);

  // useEffect(() => {
  //   const fetchAuthStatus = async () => {
  //     try {
  //       const response = await checkAuthStatus();
  //       if (response.message === "Please log in again.") {
  //         setstatus(false);
  //       } else {
  //         setstatus(true);
  //       }
  //     } catch (error) {
  //       console.error("Error in fetching auth status:", error);
  //     }
  //   };

  //   fetchAuthStatus();
  // }, []);

  // useEffect(() => {
  //   if (!status) {
  //     navigate("/");
  //   }
  // }, []);

  const handleViewAllAccounts = () => {
    navigate("/digital-products");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Admin-curated listings (Admin > Homepage products) */}
        <section className="container mx-auto px-4 py-12">
          <FeaturedProducts />
        </section>
        <HowItWorks />
        <WhyUs />
        <Faq />
        <SellerCta />
      </main>
      <Footer />
    </div>
  );
};

export default UserHomePage;
