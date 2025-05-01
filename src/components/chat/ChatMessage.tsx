import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  id: string;
  content: string;
  sender: string;
  timestamp?: string;
  time_received?: string;
  seen?: number | boolean;
  seen_by_user?: number;
  attachments?: string[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content = "",
  sender,
  timestamp,
  time_received,
  seen,
  seen_by_user,
  attachments = [],
}) => {
  const isUser = sender === "user";
  const messageTime = timestamp || time_received;
  const isMessageSeen =
    seen !== undefined
      ? seen
      : seen_by_user !== undefined
      ? seen_by_user === 1
      : false;

  // Determine if content is a URL
  const isUrl = (str: string) => {
    try {
      return Boolean(new URL(str));
    } catch (e) {
      return false;
    }
  };

  const fetchImage = async (link: string): Promise<string | undefined> => {
    try {
      const response = await fetch(
        `https://aitool.asoroautomotive.com/api/${link}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const imageSrc = await response.text();
      return imageSrc;
    } catch (error) {
      console.error("Error fetching image:", error);
      return undefined;
    }
  };

  // / Fetch images for messages starting with "get-image"
  //   useEffect(() => {
  //     if (messages) {
  //       messages.forEach((message: Message) => {
  //         if (message.message.startsWith("get-image")) {
  //
  //         }
  //       });
  //     }
  //   }, [messages]);
  // Get file icon based on file extension
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const isImageUrl = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
  };

  return (
    <div
      className={cn(
        "flex flex-col w-fit max-w-[70%] sm:max-w-[50%] rounded-lg p-3 mb-3 relative transition-all",
        !isUser
          ? "ml-auto bg-blue-950 text-white rounded-br-none hover:bg-blue-980"
          : "mr-auto bg-gray-100 text-gray-800 rounded-bl-none hover:bg-gray-200"
      )}
    >
      {!isMessageSeen && !isUser && (
        <div
          className="absolute -left-2 top-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"
          title="New message"
        ></div>
      )}

      {content.startsWith("get-image") ? (
        (() => {
          const [imageSrc, setImageSrc] = React.useState<string | undefined>(
            undefined
          );

          React.useEffect(() => {
            fetchImage(content).then((src) => setImageSrc(src));
          }, [content]);

          return imageSrc ? (
            <img
              src={imageSrc}
              alt="Image loaded"
              className="max-w-full rounded max-h-[400px] object-contain"
            />
          ) : (
            <p>Loading image...</p>
          );
        })()
      ) : (
        <p>{content}</p>
      )}

      {attachments && attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((url, idx) => (
            <div key={idx} className="flex flex-col">
              {isImageUrl(url) ? (
                <div className="group relative">
                  <img
                    src={url}
                    alt={`Attachment ${idx + 1}`}
                    className="max-w-full rounded-md max-h-[200px] object-contain hover:opacity-95 cursor-pointer transition-all"
                    onClick={() => window.open(url, "_blank")}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-md flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-sm">
                      Click to view
                    </span>
                  </div>
                </div>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center text-sm p-2 rounded-md transition-colors",
                    isUser
                      ? "text-white hover:bg-blue-700"
                      : "text-blue-600 hover:bg-gray-200"
                  )}
                >
                  {getFileIcon(url)}
                  <span className="ml-2 underline">Attachment {idx + 1}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {messageTime && (
        <div
          className={cn(
            "text-[10px] sm:text-xs mt-2",
            isUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          {formatDistanceToNow(new Date(messageTime), { addSuffix: true })}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
