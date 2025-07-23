
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Filter, ArrowLeft, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getUserPayments } from '@/services/paymentService';
import { toast } from '@/hooks/use-toast';
import { authService } from "@/services/authService";

interface Payment {
  id: string;
  payment_type: string;
  payment_status: string;
  payment_gateway: string;
  amount: number;
  transaction_type: string;
  ref: string;
  created_at: string;
  currency: string;
  seen_by_user: boolean;
  payment_id: string;
}

const PaymentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  

useEffect(() => {
  const checkAuthStatus = async () => {
    try {
      const response = await authService.verifyUser();

      if (!response) {
        navigate("/login");
        return;
      }

      document.title = "Payment History - Account Hub";

      const fetchPayments = async (id) => {
        try {
          setLoading(true);
          const response = await getUserPayments(id);
          const allPayments = response.payments || [];
          setPayments(allPayments);

          // Wait 3 seconds then mark unseen payments as seen
          setTimeout(() => {
            allPayments.forEach(async (payment) => {
              if (!payment.seen_by_user) {
                try {
                  await fetch(`https://aitool.asoroautomotive.com/api/user-payment-seen/${payment.payment_id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                     credentials:"include"
                  });

                  // Update UI optimistically
                  setPayments((prev) =>
                    prev.map((p) =>
                      p.payment_id === payment.payment_id ? { ...p, seen_by_user: true } : p
                    )
                  );
                } catch (err) {
                  console.error(`Failed to mark payment ${payment.payment_id} as seen`, err);
                }
              }
            });
          }, 3000);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to load payments",
            description: "There was an error loading your payment history. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchPayments(response.id);
    } catch (error) {
      console.error("Authentication error", error);
    }
  };

  checkAuthStatus();
}, []);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
return (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1 w-full px-4 py-8 sm:w-11/12 sm:mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          <h1 className="text-2xl font-bold flex items-center mb-2">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Payment History
          </h1>
          <p className="text-gray-600">View and track all your payments</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                  <tr
  key={payment.payment_id}
  className={`hover:bg-gray-50 ${!payment.seen_by_user ? 'bg-yellow-50 font-semibold' : ''}`}
>

                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {payment.ref}
                          {!payment.seen_by_user && (
                            <span className="ml-2 text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.currency || 'USD'} {Number(payment.amount).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">
                          {payment.payment_gateway}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">
                          {payment.payment_type.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.payment_status)}`}>
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      <CreditCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p>No payment history found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>

    <Footer />
  </div>
);

};

export default PaymentHistoryPage;
