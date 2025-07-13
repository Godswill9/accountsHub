import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { messageService } from "@/services/messageService";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import ChatWindow from "@/components/chat/ChatWindow";
import { toast } from "sonner";
import Header from "@/components/Header";
import axios from "axios";


export interface ChatDetails {
     order_id:string, 
     sender_id:string, 
     sender_role:string,
     message:string
}

interface Conversation {
  conversation_id: string,
  order_id: string,
  buyer_id: string,
  seller_id: string,
  product_id: string,
  created_at: string,
  status: string,
}

export interface Message {
  id: string;
  message_id?: string;
  message: string;
  content?: string; // Add content as an alias for message
  sender_id: string;
  sender?: string; // Add sender as an alias for sender_id
  admin_id: string;
  time_received: string;
  timestamp?: string; // Add timestamp as an alias for time_received
  seen_by_user: number;
  seen_by_receiver?:number;
  sent_at?:string;
  sender_role?: string; // Add sender_role to differentiate between user and admin
  seen?: boolean; // Add seen as an alias for seen_by_user
  attachments?: string[];
     order_id?:string, 
}


const OrderChatPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [orderSubject, setorderSubject] = useState("Order");

  const [chatStatus, setChatStatus] = useState<string>("");
  // Check authentication only once when page loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response.message === "Please log in again.") {
          toast.error("Please log in to view your tickets");
          navigate("/login");
          return null;
        } else {
          setUserId(response.id);
        }
      } catch (error) {
        console.error("Authentication error", error);
        navigate("/login"); // Navigate to login on error
      }
    };

    checkAuthStatus();
  }, [navigate]);

  function getMimeTypeFromExtension(ext: string) {
  switch (ext.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}

const fetchChatMessages = async (orderId) => {
  try {
    const response = await fetch(`https://aitool.asoroautomotive.com/api/${orderId}`, {
    // const response = await fetch(`http://localhost:8086/api/${orderId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    const data = await response.json();
    return data; // this will be an array of messages
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return null;
  }
};


 const fetchSelectedConversationData = async (orderId: string) => {
    try {
      const response = await axios.get(
        `https://aitool.asoroautomotive.com/api/conversation/${orderId}`,
        { withCredentials: true }
      );
      
      // console.log("Fetched conversation data:", response.data);
      return response.data.conversation as Conversation;

    } catch (error) {
      console.error("Error fetching messages for conversation", error);
    }
  };

  const setMessagesSeen = async (messageIds: string[]) => {
  try {
    await Promise.all(
      messageIds.map(async (id) => {
        await axios.patch(
          `https://aitool.asoroautomotive.com/api/seen/${id}`,
          {},
          { withCredentials: true }
        );
      })
    );

    console.log("All unseen messages marked as seen.");
  } catch (error) {
    console.error("Error marking messages as seen:", error);
  }
};

  useEffect(() => {
  const loadMessages = async () => {
    const data = await fetchChatMessages(orderId);
    // console.log("Fetched messages:", data);
    fetchSelectedConversationData(orderId). then((conversation) => {
      if (conversation) {
        setChatStatus(conversation.status);
      }
    });
    

    if (Array.isArray(data)) {
      const processed = data.map((msg) => {
        return {
          ...msg,
          attachments: msg.attachments || [], // use exactly what backend sends
        };
      });

      setMessages(processed);

        // Filter unseen messages from the buyer
    const unseenMessageIds = processed
      .filter(msg => msg.seen_by_receiver === 0 && msg.sender_role === 'seller')
      .map(msg => msg.message_id);
    if (unseenMessageIds.length > 0) {
      setMessagesSeen(unseenMessageIds);
    }
      // console.log("Processed messages:", processed);
    }

    setIsLoading(false);
  };

  if (orderId) {
    loadMessages();
  }
}, [orderId]);


const handleSendMessage = async (content: string, type: string = "text") => {
  if (!orderId || !content.trim() || !userId) return;
  setIsSending(true);

  try {
    const chatData = {
      order_id: orderId,
      sender_id: userId,
      sender_role: "user",
      message: content.trim(),
    };

    const response = await fetch("https://aitool.asoroautomotive.com/api/sendMessage", {
    // const response = await fetch("http://localhost:8086/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatData),
    });

    const data = await response.json();

    if (data.success) {
      console.log("✅ Message sent successfully:", data);

      const sentMessage: Message = {
        id: data.message_id,
        message_id: data.message_id,
        message: chatData.message,
        sender_id: userId,
        admin_id: "admin",
        time_received: new Date().toISOString(),
        seen_by_user: 1,
        sender_role: "user",
        sent_at: data.sent_at,
        order_id: orderId,
      };

      setMessages((prev) => [...prev, sentMessage]);
      fetchChatMessages(orderId)
    } else {
      console.error("❌ Error sending message:", data.message);
      toast.error("Failed to send message");
    }
  } catch (error: any) {
    console.error("❌ Network error:", error.message);
    toast.error("Failed to send message");
  } finally {
    setIsSending(false);
  }
};


 const handleSendFiles = async (
  content: string,
  files: File[],
  type: string = "file"
) => {
  if (!orderId || files.length === 0 || !userId) return;
  setIsSending(true);

  try {
    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("sender_id", userId);
    formData.append("sender_role", "user");
    formData.append("message", content); // can be empty or actual text

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("https://aitool.asoroautomotive.com/api/sendMessage", {
    // const response = await fetch("http://localhost:8086/api/sendMessage", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Files sent successfully");

      // Refresh messages after sending
      const fetchedMessages = await fetchChatMessages(orderId);
      setMessages(fetchedMessages || []);
    } else {
      console.error("❌ Error sending files:", data.message);
      toast.error("Failed to send files");
    }
  } catch (error: any) {
    console.error("Error sending files:", error);
    toast.error("Failed to send files. Please try again.");
  } finally {
    setIsSending(false);
  }
};

const handleAcceptClose = async (order_id) => {
  try {
    // Step 1: Close the conversation
    const closeRes = await axios.put(
      `https://aitool.asoroautomotive.com/api/conversation/${order_id}/status`,
      { status: "closed" },
      { withCredentials: true }
    );

    if (closeRes.data.message === "Status updated") {
      // Step 2: Mark the order as completed
      const completeRes = await axios.put(
        `https://aitool.asoroautomotive.com/api/completeOrder/${order_id}`,
        {},
        { withCredentials: true }
      );

      if (completeRes.data.message === "Order completion date updated") {
        toast.success("Order completed successfully");
      } else {
        console.error("❌ Failed to complete order:", completeRes.data.message);
        toast.error("Failed to complete order");
      }

      window.location.reload(); // Refresh only after both steps
    } else {
      console.error("❌ Failed to close conversation:", closeRes.data.message);
      toast.error("Failed to close conversation");
    }
  } catch (error) {
    console.error("❌ Error closing conversation:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


const handleRejectClose = async(order_id) => {
  const res = await axios.put(
        `https://aitool.asoroautomotive.com/api/conversation/${order_id}/status`,
        {
          status: "open"
        },
        { withCredentials: true }
      );

      if (res.data.message === "Status updated") {
        toast.success("Conversation reopened successfully");
        window.location.reload(); // Reload to fetch updated conversations
      }else{
        console.error("❌ Failed to reopene conversation:", res.data.message);
        toast.error("Failed to reopene conversation");
      }
};


return (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main className="container mx-auto px-4 py-8 flex-1 flex flex-col relative">
      {/* Pending banner */}
      {chatStatus === "pending" && (
          <div className="sticky top-0 z-20">
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-4 flex justify-between items-center shadow">
      <span>This seller wants to close the conversation.</span>
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => handleAcceptClose(orderId)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Accept
        </button>
        <button
          onClick={() => handleRejectClose(orderId)}
          className="px-3 py-1 bg-white text-yellow-800 border border-yellow-500 rounded hover:bg-yellow-200"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
      )}

      {/* Back button + header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/orders")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-xl font-bold">{orderSubject.toLocaleUpperCase()}</h1>
        </div>
      </div>

      {/* Chat Window */}
      <div className="relative flex-1">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
          onSendMessage={handleSendMessage}
          onSendFiles={(content, files) => handleSendFiles(content, files)}
          userId={userId || ""}
        />

        {/* Overlay for Closed */}
        {chatStatus === "closed" && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center px-4">
            <MessageCircle className="h-10 w-10 text-gray-400 mb-3" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Conversation Closed</h2>
            <p className="text-gray-500">This conversation is no longer active.</p>
          </div>
        )}
      </div>
    </main>

    <Footer />
  </div>
);


};

export default OrderChatPage;
