
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface WalletBalance {
  balance: number;
}

export interface WalletResponse {
  message: string;
  error?: string;
}

export interface WalletFundsRequest {
  userId: string;
  amount: number;
}

export interface WalletTransferRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

// export const getWalletBalance = async (userId: string): Promise<WalletBalance> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/wallet/${userId}/balance`);
//     return response.data;
//   } catch (error: any) {
//     console.error('Error fetching wallet balance:', error);
//     if (error.response?.status === 404) {
//       throw new Error('Wallet not found');
//     }
//     throw error;
//   }
// };

export const addFunds = async (data: WalletFundsRequest): Promise<WalletResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wallet/add-funds`, data, {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error('Error adding funds:', error);
    throw error;
  }
};

export const withdrawFunds = async (data: WalletFundsRequest): Promise<WalletResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wallet/withdraw-funds`, data, {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    throw error;
  }
};

export const transferFunds = async (data: WalletTransferRequest): Promise<WalletResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wallet/transfer-funds`, data, {withCredentials:true});
    return response.data;
  } catch (error) {
    console.error('Error transferring funds:', error);
    throw error;
  }
};
