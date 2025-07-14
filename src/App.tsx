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
import BannedPage from "./pages/BannedPage";
import ProtectedRoute from "@/pages/ProtectedRoute"; // adjust path


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
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/digital-products" element={<DigitalProducts />} />
              <Route path="/digital-products/:id" element={<ProductDetail />} />
              <Route path="/about-seller/:sellerId" element={<SellerDetailsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/banned" element={<BannedPage />} />

              {/* Protected Routes */}
              {/* <Route
                path="/user-home"
                element={
                  <ProtectedRoute>
                    <UserHomePage />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/ticket"
                element={
                  <ProtectedRoute>
                    <TicketPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <TicketsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:ticketId"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conversation/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <WalletPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/add-funds/card"
                element={
                  <ProtectedRoute>
                    <CreateCurrencyPayment />
                  </ProtectedRoute>
                }
              /> */}
              {/* <Route
                path="/add-funds/crypto"
                element={
                  <ProtectedRoute>
                    <CreateCryptoPayment />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/payment-history"
                element={
                  <ProtectedRoute>
                    <PaymentHistoryPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccessPage />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-order"
                element={
                  <ProtectedRoute>
                    <CreateOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <SuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/error"
                element={
                  <ProtectedRoute>
                    <ErrorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify-payment"
                element={
                  <ProtectedRoute>
                    <VerifyPaymentPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
