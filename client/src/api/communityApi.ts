import { axiosInstance } from './axiosInstance';
import type { Trip } from '../types';

export interface CommunityPostItem {
  id: string;
  tripId?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string | null;
  };
  trip?: {
    id: string;
    name: string;
    coverPhotoUrl?: string | null;
    startDate: string;
    endDate: string;
    stopsCount: number;
    shareSlug?: string | null;
    stops: {
      id: string;
      cityName: string;
      country?: string | null;
      order: number;
      _count?: { activities: number };
    }[];
  };
}

export interface ListCommunityPostsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListCommunityPostsResponse {
  posts: CommunityPostItem[];
  trips: Trip[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCommunityPostPayload {
  tripId?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
}

export const communityApi = {
  getCommunityPosts: async (params?: ListCommunityPostsParams): Promise<ListCommunityPostsResponse> => {
    const res = await axiosInstance.get('/community', { params });
    return res.data.data;
  },

  createCommunityPost: async (payload: CreateCommunityPostPayload): Promise<{ post: CommunityPostItem }> => {
    const res = await axiosInstance.post('/community', payload);
    return res.data.data;
  },
};
