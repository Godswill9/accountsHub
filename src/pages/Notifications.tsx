import React, { useEffect, useState } from "react";
import { Filter, Bell, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  getNotifications,
  deleteNotification,
  deleteAllNotifications,
} from "@/services/notificationService";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.verifyUser();
        if (response) {
          console.log(response);
          setUserId(response.id);
          fetchNotifications(response.id);
        } else {
          navigate("/login");
          return null;
        }
      } catch (error) {
        console.error("Authentication error", error);
        // navigate("/login");
        return null;
      }
    };

    checkAuthStatus();
  }, []);

  const fetchNotifications = async (id) => {
    try {
      const data = await getNotifications(id);
      setNotifications(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load notifications",
        description: "There was an error loading your notifications.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      toast({ title: "Notification deleted" });
    } catch (error) {
      toast({ title: "Failed to delete notification", variant: "destructive" });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications(userId);
      setNotifications([]);
      toast({ title: "All notifications deleted" });
    } catch (error) {
      toast({ title: "Failed to delete all", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 xl:max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center mb-2">
              <Bell className="h-6 w-6 mr-2 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with the latest notifications
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete All
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow max-w-6xl mx-auto px-4 lg:px-8 divide-y">
            {notifications.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No notifications found.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-start py-4 gap-4"
                >
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {notification.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {notification.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
