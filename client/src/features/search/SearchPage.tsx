import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Globe,
  SlidersHorizontal,
  MapPin,
  Plus,
  Heart,
  ChevronDown,
  X,
  Check,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { cityApi } from '../../api/cityApi';
import { activityApi } from '../../api/activityApi';

interface CityItem {
  id: string;
  name: string;
  country: string;
  region: 'Europe' | 'Asia' | 'Americas';
  image: string;
  costLevel: '$' | '$$' | '$$$';
  rating: number;
  description: string;
}

interface ActivitySearchItem {
  id: string;
  name: string;
  cityName: string;
  country: string;
  region: 'Europe' | 'Asia' | 'Americas';
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Culture';
  price: number;
  duration: string;
  rating: number;
  image: string;
}

const CITIES_DATA: CityItem[] = [
  {
    id: 'city-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    costLevel: '$$',
    rating: 4.9,
    description: 'Ultramodern skyscrapers, historic shrines, and world-class dining.',
  },
  {
    id: 'city-amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    image: '/images/amalfi.jpg',
    costLevel: '$$$',
    rating: 4.8,
    description: 'Dramatic pastel cliffside villages overlooking the sparkling Tyrrhenian Sea.',
  },
  {
    id: 'city-newyork',
    name: 'New York',
    country: 'United States',
    region: 'Americas',
    image: '/images/newyork.jpg',
    costLevel: '$$$',
    rating: 4.9,
    description: 'The energetic global capital of culture, theater, architecture, and nightlife.',
  },
  {
    id: 'city-santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
    costLevel: '$$$',
    rating: 4.9,
    description: 'Iconic whitewashed cubic houses and blue domes with panoramic caldera sunsets.',
  },
  {
    id: 'city-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: '/images/paris.jpg',
    costLevel: '$$$',
    rating: 4.8,
    description: 'The City of Light, home to the Eiffel Tower, the Louvre, and charming cafes.',
  },
  {
    id: 'city-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: '/images/bali.jpg',
    costLevel: '$',
    rating: 4.7,
    description: 'Lush terraced rice paddies, serene volcanic mountains, and coral reefs.',
  },
  {
    id: 'city-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    image: '/images/rome.jpg',
    costLevel: '$$',
    rating: 4.8,
    description: 'Nearly 3,000 years of globally influential art, architecture, and culture.',
  },
  {
    id: 'city-london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    costLevel: '$$$',
    rating: 4.7,
    description: 'Historic landmarks from the Houses of Parliament to the modern London Eye.',
  },
];

const ACTIVITIES_DATA: ActivitySearchItem[] = [
  {
    id: 'act-louvre',
    name: 'Louvre Museum Tour',
    cityName: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Culture',
    price: 45,
    duration: '2 hours',
    rating: 4.9,
    image: '/images/paris.jpg',
  },
  {
    id: 'act-eiffel',
    name: 'Eiffel Tower Sunset Dinner',
    cityName: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Food',
    price: 180,
    duration: '2.5 hours',
    rating: 4.8,
    image: '/images/paris.jpg',
  },
  {
    id: 'act-shibuya',
    name: 'Shibuya Night Market Food Walk',
    cityName: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    category: 'Food',
    price: 65,
    duration: '3 hours',
    rating: 4.9,
    image: '/images/tokyo.jpg',
  },
  {
    id: 'act-amalfi-boat',
    name: 'Positano Coastal Boat Cruise',
    cityName: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    category: 'Adventure',
    price: 110,
    duration: '4 hours',
    rating: 4.8,
    image: '/images/amalfi.jpg',
  },
  {
    id: 'act-central-park',
    name: 'Central Park Guided Bike Tour',
    cityName: 'New York',
    country: 'United States',
    region: 'Americas',
    category: 'Sightseeing',
    price: 35,
    duration: '2 hours',
    rating: 4.7,
    image: '/images/newyork.jpg',
  },
  {
    id: 'act-santorini-sunset',
    name: 'Oia Sunset Catamaran & Dinner',
    cityName: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    category: 'Adventure',
    price: 140,
    duration: '5 hours',
    rating: 5.0,
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'act-colosseum',
    name: 'Colosseum Arena Floor & Underground',
    cityName: 'Rome',
    country: 'Italy',
    region: 'Europe',
    category: 'Culture',
    price: 80,
    duration: '3 hours',
    rating: 4.9,
    image: '/images/rome.jpg',
  },
];

export const SearchPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: Cities or Activities
  const [activeTab, setActiveTab] = useState<'cities' | 'activities'>('cities');

  // Search input state (pre-filled from URL query param if present)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Live Backend Data
  const [liveCities, setLiveCities] = useState<CityItem[]>(CITIES_DATA);
  const [liveActivities, setLiveActivities] = useState<ActivitySearchItem[]>(ACTIVITIES_DATA);

  // Filter States
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'Europe' | 'Asia' | 'Americas' | 'India'>('all');
  const [selectedCost, setSelectedCost] = useState<'all' | '$' | '$$' | '$$$'>('all');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'city-newyork': true,
  });

  // Add to Trip Modal State
  const [itemToAdd, setItemToAdd] = useState<{ id: string; name: string; type: 'city' | 'activity' } | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Fetch live backend results when search query changes
  useEffect(() => {
    const fetchLiveResults = async () => {
      if (!searchQuery.trim()) {
        try {
          const popData = await cityApi.getPopularCities(10);
          if (popData?.cities && popData.cities.length > 0) {
            const formatted: CityItem[] = popData.cities.map((c, i) => ({
              id: c.id || `city-pop-${i}`,
              name: c.name,
              country: c.country,
              region: (c.region as 'Europe' | 'Asia' | 'Americas') || 'Europe',
              image: c.image || c.imageUrl || '/images/paris.jpg',
              costLevel: (c.costLevel as '$' | '$$' | '$$$') || '$$',
              rating: 4.8,
              description: c.description || `Explore the beautiful sights and attractions of ${c.name}.`,
            }));
            setLiveCities(formatted);
          }
        } catch {
          // Keep defaults
        }
        return;
      }

      try {
        if (activeTab === 'cities') {
          const res = await cityApi.searchCities(searchQuery.trim());
          if (res?.cities) {
            const formatted: CityItem[] = res.cities.map((c, i) => ({
              id: c.id || `city-live-${i}`,
              name: c.name,
              country: c.country,
              region: (c.region as 'Europe' | 'Asia' | 'Americas') || 'Europe',
              image: c.image || c.imageUrl || '/images/paris.jpg',
              costLevel: (c.costLevel as '$' | '$$' | '$$$') || '$$',
              rating: 4.9,
              description: c.description || `Discover the culture, landmarks, and highlights of ${c.name}, ${c.country}.`,
            }));
            setLiveCities(formatted);
          }
        } else {
          const res = await activityApi.searchActivities({ q: searchQuery.trim() });
          if (res?.activities) {
            const formatted: ActivitySearchItem[] = res.activities.map((a) => ({
              id: a.id,
              name: a.name,
              cityName: (a as unknown as { stop?: { cityName?: string } })?.stop?.cityName || 'Worldwide',
              country: (a as unknown as { stop?: { country?: string } })?.stop?.country || 'Destination',
              region: 'Europe' as const,
              category: (a.category ? (a.category.charAt(0) + a.category.slice(1).toLowerCase()) : 'Culture') as ActivitySearchItem['category'],
              price: Number(a.cost) || 0,
              duration: a.durationMin ? `${a.durationMin} mins` : '2 hours',
              rating: 4.9,
              image: '/images/paris.jpg',
            }));
            setLiveActivities(formatted);
          }
        }
      } catch {
        // Fallback to local filtering
      }
    };

    const timer = setTimeout(fetchLiveResults, 1500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Toggle favorite
  const toggleFavorite = (id: string, name: string) => {
    setFavorites((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        setAddedToast(`Added ${name} to your Saved items!`);
        setTimeout(() => setAddedToast(null), 2500);
      }
      return { ...prev, [id]: nextState };
    });
  };

  // Filtered Cities
  const filteredCities = useMemo(() => {
    return liveCities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' ||
        city.region === selectedRegion ||
        (selectedRegion === 'India' && city.country.toLowerCase() === 'india');
      const matchesCost = selectedCost === 'all' || city.costLevel === selectedCost;
      return matchesSearch && matchesRegion && matchesCost;
    });
  }, [liveCities, searchQuery, selectedRegion, selectedCost]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return liveActivities.filter((act) => {
      const matchesSearch =
        act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' ||
        act.region === selectedRegion ||
        (selectedRegion === 'India' && act.country.toLowerCase() === 'india');
      return matchesSearch && matchesRegion;
    });
  }, [liveActivities, searchQuery, selectedRegion]);

  const handleAddToTripAction = (_tripId: string, tripName: string) => {
    if (!itemToAdd) return;
    setAddedToast(`Added ${itemToAdd.name} to ${tripName}!`);
    setTimeout(() => setAddedToast(null), 2500);
    setItemToAdd(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* SEGMENTED SWITCHER: CITIES vs ACTIVITIES (Centered) */}
        <div className="flex justify-center">
          <div className="bg-slate-200/80 p-1.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('cities')}
              className={`px-8 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === 'cities'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Cities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-8 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === 'activities'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Activities
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS CONTROLS BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'cities'
                  ? 'Search cities...'
                  : 'Search activities (e.g. Museum, Boat tour)...'
              }
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm outline-none transition-all shadow-xs focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Trigger Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Country / Region Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                className={`px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${selectedRegion !== 'all'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>
                  {selectedRegion === 'all'
                    ? 'Country/Region'
                    : `Region: ${selectedRegion}`}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {showRegionDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowRegionDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-fadeIn">
                    {(['all', 'Europe', 'Asia', 'Americas', 'India'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(r);
                          setShowRegionDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span className="capitalize">{r === 'all' ? 'All Regions' : r}</span>
                        {selectedRegion === r && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* More Filters Trigger */}
            <button
              type="button"
              onClick={() => setShowMoreFiltersModal(true)}
              className={`px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${selectedCost !== 'all'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {addedToast && (
          <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg animate-fadeIn max-w-md mx-auto justify-center">
            <Check className="w-4 h-4" />
            <span>{addedToast}</span>
          </div>
        )}

        {/* CONTENT GRID: CITIES TAB */}
        {activeTab === 'cities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => {
              const isFav = !!favorites[city.id];

              return (
                <div
                  key={city.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* City Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Top Right Heart / Save Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(city.id, city.name)}
                      aria-label="Save to favorites"
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 flex items-center justify-center shadow-md backdrop-blur-xs transition-all cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${isFav
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-600 hover:text-red-500'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Bottom Info Row */}
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                        <h3 className="font-heading font-bold text-xl text-slate-900 tracking-tight">
                          {city.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 ml-5 mt-0.5">
                        {city.country}
                      </p>
                    </div>

                    {/* Blue Plus Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setItemToAdd({ id: city.id, name: city.name, type: 'city' })
                      }
                      aria-label={`Add ${city.name} to trip`}
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENT GRID: ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => {
              const isFav = !!favorites[act.id];

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Activity Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={act.image}
                      alt={act.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Category Pill Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {act.category}
                    </div>

                    {/* Top Right Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(act.id, act.name)}
                      aria-label="Save to favorites"
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 flex items-center justify-center shadow-md backdrop-blur-xs transition-all cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${isFav
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-600 hover:text-red-500'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Activity Details & Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight leading-snug">
                        {act.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {act.cityName}, {act.country}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <div>
                        <span className="text-lg font-bold text-slate-900">
                          ${act.price}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          {' '}
                          / person
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setItemToAdd({ id: act.id, name: act.name, type: 'activity' })
                        }
                        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                      >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL: ADD TO TRIP POPUP */}
      {itemToAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Add to Trip
              </h3>
              <button
                type="button"
                onClick={() => setItemToAdd(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Select an existing trip to add <strong>{itemToAdd.name}</strong> or create a new itinerary.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { id: 'trip-1', title: 'European Adventure', dates: 'Oct 12 - Oct 25, 2024' },
                { id: 'trip-2', title: 'Aegean Odyssey', dates: 'Jun 12 - Jun 26, 2024' },
                { id: 'trip-3', title: 'PNW Roadtrip', dates: 'Aug 05 - Aug 20, 2024' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleAddToTripAction(t.id, t.title)}
                  className="w-full p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-blue-700 text-sm">
                      {t.title}
                    </div>
                    <div className="text-xs text-slate-500">{t.dates}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const dest = itemToAdd.name;
                setItemToAdd(null);
                navigate(`/trips/new?destination=${encodeURIComponent(dest)}`);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Trip with this {itemToAdd.type}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: MORE FILTERS */}
      {showMoreFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Filter Destinations
              </h3>
              <button
                type="button"
                onClick={() => setShowMoreFiltersModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Cost Tier Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Budget Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['all', '$', '$$', '$$$'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedCost(tier)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${selectedCost === tier
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {tier === 'all' ? 'All' : tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Geographic Region Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Region
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'Europe', 'Asia', 'Americas', 'India'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRegion(r)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${selectedRegion === r
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {r === 'all' ? 'All' : r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedCost('all');
                  setSelectedRegion('all');
                  setShowMoreFiltersModal(false);
                }}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowMoreFiltersModal(false)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
              >
                Apply Filters
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

export default SearchPage;
