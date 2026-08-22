export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TripStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export enum ActivityCategory {
  SIGHTSEEING = 'SIGHTSEEING',
  FOOD = 'FOOD',
  ADVENTURE = 'ADVENTURE',
  CULTURE = 'CULTURE',
  SHOPPING = 'SHOPPING',
  NIGHTLIFE = 'NIGHTLIFE',
  NATURE = 'NATURE',
  WELLNESS = 'WELLNESS',
}

export enum CostLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  LUXURY = 'LUXURY',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  photoUrl?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  coverPhotoUrl?: string | null;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  isPublic: boolean;
  shareSlug?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stop {
  id: string;
  tripId: string;
  cityName: string;
  country?: string | null;
  cityExternalId?: string | null;
  lat?: number | null;
  lng?: number | null;
  startDate: Date;
  endDate: Date;
  budget: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  stopId: string;
  name: string;
  category?: ActivityCategory | null;
  dayNumber: number;
  cost: number;
  costLevel?: CostLevel | null;
  durationMin?: number | null;
  notes?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  tripId?: string | null;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
