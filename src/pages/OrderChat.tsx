import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { messageService } from "@/services/messageService";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import ChatWindow from "@/components/chat/ChatWindow";
import { toast } from "sonner";
import Header from "@/components/Header";


export interface ChatDetails {
     order_id:string, 
     sender_id:string, 
     sender_role:string,
     message:string
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

  // Load messages when both orderId and userId are ready
//   useEffect(() => {
//     if (!orderId || !userId) return; // Do not proceed if orderId or userId is not available

//     const loadMessages = async () => {
//       try {
//         setIsLoading(true);

//         // Fetch ticket subject
//         const ticket = await ticketService.getTicket(orderId);
//         if (ticket) {
//           setorderSubject(ticket.subject);
//         }
 
//         // Fetch initial messages
//         const fetchedMessages = await messageService.fetchMessages({
//           ticket_id: orderId,
//         });

//         if (fetchedMessages.length === 0) {
//           toast.info("No messages found for this ticket.");
//         }
//         setMessages(fetchedMessages);

//         // Mark unread admin messages as seen
//         fetchedMessages.forEach((msg) => {
//           if (
//             (msg.seen_by_user === 0 || msg.seen === false) &&
//             (msg.sender_id === "admin" || msg.sender === "admin")
//           ) {
//             messageService.markAsSeen(msg.id);
//           }
//         });
//       } catch (error) {
//         console.error("Error loading messages:", error);
//         toast.error("Failed to load messages");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadMessages();
//   }, [orderId, userId]); // This will run only when both `orderId` and `userId` are available

  // Poll for new messages every 30 seconds only when both orderId and userId are ready

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

  useEffect(() => {
  const loadMessages = async () => {
    const data = await fetchChatMessages(orderId);
    console.log("Fetched messages:", data);

    if (Array.isArray(data)) {
      const processed = data.map((msg) => {
        return {
          ...msg,
          attachments: msg.attachments || [], // use exactly what backend sends
        };
      });

      setMessages(processed);
      console.log("Processed messages:", processed);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <UserHeader /> */}
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col">
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
            <h1 className="text-xl font-bold">
              {orderSubject.toLocaleUpperCase()}
            </h1>
          </div>
        </div>

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            isSending={isSending}
            onSendMessage={handleSendMessage}
            onSendFiles={(content, files) => handleSendFiles(content, files)}
            userId = {userId || ""}
          />
      </main>

      <Footer />
    </div>
  );
};

export default OrderChatPage;
