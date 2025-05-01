
// Base API URL - reading from environment variable with fallback
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aitool.asoroautomotive.com/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/user-signup`,
  LOGIN: `${API_BASE_URL}/user-login`,
  VERIFY_CODE: `${API_BASE_URL}/verify-user-code`,
  LOGOUT: `${API_BASE_URL}/user-logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/user-forgot-password`,
  APPROVE_FORGOT_PASSWORD: `${API_BASE_URL}/approve-forgot-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/change-password`,
  VERIFY_USER: `${API_BASE_URL}/verifyUser`,
  VERIFY_PASSWORD_CHANGE: `${API_BASE_URL}/verifyPasswordChange`,
};
 
// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
};

// Ticket endpoints
export const TICKET_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/create-ticket`,
  GET: `${API_BASE_URL}/ticket`,
  LIST: `${API_BASE_URL}/tickets`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/tickets/user/${id}`,
  UPDATE: `${API_BASE_URL}/update-ticket`,
  CLOSE: `${API_BASE_URL}/close-ticket`,
  ASSIGN: `${API_BASE_URL}/assign-ticket`,
};

// Message endpoints
export const MESSAGE_ENDPOINTS = {
  SEND_USER: `${API_BASE_URL}/send-message`,
  SEND_ADMIN: `${API_BASE_URL}/send-message-admin`,
  FETCH_PER_TICKET: `${API_BASE_URL}/fetch-messages`,
  FETCH_ALL: `${API_BASE_URL}/fetch-all-messages`,
  MARK_SEEN_BY_USER: `${API_BASE_URL}/edit-message-seen-by-user`,
  SEND_EMAIL: `${API_BASE_URL}/send-message-mail`,
};

// File endpoints
export const FILE_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/upload-files`,
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/create-order`,
  GET: (id: string) => `${API_BASE_URL}/order/${id}`,
  LIST: `${API_BASE_URL}/orders`,
  UPDATE: `${API_BASE_URL}/update-order`,
  DELETE: (id: string) => `${API_BASE_URL}/order/${id}`,
};

// Wallet endpoints
export const WALLET_ENDPOINTS = {
  BALANCE: (walletId: string) => `${API_BASE_URL}/wallet/${walletId}/balance`,
  ADD_FUNDS: `${API_BASE_URL}/wallet/add-funds`,
  WITHDRAW_FUNDS: `${API_BASE_URL}/wallet/withdraw-funds`,
  TRANSFER_FUNDS: `${API_BASE_URL}/wallet/transfer-funds`,
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_CRYPTO: `${API_BASE_URL}/payments/create-crypto-payment`,
  CREATE_CURRENCY: `${API_BASE_URL}/payments/create-currency-payment`,
  STATUS: (id: string) => `${API_BASE_URL}/payments/payment/${id}/status`,
  USER_PAYMENTS: (userId: string) => `${API_BASE_URL}/payments/${userId}/payments`,
  IPN: `${API_BASE_URL}/payments/ipn`,
  SAVE: `${API_BASE_URL}/payments`,
};
