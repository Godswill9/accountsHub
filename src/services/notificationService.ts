import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export const NOTIFICATION_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/notifications/create`,
  LIST: (userId: string) => `${API_BASE_URL}/notifications/${userId}`,
  DELETE: (id: string) => `${API_BASE_URL}/notifications/${id}`,
  DELETE_ALL: (userId: string) => `${API_BASE_URL}/notifications/user/${userId}/delete-all`,
  MARK_AS_SEEN: (id: string) => `${API_BASE_URL}/notifications/${id}/seen`,
};

export const createNotification = async (data: any) => {
  try {
    const response = await axios.post(NOTIFICATION_ENDPOINTS.CREATE, data, {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const response = await axios.get(NOTIFICATION_ENDPOINTS.LIST(userId),{withCredentials:true});
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axios.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId), {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

export const deleteAllNotifications = async (userId: string) => {
  try {
    const response = await axios.delete(NOTIFICATION_ENDPOINTS.DELETE_ALL(userId), {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
};

export const markNotificationAsSeen = async (notificationId: string) => {
  try {
    const response = await axios.put(NOTIFICATION_ENDPOINTS.MARK_AS_SEEN(notificationId), {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    throw error;
  }
};
