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

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response) {
          console.log(response);
          setUserId(response.id);
          fetchOrders(response.id);
          setUserEmail(response.email);
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
      console.log(data.order);
      setOrders(data.order || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load orders",
        description:
          "There was an error loading your orders. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
            <OrderList orders={orders} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
