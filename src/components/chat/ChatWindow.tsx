import React, { useEffect, useRef } from "react";
import { Message } from "@/services/messageService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onSendFiles: (content: string, files: File[]) => Promise<void>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  isSending,
  onSendMessage,
  onSendFiles,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <>
            <div className="flex justify-start mb-4">
              <Skeleton className="h-24 w-2/3 rounded-lg" />
            </div>
            <div className="flex justify-end mb-4">
              <Skeleton className="h-16 w-1/2 rounded-lg" />
            </div>
            <div className="flex justify-start mb-4">
              <Skeleton className="h-20 w-3/5 rounded-lg" />
            </div>
          </>
        ) : messages.length > 0 ? (
          // Messages
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              content={msg.message || msg.content || ""}
              sender={msg.sender_id || msg.sender || ""}
              timestamp={msg.time_received || msg.timestamp}
              seen={msg.seen_by_user === 1 || msg.seen === true}
              attachments={msg.attachments}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white shadow-sm">
        <ChatInput
          onSendMessage={onSendMessage}
          onSendFiles={onSendFiles}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
