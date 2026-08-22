import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import type { Trip, Stop, Activity } from '../types';

interface TripContextType {
  trips: Trip[];
  currentDraftTrip: Partial<Trip> | null;
  createDraftTrip: (initialData: Partial<Trip>) => string;
  updateDraftTrip: (updates: Partial<Trip>) => void;
  saveCurrentTrip: () => Trip | null;
  getTripById: (id: string) => Trip | undefined;
  deleteTrip: (id: string) => void;
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
  {
    id: 'trip-3',
    name: 'PNW Roadtrip',
    description: 'Exploring Pacific Northwest temperate rainforests, volcanoes, and coastline.',
    startDate: '2024-08-05',
    endDate: '2024-08-20',
    status: 'UPCOMING',
    isPublic: false,
    shareSlug: 'pnw-roadtrip',
    coverPhotoUrl: '/images/scotland.jpg',
    userId: 'usr-1',
    createdAt: '2024-03-01T09:00:00Z',
    stops: [],
  },
  {
    id: 'trip-4',
    name: 'Kyoto Autumn',
    description: 'Golden foliage, traditional teahouses, and zen gardens in ancient Kyoto.',
    startDate: '2024-11-10',
    endDate: '2024-11-18',
    status: 'UPCOMING',
    isPublic: true,
    shareSlug: 'kyoto-autumn',
    coverPhotoUrl: '/images/tokyo.jpg',
    userId: 'usr-1',
    createdAt: '2024-03-10T11:00:00Z',
    stops: [],
  },
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    // TODO: replace with real API call to GET /api/trips
    const saved = localStorage.getItem('globetrotter_custom_trips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [
          ...DEFAULT_TRIPS,
          ...parsed.filter((p: Trip) => !DEFAULT_TRIPS.some((d) => d.id === p.id)),
        ];
      } catch {
        return DEFAULT_TRIPS;
      }
    }
    return DEFAULT_TRIPS;
  });

  const [currentDraftTrip, setCurrentDraftTrip] = useState<Partial<Trip> | null>(null);

  // Sync custom trips to localStorage
  useEffect(() => {
    const customOnly = trips.filter((t) => !DEFAULT_TRIPS.some((d) => d.id === t.id));
    localStorage.setItem('globetrotter_custom_trips', JSON.stringify(customOnly));
  }, [trips]);

  // Create or initialize a new draft trip
  const createDraftTrip = (initialData: Partial<Trip>): string => {
    // TODO: replace with real API call to POST /api/trips
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

  // Save current trip to all trips list
  const saveCurrentTrip = (): Trip | null => {
    // TODO: replace with real API call to POST /api/trips or PUT /api/trips/:id
    if (!currentDraftTrip || !currentDraftTrip.id) return null;

    const fullTrip: Trip = {
      id: currentDraftTrip.id,
      name: currentDraftTrip.name || 'Untitled Trip',
      description: currentDraftTrip.description || '',
      startDate:
        currentDraftTrip.startDate || new Date().toISOString().split('T')[0],
      endDate:
        currentDraftTrip.endDate ||
        new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: currentDraftTrip.status || 'UPCOMING',
      isPublic: currentDraftTrip.isPublic ?? true,
      shareSlug: currentDraftTrip.shareSlug || `share-${Date.now()}`,
      coverPhotoUrl: currentDraftTrip.coverPhotoUrl || '/images/paris.jpg',
      userId: 'usr-1',
      createdAt: currentDraftTrip.createdAt || new Date().toISOString(),
      stops: currentDraftTrip.stops || [],
    };

    setTrips((prev) => {
      const exists = prev.some((t) => t.id === fullTrip.id);
      if (exists) {
        return prev.map((t) => (t.id === fullTrip.id ? fullTrip : t));
      }
      return [fullTrip, ...prev];
    });

    return fullTrip;
  };

  const getTripById = (id: string): Trip | undefined => {
    // TODO: replace with real API call to GET /api/trips/:id
    if (currentDraftTrip && currentDraftTrip.id === id) {
      return currentDraftTrip as Trip;
    }
    return trips.find((t) => t.id === id);
  };

  const deleteTrip = (id: string) => {
    // TODO: replace with real API call to DELETE /api/trips/:id
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentDraftTrip,
        createDraftTrip,
        updateDraftTrip,
        saveCurrentTrip,
        getTripById,
        deleteTrip,
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
