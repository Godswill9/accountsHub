import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Plus,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { ticketService } from "@/services/ticketService";
import { messageService } from "@/services//messageService";
import { authService } from "@/services/authService";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";

interface Ticket {
  ticket_id: string;
  subject: string;
  status: "open" | "closed";
  category: string;
  created_at: string;
  updatedAt: string;
  unreadCount: number;
  priority:string;
}

const TicketsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
const totalUnreadConversations = Object.keys(unreadCounts).length;



  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response.message === "Please log in again.") {
          toast.error("Please log in to view your tickets");
          navigate("/login");
          return null;
        } else {
          setIsLoading(false);
          console.log(response);
          setUserId(response.id);
          const userTickets = await ticketService.getUserTickets(response.id);

          if (Array.isArray(userTickets)) {
  setTickets(userTickets);
} else {
  toast.error("No tickets found.");
  setTickets([]);
}
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  

useEffect(() => {
  const fetchUnreadCounts = async () => {
    const counts: Record<string, number> = {};

    for (const ticket of tickets) {
      try {
        const messages = await messageService.fetchMessages({ ticket_id: ticket.ticket_id });

        // console.log(messages)

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

  if (tickets.length > 0) {
    fetchUnreadCounts();
  }
}, [tickets]);





  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  const handleCreateTicket = () => {
    navigate("/ticket");
  };

  const handleViewTicket = (ticketId: string) => {
    navigate(`/chat/${ticketId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "technical":
        return "bg-blue-100 text-blue-800";
      case "billing":
        return "bg-green-100 text-green-800";
      case "account":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <UserHeader /> */}
      <Header />
      <main className="flex-1 w-full px-4 py-8 sm:w-11/12 sm:mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
            Support Tickets
          </h1>

          <Button
            onClick={handleCreateTicket}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Ticket
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="space-y-4">
           {tickets.map((ticket) => {
  const unreadCount = unreadCounts[ticket.ticket_id] || 0;

  return (
    <Card
      key={ticket.ticket_id}
      className="relative hover:shadow-lg h-auto hover:scale-[1.01] transition-all duration-200 rounded-2xl border p-4"
    >
      {unreadCount > 0 && (
        <div className="absolute top-3 right-3">
          <span
            className="bg-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-full px-2 sm:px-3 py-[2px] shadow-md whitespace-nowrap"
            title={`${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}
          >
            <span className="sm:hidden">{unreadCount}</span>
            <span className="hidden sm:inline">
              {unreadCount} Unread
            </span>
          </span>
        </div>
      )}

      <CardHeader className="p-1">
        <CardTitle className="text-lg font-semibold leading-snug text-gray-900">
          {ticket.subject.toLocaleUpperCase()}
        </CardTitle>
        <CardDescription className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          Created on {formatDate(ticket.created_at)}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-1">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(ticket.category)}`}
          >
            {ticket.priority}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-1 rounded-full ${
              ticket.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {ticket.status !== "closed" ? "Open" : "Closed"}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-1">
        {ticket.status !== "closed" && (
          <Button
            variant="ghost"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 gap-1"
            onClick={() => handleViewTicket(ticket.ticket_id)}
          >
            View Conversation
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
})}

          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't created any support tickets yet.
              </p>
              {/* <Button
                onClick={handleCreateTicket}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create First Ticket
              </Button> */}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TicketsListPage;
