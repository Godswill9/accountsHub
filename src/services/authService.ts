import { AUTH_ENDPOINTS } from '@/config/api';

interface SignupData {
   fullName: string;
  email: string;
  password: string;
  code:string;
  phoneNumber: string;
  country: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyCodeData {
  email: string;
  code: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ApproveForgotPasswordData {
  email: string;
  code: string;
}

interface ChangePasswordData {
  email: string;
  oldPassword: string;
  newPassword: string;
}

// Helper function for API requests with environment-aware logging
const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    // For debugging in development only
    if (import.meta.env.DEV) {
      console.log(`Making ${method} request to: ${url}`);
      if (data) console.log('Request data:', data);
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
    // if (import.meta.env.DEV) {
    //   console.log('Response:', responseData);
    // }

    // if (!response.ok) {
    //   throw new Error(responseData.message || 'Something went wrong');
    // }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth service functions
export const authService = {
  signup: (data: SignupData) => 
    apiRequest(AUTH_ENDPOINTS.SIGNUP, 'POST', data),
  
  login: (data: LoginData) => 
    apiRequest(AUTH_ENDPOINTS.LOGIN, 'POST', data),
  
  verifyCode: (data: VerifyCodeData) => 
    apiRequest(AUTH_ENDPOINTS.VERIFY_CODE, 'POST', data),
  
  logout: () => 
    apiRequest(AUTH_ENDPOINTS.LOGOUT, 'POST'),
  
  forgotPassword: (data: ForgotPasswordData) => 
    apiRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, 'POST', data),
  
  approveForgotPassword: (data: ApproveForgotPasswordData) => 
    apiRequest(AUTH_ENDPOINTS.APPROVE_FORGOT_PASSWORD, 'POST', data),
  
  changePassword: (data: ChangePasswordData) => 
    apiRequest(AUTH_ENDPOINTS.CHANGE_PASSWORD, 'POST', data),
  
  verifyUser: () => 
    apiRequest(AUTH_ENDPOINTS.VERIFY_USER, 'GET'),
  
  verifyPasswordChange: () => 
    apiRequest(AUTH_ENDPOINTS.VERIFY_PASSWORD_CHANGE, 'GET'),
};
