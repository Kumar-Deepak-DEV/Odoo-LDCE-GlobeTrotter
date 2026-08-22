import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  MapPin,
  Clock,
  Heart,
  Bookmark,
  Copy,
  Star,
  Check,
  Calendar,
  X,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CommunityNav } from './components/CommunityNav';

interface PublicGuide {
  id: string;
  title: string;
  destination: string;
  country: string;
  region: 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania';
  durationDays: number;
  estimatedBudget: string;
  category: 'Adventure' | 'Culture & Food' | 'Romantic' | 'Budget' | 'Solo Explorer';
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    tripsCount: number;
    isVerified?: boolean;
  };
  rating: number;
  reviewsCount: number;
  clonesCount: number;
  likesCount: number;
  highlights: string[];
  daysOverview: { day: number; title: string; activities: string[] }[];
}

const COMMUNITY_GUIDES: PublicGuide[] = [
  {
    id: 'guide-1',
    title: '7 Days in Hokkaido: Powder Snow, Onsens & Ramen',
    destination: 'Sapporo & Niseko',
    country: 'Japan',
    region: 'Asia',
    durationDays: 7,
    estimatedBudget: '$1,400 - $1,900',
    category: 'Adventure',
    coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1000&auto=format&fit=crop&q=80',
    author: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tripsCount: 24,
      isVerified: true,
    },
    rating: 4.95,
    reviewsCount: 84,
    clonesCount: 612,
    likesCount: 340,
    highlights: ['Niseko Backcountry Skiing', 'Otaru Canal Night Walk', 'Noboribetsu Hell Valley Onsen', 'Sapporo Ramen Alley'],
    daysOverview: [
      { day: 1, title: 'Arrival in Sapporo & Ramen Alley', activities: ['Check-in at Susukino', 'Ganso Ramen Yokocho tasting', 'Odori Park night walk'] },
      { day: 2, title: 'Historic Otaru Day Excursion', activities: ['Otaru Canal stroll', 'Music Box Museum', 'Fresh seafood at Sankaku Market'] },
      { day: 3, title: 'Transfer to Niseko Ski Resort', activities: ['Shuttle to Grand Hirafu', 'Night powder skiing', 'Local soba dinner'] },
      { day: 4, title: 'Full Day Mount Yotei Trails', activities: ['Backcountry ski tour', 'Thermal springs at Onsen', 'Izakaya gathering'] },
      { day: 5, title: 'Noboribetsu Thermal Valley', activities: ['Jigokudani volcanic crater walk', 'Oyunuma natural footbath'] },
      { day: 6, title: 'Lake Toya Scenic Views', activities: ['Mount Usu Ropeway', 'Lakeside onsen retreat', 'Traditional Kaiseki dinner'] },
      { day: 7, title: 'Souvenir Shopping & Departure', activities: ['New Chitose Airport Royce Chocolate World', 'Flight home'] },
    ],
  },
  {
    id: 'guide-2',
    title: 'Amalfi Coast on a Budget: Ferries, Paths & Pasta',
    destination: 'Positano, Amalfi & Capri',
    country: 'Italy',
    region: 'Europe',
    durationDays: 5,
    estimatedBudget: '$850 - $1,200',
    category: 'Budget',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80',
    author: {
      name: 'Giulia Conti',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tripsCount: 19,
      isVerified: true,
    },
    rating: 4.88,
    reviewsCount: 128,
    clonesCount: 890,
    likesCount: 520,
    highlights: ['Path of the Gods Hike', 'Ferry to Capri Island', 'Cliffside Lemon Groves', 'Local Trattoria Dinners'],
    daysOverview: [
      { day: 1, title: 'Arrival in Sorrento Base', activities: ['Check-in at boutique hostel', 'Sunset spritz at Marina Grande', 'Gnocchi alla Sorrentina'] },
      { day: 2, title: 'Hike the Path of the Gods', activities: ['Bomerano to Nocelle panoramic trek', 'Descend 1700 steps to Positano', 'Beach swim'] },
      { day: 3, title: 'Amalfi & Ravello Gardens', activities: ['Ferry to Amalfi town', 'Villa Cimbrone infinity terrace in Ravello', 'Lemon sorbet tasting'] },
      { day: 4, title: 'Day Trip to Capri Island', activities: ['Early morning hydrofoil', 'Faraglioni rock photo cruise', 'Anacapri chairlift to Monte Solaro'] },
      { day: 5, title: 'Fiordo di Furore & Farewell', activities: ['Hidden fjord photo stop', 'Final handmade pasta lunch', 'Train departure'] },
    ],
  },
  {
    id: 'guide-3',
    title: 'Vietnam North to South: Street Food & Limestone Karsts',
    destination: 'Hanoi, Ha Long Bay, Hoi An',
    country: 'Vietnam',
    region: 'Asia',
    durationDays: 10,
    estimatedBudget: '$650 - $950',
    category: 'Culture & Food',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&auto=format&fit=crop&q=80',
    author: {
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      tripsCount: 31,
    },
    rating: 4.92,
    reviewsCount: 96,
    clonesCount: 745,
    likesCount: 410,
    highlights: ['Egg Coffee in Hanoi Old Quarter', 'Overnight Ha Long Cruise', 'Lantern-lit Hoi An Night Market', 'Ninh Binh River Rowboats'],
    daysOverview: [
      { day: 1, title: 'Hanoi Old Quarter Street Food Crawl', activities: ['Banh Mi 25', 'Train Street experience', 'Egg coffee at Cafe Giang'] },
      { day: 2, title: 'Hanoi Culture & French Quarter', activities: ['Temple of Literature', 'Hoan Kiem Lake walk', 'Water Puppet Theatre'] },
      { day: 3, title: 'Ha Long Bay Overnight Cruise', activities: ['Board traditional junk boat', 'Kayak through Sung Sot Cave', 'Sunset on deck'] },
      { day: 4, title: 'Lan Ha Bay & Return to Hanoi', activities: ['Tai Chi at sunrise', 'Floating pearl farm visit', 'Night sleeper train to Da Nang'] },
      { day: 5, title: 'Welcome to Ancient Hoi An', activities: ['Japanese Covered Bridge', 'Tailor-made suit fittings', 'Riverside lantern release'] },
      { day: 6, title: 'Hoi An Cooking Class & Basket Boats', activities: ['Tra Que vegetable village', 'Coconut palm river boat spin', 'Spring roll masterclass'] },
      { day: 7, title: 'My Son Sanctuary & An Bang Beach', activities: ['UNESCO Cham ruins morning visit', 'Afternoon beach lounging with fresh coconut'] },
      { day: 8, title: 'Fly to Ho Chi Minh City', activities: ['Ben Thanh Market haggling', 'War Remnants Museum', 'Rooftop cocktail bar'] },
      { day: 9, title: 'Mekong Delta River Exploration', activities: ['Cai Rang floating market', 'Tropical fruit orchard tour', 'Sampan boat canal glide'] },
      { day: 10, title: 'Last Pho & Departure', activities: ['Pho Hoa Pasteur breakfast', 'Saigon Central Post Office', 'Airport transfer'] },
    ],
  },
  {
    id: 'guide-4',
    title: 'Iceland South Coast Solo Roadtrip & Waterfalls',
    destination: 'Reykjavik, Vik, Jokulsarlon',
    country: 'Iceland',
    region: 'Europe',
    durationDays: 6,
    estimatedBudget: '$1,300 - $1,800',
    category: 'Solo Explorer',
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1000&auto=format&fit=crop&q=80',
    author: {
      name: 'Freja Lindqvist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      tripsCount: 15,
      isVerified: true,
    },
    rating: 4.97,
    reviewsCount: 142,
    clonesCount: 1120,
    likesCount: 680,
    highlights: ['Seljalandsfoss Walk-Behind Waterfall', 'Reynisfjara Black Sand Beach', 'Diamond Beach Icebergs', 'Blue Lagoon Geothermal Spa'],
    daysOverview: [
      { day: 1, title: 'Golden Circle Route', activities: ['Thingvellir tectonic rift', 'Geysir hot springs eruption', 'Gullfoss thunderous waterfall'] },
      { day: 2, title: 'South Coast Waterfall Trail', activities: ['Seljalandsfoss waterfall cavern', 'Skogafoss staircase climb', 'Skogar folk museum'] },
      { day: 3, title: 'Vik & Black Sand Columns', activities: ['Reynisfjara basalt columns', 'Dyrholaey lighthouse viewpoint', 'Puffin birdwatching'] },
      { day: 4, title: 'Glacier Lagoon & Diamond Ice', activities: ['Jokulsarlon zodiac boat tour', 'Diamond Beach glittering crystal ice', 'Canyon hike'] },
      { day: 5, title: 'Skaftafell Glacier Trek', activities: ['Crampon glacier hike with guide', 'Svartifoss basalt waterfall', 'Drive back to Reykjavik'] },
      { day: 6, title: 'Blue Lagoon Spa & Departure', activities: ['Geothermal silica mud mask', 'Hallgrimskirkja tower views', 'Keflavik departure'] },
    ],
  },
  {
    id: 'guide-5',
    title: 'Peruvian Andes: Cusco, Sacred Valley & Inca Trail',
    destination: 'Cusco & Machu Picchu',
    country: 'Peru',
    region: 'Americas',
    durationDays: 8,
    estimatedBudget: '$900 - $1,350',
    category: 'Adventure',
    coverImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&auto=format&fit=crop&q=80',
    author: {
      name: 'Mateo Morales',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      tripsCount: 22,
    },
    rating: 4.91,
    reviewsCount: 67,
    clonesCount: 430,
    likesCount: 295,
    highlights: ['Sunrise at Machu Picchu', 'Sacred Valley Salt Mines', 'Rainbow Mountain High Trek', 'San Pedro Food Market'],
    daysOverview: [
      { day: 1, title: 'Acclimatizing in Imperial Cusco', activities: ['Plaza de Armas walk', 'Coca tea tasting', 'San Pedro traditional market'] },
      { day: 2, title: 'Sacred Valley of the Incas', activities: ['Pisac market & ruins', 'Ollantaytambo stone fortress', 'Maras salt pans'] },
      { day: 3, title: 'Inca Trail Day 1: Kilometer 82', activities: ['Pass through checkpoint', 'Patallacta ancient ruins', 'Camp along the Cusichaca river'] },
      { day: 4, title: 'Inca Trail Day 2: Dead Woman Pass', activities: ['Climb to Warmiwañusqa (4,215m)', 'Descent to Pacaymayo valley camp'] },
      { day: 5, title: 'Inca Trail Day 3: Cloud Forests', activities: ['Runkurakay & Sayacmarca ruins', 'Wiñay Wayna orchid campsite'] },
      { day: 6, title: 'Machu Picchu Sun Gate Sunrise', activities: ['Inti Punku sunrise view', 'Guided citadel exploration', 'Scenic train back to Ollantaytambo'] },
      { day: 7, title: 'Vinicunca Rainbow Mountain Trek', activities: ['Early alpine start', 'Summit view at 5,036m', 'Red Valley descent'] },
      { day: 8, title: 'Cusco Artisan Shopping & Flight', activities: ['San Blas artisan quarter', 'Peruvian alpaca souvenirs', 'Flight to Lima'] },
    ],
  },
  {
    id: 'guide-6',
    title: 'Romantic Provence: Lavender Fields, Vineyards & Coast',
    destination: 'Aix-en-Provence, Luberon & Cassis',
    country: 'France',
    region: 'Europe',
    durationDays: 6,
    estimatedBudget: '$1,200 - $1,750',
    category: 'Romantic',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&auto=format&fit=crop&q=80',
    author: {
      name: 'Claire Dupont',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tripsCount: 18,
      isVerified: true,
    },
    rating: 4.89,
    reviewsCount: 73,
    clonesCount: 512,
    likesCount: 380,
    highlights: ['Valensole Lavender Fields', 'Calanques Boat Tour in Cassis', 'Gordes Hilltop Village', 'Chateauneuf-du-Pape Wine Tour'],
    daysOverview: [
      { day: 1, title: 'Arrival in Aix-en-Provence', activities: ['Cours Mirabeau stroll', 'Paul Cézanne studio visit', 'Provençal dinner under plane trees'] },
      { day: 2, title: 'Luberon Hilltop Villages', activities: ['Gordes panoramic village', 'Roussillon red ochre trail', 'Abbey of Senanque'] },
      { day: 3, title: 'Lavender Plateau of Valensole', activities: ['Purple bloom photoshoot', 'Artisan lavender honey & oil distilleries', 'Moustiers-Sainte-Marie'] },
      { day: 4, title: 'Verdon Gorge Canyon Kayak', activities: ['Electric boat hire on Lake of Sainte-Croix', 'Turquoise gorge cliff paddling'] },
      { day: 5, title: 'Coastal Cassis & Calanques Fjords', activities: ['Boat cruise into limestone calanques', 'Seafood lunch at the harbor', 'Cap Canaille sunset'] },
      { day: 6, title: 'Final Farmers Market & Departure', activities: ['Aix morning cheese & olive market', 'Marseille airport transfer'] },
    ],
  },
];

export const CommunityGuidesPage: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'cloned' | 'rated'>('popular');
  const [savedGuideIds, setSavedGuideIds] = useState<Record<string, boolean>>({});
  const [likedGuideIds, setLikedGuideIds] = useState<Record<string, boolean>>({});

  // Active Guide Preview Modal
  const [previewGuide, setPreviewGuide] = useState<PublicGuide | null>(null);
  const [cloneSuccessToast, setCloneSuccessToast] = useState<string | null>(null);

  const regions = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
  const categories = ['All', 'Adventure', 'Culture & Food', 'Romantic', 'Budget', 'Solo Explorer'];

  const filteredGuides = useMemo(() => {
    return COMMUNITY_GUIDES.filter((guide) => {
      const matchRegion = selectedRegion === 'All' || guide.region === selectedRegion;
      const matchCategory = selectedCategory === 'All' || guide.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchRegion && matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'cloned') return b.clonesCount - a.clonesCount;
      if (sortBy === 'rated') return b.rating - a.rating;
      return b.likesCount - a.likesCount;
    });
  }, [selectedRegion, selectedCategory, searchQuery, sortBy]);

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedGuideIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedGuideIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCloneGuide = (guide: PublicGuide, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Clone into localStorage custom trips
    const newTrip = {
      id: `trip-cloned-${Date.now()}`,
      name: `${guide.title}`,
      title: `${guide.title}`,
      destination: guide.destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + guide.durationDays * 86400000).toISOString().split('T')[0],
      isPublic: false,
      coverPhotoUrl: guide.coverImage,
      stops: guide.daysOverview.flatMap((d) => d.activities),
    };

    try {
      const current = JSON.parse(localStorage.getItem('globetrotter_custom_trips') || '[]');
      localStorage.setItem('globetrotter_custom_trips', JSON.stringify([newTrip, ...current]));
    } catch {
      // ignore
    }

    setCloneSuccessToast(`"${guide.title}" cloned to your trips!`);
    setTimeout(() => {
      setCloneSuccessToast(null);
      navigate('/trips');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <CommunityNav />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-12 sm:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Community Curated Itineraries</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-3 text-white">
            Explore & Clone Real Travel Guides
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Don't start from scratch. Discover day-by-day itineraries mapped by experienced globetrotters, with authentic stops, budget breakdowns, and 1-click cloning.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by destination (e.g. Japan, Italy, Amalfi, skiing, budget)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl shadow-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/20 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
              Region:
            </span>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Vibe & Sort Selectors */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Style:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="cloned">Most Cloned</option>
                <option value="rated">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clone Toast Notice */}
        {cloneSuccessToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between animate-fadeIn sticky top-36 z-40">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{cloneSuccessToast}</span>
            </div>
            <span className="text-xs text-emerald-100">Redirecting to Trips...</span>
          </div>
        )}

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg text-slate-800">No matching guides found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => {
              const isSaved = !!savedGuideIds[guide.id];
              const isLiked = !!likedGuideIds[guide.id];

              return (
                <div
                  key={guide.id}
                  onClick={() => setPreviewGuide(guide)}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  {/* Top Image Box */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badges on Image */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>{guide.durationDays} Days</span>
                      </span>
                      <span className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-xs">
                        {guide.category}
                      </span>
                    </div>

                    {/* Action Buttons on Image */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(guide.id, e)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                          isLiked ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                        title="Like Guide"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(guide.id, e)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                          isSaved ? 'bg-amber-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                        }`}
                        title="Save Bookmark"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Location Badge bottom of Image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>
                          {guide.destination}, {guide.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{guide.rating.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={guide.author.avatar}
                          alt={guide.author.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {guide.author.name}
                        </span>
                        {guide.author.isVerified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto">
                          {guide.clonesCount} clones
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {guide.title}
                      </h3>

                      {/* Highlights Pill Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {guide.highlights.slice(0, 3).map((hl, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-slate-800">{guide.estimatedBudget}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCloneGuide(guide, e)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Clone Itinerary</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Preview Itinerary Modal */}
        {previewGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {previewGuide.durationDays} Days Guide
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {previewGuide.destination}, {previewGuide.country}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
                    {previewGuide.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewGuide(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Author and Stats */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={previewGuide.author.avatar}
                    alt={previewGuide.author.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{previewGuide.author.name}</span>
                      {previewGuide.author.isVerified && <span className="text-blue-600 text-xs">✓</span>}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {previewGuide.author.tripsCount} published trips
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-slate-800">{previewGuide.estimatedBudget}</div>
                  <span className="text-[11px] text-slate-400">Estimated budget</span>
                </div>
              </div>

              {/* Day by Day Breakdown */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Day-by-Day Schedule</span>
                </h3>

                <div className="space-y-3">
                  {previewGuide.daysOverview.map((day) => (
                    <div
                      key={day.day}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
                          Day {day.day}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{day.title}</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                        {day.activities.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTAs */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewGuide(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleCloneGuide(previewGuide)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Clone to My Itineraries</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CommunityGuidesPage;
