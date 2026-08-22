import { axiosInstance } from './axiosInstance';

export interface DashboardStats {
  totalTrips: number;
  upcomingCount: number;
  ongoingCount: number;
  completedCount: number;
  totalEstimatedBudget: number;
  totalStops: number;
  totalActivities: number;
  nextTrip: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    daysRemaining: number | null;
    stopsCount: number;
    coverPhotoUrl?: string | null;
  } | null;
  recentTrips: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    coverPhotoUrl?: string | null;
    stopsCount: number;
    cities: string[];
  }[];
}

export const dashboardApi = {
  getDashboardStats: async (): Promise<{ stats: DashboardStats }> => {
    const res = await axiosInstance.get('/dashboard/stats');
    return res.data.data;
  },
};
