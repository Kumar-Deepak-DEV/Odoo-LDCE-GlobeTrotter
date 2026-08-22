import { axiosInstance } from './axiosInstance';

export interface StopBudgetSummary {
  stopId: string;
  cityName: string;
  country?: string | null;
  order: number;
  budget: number;
  actualCost: number;
  remaining: number;
  isOverBudget: boolean;
  activityCount: number;
}

export interface CategoryBudgetSummary {
  category: string;
  amount: number;
  percentage: number;
  activityCount: number;
}

export interface CostLevelBudgetSummary {
  costLevel: string;
  amount: number;
  activityCount: number;
}

export interface TripBudgetAnalysis {
  tripId: string;
  tripName: string;
  totalBudget: number;
  totalEstimatedCost: number;
  balance: number;
  isOverBudget: boolean;
  byCategory: CategoryBudgetSummary[];
  byStop: StopBudgetSummary[];
  byCostLevel: CostLevelBudgetSummary[];
  overBudgetStops: string[];
  warnings: string[];
}

export const budgetApi = {
  getTripBudget: async (tripId: string): Promise<{ budget: TripBudgetAnalysis }> => {
    try {
      const res = await axiosInstance.get(`/trips/${tripId}/budget`);
      return res.data.data;
    } catch {
      const res = await axiosInstance.get(`/budget/${tripId}`);
      return res.data.data;
    }
  },
};
