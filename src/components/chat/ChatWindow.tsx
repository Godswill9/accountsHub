import React, { useEffect, useRef } from "react";
import { Message } from "@/services/messageService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  status?: string;
  onSendMessage: (content: string) => Promise<void>;
  onSendFiles: (content: string, files: File[]) => Promise<void>;
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  isSending,
  onSendMessage,
  onSendFiles,
  userId,
  status
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-3xl h-[80vh] bg-white rounded-xl shadow-lg border mx-auto">
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
          messages.map((msg) => (
            <ChatMessage
              key={msg.id || msg.message_id}
              id={msg.id || msg.message_id}
              content={msg.message || msg.content || ""}
              sender={msg.sender_id || msg.sender || msg.sender_role}
              timestamp={msg.time_received || msg.timestamp || msg.sent_at}
              seen={msg.seen_by_user === 1 || msg.seen === true}
              attachments={msg.attachments}
              userId={userId}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t bg-gray-100 rounded-b-xl">
        {status === "closed" ? (
          <div className="text-center text-gray-600 p-4">
            This chat is now closed. You can no longer send messages.
          </div>
        ) : (
          <ChatInput
            onSendMessage={onSendMessage}
            onSendFiles={onSendFiles}
            isSending={isSending}
          />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
