import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-6 gap-10">
          {/* Logo + About */}
          <div className="md:col-span-2">
            <a href="/" className="block mb-4">
              <span className="text-2xl font-bold text-flippa-navy">Accounts Hub.</span>
            </a>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              The leading platform to buy and sell verified social media accounts — trusted by over 3 million entrepreneurs worldwide.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 transition">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-blue-500 transition">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-pink-500 transition">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-blue-700 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Sell Section */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Start Selling</h4>
            <p className="text-sm text-gray-600 mb-3">
              Ready to cash out? Create a seller account and list your digital asset in minutes.
            </p>
            <Button variant="default" className="text-sm font-medium px-4 py-2" asChild>
              <a href="https://accountshubsellers.onrender.com/" className="flex items-center gap-2">
                Start Selling <ChevronRight size={16} />
              </a>
            </Button>
          </div>

          {/* Company Links */}
          {/* <div>
            <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-flippa-blue transition">About Us</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-flippa-blue transition">Contact</a></li>
              <li><a href="/careers" className="text-sm text-gray-600 hover:text-flippa-blue transition">Careers</a></li>
              <li><a href="/blog" className="text-sm text-gray-600 hover:text-flippa-blue transition">Blog</a></li>
            </ul>
          </div> */}

          {/* Legal Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-flippa-blue transition">Terms of Service</a></li>
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-flippa-blue transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} AccountsHub.com. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm text-gray-500 hover:text-flippa-blue transition">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-gray-500 hover:text-flippa-blue transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
