
import { TICKET_ENDPOINTS } from '@/config/api';
import { toast } from "sonner";

interface TicketData {
  subject: string;
  message: string;
  category: string;
  attachments?: File[];
  user_id: string;
}

interface CloseTicketData {
  ticketId: string;
  reason?: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed';
  category: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
}

// Helper function for API requests with environment-aware logging
const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    // For debugging in development only
    if (import.meta.env.DEV) {
      // console.log(`Making ${method} request to: ${url}`);
      // if (data) console.log('Request data:', data);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies/sessions
    });

    const responseData = await response.json();
    
    // Log response in development
    if (import.meta.env.DEV) {
      // console.log('Response:', responseData);
    }

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Ticket service functions
export const ticketService = {
  createTicket: async (data: TicketData) => {
    try {
      // console.log(data)
      const response = await apiRequest(TICKET_ENDPOINTS.CREATE, 'POST', data);
      // toast.success("Support ticket created successfully");
      return response;
    } catch (error) {
      toast.error("Failed to create support ticket");
      throw error;
    }
  },
  
  getTicket: async (ticketId: string) => {
    try {
      const response = await apiRequest(`${TICKET_ENDPOINTS.GET}/${ticketId}`, 'GET');
      return response.ticket;
    } catch (error) {
      toast.error("Failed to fetch ticket details");
      throw error;
    }
  },

  getUserTickets: async (userId: string) => {
    try {
      const response = await apiRequest(
        TICKET_ENDPOINTS.GET_BY_ID(userId), // Use the GET_BY_ID function
        "GET"
      );
      return response.ticket;
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tickets");
      throw error;
    }
  },

  // getUserTickets: async (userId: string) => {
  //   try {
  //     const response = await apiRequest(TICKET_ENDPOINTS.LIST, 'POST', { user_id: userId });
  //     return response.tickets;
  //   } catch (error) {
  //     toast.error("Failed to fetch tickets");
  //     throw error;
  //   }
  // },
  
  closeTicket: async (data: CloseTicketData) => {
    try {
      const response = await apiRequest(TICKET_ENDPOINTS.CLOSE, 'PUT', data);
      toast.success("Ticket closed successfully");
      return response;
    } catch (error) {
      toast.error("Failed to close ticket");
      throw error;
    }
  }
};
