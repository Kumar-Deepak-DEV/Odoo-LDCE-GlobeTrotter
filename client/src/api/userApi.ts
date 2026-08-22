import { axiosInstance } from './axiosInstance';
import type { User } from '../types';

export interface UpdateUserProfilePayload {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  bio?: string;
}

export const userApi = {
  getUserProfile: async (): Promise<{ user: User }> => {
    const res = await axiosInstance.get('/users/profile');
    return res.data.data;
  },

  updateUserProfile: async (payload: UpdateUserProfilePayload): Promise<{ user: User }> => {
    const res = await axiosInstance.put('/users/profile', payload);
    return res.data.data;
  },

  getUserById: async (id: string): Promise<{ user: User }> => {
    const res = await axiosInstance.get(`/users/${id}`);
    return res.data.data;
  },
};
