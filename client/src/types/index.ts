export type Role = 'USER' | 'ADMIN';

export type TripStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'adventure'
  | 'transport'
  | 'stay'
  | 'culture'
  | 'entertainment'
  | 'shopping'
  | 'other';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  bio?: string;
  role: Role;
  createdAt: string;
}

export interface Activity {
  id: string;
  stopId: string;
  name: string;
  category?: ActivityCategory | string;
  dayNumber: number;
  cost: number;
  durationMin?: number;
  notes?: string;
  order: number;
}

export interface Stop {
  id: string;
  tripId: string;
  cityName: string;
  country?: string;
  startDate: string;
  endDate: string;
  budget: number;
  order: number;
  activities?: Activity[];
}

export interface Trip {
  id: string;
  userId: string;
  user?: User;
  name: string;
  coverPhotoUrl?: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  isPublic: boolean;
  shareSlug?: string;
  createdAt: string;
  stops?: Stop[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  user?: User;
  tripId?: string;
  trip?: Trip;
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
  likes?: number;
}

export interface City {
  id: string;
  name: string;
  country: string;
  costIndex?: number;
  popularity?: number;
  imageUrl?: string;
  description?: string;
  topAttractions?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface BudgetBreakdown {
  totalBudget: number;
  totalEstimatedCost: number;
  balance: number;
  byCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  byStop: {
    stopId: string;
    cityName: string;
    budget: number;
    actualCost: number;
  }[];
}
