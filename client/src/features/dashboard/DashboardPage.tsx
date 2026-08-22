import { useState, useMemo, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowDownWideNarrow,
  Layers,
  MapPin,
  Plus,
  ChevronRight,
  ArrowRight,
  Check,
  Calendar,
  Compass,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { dashboardApi } from '../../api/dashboardApi';
import type { DashboardStats } from '../../api/dashboardApi';
import { useTrip } from '../../context/TripContext';

interface RegionalDestination {
  id: string;
  name: string;
  country: string;
  region: 'Europe' | 'Asia' | 'Americas';
  image: string;
  category: string;
  popularity: number;
  description: string;
}

interface PreviousTrip {
  id: string;
  title: string;
  location: string;
  dates: string;
  startDate: string;
  endDate: string;
  image: string;
  isPopular?: boolean;
  region: 'Europe' | 'Asia' | 'Americas';
  budget?: number;
  stopsCount?: number;
}

const REGIONAL_SELECTIONS: RegionalDestination[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: '/images/paris.jpg',
    category: 'Culture & Romance',
    popularity: 98,
    description: 'The City of Light, famous for the Eiffel Tower, art museums, and charming cafes.',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    image: '/images/tokyo.jpg',
    category: 'Metropolis & Technology',
    popularity: 97,
    description: 'A dazzling blend of ultramodern neon skyscrapers and historic temples.',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: '/images/bali.jpg',
    category: 'Tropical Retreat',
    popularity: 95,
    description: 'An Indonesian paradise known for its lush forested volcanic mountains and beaches.',
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    region: 'Americas',
    image: '/images/newyork.jpg',
    category: 'Urban Adventure',
    popularity: 96,
    description: 'The iconic city that never sleeps, with world-class theater, dining, and skyline.',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    image: '/images/rome.jpg',
    category: 'History & Gastronomy',
    popularity: 94,
    description: 'The Eternal City packed with ancient ruins, Renaissance art, and vibrant piazza life.',
  },
];

export const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { trips } = useTrip();

  // Backend Stats State
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Europe' | 'Asia' | 'Americas'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'newest'>('popular');
  const [groupBy, setGroupBy] = useState<'none' | 'region'>('none');

  // Control Dropdown Menus
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  // Selected Destination Quick Modal
  const [selectedDestination, setSelectedDestination] = useState<RegionalDestination | null>(null);

  // Fetch Dashboard Stats from Backend
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const data = await dashboardApi.getDashboardStats();
        if (data?.stats) {
          setStats(data.stats);
        }
      } catch {
        // Fallback gracefully to client state
      }
    };

    loadDashboardStats();
  }, []);

  // Handle Search Submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Filtered and Sorted Regional Selections
  const filteredDestinations = useMemo(() => {
    return REGIONAL_SELECTIONS.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || dest.region === selectedFilter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.popularity - a.popularity;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, selectedFilter, sortBy]);

  // Real Trips from TripContext & Backend
  const displayedTrips = useMemo<PreviousTrip[]>(() => {
    if (trips && trips.length > 0) {
      return trips.map((t) => {
        const dest = t.stops && t.stops.length > 0 ? t.stops.map((s) => s.cityName).join(', ') : 'Adventure';
        const start = t.startDate ? new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        const end = t.endDate ? new Date(t.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        return {
          id: t.id,
          title: t.name,
          location: dest,
          dates: `${start} - ${end}`,
          startDate: t.startDate,
          endDate: t.endDate,
          image: t.coverPhotoUrl || '/images/adventure-mountain.jpg',
          region: 'Europe' as const,
          stopsCount: t.stops?.length || 0,
        };
      });
    }

    return [
      {
        id: 'trip-amalfi',
        title: 'Amalfi Coast Escape',
        location: 'Amalfi, Italy',
        dates: 'Jun 12 - Jun 19, 2024',
        startDate: '2024-06-12',
        endDate: '2024-06-19',
        image: '/images/amalfi.jpg',
        isPopular: true,
        region: 'Europe',
        budget: 2400,
        stopsCount: 3,
      },
      {
        id: 'trip-scotland',
        title: 'Scottish Highlands Tour',
        location: 'Highlands, Scotland',
        dates: 'Sep 05 - Sep 14, 2024',
        startDate: '2024-09-05',
        endDate: '2024-09-14',
        image: '/images/scotland.jpg',
        region: 'Europe',
        budget: 1850,
        stopsCount: 4,
      },
      {
        id: 'trip-bangkok',
        title: 'Bangkok City Break',
        location: 'Bangkok, Thailand',
        dates: 'Oct 20 - Oct 28, 2024',
        startDate: '2024-10-20',
        endDate: '2024-10-28',
        image: '/images/bangkok.jpg',
        region: 'Asia',
        budget: 1200,
        stopsCount: 2,
      },
    ];
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return displayedTrips.filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || trip.region === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [displayedTrips, searchQuery, selectedFilter]);

  const handleStartTripWithDestination = (cityName: string) => {
    navigate(`/trips/new?destination=${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Sticky Global Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* HERO BANNER SECTION */}
        <section className="relative">
          {/* Main Gradient Card */}
          <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#2563EB] via-[#0284C7] to-[#0D9488] p-8 sm:p-14 lg:p-18 text-center text-white overflow-hidden shadow-xl shadow-blue-500/10">
            {/* Ambient Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold font-heading text-white tracking-tight leading-[1.1]">
                Where to next?
              </h1>
              <p className="text-white/90 text-base sm:text-lg font-normal max-w-xl mx-auto">
                Your next adventure is just a click away
              </p>

              {/* Floating Pill Search Bar Container */}
              <div className="pt-6 sm:pt-8 max-w-2xl mx-auto">
                <form
                  onSubmit={handleSearch}
                  className="bg-white rounded-full p-2 pl-6 shadow-2xl border border-slate-100/90 flex items-center gap-3 transition-all focus-within:ring-4 focus-within:ring-blue-300/40"
                >
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destinations..."
                    className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base outline-none font-normal"
                  />
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-full transition-all shadow-md shadow-blue-500/25 cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE METRICS CARDS (IF STATS AVAILABLE) */}
        {stats && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fadeIn">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Trips</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalTrips}</h3>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.upcomingCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stops</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalStops}</h3>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  ${stats.totalEstimatedBudget.toLocaleString()}
                </h3>
              </div>
            </div>
          </section>
        )}

        {/* FILTER / SORT / GROUP CONTROLS BAR */}
        <section className="flex flex-wrap items-center gap-3 pt-2">
          {/* Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowSortDropdown(false);
                setShowGroupDropdown(false);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                selectedFilter !== 'all'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter{selectedFilter !== 'all' ? `: ${selectedFilter}` : ''}</span>
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowFilterDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-fadeIn">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Filter by Region
                  </div>
                  {(['all', 'Europe', 'Asia', 'Americas'] as const).map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => {
                        setSelectedFilter(region);
                        setShowFilterDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="capitalize">{region === 'all' ? 'All Regions' : region}</span>
                      {selectedFilter === region && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort By: Popular Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowFilterDropdown(false);
                setShowGroupDropdown(false);
              }}
              className="px-4 py-2 rounded-full border border-blue-600 bg-blue-50/70 text-blue-600 text-sm font-medium flex items-center gap-2 transition-all hover:bg-blue-100/60 cursor-pointer"
            >
              <ArrowDownWideNarrow className="w-4 h-4" />
              <span>
                Sort by:{' '}
                <strong className="font-semibold">
                  {sortBy === 'popular'
                    ? 'Popular'
                    : sortBy === 'name'
                    ? 'Alphabetical'
                    : 'Newest'}
                </strong>
              </span>
            </button>

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-fadeIn">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Sort Options
                  </div>
                  {[
                    { key: 'popular', label: 'Popular' },
                    { key: 'name', label: 'Alphabetical' },
                    { key: 'newest', label: 'Newest First' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        setSortBy(option.key as 'popular' | 'name' | 'newest');
                        setShowSortDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {sortBy === option.key && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Group By Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowGroupDropdown(!showGroupDropdown);
                setShowFilterDropdown(false);
                setShowSortDropdown(false);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                groupBy !== 'none'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Group by{groupBy !== 'none' ? `: Region` : ''}</span>
            </button>

            {/* Group Dropdown */}
            {showGroupDropdown && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowGroupDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-fadeIn">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Group Options
                  </div>
                  {[
                    { key: 'none', label: 'No Grouping' },
                    { key: 'region', label: 'By Region' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        setGroupBy(option.key as 'none' | 'region');
                        setShowGroupDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>{option.label}</span>
                      {groupBy === option.key && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* SECTION 1: TOP REGIONAL SELECTIONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-[28px] font-bold font-heading text-slate-900 tracking-tight">
              Top Regional Selections
            </h2>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5 Destination Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Background City Image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight drop-shadow-md">
                    {dest.name}
                  </h3>
                  <p className="text-white/70 text-xs font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: PREVIOUS TRIPS */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-[28px] font-bold font-heading text-slate-900 tracking-tight">
              Previous Trips
            </h2>
            <button
              type="button"
              onClick={() => navigate('/trips/new')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Plan a Trip</span>
            </button>
          </div>

          {/* 3 Trip Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Trip Card Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Popular Badge */}
                  {trip.isPopular && (
                    <div className="absolute top-3.5 right-3.5 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Popular
                    </div>
                  )}
                </div>

                {/* Trip Details Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location Pin and Title */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {trip.title}
                      </h3>
                    </div>
                  </div>

                  {/* Date and View Details Footer Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm">
                    <span className="text-slate-500 font-normal">
                      {trip.dates}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Destination Quick Details Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <button
                type="button"
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              >
                &times;
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-xs font-semibold uppercase tracking-wider">
                  {selectedDestination.region}
                </span>
                <h3 className="text-3xl font-bold font-heading mt-1">
                  {selectedDestination.name}
                </h3>
                <p className="text-white/80 text-sm">{selectedDestination.country}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedDestination.description}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Theme: <strong>{selectedDestination.category}</strong></span>
                <span>Popularity: <strong>{selectedDestination.popularity}% Match</strong></span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDestination(null)}
                  className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleStartTripWithDestination(selectedDestination.name)}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Plan Trip to {selectedDestination.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
