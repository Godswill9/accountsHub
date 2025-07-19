import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, ChevronDown, Menu, Globe, Flag, X, LogOut, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SupportTicketButton from "./SupportTicketButton";
import WalletButton from "./WalletButton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { getUserPayments } from '@/services/paymentService';
import { ticketService } from "@/services/ticketService";
import { messageService } from "@/services//messageService";
import {
  getNotifications
} from "@/services/notificationService";
import { getOrders } from "@/services/orderService";
import axios from "axios";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState('')
  const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
const [notifications, setNotifications] = useState([]);
const [allTIckets, setAllTickets] = useState([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
const totalUnreadConversations = Object.keys(unreadCounts).length;
const [accountBanStatus, setAccountBanStatus] = useState(false)
const [accountSuspendedStatus,setAccountSuspendedStatus] = useState(false)
   const [messagesCount, setMessagesCount] = useState<Record<string, number>>({});


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/digital-products?search=${encodeURIComponent(searchQuery)}`);
  };

   const fetchMessagesFromId = async (orderId: string) => {
  try {
    const res = await axios.get(
      `https://aitool.asoroautomotive.com/api/${orderId}`
    );

    const unseenFromSeller = res.data.filter(
      (msg: any) => msg.seen_by_receiver === 0 && msg.sender_role === 'seller'
    );

    // console.log("Unseen messages from seller:", unseenFromSeller);

    setMessagesCount(prev => ({
      ...prev,
      [orderId]: unseenFromSeller.length
    }));
  } catch (err) {
    console.error("Error fetching seller messages", err);
  }
};

const unreadConversationsCount = Object.values(messagesCount).filter(
  (count) => count > 0
).length;

// console.log(unreadConversationsCount)


   const fetchMessages= async(sellerId: string)=>{
       try {
        const res = await axios.get(
          `https://aitool.asoroautomotive.com/api/conversations/${sellerId}`
        );
       
        return res.data.conversations
      } catch (err) {
        console.error("Error fetching seller messages", err);
      } finally {
        // setLoading(false);
      }
  }


  useEffect(() => {
    // console.log(isAuthenticated);
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response.message === "Please log in again.") {
          setIsAuthenticated(false);
          return null;
        } else {
          //banning and suspension mechanism
      const isSuspended = response?.acc_status === "Suspended";
const isBanned = response?.acc_status && response.acc_status !== "Okay";
setAccountBanStatus(isBanned);
setAccountSuspendedStatus(isSuspended);
// console.log(accountBanStatus, accountSuspendedStatus)


          setIsAuthenticated(true);
           setUserId(response.id)
          await  fetchNotifications(response.id)
           await fetchOrders(response.id)
          await  fetchPayments(response.id)
           await fetchAllTickets(response.id)

            const allOrdersWithMessages = await fetchMessages(response.id)
        //  console.log(allOrdersWithMessages)
         allOrdersWithMessages.forEach((item, i)=>{
          fetchMessagesFromId(item.order_id)
         })
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
  } catch (error) {
    // handle error
  }
};
 const fetchAllTickets = async (id) => {
  try {
    const data = await ticketService.getUserTickets(id);
    setAllTickets(data)
  } catch (error) {
    // handle error
  }
};

useEffect(() => {
  const fetchUnreadCounts = async () => {
    const counts: Record<string, number> = {};

    for (const ticket of allTIckets) {
      try {
        const messages = await messageService.fetchMessages({ ticket_id: ticket.ticket_id });
        const unseen = messages.filter((msg) => msg.seen_by_user === 0).length;
        if (unseen > 0) {
          counts[ticket.ticket_id] = unseen;
        }
      } catch (err) {
        console.error("Error fetching messages for ticket", ticket.ticket_id, err);
      }
    }

    setUnreadCounts(counts);
  };

  if (allTIckets.length > 0) {
    fetchUnreadCounts();
  }
}, [allTIckets]);


   const fetchOrders = async (id: string) => {
  try {
    const data = await getOrders(id);
    const unseenOrders = (data.order || []).filter(item => item.seen_by_user === null);
    setOrders(unseenOrders);
    // console.log(unseenOrders);
  } catch (error) {
    // handle error
  }
};



 const fetchPayments = async (id) => {
  try {
    const response = await getUserPayments(id);
    const unseenPayments = (response.payments || []).filter(item => item.seen_by_user === null);
    setPayments(unseenPayments);
    // console.log(unseenPayments);
  } catch (error) {
    // handle error
  }
};


  return (
   <header className="w-full bg-white shadow-sm sticky top-0 z-50">
    {accountBanStatus && (
  <div className="fixed top-0 left-0 w-full z-50 bg-red-600 text-white text-sm sm:text-base font-medium px-4 py-2 shadow-md flex items-center justify-center gap-2">
    <AlertTriangle className="w-4 h-4" />
    This user has been <span className="font-semibold">banned</span>.
  </div>
 )} 

  {accountSuspendedStatus && ( 
<div className="fixed top-0 left-0 w-full z-50 bg-yellow-400 text-yellow-900 text-sm sm:text-base font-medium px-4 py-3 shadow-md">
  <div className="max-w-4xl mx-auto flex items-start gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
    <span>
      This user account is currently <span className="font-semibold">suspended</span>. 
      Message Support for more information.
    </span>
  </div>
</div> )}

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

{isAuthenticated && (
  <div className="flex flex-col gap-2">

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
  {unreadConversationsCount > 0 && (
    <span className="absolute top-3 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-yellow-600 rounded-full">
      {unreadConversationsCount}
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

                    {isAuthenticated && (
    <div className="hidden md:flex md:items-center md:space-x-8">
           <SupportTicketButton unread={Object.keys(unreadCounts).length}/>
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
  {unreadConversationsCount > 0 && (
    <span className="absolute -top-1 -right-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-yellow-600 rounded-full">
      {unreadConversationsCount}
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
              {isAuthenticated && <SupportTicketButton unread={Object.keys(unreadCounts).length}/>}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
