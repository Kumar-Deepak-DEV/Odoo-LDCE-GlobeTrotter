import { axiosInstance } from './axiosInstance';
import type { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  city?: string;
  country?: string;
  bio?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    const res = await axiosInstance.post('/auth/login', payload);
    return res.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponseData> => {
    const res = await axiosInstance.post('/auth/register', payload);
    return res.data.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await axiosInstance.get('/auth/me');
    return res.data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await axiosInstance.post('/auth/forgot-password', { email });
    return res.data.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const res = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    return res.data.data;
  },
};
