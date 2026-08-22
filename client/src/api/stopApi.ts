import { axiosInstance } from './axiosInstance';
import type { Stop } from '../types';

export interface CreateStopPayload {
  cityName: string;
  country?: string;
  cityExternalId?: string;
  lat?: number;
  lng?: number;
  startDate: string;
  endDate: string;
  budget?: number;
  order?: number;
}

export interface UpdateStopPayload {
  cityName?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  order?: number;
}

export const stopApi = {
  getStopsByTrip: async (tripId: string): Promise<{ stops: Stop[] }> => {
    const res = await axiosInstance.get(`/trips/${tripId}/stops`);
    return res.data.data;
  },

  createStop: async (tripId: string, payload: CreateStopPayload): Promise<{ stop: Stop }> => {
    const res = await axiosInstance.post(`/trips/${tripId}/stops`, payload);
    return res.data.data;
  },

  updateStop: async (stopId: string, payload: UpdateStopPayload): Promise<{ stop: Stop }> => {
    const res = await axiosInstance.put(`/stops/${stopId}`, payload);
    return res.data.data;
  },

  deleteStop: async (stopId: string): Promise<{ message: string; id: string }> => {
    const res = await axiosInstance.delete(`/stops/${stopId}`);
    return res.data.data;
  },

  reorderStops: async (tripId: string, stopIds: string[]): Promise<{ stops: Stop[] }> => {
    const res = await axiosInstance.put(`/trips/${tripId}/stops/reorder`, { stopIds });
    return res.data.data;
  },
};
