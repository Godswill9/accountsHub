import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import DigitalProducts from "./pages/DigitalProducts";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import WalletPage from "./pages/WalletPage";
import OrdersPage from "./pages/OrdersPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import UserHomePage from "./pages/UserHomePage";
import TicketPage from "./pages/Ticketpage";
import TicketsListPage from "./pages/TicketsListPage";
import ChatPage from "./pages/ChatPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import CreateCurrencyPayment from "./pages/CreateCurrencyPayment";
import CreateCryptoPayment from "./pages/CreateCryptoPayment";
import "./App.css";
import SuccessPage from "./pages/successPage";
import ErrorPage from "./pages/error";
import NotificationsPage from "./pages/Notifications";
import OrderChatPage from "./pages/OrderChat";
import VerifyPaymentPage from "./pages/loading";
import SellerDetailsPage from "./pages/SellerDetailsPage";

// Create a Client once for the entire application
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/digital-products" element={<DigitalProducts />} />
              <Route path="/digital-products/:id" element={<ProductDetail />} />
              <Route path="/about-seller/:sellerId" element={<SellerDetailsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/user-home" element={<UserHomePage />} />

              {/* Ticket Routes */}
              <Route path="/ticket" element={<TicketPage />} />
              <Route path="/tickets" element={<TicketsListPage />} />
              <Route path="/chat/:ticketId" element={<ChatPage />} />
              <Route path="/conversation/:orderId" element={<OrderChatPage/>} />

              {/* Wallet Routes */}
              <Route path="/wallet" element={<WalletPage />} />
              <Route
                path="/add-funds/card"
                element={<CreateCurrencyPayment />}
              />
              <Route
                path="/add-funds/crypto"
                element={<CreateCryptoPayment />}
              />
              <Route path="/payment-history" element={<PaymentHistoryPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />

              {/* Order Routes */}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/create-order" element={<CreateOrderPage />} />
              <Route path="/order/:orderId" element={<OrderDetailPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/verify-payment" element={<VerifyPaymentPage />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
