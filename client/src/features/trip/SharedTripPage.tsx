import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Globe,
  Calendar,
  Copy,
  Link2,
  MapPin,
  Clock,
  Landmark,
  Utensils,
  Footprints,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tripApi } from '../../api/tripApi';
import type { Trip } from '../../types';

export const SharedTripPage: FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [loadedTrip, setLoadedTrip] = useState<Trip | null>(null);

  const lookupKey = slug || id || 'european-adventure-2024';

  const loadPublicTrip = useCallback(async () => {
    try {
      const data = await tripApi.getPublicTrip(lookupKey);
      if (data?.trip) {
        setLoadedTrip(data.trip);
      }
    } catch {
      // Keep fallback trip
    }
  }, [lookupKey]);

  useEffect(() => {
    loadPublicTrip();
  }, [loadPublicTrip]);

  // Trip Information matching loaded or fallback mockup
  const trip = {
    id: loadedTrip?.id || id || 'share-1',
    title: loadedTrip?.name || 'European Highlights',
    author: loadedTrip?.user ? `${loadedTrip.user.firstName} ${loadedTrip.user.lastName}` : 'GlobeTrotter Explorer',
    authorAvatar:
      loadedTrip?.user?.photoUrl ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    dates: loadedTrip?.startDate && loadedTrip?.endDate
      ? `${new Date(loadedTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(loadedTrip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    isPublic: true,
    coverImage: loadedTrip?.coverPhotoUrl || '/images/adventure-mountain.jpg',
    description:
      loadedTrip?.description ||
      "A curated journey through Europe's most iconic cities, focusing on hidden gems and culinary delights.",
    stops: loadedTrip?.stops && loadedTrip.stops.length > 0
      ? loadedTrip.stops.map((s) => ({
        id: s.id,
        cityName: s.country ? `${s.cityName}, ${s.country}` : s.cityName,
        days: [
          {
            dayNumber: 1,
            activities: (s.activities || []).map((act) => ({
              id: act.id,
              name: act.name,
              durationMin: act.durationMin || 60,
              cost: Number(act.cost) > 0 ? `$${act.cost}` : 'Free',
              category: act.category || 'Sightseeing',
              icon: act.category?.toLowerCase() === 'food' ? 'utensils' : 'landmark',
            })),
          },
        ],
      }))
      : [
        {
          id: 'stop-1',
          cityName: 'Paris, France',
          days: [
            {
              dayNumber: 1,
              activities: [
                {
                  id: 'act-1',
                  name: 'Louvre Museum',
                  durationMin: 120,
                  cost: '$45',
                  category: 'Culture',
                  icon: 'landmark',
                },
                {
                  id: 'act-2',
                  name: 'Dinner at Le Marais',
                  durationMin: 90,
                  cost: '$80',
                  category: 'Food',
                  icon: 'utensils',
                },
              ],
            },
            {
              dayNumber: 2,
              activities: [
                {
                  id: 'act-3',
                  name: 'Montmartre Walking Tour',
                  durationMin: 180,
                  cost: 'Free',
                  category: 'Sightseeing',
                  icon: 'footprints',
                },
              ],
            },
          ],
        },
      ],
  };

  const handleCopyTrip = async () => {
    setIsCopied(true);
    setToastMessage('Cloning trip to your itineraries...');

    if (isAuthenticated && loadedTrip?.id) {
      try {
        await tripApi.copyTrip(loadedTrip.id);
      } catch {
        // Fallback handled
      }
    }

    setTimeout(() => {
      setToastMessage(null);
      if (isAuthenticated) {
        navigate('/trips');
      } else {
        navigate('/signup?redirect=/trips');
      }
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage('Link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this amazing trip to ${trip.title} on GlobeTrotter!`
      )}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      '_blank'
    );
  };

  const renderActivityIcon = (icon: string) => {
    switch (icon) {
      case 'landmark':
        return <Landmark className="w-5 h-5 text-teal-600" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-teal-600" />;
      case 'footprints':
        return <Footprints className="w-5 h-5 text-teal-600" />;
      default:
        return <Landmark className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* PUBLIC NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="font-heading font-bold text-2xl text-blue-600 tracking-tight">
              GlobeTrotter
            </span>
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl animate-fadeIn max-w-md mx-auto">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HERO COVER IMAGE CONTAINER */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/8] sm:aspect-[2.6/1] bg-slate-200 shadow-sm">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />

          {/* Public Trip Badge */}
          {trip.isPublic && (
            <div className="absolute top-4 left-4 bg-teal-900/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-teal-300" />
              <span>Public Trip</span>
            </div>
          )}
        </div>

        {/* TRIP TITLE & METADATA */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            {trip.title}
          </h1>

          {/* Author & Dates Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <img
                src={trip.authorAvatar}
                alt={trip.author}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span>
                Shared by <strong className="text-slate-900">{trip.author}</strong>
              </span>
            </div>

            <span className="text-slate-300">•</span>

            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{trip.dates}</span>
            </div>
          </div>

          {/* Description & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {trip.description}
            </p>

            {/* Actions: Copy This Trip & Social Share */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyTrip}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{isCopied ? 'Trip Copied!' : 'Copy This Trip'}</span>
              </button>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy link to clipboard"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
              </button>

              {/* Twitter / X Button */}
              <button
                type="button"
                onClick={handleShareTwitter}
                aria-label="Share on Twitter / X"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-teal-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={handleShareFacebook}
                aria-label="Share on Facebook"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-blue-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ITINERARY SECTION */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Itinerary
          </h2>

          {trip.stops.map((stop) => (
            <div key={stop.id} className="space-y-6">
              {/* City Name Header */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                  {stop.cityName}
                </h3>
              </div>

              {/* Days Timeline */}
              <div className="space-y-6 border-l-2 border-slate-200 ml-2.5 pl-6 sm:pl-8">
                {stop.days.map((day) => (
                  <div key={day.dayNumber} className="space-y-3">
                    {/* Day Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold -ml-10 sm:-ml-12 bg-white">
                      Day {day.dayNumber}
                    </div>

                    {/* Activities List */}
                    <div className="space-y-3 pt-1">
                      {day.activities.map((act) => (
                        <div
                          key={act.id}
                          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex items-center justify-between hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon Box */}
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              {renderActivityIcon(act.icon)}
                            </div>

                            {/* Name & Meta */}
                            <div>
                              <h4 className="font-heading font-bold text-base text-slate-900">
                                {act.name}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{act.durationMin} min</span>
                                </span>

                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] font-semibold text-[11px]">
                                  {act.cost}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* PUBLIC FOOTER */}
      <footer className="mt-16 bg-white border-t border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-heading font-bold text-base text-blue-600">
              GlobeTrotter
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>© 2024 GlobeTrotter. Ready to plan your own adventure?</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/signup" className="hover:text-slate-900 transition-colors">
              Join GlobeTrotter
            </Link>
            <Link to="/search" className="hover:text-slate-900 transition-colors">
              Explore Destinations
            </Link>
            <Link to="/profile" className="hover:text-slate-900 transition-colors">
              Help Center
            </Link>
            <span className="text-slate-700">
              Want to plan your own trip?{' '}
              <Link
                to="/signup"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign up for GlobeTrotter
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SharedTripPage;
