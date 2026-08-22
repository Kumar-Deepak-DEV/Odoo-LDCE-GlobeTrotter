import { axiosInstance } from './axiosInstance';
import type { Trip } from '../types';

export interface ListTripsParams {
  status?: string;
  search?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'startDate' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTripPayload {
  name: string;
  title?: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string;
  coverImage?: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  isPublic?: boolean;
  shareSlug?: string;
}

export interface UpdateTripPayload {
  name?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverPhotoUrl?: string;
  coverImage?: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  isPublic?: boolean;
}

export interface ListTripsResponse {
  trips: Trip[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const tripApi = {
  getTrips: async (params?: ListTripsParams): Promise<ListTripsResponse> => {
    const res = await axiosInstance.get('/trips', { params });
    return res.data.data;
  },

  getTripById: async (id: string): Promise<{ trip: Trip }> => {
    const res = await axiosInstance.get(`/trips/${id}`);
    return res.data.data;
  },

  createTrip: async (payload: CreateTripPayload): Promise<{ trip: Trip }> => {
    const res = await axiosInstance.post('/trips', payload);
    return res.data.data;
  },

  updateTrip: async (id: string, payload: UpdateTripPayload): Promise<{ trip: Trip }> => {
    const res = await axiosInstance.put(`/trips/${id}`, payload);
    return res.data.data;
  },

  deleteTrip: async (id: string): Promise<{ message: string; id: string }> => {
    const res = await axiosInstance.delete(`/trips/${id}`);
    return res.data.data;
  },

  publishTrip: async (id: string): Promise<{ trip: Trip; shareSlug: string; shareUrl: string }> => {
    const res = await axiosInstance.post(`/trips/${id}/publish`);
    return res.data.data;
  },

  copyTrip: async (id: string): Promise<{ trip: Trip; message: string }> => {
    const res = await axiosInstance.post(`/trips/${id}/copy`);
    return res.data.data;
  },

  getPublicTrip: async (slugOrId: string): Promise<{ trip: Trip }> => {
    try {
      const res = await axiosInstance.get(`/public/trips/${slugOrId}`);
      return res.data.data;
    } catch {
      // Fallback to /trips/:id or /trips/public/:slug
      const res = await axiosInstance.get(`/trips/public/${slugOrId}`);
      return res.data.data;
    }
  },
};
