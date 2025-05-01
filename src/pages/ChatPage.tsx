import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Message, messageService } from "@/services/messageService";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import ChatWindow from "@/components/chat/ChatWindow";
import { toast } from "sonner";

const ChatPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState("Support Ticket");

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

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

  // Load messages when both ticketId and userId are ready
  useEffect(() => {
    if (!ticketId || !userId) return; // Do not proceed if ticketId or userId is not available

    const loadMessages = async () => {
      try {
        setIsLoading(true);

        // Fetch ticket subject
        const ticket = await ticketService.getTicket(ticketId);
        if (ticket) {
          setTicketSubject(ticket.subject);
        }

        // Fetch initial messages
        const fetchedMessages = await messageService.fetchMessages({
          ticket_id: ticketId,
        });

        if (fetchedMessages.length === 0) {
          toast.info("No messages found for this ticket.");
        }
        setMessages(fetchedMessages);

        // Mark unread admin messages as seen
        fetchedMessages.forEach((msg) => {
          if (
            (msg.seen_by_user === 0 || msg.seen === false) &&
            (msg.sender_id === "admin" || msg.sender === "admin")
          ) {
            messageService.markAsSeen(msg.id);
          }
        });
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [ticketId, userId]); // This will run only when both `ticketId` and `userId` are available

  // Poll for new messages every 30 seconds only when both ticketId and userId are ready
  useEffect(() => {
    if (!ticketId || !userId) return; // Prevent polling if ticketId or userId are not available

    const interval = setInterval(async () => {
      try {
        const fetchedMessages = await messageService.fetchMessages({
          ticket_id: ticketId,
        });
        setMessages(fetchedMessages);

        // Mark unread admin messages as seen
        fetchedMessages.forEach((msg) => {
          if (
            (msg.seen_by_user === 0 || msg.seen === false) &&
            (msg.sender_id === "admin" || msg.sender === "admin")
          ) {
            messageService.markAsSeen(msg.id);
          }
        });
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 30000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [ticketId, userId]); // This will run only when both `ticketId` and `userId` are available

  const handleSendMessage = async (content: string, type: string = "text") => {
    if (!ticketId || !content.trim() || !userId) return;
    setIsSending(true);
    try {
      const sentMessage = await messageService.sendMessage({
        message: content.trim(),
        ticket_id: ticketId,
        message_type: type,
        sender_id: userId,
        admin_id: "admin",
      });

      setMessages((prev) => [...prev, sentMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
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
    if (!ticketId || files.length === 0 || !userId) return;
    setIsSending(true);
    try {
      const sentMessage = await messageService.sendMessage({
        message: content,
        ticket_id: ticketId,
        message_type: type,
        sender_id: userId,
        admin_id: "admin",
        attachments: files,
      });
      toast.success("Files uploaded successfully");

      // Refresh the messages list to show the new files
      const fetchedMessages = await messageService.fetchMessages({
        ticket_id: ticketId,
      });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error sending files:", error);
      toast.error("Failed to send files. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tickets")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-xl font-bold">
              {ticketSubject.toLocaleUpperCase()}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border flex-1">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            isSending={isSending}
            onSendMessage={handleSendMessage}
            onSendFiles={(content, files) => handleSendFiles(content, files)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatPage;
