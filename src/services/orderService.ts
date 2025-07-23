
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export const ORDER_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/create-order`,
  GET: (id: string) => `${API_BASE_URL}/order/${id}`,
  LIST:(id: string) => `${API_BASE_URL}/orders/user/${id}`,
  UPDATE: `${API_BASE_URL}/update-order`,
  DELETE: (id: string) => `${API_BASE_URL}/order/${id}`,
};

export const createOrder = async (orderData: any) => {
  try {
    const response = await axios.post(ORDER_ENDPOINTS.CREATE, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.GET(orderId), {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

export const getOrders = async (userId: string) => {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.LIST(userId), {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrder = async (orderData: any) => {
  try {
    const response = await axios.put(ORDER_ENDPOINTS.UPDATE, orderData, {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await axios.delete(ORDER_ENDPOINTS.DELETE(orderId), {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};
