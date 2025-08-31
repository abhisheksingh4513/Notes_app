import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  OTPVerification, 
  Note, 
  CreateNoteData, 
  UpdateNoteData, 
  User 
} from '../types';
import {  STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  // Auth methods
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  }

  static async signup(credentials: SignupCredentials): Promise<{ message: string }> {
    const response = await api.post('/auth/signup', credentials);
    return response.data;
  }

  static async sendOTP(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  }

  static async verifyOTP(verification: OTPVerification): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/verify-otp', verification);
    return response.data;
  }

  static async googleAuth(credential: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/google', { credential });
    return response.data;
  }

  // Notes methods
  static async getNotes(): Promise<Note[]> {
    const response: AxiosResponse<Note[]> = await api.get('/notes');
    return response.data;
  }

  static async createNote(noteData: CreateNoteData): Promise<Note> {
    const response: AxiosResponse<Note> = await api.post('/notes', noteData);
    return response.data;
  }

  static async updateNote(id: string, noteData: UpdateNoteData): Promise<Note> {
    const response: AxiosResponse<Note> = await api.put(`/notes/${id}`, noteData);
    return response.data;
  }

  static async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  }

  static async getNote(id: string): Promise<Note> {
    const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
    return response.data;
  }

  // User methods
  static async getUserProfile(): Promise<User> {
    const response: AxiosResponse<User> = await api.get('/user/profile');
    return response.data;
  }
}

export default ApiService;
