const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
  
  // Notes endpoints
  NOTES: `${API_BASE_URL}/notes`,
  NOTE_BY_ID: (id: string) => `${API_BASE_URL}/notes/${id}`,
  
  // User endpoints
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};
