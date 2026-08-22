import { useState, useMemo, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  Calendar,
  Trash2,
  Pencil,
  Plane,
  Plus,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { tripApi } from '../../api/tripApi';
import type { Trip } from '../../types';

export interface TripListItem {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  displayDates: string;
  stopsCount: number;
  isPublic: boolean;
  status: 'ONGOING' | 'UPCOMING' | 'COMPLETED';
  image: string;
}

const DEFAULT_TRIPS: TripListItem[] = [
  {
    id: 'trip-aegean',
    title: 'Aegean Odyssey',
    destination: 'Santorini & Greek Islands',
    startDate: '2024-06-12',
    endDate: '2024-06-26',
    displayDates: 'Jun 12, 2024 - Jun 26, 2024',
    stopsCount: 4,
    isPublic: true,
    status: 'ONGOING',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'trip-pnw',
    title: 'PNW Roadtrip',
    destination: 'Pacific Northwest, USA',
    startDate: '2024-08-05',
    endDate: '2024-08-20',
    displayDates: 'Aug 05, 2024 - Aug 20, 2024',
    stopsCount: 8,
    isPublic: false,
    status: 'UPCOMING',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'trip-kyoto',
    title: 'Kyoto Autumn',
    destination: 'Kyoto, Japan',
    startDate: '2024-11-10',
    endDate: '2024-11-18',
    displayDates: 'Nov 10, 2024 - Nov 18, 2024',
    stopsCount: 2,
    isPublic: true,
    status: 'UPCOMING',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
  },
];

export const MyTripsPage: FC = () => {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'startDate' | 'title' | 'stops'>('startDate');
  const [isPublicOnly, setIsPublicOnly] = useState(false);
  const [trips, setTrips] = useState<TripListItem[]>(DEFAULT_TRIPS);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const formatTripToListItem = (t: Trip): TripListItem => {
    const dest = t.stops && t.stops.length > 0 ? t.stops.map((s) => s.cityName).join(', ') : 'Custom Trip';
    const sDate = t.startDate ? new Date(t.startDate) : new Date();
    const eDate = t.endDate ? new Date(t.endDate) : new Date();
    const sStr = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const eStr = eDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      id: t.id,
      title: t.name,
      destination: dest,
      startDate: t.startDate ? t.startDate.split('T')[0] : '',
      endDate: t.endDate ? t.endDate.split('T')[0] : '',
      displayDates: `${sStr} - ${eStr}`,
      stopsCount: t.stops?.length || 0,
      isPublic: !!t.isPublic,
      status: t.status || 'UPCOMING',
      image: t.coverPhotoUrl || '/images/adventure-mountain.jpg',
    };
  };

  const fetchTripsFromBackend = useCallback(async () => {
    try {
      const res = await tripApi.getTrips();
      if (res?.trips && res.trips.length > 0) {
        const formatted = res.trips.map(formatTripToListItem);
        setTrips(formatted);
      }
    } catch {
      // Fallback: check localStorage for custom trips
      try {
        const customTrips = JSON.parse(
          localStorage.getItem('globetrotter_custom_trips') || '[]'
        );
        if (customTrips && Array.isArray(customTrips) && customTrips.length > 0) {
          const formattedCustom: TripListItem[] = customTrips.map(formatTripToListItem);
          setTrips((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const toAdd = formattedCustom.filter((c) => !ids.has(c.id));
            return [...toAdd, ...prev];
          });
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    fetchTripsFromBackend();
  }, [fetchTripsFromBackend]);

  // Filtered & Sorted Trips
  const processedTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const matchesSearch =
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPublic = !isPublicOnly || trip.isPublic;
        return matchesSearch && matchesPublic;
      })
      .sort((a, b) => {
        if (sortBy === 'startDate') return a.startDate.localeCompare(b.startDate);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'stops') return b.stopsCount - a.stopsCount;
        return 0;
      });
  }, [trips, searchQuery, sortBy, isPublicOnly]);

  // Grouped Trips by Status
  const ongoingTrips = useMemo(
    () => processedTrips.filter((t) => t.status === 'ONGOING'),
    [processedTrips]
  );
  const upcomingTrips = useMemo(
    () => processedTrips.filter((t) => t.status === 'UPCOMING'),
    [processedTrips]
  );
  const completedTrips = useMemo(
    () => processedTrips.filter((t) => t.status === 'COMPLETED'),
    [processedTrips]
  );

  const handleDeleteTrip = async () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    setDeleteTargetId(null);
    setTrips((prev) => prev.filter((t) => t.id !== targetId));

    try {
      await tripApi.deleteTrip(targetId);
    } catch {
      // Deletion from local state already performed
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* TOP CONTROLS BAR: SEARCH, SORT & PUBLIC ONLY FILTER */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your trips..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 md:bg-white border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Right Filters & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between md:justify-end w-full md:w-auto gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-700">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'startDate' | 'title' | 'stops')
                }
                className="bg-transparent font-semibold text-slate-800 text-sm outline-none cursor-pointer pr-1"
              >
                <option value="startDate">Start Date</option>
                <option value="title">Trip Title</option>
                <option value="stops">Stops Count</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Public Only Checkbox */}
            <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublicOnly}
                onChange={(e) => setIsPublicOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>Public only</span>
            </label>
          </div>
        </div>

        {/* SECTION 1: ONGOING TRIPS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Ongoing
            </h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {ongoingTrips.length} {ongoingTrips.length === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>

          {ongoingTrips.length > 0 ? (
            <div className="space-y-4">
              {ongoingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-all"
                >
                  {/* Trip Cover Image */}
                  <div className="relative w-full sm:w-72 md:w-80 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {trip.isPublic && (
                      <div className="absolute top-3 left-3 bg-teal-600/90 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs shadow-sm">
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </div>
                    )}
                  </div>

                  {/* Trip Info & Action Controls */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                          {trip.title}
                        </h3>
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0">
                          {trip.stopsCount} stops
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{trip.displayDates}</span>
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(trip.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/trips/${trip.id}/builder`)}
                        className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                        title="Edit Itinerary"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        View Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
              No ongoing trips found matching your filters.
            </div>
          )}
        </section>

        {/* SECTION 2: UPCOMING TRIPS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Upcoming
            </h2>
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {upcomingTrips.length} {upcomingTrips.length === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>

          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-all"
                >
                  {/* Cover Image */}
                  <div className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {trip.isPublic && (
                      <div className="absolute top-2.5 left-2.5 bg-teal-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs shadow-sm">
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </div>
                    )}
                  </div>

                  {/* Content & Actions */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                          {trip.title}
                        </h3>
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-md shrink-0">
                          {trip.stopsCount} stops
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.displayDates}</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(trip.id)}
                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/trips/${trip.id}/builder`)}
                        className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Itinerary"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        className="px-4 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
              No upcoming trips found matching your criteria.
            </div>
          )}
        </section>

        {/* SECTION 3: COMPLETED TRIPS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Completed
            </h2>
            <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {completedTrips.length} Trips
            </span>
          </div>

          {completedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
                >
                  <h3 className="font-bold text-lg">{trip.title}</h3>
                  <p className="text-sm text-slate-500">{trip.displayDates}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State Container */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-10 sm:p-14 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Plane className="w-8 h-8 stroke-[1.8] text-blue-600 rotate-[-20deg]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight">
                No completed trips yet
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
                Your adventure history will appear here once you finish a trip.
                Ready to start your next journey?
              </p>
              <button
                type="button"
                onClick={() => navigate('/trips/new')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Plan a Trip</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">
              Delete Trip?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this trip? All stops and activities
              associated with it will be removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTrip}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default MyTripsPage;
