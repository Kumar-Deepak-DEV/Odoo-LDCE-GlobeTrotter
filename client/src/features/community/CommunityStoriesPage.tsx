import { useState } from 'react';
import type { FC } from 'react';
import {
  BookOpen,
  Search,
  MapPin,
  Heart,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CommunityNav } from './components/CommunityNav';

interface TravelStory {
  id: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  location: string;
  readTime: string;
  publishDate: string;
  coverImage: string;
  category: 'Solo Travel' | 'Alpine & Hiking' | 'Food & Culture' | 'Roadtrips' | 'City Guides';
  likesCount: number;
  commentsCount: number;
  excerpt: string;
  fullBody: string[];
  tips: string[];
}

const COMMUNITY_STORIES: TravelStory[] = [
  {
    id: 'story-1',
    title: 'Waking Up in the Clouds: What 14 Days on the Inca Trail Taught Me',
    subtitle: 'From altitude sickness to sunrise over Inti Punku',
    author: {
      name: 'Sofia Alvarez',
      handle: '@sofia_travels',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    location: 'Cusco & Machu Picchu, Peru',
    readTime: '6 min read',
    publishDate: 'Aug 18, 2025',
    coverImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&auto=format&fit=crop&q=80',
    category: 'Alpine & Hiking',
    likesCount: 542,
    commentsCount: 38,
    excerpt:
      'The air was thin, the mornings were freezing, but crossing Dead Woman’s Pass at 4,215 meters changed the way I see the world forever...',
    fullBody: [
      'Standing at Kilometer 82 outside Ollantaytambo, with my 45-liter backpack buckled tight and the Urubamba River roaring below, all the nervous anticipation dissolved into pure focus.',
      'The Inca Trail isn’t just a hike—it’s an emotional pilgrimage through microclimates. One day you’re walking through dry cactus valleys, and by afternoon you’re engulfed in humid Andean cloud forests where orchids grow wild along ancient stone staircases.',
      'On morning four, waking at 3:30 AM to hike the final mile to the Sun Gate (Inti Punku), the fog suddenly parted just as the golden morning rays struck the stone terraces of Machu Picchu below. There were twenty of us, and not a single word was spoken for ten minutes.',
    ],
    tips: [
      'Spend at least 3 full days in Cusco (3,400m) acclimating before stepping foot on the trail.',
      'Invest in high-quality wool socks and broken-in waterproof trail boots.',
      'Tip your porters generously—they carry the camps and cook incredible hot meals on mountain ridges.',
    ],
  },
  {
    id: 'story-2',
    title: 'Midnight Ramen & Alleyway Jazz in Kyoto',
    subtitle: 'A sensory nocturnal guide to Kansai’s historic heart',
    author: {
      name: 'Kenji Sato',
      handle: '@kenji_japan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    location: 'Kyoto, Japan',
    readTime: '4 min read',
    publishDate: 'Aug 14, 2025',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
    category: 'Food & Culture',
    likesCount: 420,
    commentsCount: 29,
    excerpt:
      'While daytime Kyoto is filled with temple crowds, the real magic begins after 10 PM in the lantern-lit corridors of Pontocho and Gion...',
    fullBody: [
      'Kyoto after midnight transforms into a dreamscape. As the tour buses depart and wooden lattice shutters close, faint jazz saxophone notes leak through basements and hidden sliding doors.',
      'I found a 6-seat counter tucked behind an antique kimono shop. The chef, Master Hiroshi, had been simmering his chicken paitan broth for 18 hours. One sip of that golden soup with chewy spring noodles made the 14-hour flight completely worthwhile.',
    ],
    tips: [
      'Download Google Translate with Japanese offline pack for deciphering handwritten wooden menu placards.',
      'Always carry 1,000 yen cash notes—the best traditional ramen counters only take coin-operated ticket machines.',
    ],
  },
  {
    id: 'story-3',
    title: 'The Art of Solo Travel: How I Learned to Dine Alone in Paris',
    subtitle: 'Overcoming social anxiety and embracing the solo flâneur mindset',
    author: {
      name: 'Sarah Jenkins',
      handle: '@sarah_j',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    location: 'Paris, France',
    readTime: '5 min read',
    publishDate: 'Aug 09, 2025',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    category: 'Solo Travel',
    likesCount: 689,
    commentsCount: 54,
    excerpt:
      'The first night, I almost ordered room service out of fear. By night five, I was sipping Burgundy wine and chatting with local bakers at the counter...',
    fullBody: [
      'For years, the thought of sitting at a bistro table alone with a book terrified me. What if people thought I was lonely? What if the waiters ignored me?',
      'Paris taught me the French art of the "flâneur"—the passionate spectator who strolls and observes without rush. In a bustling neighborhood brasserie in the 11th arrondissement, dining alone isn’t sad; it’s an indulgence.',
    ],
    tips: [
      'Ask for a seat at the bar/counter ("au comptoir") for easy conversations with sommeliers.',
      'Bring a notebook or sketchbook rather than staring at your phone.',
    ],
  },
];

export const CommunityStoriesPage: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<TravelStory | null>(null);
  const [likedStoryIds, setLikedStoryIds] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Solo Travel', 'Alpine & Hiking', 'Food & Culture', 'Roadtrips', 'City Guides'];

  const filteredStories = COMMUNITY_STORIES.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedStoryIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <CommunityNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-12 sm:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Travel Journals & Essays</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-3 text-white">
            Stories from the Road
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            In-depth travel memoirs, culinary reflections, and hidden route chronicles penned by the Voyago traveler community.
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stories by country, author, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl shadow-xl text-xs sm:text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const isLiked = !!likedStoryIds[story.id];

            return (
              <article
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      {story.category}
                    </span>

                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{story.location}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{story.publishDate}</span>
                      <span>{story.readTime}</span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 border-t border-slate-100/80 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 pt-3">
                    <img
                      src={story.author.avatar}
                      alt={story.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-700">{story.author.name}</span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-3 text-slate-400 text-xs">
                    <button
                      onClick={(e) => handleToggleLike(story.id, e)}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{story.likesCount + (isLiked ? 1 : 0)}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{story.commentsCount}</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Story Reader Modal */}
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeStory.author.avatar}
                    alt={activeStory.author.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-50"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{activeStory.author.name}</h4>
                    <p className="text-xs text-slate-400">{activeStory.author.handle} • {activeStory.publishDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Cover */}
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {activeStory.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-2 mb-1">
                  {activeStory.title}
                </h1>
                <p className="text-sm text-slate-500 mb-4">{activeStory.subtitle}</p>

                <div className="h-64 rounded-2xl overflow-hidden mb-6">
                  <img src={activeStory.coverImage} alt={activeStory.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Full Body Text */}
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                {activeStory.fullBody.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Tips Callout */}
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2">
                <h4 className="font-heading font-bold text-sm text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Key Tips from the Author</span>
                </h4>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5 pl-4 list-disc">
                  {activeStory.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveStory(null)}
                  className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close Story
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleLike(activeStory.id, e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Applaud Story</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CommunityStoriesPage;
