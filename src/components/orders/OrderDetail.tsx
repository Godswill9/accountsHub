
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteOrder } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, CloudCog, Edit, MessageCircle, Trash2 } from 'lucide-react';

interface OrderDetailProps {
  order: {
    order_id: string;
    productName: string;
    productId: string;
    quantity: number;
    date: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    totalAmount: number;
    notes?: string;
    paymentMethod?: string;
    created_at: string;
    item_name: string;
    item_id: string;
    amount: string;
    seller_id?:string
  };
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(order.order_id);
        toast({
          title: "Order deleted",
          description: `Order #${order.order_id} has been deleted successfully.`,
        });
        navigate('/orders');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete order",
          description: "There was an error deleting your order. Please try again.",
        });
      }
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              Order for {order.item_name}
              <Badge variant="outline" className={`ml-3 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription>Placed on {new Date(order.created_at).toLocaleString()}</CardDescription>
          </div>
      
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Product Information</h3>
            <div className="mt-2 border rounded-md p-3">
              <p><span className="font-medium">Product Name:</span> {order.item_name}</p>
              <p><span className="font-medium">Product ID:</span> {order.item_id}</p>
              <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
            <div className="mt-2 border rounded-md p-3">
              <p><span className="font-medium">Total Amount:</span> ${Number(order.amount).toFixed(2)}</p>
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'Wallet'}</p>
              <p>
                <span className="font-medium">Payment Status:</span> 
                <span className={order.status === 'pending' ? 'text-green-600' : 'text-yellow-600'}>
                  {order.status === 'pending' ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {order.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
            <div className="mt-2 border rounded-md p-3">
              <p>{order.notes}</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500">Order Timeline</h3>
          <div className="mt-2 space-y-3">
            <div className="flex items-start">
              <div className="flex-none mr-3">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Order placed</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
            {/* Add more timeline events as needed */}
          </div>
        </div>
      </CardContent>
<CardFooter className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full bg-muted p-4 rounded-xl">
  {/* Back Button */}
  <Button
    variant="outline"
    onClick={() => navigate('/orders')}
    className="w-full lg:w-auto"
  >
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back to Orders
  </Button>

  {/* Seller Help Section */}
  <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:w-auto gap-3">
    <p className="text-sm text-muted-foreground">
      Need help with this order? Contact the seller:
    </p>

    {/* Message Seller */}
    <Button
      variant="outline"
      onClick={() => navigate(`/conversation/${order.order_id}`)}
      className="w-full lg:w-auto"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Message Seller
    </Button>

    {/* View Seller Profile */}
    <Link
      to={`/about-seller/${order.seller_id}`}
      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition w-full lg:w-auto"
    >
      View Seller
    </Link>
  </div>
</CardFooter>


    </Card>
  );
};

export default OrderDetail;
