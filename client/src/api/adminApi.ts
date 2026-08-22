import { axiosInstance } from './axiosInstance';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  photoUrl?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  createdAt: string;
  _count?: {
    trips: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  newUsersLast7Days: number;
  totalTrips: number;
  tripsCreatedLast7Days: number;
  totalStops: number;
  totalActivities: number;
  activeTrips?: number;
  topCities: { cityName: string; count: number }[];
  topActivities: { name: string; count: number }[];
  averageTripDuration: number;
  averageBudgetPerTrip: number;
  categoryDistribution: { category: string; count: number }[];
}

export interface AdminStatsResponse {
  stats: AdminStats;
}

export interface ListAdminUsersParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const adminApi = {
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    const res = await axiosInstance.get('/admin/stats');
    return res.data.data;
  },

  getAdminUsers: async (params?: ListAdminUsersParams): Promise<{
    users: AdminUser[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const res = await axiosInstance.get('/admin/users', { params });
    return res.data.data;
  },

  deleteAdminUser: async (id: string): Promise<{ message: string; id: string }> => {
    const res = await axiosInstance.delete(`/admin/users/${id}`);
    return res.data.data;
  },
};
