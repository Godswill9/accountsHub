import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderList from "@/components/orders/OrderList";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Filter } from "lucide-react";
import { getOrders } from "@/services/orderService";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import axios from "axios";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
    const [messagesCount, setMessagesCount] = useState<Record<string, number>>({});



      useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);
    
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response) {
          // console.log(response);
          setUserId(response.id);
          fetchOrders(response.id);
          setUserEmail(response.email);

           const allOrdersWithMessages = await fetchMessages(response.id)
        //  console.log(allOrdersWithMessages)
         allOrdersWithMessages.forEach((item, i)=>{
          fetchMessagesFromId(item.order_id)
         })
        } else {
          navigate("/login");
          return null;
        }
      } catch (error) {
        console.error("Authentication error", error);
        // navigate("/login");
        return null;
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = async (id: string) => {
    try {
     const data = await getOrders(id);

// Sort by created_at descending (newest first)
const sortedOrders = (data.order || []).sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);

setOrders(sortedOrders);
    } catch (error) {
      toast({
        title: "Failed to load orders",
        description:
          "There was an error loading your orders. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

    const fetchMessages= async(sellerId: string)=>{
       try {
        const res = await axios.get(
          `https://aitool.asoroautomotive.com/api/conversations/${sellerId}`, {withCredentials:true}
        );
       
        return res.data.conversations
      } catch (err) {
        console.error("Error fetching seller messages", err);
      } finally {
        setLoading(false);
      }
  }

  const fetchMessagesFromId = async (orderId: string) => {
  try {
    const res = await axios.get(
      `https://aitool.asoroautomotive.com/api/${orderId}`, {withCredentials:true}
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



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* <main className="flex-grow container mx-auto px-4 py-8"> */}
      <main className="flex-1 w-full px-4 py-8 sm:w-11/12 sm:mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
  <div>
    <h1 className="text-2xl font-bold flex items-center mb-2">
      <ShoppingCart className="h-6 w-6 mr-2 text-blue-600" />
      My Orders

      {unreadConversationsCount > 0 && (
        <span className="ml-3 text-sm bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
          {unreadConversationsCount} unread {unreadConversationsCount === 1 ? 'message' : 'messages'}
        </span>
      )}
    </h1>
    <p className="text-gray-600">View and manage your orders</p>
  </div>
</div>


        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Order History</h2>
              {/* <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button> */}
            </div>
            <OrderList orders={orders} messagesCount={messagesCount} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
