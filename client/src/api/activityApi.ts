import { axiosInstance } from './axiosInstance';
import type { Activity } from '../types';

export interface CreateActivityPayload {
  name: string;
  category?: string;
  dayNumber?: number;
  cost?: number;
  costLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'LUXURY';
  durationMin?: number;
  notes?: string;
  description?: string;
  order?: number;
}

export interface UpdateActivityPayload {
  name?: string;
  category?: string;
  dayNumber?: number;
  cost?: number;
  costLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'LUXURY';
  durationMin?: number;
  notes?: string;
  description?: string;
  order?: number;
}

export interface SearchActivitiesParams {
  city?: string;
  category?: string;
  costLevel?: string;
  q?: string;
}

export const activityApi = {
  createActivity: async (stopId: string, payload: CreateActivityPayload): Promise<{ activity: Activity }> => {
    const res = await axiosInstance.post(`/stops/${stopId}/activities`, payload);
    return res.data.data;
  },

  updateActivity: async (activityId: string, payload: UpdateActivityPayload): Promise<{ activity: Activity }> => {
    const res = await axiosInstance.put(`/activities/${activityId}`, payload);
    return res.data.data;
  },

  deleteActivity: async (activityId: string): Promise<{ message: string; id: string }> => {
    const res = await axiosInstance.delete(`/activities/${activityId}`);
    return res.data.data;
  },

  searchActivities: async (params?: SearchActivitiesParams): Promise<{ activities: Activity[]; count: number }> => {
    const res = await axiosInstance.get('/activities/search', { params });
    return res.data.data;
  },
};
