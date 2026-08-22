import { axiosInstance } from './axiosInstance';

export interface CityResult {
  id?: string;
  name: string;
  country: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  imageUrl?: string;
  description?: string;
  popularity?: number;
  costLevel?: string;
}

export const cityApi = {
  getPopularCities: async (limit: number = 6): Promise<{ cities: CityResult[]; count: number }> => {
    const res = await axiosInstance.get('/cities/popular', { params: { limit } });
    return res.data.data;
  },

  searchCities: async (q: string, limit: number = 10): Promise<{ query: string; cities: CityResult[]; count: number }> => {
    const res = await axiosInstance.get('/cities/search', { params: { q, limit } });
    return res.data.data;
  },
};
