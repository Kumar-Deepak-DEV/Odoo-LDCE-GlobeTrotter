import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  DollarSign,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Star,
  CheckCircle2,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { VoyagoLogo } from '../../components/ui/VoyagoLogo';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

interface FeaturedCity {
  name: string;
  country: string;
  image: string;
  tag: string;
  rating: number;
  reviews: number;
  description: string;
}

const FEATURED_DESTINATIONS: FeaturedCity[] = [
  {
    name: 'Paris',
    country: 'France',
    image: '/images/paris.jpg',
    tag: 'Culture & Romance',
    rating: 4.9,
    reviews: 1420,
    description: 'Iconic architecture, world-class art museums, and charming sidewalk bistros.',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: '/images/tokyo.jpg',
    tag: 'Futuristic & Ancient',
    rating: 5.0,
    reviews: 2180,
    description: 'Neon skyscrapers, ancient temples, tranquil gardens, and culinary masterpieces.',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: '/images/bali.jpg',
    tag: 'Tropical Paradise',
    rating: 4.8,
    reviews: 1890,
    description: 'Emerald rice terraces, pristine beaches, sacred temples, and serene wellness retreats.',
  },
  {
    name: 'Rome',
    country: 'Italy',
    image: '/images/rome.jpg',
    tag: 'Historic Wonder',
    rating: 4.9,
    reviews: 1650,
    description: 'Colosseum ruins, Vatican treasures, Renaissance plazas, and unforgettable gelato.',
  },
  {
    name: 'New York',
    country: 'United States',
    image: '/images/newyork.jpg',
    tag: 'Metropolitan Energy',
    rating: 4.7,
    reviews: 3100,
    description: 'Broadway shows, Central Park strolls, world-famous skyline views, and endless culture.',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    image: '/images/london.jpg',
    tag: 'Royal Heritage',
    rating: 4.8,
    reviews: 2450,
    description: 'Historic landmarks, scenic Thames cruises, West End theaters, and royal parks.',
  },
];

export const LandingPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, isAdmin } = useAuth();
  const [demoLoading, setDemoLoading] = useState<'user' | 'admin' | null>(null);

  const handleQuickDemoLogin = async (type: 'user' | 'admin') => {
    setDemoLoading(type);
    try {
      const email = type === 'user' ? 'demo@globetrotter.com' : 'admin@globetrotter.com';
      const password = type === 'user' ? 'Demo@2024' : 'Admin@2024';

      const data = await authApi.login({ email, password });
      if (data?.token && data?.user) {
        login(data.token, data.user);
        const destination = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
        navigate(destination);
      }
    } catch {
      // Fallback redirect to login
      navigate('/login');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-body selection:bg-blue-500 selection:text-white flex flex-col">
      {/* FLOATING HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <VoyagoLogo variant="light" size="md" />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#destinations" className="hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link to="/community" className="hover:text-white transition-colors">
              Community
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Go to App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-300 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Generation Travel & Itinerary Planning</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.12]">
              The intelligent way to plan, budget & share your dream journeys.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
              Create multi-city itineraries in minutes, get instant budget breakdowns, visualize schedules on interactive calendars, and discover guides from real travelers worldwide.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/signup'}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>Start Planning for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/15 font-bold text-base rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Your Account</span>
              </Link>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="pt-6">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider">
                  ⚡ 1-Click Demo Login:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('user')}
                    disabled={demoLoading !== null}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{demoLoading === 'user' ? 'Signing In...' : 'Traveler Demo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    disabled={demoLoading !== null}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{demoLoading === 'admin' ? 'Signing In...' : 'Admin Demo'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup Grid */}
          <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-800/80 border border-white/10 p-6 shadow-2xl group hover:border-blue-500/40 transition-all">
              <div className="h-44 rounded-2xl overflow-hidden mb-4 relative">
                <img
                  src="/images/adventure-mountain.jpg"
                  alt="Canadian Rockies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-bold text-teal-300 border border-white/20">
                  🏔️ Multi-City Explorer
                </div>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Banff & Canadian Rockies
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                7 Days • 3 Stops • $1,850 Estimated
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Auto-organized Day Schedule</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-800/80 border border-white/10 p-6 shadow-2xl group hover:border-blue-500/40 transition-all md:-translate-y-4">
              <div className="h-44 rounded-2xl overflow-hidden mb-4 relative">
                <img
                  src="/images/adventure-dolomites.jpg"
                  alt="Italian Dolomites"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/20">
                  💶 Smart Budget Estimator
                </div>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Dolomites Alpine Discovery
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                5 Days • 4 Stops • $2,200 Total
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Real-Time Expense Breakdown</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-800/80 border border-white/10 p-6 shadow-2xl group hover:border-blue-500/40 transition-all">
              <div className="h-44 rounded-2xl overflow-hidden mb-4 relative">
                <img
                  src="/images/adventure-coastal.jpg"
                  alt="Nusa Penida"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-bold text-purple-300 border border-white/20">
                  🌐 1-Click Public Itinerary
                </div>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Bali & Island Hop Escape
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                10 Days • 6 Stops • $1,400 Total
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Share with Friends & Buddies</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-950 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
              Powerful Travel Engine
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Everything you need to craft unforgettable trips
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-heading text-white mb-2">
                Multi-City Itineraries
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add multiple stops, rearrange city order, customize date ranges, and log specific daily activities seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-heading text-white mb-2">
                Smart Budget Estimator
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Get auto-calculated budgets categorized by flights, lodging, meals, and adventures with interactive breakdown charts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-heading text-white mb-2">
                Visual Trip Calendar
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                View all your ongoing and upcoming vacations plotted neatly on a full-month interactive schedule.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold font-heading text-white mb-2">
                Share & Community
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Publish trips with secure share slugs, clone community travel guides, and connect with fellow explorers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS GRID */}
      <section id="destinations" className="py-20 bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                Curated Regional Highlights
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                Featured Global Destinations
              </h3>
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
            >
              <span>Explore all cities</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                className="group relative rounded-3xl overflow-hidden bg-slate-800 border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-xl flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                    {dest.tag}
                  </div>
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-900 text-xs font-extrabold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-slate-900" />
                    <span>{dest.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xl font-bold font-heading text-white">
                        {dest.name}
                      </h4>
                      <span className="text-xs font-medium text-slate-400">
                        {dest.country}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {dest.reviews.toLocaleString()} traveler ratings
                    </span>
                    <Link
                      to="/login"
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Plan Visit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
              Effortless 3-Step Flow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              How GlobeTrotter Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 relative">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold font-heading text-lg flex items-center justify-center mb-6">
                1
              </div>
              <h4 className="text-xl font-bold font-heading text-white mb-2">
                Choose Your Stops
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select your destinations, specify travel dates, and build your route across multiple cities effortlessly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 relative">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white font-bold font-heading text-lg flex items-center justify-center mb-6">
                2
              </div>
              <h4 className="text-xl font-bold font-heading text-white mb-2">
                Build Daily Activities
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add sightseeing, food, adventure, and wellness activities. GlobeTrotter auto-estimates and tracks your total budget.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 relative">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-bold font-heading text-lg flex items-center justify-center mb-6">
                3
              </div>
              <h4 className="text-xl font-bold font-heading text-white mb-2">
                Travel & Share
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sync with your calendar, navigate your day-by-day itinerary on any device, and publish read-only links for friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
            Ready to plan your next great adventure?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of travelers crafting smart, budget-conscious, and beautiful itineraries today.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-blue-700 hover:bg-slate-100 font-bold text-base rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-base rounded-2xl transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-white/10 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <VoyagoLogo variant="light" size="sm" />
            <span className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="hover:text-white transition-colors">
              Support
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
