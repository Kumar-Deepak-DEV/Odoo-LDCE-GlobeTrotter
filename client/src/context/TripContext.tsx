import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import type { Trip, Stop, Activity } from '../types';
import { tripApi } from '../api/tripApi';
import { useAuth } from './AuthContext';

interface TripContextType {
  trips: Trip[];
  isLoadingTrips: boolean;
  currentDraftTrip: Partial<Trip> | null;
  createDraftTrip: (initialData: Partial<Trip>) => string;
  updateDraftTrip: (updates: Partial<Trip>) => void;
  saveCurrentTrip: () => Promise<Trip | null>;
  getTripById: (id: string) => Trip | undefined;
  fetchTripById: (id: string) => Promise<Trip | null>;
  deleteTrip: (id: string) => Promise<boolean>;
  refreshTrips: () => Promise<void>;
  addStopToDraft: (stop: Omit<Stop, 'id' | 'tripId' | 'order'>) => void;
  addActivityToStop: (stopId: string, activity: Omit<Activity, 'id' | 'stopId' | 'order'>) => void;
}

const DEFAULT_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    name: 'European Adventure',
    description: 'Two-week cultural & culinary journey across London, Paris, and Rome.',
    startDate: '2024-10-12',
    endDate: '2024-10-25',
    status: 'UPCOMING',
    isPublic: true,
    shareSlug: 'european-adventure-2024',
    coverPhotoUrl: '/images/adventure-mountain.jpg',
    userId: 'usr-1',
    createdAt: '2024-01-10T10:00:00Z',
    stops: [
      {
        id: 'stop-paris',
        tripId: 'trip-1',
        cityName: 'Paris',
        country: 'France',
        order: 0,
        startDate: '2024-10-12',
        endDate: '2024-10-18',
        budget: 1100,
        activities: [
          {
            id: 'act-1',
            stopId: 'stop-paris',
            name: 'Louvre Museum Tour',
            category: 'culture',
            dayNumber: 1,
            order: 0,
            durationMin: 120,
            cost: 45,
          },
          {
            id: 'act-2',
            stopId: 'stop-paris',
            name: 'Eiffel Tower Sunset Dinner',
            category: 'food',
            dayNumber: 2,
            order: 1,
            durationMin: 150,
            cost: 180,
          },
        ],
      },
      {
        id: 'stop-london',
        tripId: 'trip-1',
        cityName: 'London',
        country: 'UK',
        order: 1,
        startDate: '2024-10-18',
        endDate: '2024-10-25',
        budget: 1100,
        activities: [
          {
            id: 'act-3',
            stopId: 'stop-london',
            name: 'Westminster Historical Walk',
            category: 'sightseeing',
            dayNumber: 3,
            order: 0,
            durationMin: 90,
            cost: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'trip-2',
    name: 'Aegean Odyssey',
    description: 'Island hopping through the Greek Cyclades and ancient Aegean ruins.',
    startDate: '2024-06-12',
    endDate: '2024-06-26',
    status: 'ONGOING',
    isPublic: true,
    shareSlug: 'aegean-odyssey',
    coverPhotoUrl: '/images/adventure-coastal.jpg',
    userId: 'usr-1',
    createdAt: '2024-02-01T08:00:00Z',
    stops: [],
  },
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [trips, setTrips] = useState<Trip[]>(DEFAULT_TRIPS);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(false);
  const [currentDraftTrip, setCurrentDraftTrip] = useState<Partial<Trip> | null>(null);

  const refreshTrips = useCallback(async () => {
    if (!token) return;
    setIsLoadingTrips(true);
    try {
      const data = await tripApi.getTrips();
      if (data?.trips) {
        setTrips(data.trips);
      }
    } catch {
      // Keep existing trips if network error occurs
    } finally {
      setIsLoadingTrips(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTrips();
    }
  }, [isAuthenticated, refreshTrips]);

  // Create or initialize a new draft trip
  const createDraftTrip = (initialData: Partial<Trip>): string => {
    const mockId = `trip-${Date.now()}`;
    const newDraft: Partial<Trip> = {
      id: mockId,
      name: initialData.name || 'New Adventure',
      description: initialData.description || '',
      startDate: initialData.startDate || new Date().toISOString().split('T')[0],
      endDate:
        initialData.endDate ||
        new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      isPublic: initialData.isPublic ?? true,
      shareSlug: `trip-${Date.now()}`,
      status: initialData.status || 'UPCOMING',
      coverPhotoUrl: initialData.coverPhotoUrl || '/images/paris.jpg',
      stops: initialData.stops || [],
      createdAt: new Date().toISOString(),
    };
    setCurrentDraftTrip(newDraft);
    return mockId;
  };

  // Update existing draft trip in state
  const updateDraftTrip = (updates: Partial<Trip>) => {
    setCurrentDraftTrip((prev) => (prev ? { ...prev, ...updates } : updates));
  };

  // Add stop to current draft
  const addStopToDraft = (stopData: Omit<Stop, 'id' | 'tripId' | 'order'>) => {
    if (!currentDraftTrip) return;
    const newStop: Stop = {
      ...stopData,
      id: `stop-${Date.now()}`,
      tripId: currentDraftTrip.id || 'draft',
      order: currentDraftTrip.stops?.length || 0,
      activities: [],
    };
    const updatedStops = [...(currentDraftTrip.stops || []), newStop];
    updateDraftTrip({ stops: updatedStops });
  };

  // Add activity to a stop in current draft
  const addActivityToStop = (
    stopId: string,
    activityData: Omit<Activity, 'id' | 'stopId' | 'order'>
  ) => {
    if (!currentDraftTrip || !currentDraftTrip.stops) return;
    const updatedStops = currentDraftTrip.stops.map((stop) => {
      if (stop.id === stopId) {
        const existingActivities = stop.activities || [];
        const newAct: Activity = {
          ...activityData,
          id: `act-${Date.now()}`,
          stopId,
          order: existingActivities.length,
        };
        return { ...stop, activities: [...existingActivities, newAct] };
      }
      return stop;
    });
    updateDraftTrip({ stops: updatedStops });
  };

  // Save current draft trip to backend or state
  const saveCurrentTrip = async (): Promise<Trip | null> => {
    if (!currentDraftTrip) return null;

    try {
      if (currentDraftTrip.id && !currentDraftTrip.id.startsWith('trip-')) {
        // Real existing trip in backend: update
        const res = await tripApi.updateTrip(currentDraftTrip.id, {
          name: currentDraftTrip.name,
          description: currentDraftTrip.description,
          startDate: currentDraftTrip.startDate,
          endDate: currentDraftTrip.endDate,
          isPublic: currentDraftTrip.isPublic,
          coverPhotoUrl: currentDraftTrip.coverPhotoUrl,
          status: currentDraftTrip.status,
        });
        if (res?.trip) {
          setTrips((prev) => prev.map((t) => (t.id === res.trip.id ? res.trip : t)));
          return res.trip;
        }
      } else {
        // Create new trip on backend
        const res = await tripApi.createTrip({
          name: currentDraftTrip.name || 'New Trip',
          description: currentDraftTrip.description,
          startDate: currentDraftTrip.startDate || new Date().toISOString(),
          endDate: currentDraftTrip.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
          isPublic: currentDraftTrip.isPublic ?? false,
          coverPhotoUrl: currentDraftTrip.coverPhotoUrl || '/images/paris.jpg',
          status: currentDraftTrip.status || 'UPCOMING',
        });
        if (res?.trip) {
          setTrips((prev) => [res.trip, ...prev]);
          return res.trip;
        }
      }
    } catch {
      // Fallback local update
    }

    const fallbackTrip = currentDraftTrip as Trip;
    setTrips((prev) => [fallbackTrip, ...prev.filter((t) => t.id !== fallbackTrip.id)]);
    return fallbackTrip;
  };

  const getTripById = (id: string): Trip | undefined => {
    if (currentDraftTrip && currentDraftTrip.id === id) {
      return currentDraftTrip as Trip;
    }
    return trips.find((t) => t.id === id);
  };

  const fetchTripById = async (id: string): Promise<Trip | null> => {
    try {
      const res = await tripApi.getTripById(id);
      if (res?.trip) {
        setTrips((prev) => {
          const exists = prev.some((t) => t.id === res.trip.id);
          return exists ? prev.map((t) => (t.id === res.trip.id ? res.trip : t)) : [res.trip, ...prev];
        });
        return res.trip;
      }
    } catch {
      // Fallback to local
    }
    return getTripById(id) || null;
  };

  const deleteTrip = async (id: string): Promise<boolean> => {
    try {
      await tripApi.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      return true;
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        isLoadingTrips,
        currentDraftTrip,
        createDraftTrip,
        updateDraftTrip,
        saveCurrentTrip,
        getTripById,
        fetchTripById,
        deleteTrip,
        refreshTrips,
        addStopToDraft,
        addActivityToStop,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default TripContext;

