import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import {
  Users,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Send,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CommunityNav } from './components/CommunityNav';

interface TravelBuddyPost {
  id: string;
  hostName: string;
  hostAvatar: string;
  hostCity: string;
  isVerified: boolean;
  destination: string;
  country: string;
  dates: string;
  duration: string;
  title: string;
  description: string;
  spotsTotal: number;
  spotsFilled: number;
  estimatedBudgetPerPerson: string;
  vibe: 'Roadtrip' | 'Backpacking' | 'Photography' | 'Hiking' | 'Foodie';
  tags: string[];
  coverImage?: string;
  requestsCount: number;
}

const INITIAL_BUDDY_POSTS: TravelBuddyPost[] = [
  {
    id: 'tb-1',
    hostName: 'Maya Patel',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hostCity: 'London, UK',
    isVerified: true,
    destination: 'South Island Roadtrip',
    country: 'New Zealand',
    dates: 'Nov 10 – Nov 24, 2025',
    duration: '14 Days',
    title: 'Looking for 2 people to split a 4WD campervan around South Island!',
    description:
      'Planning an epic two-week circle from Christchurch down to Queenstown, Milford Sound, and Lake Tekapo. Aiming to split campsite fees and fuel (~$50/day each). Love hiking, astrophotography, and cooking cozy van meals.',
    spotsTotal: 4,
    spotsFilled: 2,
    estimatedBudgetPerPerson: '~$1,200 total',
    vibe: 'Roadtrip',
    tags: ['Photography', 'Vanlife', 'Hiking Trails', 'Shared Cooking'],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    requestsCount: 6,
  },
  {
    id: 'tb-2',
    hostName: 'Lucas Dubois',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hostCity: 'Lyon, France',
    isVerified: true,
    destination: 'Patagonia W-Trek',
    country: 'Chile & Argentina',
    dates: 'Dec 05 – Dec 18, 2025',
    duration: '13 Days',
    title: 'Solo trekker looking for 1–2 buddies for Torres del Paine W-Circuit',
    description:
      'Refugio bookings are locked in! Looking for companion(s) who enjoy moderate-pace trekking and sharing glacier viewpoints. I speak French, English, and conversational Spanish.',
    spotsTotal: 3,
    spotsFilled: 1,
    estimatedBudgetPerPerson: '~$1,600 total',
    vibe: 'Hiking',
    tags: ['Torres del Paine', 'Wilderness', 'Mountain Lover', 'English/Spanish'],
    coverImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80',
    requestsCount: 4,
  },
  {
    id: 'tb-3',
    hostName: 'Chloe Kim',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    hostCity: 'Seoul, South Korea',
    isVerified: true,
    destination: 'Tokyo & Kyoto Food Crawl',
    country: 'Japan',
    dates: 'Oct 14 – Oct 22, 2025',
    duration: '8 Days',
    title: 'Izakayas, Ramen & Thrift Shopping in Shibuya/Harajuku',
    description:
      'Visiting Japan for autumn colors and culinary hunting. Would love to link up with fellow foodies for omakase dinners and exploring hidden cocktail bars in Golden Gai.',
    spotsTotal: 2,
    spotsFilled: 1,
    estimatedBudgetPerPerson: '~$900 total',
    vibe: 'Foodie',
    tags: ['Food Lovers', 'Night Markets', 'Vintage Shopping', 'Solo Friendly'],
    coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
    requestsCount: 9,
  },
  {
    id: 'tb-4',
    hostName: 'David Miller',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hostCity: 'Austin, TX',
    isVerified: false,
    destination: 'Balkans Coast Roadtrip',
    country: 'Croatia & Montenegro',
    dates: 'Sep 01 – Sep 12, 2025',
    duration: '11 Days',
    title: 'Split to Kotor Bay via Dubrovnik – renting a convertible',
    description:
      'Cruising along the Adriatic highway, cliff jumping in Hvar, and exploring medieval walled towns. Looking for 2 easy-going roadtrippers to share driving and rental costs.',
    spotsTotal: 4,
    spotsFilled: 2,
    estimatedBudgetPerPerson: '~$800 total',
    vibe: 'Roadtrip',
    tags: ['Beach Vibes', 'Co-Driving', 'Historical Towns', 'Swimming'],
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
    requestsCount: 5,
  },
];

export const TravelBuddiesPage: FC = () => {
  const [posts, setPosts] = useState<TravelBuddyPost[]>(INITIAL_BUDDY_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeConnectPost, setActiveConnectPost] = useState<TravelBuddyPost | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [sentConnectId, setSentConnectId] = useState<Record<string, boolean>>({});

  // New Post Form State
  const [newDestination, setNewDestination] = useState('');
  const [newDates, setNewDates] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVibe, setNewVibe] = useState<'Roadtrip' | 'Backpacking' | 'Photography' | 'Hiking' | 'Foodie'>('Roadtrip');
  const [newBudget, setNewBudget] = useState('~$800');
  const [newSpots, setNewSpots] = useState(3);

  const vibes = ['All', 'Roadtrip', 'Backpacking', 'Photography', 'Hiking', 'Foodie'];

  const filteredPosts = posts.filter((p) => {
    const matchVibe = selectedVibe === 'All' || p.vibe === selectedVibe;
    const matchSearch =
      !searchQuery ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchVibe && matchSearch;
  });

  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newDestination || !newTitle) return;

    const created: TravelBuddyPost = {
      id: `tb-${Date.now()}`,
      hostName: 'You (Current Voyager)',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      hostCity: 'San Francisco, USA',
      isVerified: true,
      destination: newDestination,
      country: 'Global',
      dates: newDates || 'Flexible 2025',
      duration: '7–10 Days',
      title: newTitle,
      description: newDesc || 'Excited to explore together and create unforgettable memories!',
      spotsTotal: newSpots,
      spotsFilled: 1,
      estimatedBudgetPerPerson: newBudget,
      vibe: newVibe,
      tags: ['Verified Host', 'Flexible Dates', 'Shared Costs'],
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      requestsCount: 0,
    };

    setPosts([created, ...posts]);
    setShowCreateModal(false);
    // Reset
    setNewDestination('');
    setNewTitle('');
    setNewDesc('');
  };

  const handleSendConnect = () => {
    if (!activeConnectPost) return;
    setSentConnectId((prev) => ({ ...prev, [activeConnectPost.id]: true }));
    setActiveConnectPost(null);
    setConnectMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <CommunityNav onOpenCreateModal={() => setShowCreateModal(true)} createButtonLabel="Find Travel Buddies" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-12 sm:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Co-Planning & Shared Adventures</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-3 text-white">
            Find Your Next Travel Companion
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Never travel alone unless you want to. Connect with verified explorers heading to the same destinations, split van rentals, and make lifelong friends.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post a Travel Request</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Vibe Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {vibes.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVibe(v)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedVibe === v
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destination, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Travel Buddy Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const hasRequested = !!sentConnectId[post.id];
            const spotsLeft = post.spotsTotal - post.spotsFilled;

            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                {/* Header: Host Details & Spots Open */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.hostAvatar}
                        alt={post.hostName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-50 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-heading font-bold text-sm text-slate-900">{post.hostName}</h4>
                          {post.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-blue-600" title="Verified Traveler" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{post.hostCity}</p>
                      </div>
                    </div>

                    {/* Spots Counter Badge */}
                    <div className="text-right">
                      <span className="px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold rounded-xl inline-block">
                        {spotsLeft > 0 ? `${spotsLeft} spots open` : 'Trip Full'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {post.spotsFilled}/{post.spotsTotal} adventurers
                      </p>
                    </div>
                  </div>

                  {/* Trip Meta Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{post.destination}, {post.country}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.dates}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg">
                      <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                      <span>{post.estimatedBudgetPerPerson}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {post.requestsCount} travelers interested
                  </span>

                  {hasRequested ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Request Sent!</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveConnectPost(post)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send Travel Invite</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connect Request Modal */}
        {activeConnectPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Connect Request
                  </span>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mt-0.5">
                    Message {activeConnectPost.hostName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trip to {activeConnectPost.destination} ({activeConnectPost.dates})
                  </p>
                </div>

                <button
                  onClick={() => setActiveConnectPost(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Introduction & Travel Style
                </label>
                <textarea
                  rows={4}
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  placeholder={`Hi ${activeConnectPost.hostName}! I saw your trip to ${activeConnectPost.destination} and would love to join. A bit about me: I'm an easy-going traveler who loves hiking and sharing costs...`}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveConnectPost(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendConnect}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <form
              onSubmit={handleCreateSubmit}
              className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    Find Travel Companions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Post your travel plan to connect with other voyagers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Iceland Ring Road"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Dates / Season *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 10 - Oct 20, 2025"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Trip Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Looking for 2 roadtrip buddies to split a campervan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description & Itinerary Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about what you plan to do, pacing, budget split, and who would be a great fit..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Vibe
                  </label>
                  <select
                    value={newVibe}
                    onChange={(e) => setNewVibe(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Roadtrip">Roadtrip</option>
                    <option value="Backpacking">Backpacking</option>
                    <option value="Photography">Photography</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Foodie">Foodie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Budget / Person
                  </label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Total Spots
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={newSpots}
                    onChange={(e) => setNewSpots(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs"
                >
                  Publish Request
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TravelBuddiesPage;
