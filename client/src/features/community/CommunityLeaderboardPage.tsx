import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Search,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CommunityNav } from './components/CommunityNav';

interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  homeCountry: string;
  badgeTitle: string;
  level: number;
  xp: number;
  countriesCount: number;
  guidesCount: number;
  clonesCount: number;
  specialty: string;
}

const TOP_VOYAGERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Elena Rostova',
    handle: '@elena_wanderer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'Norway 🇳🇴',
    badgeTitle: 'Grand Explorer',
    level: 42,
    xp: 28450,
    countriesCount: 54,
    guidesCount: 38,
    clonesCount: 4120,
    specialty: 'Nordic & Alpine Expeditions',
  },
  {
    rank: 2,
    name: 'Marcus Chen',
    handle: '@marcus_tours',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'Singapore 🇸🇬',
    badgeTitle: 'Master Route Maker',
    level: 38,
    xp: 24190,
    countriesCount: 46,
    guidesCount: 29,
    clonesCount: 3580,
    specialty: 'Asia Street Food & Island Hopping',
  },
  {
    rank: 3,
    name: 'Sofia Alvarez',
    handle: '@sofia_travels',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'Spain 🇪🇸',
    badgeTitle: 'Cultural Curator',
    level: 35,
    xp: 21800,
    countriesCount: 39,
    guidesCount: 25,
    clonesCount: 2940,
    specialty: 'Historic European Itineraries',
  },
  {
    rank: 4,
    name: 'Kenji Sato',
    handle: '@kenji_japan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'Japan 🇯🇵',
    badgeTitle: 'Powder Guide',
    level: 31,
    xp: 18600,
    countriesCount: 28,
    guidesCount: 21,
    clonesCount: 2450,
    specialty: 'Skiing & Hot Springs',
  },
  {
    rank: 5,
    name: 'Sarah Jenkins',
    handle: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'United Kingdom 🇬🇧',
    badgeTitle: 'Solo Pioneer',
    level: 29,
    xp: 16900,
    countriesCount: 32,
    guidesCount: 18,
    clonesCount: 1980,
    specialty: 'Budget Solo Backpacker',
  },
  {
    rank: 6,
    name: 'Mateo Morales',
    handle: '@mateo_andes',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'Peru 🇵🇪',
    badgeTitle: 'Trek Leader',
    level: 27,
    xp: 15400,
    countriesCount: 22,
    guidesCount: 16,
    clonesCount: 1640,
    specialty: 'Andean Mountain Trails',
  },
  {
    rank: 7,
    name: 'Freja Lindqvist',
    handle: '@freja_nordic',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'Sweden 🇸🇪',
    badgeTitle: 'Arctic Nomad',
    level: 26,
    xp: 14200,
    countriesCount: 25,
    guidesCount: 14,
    clonesCount: 1490,
    specialty: 'Northern Lights & Roadtrips',
  },
  {
    rank: 8,
    name: 'Aarav Patel',
    handle: '@aarav_voyage',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    homeCountry: 'India 🇮🇳',
    badgeTitle: 'Heritage Scout',
    level: 24,
    xp: 12800,
    countriesCount: 21,
    guidesCount: 12,
    clonesCount: 1210,
    specialty: 'Cultural Monasteries & Architecture',
  },
];

export const CommunityLeaderboardPage: FC = () => {
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'rising'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const handleToggleFollow = (handle: string) => {
    setFollowingMap((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  const filteredUsers = TOP_VOYAGERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.homeCountry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = TOP_VOYAGERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <CommunityNav />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white py-14 sm:py-18">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Voyager Hall of Fame</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-3 text-white">
            Top Curators & Globetrotters
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Recognizing the most inspiring travelers sharing master itineraries, helpful tips, and secret spots across the world.
          </p>

          {/* Timeframe Selector */}
          <div className="inline-flex items-center p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
            {(['all', 'monthly', 'rising'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                  timeframe === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All-Time Leaders' : t === 'monthly' ? 'This Month' : 'Rising Voyagers'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-12">
        {/* Top 3 Podium Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          {/* Rank 2 (Silver) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center shadow-xs order-2 md:order-1 hover:shadow-lg transition-all relative">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-extrabold text-sm flex items-center justify-center mx-auto -mt-10 mb-3 shadow-sm">
              2
            </div>
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden ring-4 ring-slate-200 shadow-md">
              <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {top3[1].badgeTitle}
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 mt-2 mb-0.5">{top3[1].name}</h3>
            <p className="text-xs text-slate-400">{top3[1].handle} • {top3[1].homeCountry}</p>

            <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 rounded-2xl text-center text-xs">
              <div>
                <div className="font-extrabold text-slate-900">{top3[1].xp.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">XP</div>
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{top3[1].countriesCount}</div>
                <div className="text-[10px] text-slate-400">Countries</div>
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{top3[1].clonesCount}</div>
                <div className="text-[10px] text-slate-400">Clones</div>
              </div>
            </div>

            <button
              onClick={() => handleToggleFollow(top3[1].handle)}
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                followingMap[top3[1].handle]
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
              }`}
            >
              {followingMap[top3[1].handle] ? 'Following' : '+ Follow Curator'}
            </button>
          </div>

          {/* Rank 1 (Gold - Elevated) */}
          <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-400 p-7 text-center shadow-xl order-1 md:order-2 md:-mt-6 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 font-extrabold text-base flex items-center justify-center mx-auto -mt-12 mb-3 shadow-md">
              👑 1
            </div>
            <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden ring-4 ring-amber-400 shadow-lg">
              <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {top3[0].badgeTitle}
            </span>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-2 mb-0.5">{top3[0].name}</h3>
            <p className="text-xs text-slate-400">{top3[0].handle} • {top3[0].homeCountry}</p>

            <div className="grid grid-cols-3 gap-2 mt-5 p-3.5 bg-amber-50/60 border border-amber-100 rounded-2xl text-center text-xs">
              <div>
                <div className="font-extrabold text-amber-900">{top3[0].xp.toLocaleString()}</div>
                <div className="text-[10px] text-amber-700">XP</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-900">{top3[0].countriesCount}</div>
                <div className="text-[10px] text-amber-700">Countries</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-900">{top3[0].clonesCount}</div>
                <div className="text-[10px] text-amber-700">Clones</div>
              </div>
            </div>

            <button
              onClick={() => handleToggleFollow(top3[0].handle)}
              className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                followingMap[top3[0].handle]
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
              }`}
            >
              {followingMap[top3[0].handle] ? 'Following' : '+ Follow Curator'}
            </button>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center shadow-xs order-3 md:order-3 hover:shadow-lg transition-all relative">
            <div className="w-8 h-8 rounded-full bg-amber-700/10 border border-amber-600/30 text-amber-800 font-extrabold text-sm flex items-center justify-center mx-auto -mt-10 mb-3 shadow-sm">
              3
            </div>
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden ring-4 ring-amber-600/30 shadow-md">
              <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full">
              {top3[2].badgeTitle}
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 mt-2 mb-0.5">{top3[2].name}</h3>
            <p className="text-xs text-slate-400">{top3[2].handle} • {top3[2].homeCountry}</p>

            <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 rounded-2xl text-center text-xs">
              <div>
                <div className="font-extrabold text-slate-900">{top3[2].xp.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">XP</div>
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{top3[2].countriesCount}</div>
                <div className="text-[10px] text-slate-400">Countries</div>
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{top3[2].clonesCount}</div>
                <div className="text-[10px] text-slate-400">Clones</div>
              </div>
            </div>

            <button
              onClick={() => handleToggleFollow(top3[2].handle)}
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                followingMap[top3[2].handle]
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
              }`}
            >
              {followingMap[top3[2].handle] ? 'Following' : '+ Follow Curator'}
            </button>
          </div>
        </div>

        {/* Full Leaderboard Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                Community Rankings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Ranked by verified trip completions, public itinerary clones, and community upvotes.
              </p>
            </div>

            {/* Filter Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search curators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Curator</th>
                  <th className="py-3 px-3 hidden md:table-cell">Specialty</th>
                  <th className="py-3 px-3 text-center">Countries</th>
                  <th className="py-3 px-3 text-center">Guides</th>
                  <th className="py-3 px-3 text-center">Clones</th>
                  <th className="py-3 px-3 text-right">Total XP</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((u) => {
                  const isFollowing = !!followingMap[u.handle];
                  return (
                    <tr key={u.handle} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-extrabold ${
                            u.rank === 1
                              ? 'text-amber-500'
                              : u.rank === 2
                              ? 'text-slate-400'
                              : u.rank === 3
                              ? 'text-amber-700'
                              : 'text-slate-400'
                          }`}
                        >
                          #{u.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                                Lvl {u.level}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {u.handle} • {u.homeCountry}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 hidden md:table-cell text-slate-600 text-xs">
                        {u.specialty}
                      </td>

                      <td className="py-3.5 px-3 text-center font-semibold text-slate-900">
                        {u.countriesCount}
                      </td>

                      <td className="py-3.5 px-3 text-center font-semibold text-slate-900">
                        {u.guidesCount}
                      </td>

                      <td className="py-3.5 px-3 text-center font-semibold text-blue-600">
                        {u.clonesCount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        {u.xp.toLocaleString()} <span className="text-[10px] text-amber-500 font-bold">XP</span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleToggleFollow(u.handle)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isFollowing
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Earn XP Callout Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-1 rounded-md inline-block">
              Voyager Rewards Program
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              Want to climb the Leaderboard?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Publish public itineraries (+500 XP), receive itinerary clones (+50 XP per clone), and review travel spots to unlock exclusive Voyager Pro badges.
            </p>
          </div>

          <Link
            to="/trips/new"
            className="shrink-0 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
          >
            Publish an Itinerary
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityLeaderboardPage;
