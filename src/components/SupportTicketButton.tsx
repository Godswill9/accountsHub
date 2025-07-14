
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
interface SupportTicketButtonProps {
  unread?: number;
}

const SupportTicketButton: React.FC<SupportTicketButtonProps> = ({ unread }) => {
  const isMobile = useIsMobile();

  return (
    <Link to="/tickets">
      <Button 
        variant="ghost" 
        size={isMobile ? "icon" : "sm"} 
        className={`relative transition-all ${
          isMobile 
            ? "h-9 w-9 p-0" 
            : "text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center"
        }`}
        aria-label="Support"
      >
        <MessageCircleQuestion className={isMobile ? "h-5 w-5" : "h-4 w-4 mr-1"} />
        {!isMobile && "Support"}

      {typeof unread === "number" && unread > 0 && (
  <span
    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold min-w-[18px] h-[18px] px-[6px] rounded-full flex items-center justify-center border-2 border-white shadow-sm"
    title={`${unread} unread ticket${unread > 1 ? 's' : ''}`}
  >
    {unread > 99 ? "99+" : unread}
  </span>
)}


      </Button>
    </Link>
  );
};

export default SupportTicketButton;
