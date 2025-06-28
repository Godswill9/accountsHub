import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ChevronDown, Menu, Globe, Flag, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SupportTicketButton from "./SupportTicketButton";
import WalletButton from "./WalletButton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { getUserPayments } from '@/services/paymentService';
import {
  getNotifications
} from "@/services/notificationService";
import { getOrders } from "@/services/orderService";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState('')
  const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
const [notifications, setNotifications] = useState([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/digital-products?search=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    console.log(isAuthenticated);
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response.message === "Please log in again.") {
          setIsAuthenticated(false);
          return null;
        } else {
          setIsAuthenticated(true);
          setUserId(response.id)
          fetchNotifications(response.id)
          fetchOrders(response.id)
          fetchPayments(response.id)
          console.log(response)
        }
      } catch (error) {
        console.error("Authentication error", error);
        return null;
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () =>{
    try {
      await authService.logout();
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  }

 const fetchNotifications = async (id) => {
  try {
    const data = await getNotifications(id);
    const unseen = (data || []).filter(item => item.seen_by_user === null);
    setNotifications(unseen);
    console.log(unseen);
  } catch (error) {
    // handle error
  }
};


   const fetchOrders = async (id: string) => {
  try {
    const data = await getOrders(id);
    const unseenOrders = (data.order || []).filter(item => item.seen_by_user === null);
    setOrders(unseenOrders);
    console.log(unseenOrders);
  } catch (error) {
    // handle error
  }
};



 const fetchPayments = async (id) => {
  try {
    const response = await getUserPayments(id);
    const unseenPayments = (response.payments || []).filter(item => item.seen_by_user === null);
    setPayments(unseenPayments);
    console.log(unseenPayments);
  } catch (error) {
    // handle error
  }
};


  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top dark navbar */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-3">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm truncate max-w-[200px] sm:max-w-none">
            <span>AccountsHub - Users</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <a href="#" className="text-sm flex items-center">
              <span className="mr-1 hidden sm:inline">@accountshub</span>
            </a>

            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link to="/signup" className="hidden sm:block">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                  >
                    <span className="text-sm">+ Sign Up</span>
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <span className="text-sm sm:block">Login</span>
                  </Button>
                </Link>
              </div>
            )}
          {isAuthenticated && (
  <div className="flex items-center space-x-3">
    <Button
      size="sm"
      variant="ghost"
      className="text-white hover:bg-white/10 border border-white/20 rounded-lg px-4 py-1 transition-all duration-200"
      onClick={()=>logout()}
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span className="text-sm">Logout</span>
    </Button>
  </div>
)}



            {/* <div className="flex items-center space-x-2">
              <a href="#" className="flex items-center">
                <Flag className="h-4 w-4" />
                <span className="text-sm hidden sm:inline ml-1">Eng</span>
              </a>
              <a href="#" className="flex items-center">
                <Globe className="h-4 w-4" />
                <span className="text-sm hidden sm:inline ml-1">Рус</span>
              </a>
            </div> */}
          </div>
        </div>
      </div>

      {/* Middle navigation - Mobile & Desktop */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav
            className="flex items-center justify-between"
            style={{ height: "50px" }}
          >
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-blue-900 mr-4 h-12">
                <img
                  src="/lovable-uploads\b8bc2363-f8b3-49a4-bec6-1490e3aa106a-removebg-preview.png"
                  alt="Accounts Hub Logo"
                  className="w-auto mr-2"
                  style={{ height: "120px" }}
                />
              </Link>


{/* Mobile view */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 sm:w-80">
                  <div className="flex flex-col gap-4 py-4">
                    <Link
                      to="/"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
                    >
                      Home
                    </Link>

                    <Link
                      to="/digital-products"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
                    >
                      Social Media Accounts
                    </Link>

                    {/* <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Account Types
                      </p>
                      <div className="ml-2 flex flex-col gap-2">
                        <a
                          href="/digital-products"
                          className="text-sm text-gray-700 hover:text-blue-600"
                        >
                          Digital Accounts
                        </a>
                        <a
                          href="/digital-products#facebook"
                          className="text-sm text-gray-700 hover:text-blue-600"
                        >
                          Facebook
                        </a>
                        <a
                          href="/digital-products#twitter"
                          className="text-sm text-gray-700 hover:text-blue-600"
                        >
                          Twitter
                        </a>
                        <a
                          href="/digital-products#linkedin"
                          className="text-sm text-gray-700 hover:text-blue-600"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="/digital-products#gmail"
                          className="text-sm text-gray-700 hover:text-blue-600"
                        >
                          Gmail
                        </a>
                        <a
                          href="/digital-products#tiktok"
                          className="text-sm text-gray-700 hover:text-blue-600"
                        >
                          TikTok
                        </a>
                      </div>
                    </div> */}

                    {/* <a
                      href="#"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
                    >
                      FAQ
                    </a>

                    <a
                      href="#"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
                    >
                      Terms of use
                    </a> */}

{isAuthenticated && (
  <div className="flex flex-col gap-2">

 {/* <Link
  to="/wallet"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
>
  My Wallet
</Link> */}

    <Link
  to="/orders"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
>
  My Orders
  {orders?.length > 0 && (
    <span className="absolute top-3 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {orders.length}
    </span>
  )}
</Link>

<Link
  to="/notifications"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
>
  Notifications
  {notifications?.length > 0 && (
    <span className="absolute top-3 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {notifications.length}
    </span>
  )}
</Link>

<Link
  to="/payment-history"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
>
  Payment History
  {payments?.length > 0 && (
    <span className="absolute top-3 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {payments.length}
    </span>
  )}
</Link> 
  </div>
)}
                    <a
                      href="https://accountshubsellers.onrender.com"
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 px-4 py-2"
                    >
                      Become a seller
                    </a>
                    

                    {!isAuthenticated && (
                      <Link to="/signup" className="md:hidden px-4 py-2">
                        <Button variant="outline" className="w-full">
                          <span className="text-sm">+ Sign Up</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

{/* pc view */}
              <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Home
                </Link>
                <Link
                  to="/digital-products"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Social Media Accounts
                </Link>

                {/* <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    Account Types <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                    <Link
                      to="/digital-products"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Digital Accounts
                    </Link>
                    <Link
                      to="/digital-products#facebook"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Facebook
                    </Link>
                    <Link
                      to="/digital-products#twitter"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Twitter
                    </Link>
                    <Link
                      to="/digital-products#linkedin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      LinkedIn
                    </Link>
                    <Link
                      to="/digital-products#gmail"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Gmail
                    </Link>
                    <Link
                      to="/digital-products#tiktok"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      TikTok
                    </Link>
                  </div>
                </div> */}

                    {isAuthenticated && (
    <div className="hidden md:flex md:items-center md:space-x-8">
           <SupportTicketButton />
<Link
  to="/orders"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600"
>
  My Orders
  {orders?.length > 0 && (
    <span className="absolute -top-1 -right-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {orders.length}
    </span>
  )}
</Link>

<Link
  to="/payment-history"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600"
>
  Payment History
  {payments?.length > 0 && (
    <span className="absolute -top-1 -right-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {payments.length}
    </span>
  )}
</Link>

<Link
  to="/notifications"
  className="relative text-sm font-medium text-gray-700 hover:text-blue-600"
>
  Notifications
  {notifications?.length > 0 && (
    <span className="absolute -top-1 -right-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {notifications.length}
    </span>
  )}
</Link>

  </div>
)}
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {isAuthenticated && <WalletButton />}
              <a
                href="https://accountshubsellers.onrender.com"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
              >
                Become a seller
              </a>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              {isAuthenticated && <WalletButton />}
              <SupportTicketButton />
            </div>
          </nav>
        </div>
      </div>

      {/* <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative w-full">
              <div className="flex flex-col sm:flex-row w-full gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for accounts"
                    className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div> */}

      {/* <div className="bg-blue-50 py-2 text-center text-xs sm:text-sm px-2">
        <span className="text-blue-900">
          Verified social media accounts with full access. Buy securely today!
        </span>
        <a href="#" className="ml-1 text-blue-600 hover:underline font-medium">
          Learn more
        </a>
      </div> */}
    </header>
  );
};

export default Header;
