import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { PopularListings, HowItWorks, WhyUs, Faq, SellerCta } from '@/components/HomeSections';

const Index = () => {
  useEffect(() => {
    document.title = "AccountsHub - Store";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PopularListings />
        <HowItWorks />
        <WhyUs />
        <Faq />
        <SellerCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
