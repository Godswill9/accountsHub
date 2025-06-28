import React from "react";
import { Link } from "react-router-dom";
import axios from "axios"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";

interface Order {
  amount: number;
  created_at: string;
  item_id: string;
  item_name: string;
  order_id: string;
  quantity: number;
  status: string;
  seen_by_user: string;
}
// interface Order {
//   id: string;
//   productName: string;
//   date: string;
//   status: "pending" | "processing" | "completed" | "cancelled";
//   totalAmount: number;
// }

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  console.log(orders);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderSeen = async (orderId: string) => {
  try {
    const response = await axios.put(`https://aitool.asoroautomotive.com/api/user-order-seen/${orderId}`);
    console.log("Order marked as seen:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error marking order as seen:", error);
  }
};

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Quantity bought</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
     <TableBody>
  {orders.length > 0 ? (
    orders.map((order) => (
      <TableRow
        key={order.order_id}
        className={
          order.seen_by_user === null
            ? "border-l-4 border-blue-500 bg-blue-50"
            : ""
        }
      >
        <TableCell className="font-medium">{order.order_id}</TableCell>
        <TableCell>{order.item_name}</TableCell>
        <TableCell>
          {new Date(order.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={getStatusColor(order.status)}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>${Number(order.amount).toFixed(2)}</TableCell>
        <TableCell>{Number(order.quantity)} accounts</TableCell>
        <TableCell className="text-right">
          <Link to={`/order/${order.order_id}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateOrderSeen(order.order_id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
        No orders found.{" "}
        {/* <Link to="/create-order" className="text-blue-600 hover:underline">
          Create your first order
        </Link> */}
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </div>
  );
};

export default OrderList;
