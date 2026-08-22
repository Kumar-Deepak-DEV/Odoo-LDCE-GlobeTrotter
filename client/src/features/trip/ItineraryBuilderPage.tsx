import { useState, useEffect, useCallback } from 'react';
import type { FC, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Share2,
  Map as MapIcon,
  Calendar,
  GripVertical,
  Plus,
  Equal,
  Landmark,
  Utensils,
  Footprints,
  Theater,
  Castle,
  PlusCircle,
  X,
  Check,
  Clock,
  Copy,
  Trash2,
  Eye,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { tripApi } from '../../api/tripApi';
import { stopApi } from '../../api/stopApi';
import { activityApi } from '../../api/activityApi';

interface ActivityItem {
  id: string;
  name: string;
  dayNumber: number;
  durationMin: number;
  cost: number;
  isFree?: boolean;
  category: 'museum' | 'food' | 'walking' | 'entertainment' | 'landmark' | 'other';
  categoryColor: string;
}

interface StopSection {
  id: string;
  city: string;
  country: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  activities: ActivityItem[];
}



export const ItineraryBuilderPage: FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [tripTitle, setTripTitle] = useState('My Trip');
  const [tripDates, setTripDates] = useState('');
  const [tripDuration, setTripDuration] = useState('');
  const [stops, setStops] = useState<StopSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareSlug, setShareSlug] = useState<string | null>(null);

  // Modals state
  const [showAddActivityModal, setShowAddActivityModal] = useState<string | null>(null); // stopId
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Activity Form
  const [newActName, setNewActName] = useState('');
  const [newActDay, setNewActDay] = useState(1);
  const [newActDuration, setNewActDuration] = useState(90);
  const [newActCost, setNewActCost] = useState(0);
  const [newActCategory, setNewActCategory] = useState<ActivityItem['category']>('museum');

  // New Stop Form
  const [newStopCity, setNewStopCity] = useState('');
  const [newStopCountry, setNewStopCountry] = useState('');
  const [newStopDates, setNewStopDates] = useState('');
  const [newStopBudget, setNewStopBudget] = useState(1000);

  // Category Color Map
  const categoryColors: Record<string, string> = {
    museum: '#F97316',
    food: '#EF4444',
    walking: '#14B8A6',
    entertainment: '#F97316',
    landmark: '#14B8A6',
    culture: '#F97316',
    sightseeing: '#14B8A6',
    adventure: '#0EA5E9',
    other: '#3B82F6',
  };

  // Load real trip details from Backend API
  const loadTripData = useCallback(async () => {
    if (!id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const data = await tripApi.getTripById(id);
      if (data?.trip) {
        const t = data.trip;
        setTripTitle(t.name);
        if (t.shareSlug) {
          setShareSlug(t.shareSlug);
        }
        if (t.startDate && t.endDate) {
          const s = new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const e = new Date(t.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          setTripDates(`${s} - ${e}`);
          const days = Math.max(1, Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24)));
          setTripDuration(`${days} Days`);
        }
        if (t.stops && t.stops.length > 0) {
          const formattedStops: StopSection[] = t.stops.map((s) => {
            const sStart = s.startDate ? new Date(s.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            const sEnd = s.endDate ? new Date(s.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            return {
              id: s.id,
              city: s.cityName,
              country: s.country || '',
              dateRange: sStart && sEnd ? `${sStart} - ${sEnd}` : 'Dates set',
              startDate: s.startDate ? s.startDate.split('T')[0] : '',
              endDate: s.endDate ? s.endDate.split('T')[0] : '',
              estimatedBudget: Number(s.budget) || 0,
              activities: (s.activities || []).map((act) => {
                const catLower = (act.category?.toLowerCase() || 'other') as ActivityItem['category'];
                return {
                  id: act.id,
                  name: act.name,
                  dayNumber: act.dayNumber || 1,
                  durationMin: act.durationMin || 60,
                  cost: Number(act.cost) || 0,
                  isFree: Number(act.cost) === 0,
                  category: catLower,
                  categoryColor: categoryColors[catLower] || '#14B8A6',
                };
              }),
            };
          });
          setStops(formattedStops);
        }
      }
    } catch {
      // Local fallback
      const savedTrips = JSON.parse(localStorage.getItem('globetrotter_custom_trips') || '[]');
      const found = savedTrips.find((t: { id: string; name: string }) => t.id === id);
      if (found?.name) {
        setTripTitle(found.name);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  // Render category icon helper
  const renderCategoryIcon = (category: ActivityItem['category']) => {
    switch (category) {
      case 'museum':
        return <Landmark className="w-4 h-4 text-teal-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-teal-600" />;
      case 'walking':
        return <Footprints className="w-4 h-4 text-teal-600" />;
      case 'entertainment':
        return <Theater className="w-4 h-4 text-teal-600" />;
      case 'landmark':
        return <Castle className="w-4 h-4 text-teal-600" />;
      default:
        return <Landmark className="w-4 h-4 text-teal-600" />;
    }
  };

  const handleAddActivitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!showAddActivityModal || !newActName.trim()) return;

    const targetStopId = showAddActivityModal;
    let newActId = `act_${Date.now()}`;

    // Backend activity creation
    if (targetStopId && !targetStopId.startsWith('stop-') && !targetStopId.startsWith('stop_')) {
      try {
        const res = await activityApi.createActivity(targetStopId, {
          name: newActName.trim(),
          dayNumber: Number(newActDay) || 1,
          durationMin: Number(newActDuration) || 60,
          cost: Number(newActCost) || 0,
          category: newActCategory.toUpperCase(),
        });
        if (res?.activity) {
          newActId = res.activity.id;
        }
      } catch {
        // Fallback local ID
      }
    }

    const newActivity: ActivityItem = {
      id: newActId,
      name: newActName.trim(),
      dayNumber: Number(newActDay) || 1,
      durationMin: Number(newActDuration) || 60,
      cost: Number(newActCost) || 0,
      isFree: Number(newActCost) === 0,
      category: newActCategory,
      categoryColor: categoryColors[newActCategory] || '#14B8A6',
    };

    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id === targetStopId) {
          return {
            ...stop,
            activities: [...stop.activities, newActivity],
          };
        }
        return stop;
      })
    );

    // Reset Form & Close
    setNewActName('');
    setNewActDay(1);
    setNewActDuration(90);
    setNewActCost(0);
    setShowAddActivityModal(null);
  };

  const handleAddStopSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStopCity.trim()) return;

    let newStopId = `stop_${Date.now()}`;
    const stopPayload = {
      cityName: newStopCity.trim(),
      country: newStopCountry.trim() || undefined,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
      budget: Number(newStopBudget) || 1000,
      order: stops.length + 1,
    };

    if (id && !id.startsWith('trip-') && !id.startsWith('trip_')) {
      try {
        const res = await stopApi.createStop(id, stopPayload);
        if (res?.stop) {
          newStopId = res.stop.id;
        }
      } catch {
        // Fallback local
      }
    }

    const newStop: StopSection = {
      id: newStopId,
      city: newStopCity.trim(),
      country: newStopCountry.trim() || 'Worldwide',
      dateRange: newStopDates.trim() || 'Dates TBD',
      startDate: stopPayload.startDate.split('T')[0],
      endDate: stopPayload.endDate.split('T')[0],
      estimatedBudget: Number(newStopBudget) || 1000,
      activities: [],
    };

    setStops((prev) => [...prev, newStop]);

    // Reset & Close
    setNewStopCity('');
    setNewStopCountry('');
    setNewStopDates('');
    setNewStopBudget(1000);
    setShowAddStopModal(false);
  };

  const handleDeleteStop = async (stopId: string) => {
    setStops((prev) => prev.filter((s) => s.id !== stopId));
    if (!stopId.startsWith('stop-') && !stopId.startsWith('stop_')) {
      try {
        await stopApi.deleteStop(stopId);
      } catch {
        // Handled in state
      }
    }
  };

  const handleDeleteActivity = async (stopId: string, activityId: string) => {
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: stop.activities.filter((act) => act.id !== activityId),
          };
        }
        return stop;
      })
    );

    if (!activityId.startsWith('act-') && !activityId.startsWith('act_')) {
      try {
        await activityApi.deleteActivity(activityId);
      } catch {
        // Handled in state
      }
    }
  };

  const handleOpenShareModal = async () => {
    if (id && !id.startsWith('trip-') && !id.startsWith('trip_')) {
      try {
        const res = await tripApi.publishTrip(id);
        if (res?.shareSlug) {
          setShareSlug(res.shareSlug);
        }
      } catch {
        // Handled
      }
    }
    setShowShareModal(true);
  };

  const shareUrl = shareSlug
    ? `${window.location.origin}/share/${shareSlug}`
    : `${window.location.origin}/trips/${id || '1'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* TRIP HEADER AREA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              {tripTitle}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{tripDates} • {tripDuration}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Itinerary Button */}
            <Link
              to={`/trips/${id || '1'}`}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Itinerary</span>
            </Link>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleOpenShareModal}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>Share</span>
            </button>

            {/* View Map Button */}
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapIcon className="w-4 h-4" />
              <span>View Map</span>
            </button>
          </div>
        </div>

        {/* STOPS LIST SECTIONS */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-sm animate-pulse">
              Loading your itinerary...
            </div>
          ) : stops.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center flex flex-col items-center gap-3 text-slate-400">
              <p className="text-sm font-medium">No stops added yet.</p>
              <p className="text-xs">Click <strong className="text-blue-600">Add Another Stop</strong> below to begin building your itinerary!</p>
            </div>
          ) : null}
          {!isLoading && stops.map((stop, stopIndex) => (
            <div key={stop.id} className="relative flex items-start gap-3 group">
              {/* External Left 6-Dot Drag Handle */}
              <div className="hidden sm:flex pt-6 text-slate-400 hover:text-slate-600 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Stop Card */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
                {/* Stop Header Row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    {/* Teal Circular Number Badge */}
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm shadow-teal-500/20">
                      {stopIndex + 1}
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none">
                        {stop.city}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {stop.country}
                      </p>
                    </div>
                  </div>

                  {/* Date Range & Estimated Budget Badge & Delete Stop */}
                  <div className="flex items-center gap-2.5 text-right">
                    <span className="text-xs sm:text-sm font-medium text-slate-600 hidden sm:inline">
                      {stop.dateRange}
                    </span>
                    <div className="bg-amber-50 text-amber-700 border border-amber-200/80 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      Est. ${stop.estimatedBudget.toLocaleString()}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteStop(stop.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Activities List */}
                <div className="space-y-2.5">
                  {stop.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-xl border border-slate-100 p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:border-slate-200 transition-all group/item"
                    >
                      {/* Left: Category Icon + Title + Day Badge */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                          {renderCategoryIcon(activity.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                            {activity.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                              Day {activity.dayNumber}
                            </span>
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {activity.durationMin} min
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Cost + Category Dot + Drag Handle / Delete */}
                      <div className="flex items-center gap-4">
                        <div className="text-right flex flex-col items-end">
                          <span className="font-bold text-slate-900 text-sm sm:text-base">
                            {activity.isFree ? 'Free' : `$${activity.cost}`}
                          </span>
                          <span
                            className="w-2 h-2 rounded-full mt-1 inline-block"
                            style={{ backgroundColor: activity.categoryColor }}
                          />
                        </div>

                        {/* Drag / Action Handle */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(stop.id, activity.id)}
                            className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                            title="Remove activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Equal className="w-4 h-4 text-slate-300 cursor-grab" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* + Add Activity Button */}
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(stop.id)}
                  className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Activity</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MASTER: + ADD ANOTHER STOP BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAddStopModal(true)}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.2]" />
            <span>Add Another Stop</span>
          </button>
        </div>
      </main>

      {/* MODAL: ADD ACTIVITY */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Add Activity
              </h3>
              <button
                type="button"
                onClick={() => setShowAddActivityModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  value={newActName}
                  onChange={(e) => setNewActName(e.target.value)}
                  placeholder="e.g. Guided City Tour"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newActDay}
                    onChange={(e) => setNewActDay(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={newActDuration}
                    onChange={(e) => setNewActDuration(parseInt(e.target.value) || 60)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Cost ($ USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newActCost}
                    onChange={(e) => setNewActCost(parseFloat(e.target.value) || 0)}
                    placeholder="0 for free"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newActCategory}
                    onChange={(e) => setNewActCategory(e.target.value as ActivityItem['category'])}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="museum">Museum / Culture</option>
                    <option value="food">Food & Dining</option>
                    <option value="walking">Walking Tour</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="landmark">Landmark / Historic</option>
                    <option value="other">Other Activity</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(null)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD STOP */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Add Another Stop
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStopModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStopSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  City Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStopCity}
                  onChange={(e) => setNewStopCity(e.target.value)}
                  placeholder="e.g. Amsterdam, Rome, Tokyo"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={newStopCountry}
                  onChange={(e) => setNewStopCountry(e.target.value)}
                  placeholder="e.g. Netherlands"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Dates
                  </label>
                  <input
                    type="text"
                    value={newStopDates}
                    onChange={(e) => setNewStopDates(e.target.value)}
                    placeholder="e.g. Oct 20 - Oct 23"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Est. Budget ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={newStopBudget}
                    onChange={(e) => setNewStopBudget(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SHARE */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Share Itinerary
              </h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              Anyone with this link can view and explore this itinerary.
            </p>

            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 mb-5">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 bg-transparent text-xs text-slate-700 outline-none px-2"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: VIEW MAP */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Itinerary Route Map
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paris ➡️ London • 2 Cities • 5 Activities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stylized Visual Route Map */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex items-center justify-between h-full px-6">
                {/* Stop 1 Pin */}
                <div className="flex flex-col items-center gap-2 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center shadow-lg shadow-teal-500/40 ring-4 ring-white/20">
                    1
                  </div>
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs font-semibold">
                    Paris, France
                  </div>
                </div>

                {/* Connecting Animated Dashed Line */}
                <div className="flex-1 mx-4 flex flex-col items-center">
                  <div className="w-full border-t-2 border-dashed border-teal-400/60 my-2" />
                  <span className="text-xs text-teal-300 font-mono">344 km via Eurostar</span>
                </div>

                {/* Stop 2 Pin */}
                <div className="flex flex-col items-center gap-2 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center shadow-lg shadow-teal-500/40 ring-4 ring-white/20">
                    2
                  </div>
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs font-semibold">
                    London, UK
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
              >
                Done
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

export default ItineraryBuilderPage;
