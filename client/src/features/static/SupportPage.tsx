import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  Search,
  Compass,
  Users,
  MapPin,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Zap,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

interface FAQ {
  id: string;
  question: string;
  category: 'planning' | 'collab' | 'account' | 'billing' | 'tech';
  answer: string;
  tags: string[];
}

interface Guide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  icon: typeof Compass;
}

const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    category: 'planning',
    question: 'How do I generate an AI-powered trip itinerary?',
    answer:
      'Navigate to "Trips" -> "Add Trip", select your destination, departure dates, estimated budget, and travel style (e.g. Adventure, Relaxed, Culture). GlobeTrotter AI will automatically construct a day-by-day itinerary with recommended activities, optimal travel times, and curated local hotspots.',
    tags: ['ai', 'generate', 'itinerary', 'create', 'new trip'],
  },
  {
    id: 'faq-2',
    category: 'collab',
    question: 'Can I invite friends to co-plan an itinerary in real-time?',
    answer:
      'Yes! Inside your Itinerary Builder, click the "Share / Invite" button in the top right. Enter your companions\' email addresses or generate an invite link. You can assign permissions as "Editor" (can add & modify stops) or "Viewer" (read-only view).',
    tags: ['collaborate', 'share', 'friends', 'invite', 'team'],
  },
  {
    id: 'faq-3',
    category: 'planning',
    question: 'How do I download or export my itinerary for offline travel?',
    answer:
      'Open any of your active trips and click "Export Itinerary". You can generate an offline-ready PDF with embedded day-by-day maps, reservation references, and emergency contacts, or sync directly to Google Calendar / Apple Calendar.',
    tags: ['offline', 'pdf', 'export', 'download', 'calendar'],
  },
  {
    id: 'faq-4',
    category: 'billing',
    question: 'Is GlobeTrotter free to use for personal travelers?',
    answer:
      'GlobeTrotter is completely free for individual travelers and small groups. You can create unlimited trips, invite friends, use AI planning recommendations, and browse community itineraries with zero subscription fees.',
    tags: ['free', 'pricing', 'cost', 'subscription'],
  },
  {
    id: 'faq-5',
    category: 'account',
    question: 'How do I reset my account password or enable 2-Factor Authentication?',
    answer:
      'Go to your Profile Settings (top right avatar -> "My Profile & Settings"). Under the "Security" tab, you can update your password, enable authenticator app (2FA) verification, and view active login sessions.',
    tags: ['password', '2fa', 'security', 'login', 'account'],
  },
  {
    id: 'faq-6',
    category: 'tech',
    question: 'What should I do if the interactive map is not loading?',
    answer:
      'Check that your browser allows WebGL hardware acceleration and that no ad-blocker or firewall is intercepting map tile requests from Mapbox. Try performing a hard refresh (Ctrl + F5 or Cmd + Shift + R). If the issue persists, our support team can diagnose your network logs.',
    tags: ['map', 'bug', 'loading', 'error', 'mapbox'],
  },
  {
    id: 'faq-7',
    category: 'collab',
    question: 'How do public itinerary links work?',
    answer:
      'When you turn on "Public Link" in the share settings of a trip, any traveler with the URL can view your itinerary without needing to register or log in. Your private expense notes and flight booking codes remain securely hidden.',
    tags: ['public', 'link', 'privacy', 'share'],
  },
  {
    id: 'faq-8',
    category: 'billing',
    question: 'How do I split trip expenses and manage currency conversions?',
    answer:
      'Within any trip, visit the "Budget & Expenses" tab. You can log expenses in any international currency (EUR, USD, JPY, INR, GBP, etc.). GlobeTrotter automatically converts to your primary home currency using daily foreign exchange rates.',
    tags: ['currency', 'budget', 'split', 'expenses', 'money'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'planning', label: 'Trip Planning', icon: Compass },
  { id: 'collab', label: 'Collaboration', icon: Users },
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'billing', label: 'Budget & Currencies', icon: CreditCard },
  { id: 'tech', label: 'Troubleshooting', icon: Zap },
];

const HELP_GUIDES: Guide[] = [
  {
    id: 'g-1',
    title: 'The Ultimate Guide to AI Itinerary Building',
    category: 'Trip Planning',
    readTime: '4 min read',
    description: 'Learn how to generate rich 3-day to 14-day itineraries customized to your travel budget and interests.',
    icon: Sparkles,
  },
  {
    id: 'g-2',
    title: 'Co-Planning Trips with Friends & Family',
    category: 'Collaboration',
    readTime: '3 min read',
    description: 'Step-by-step instructions on inviting companions, managing permissions, and live chat coordination.',
    icon: Users,
  },
  {
    id: 'g-3',
    title: 'Mastering Offline Maps & PDF Exports',
    category: 'Travel Tips',
    readTime: '2 min read',
    description: 'Never get lost without mobile data. How to print and sync high-resolution destination guides.',
    icon: MapPin,
  },
];

export const SupportPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleFeedback = (faqId: string, helpful: boolean) => {
    setFeedbackGiven((prev) => ({ ...prev, [faqId]: helpful }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-400/20 border border-blue-300/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-6">
            <LifeBuoy className="w-3.5 h-3.5 text-blue-300" />
            <span>GlobeTrotter Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4 text-white">
            How can we help you explore?
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto mb-8">
            Find answers to common questions, explore quick-start guides, or get in touch with our traveler support team.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help articles, AI tips, exports, sharing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl shadow-xl border border-transparent focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Live Status indicator */}
          <div className="mt-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
            <span>All Systems Operational (Itinerary Engine, Sync & Maps)</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-16">
        {/* Support Channels / Contact Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Direct Contact
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 leading-relaxed">
              Send our team a message. We usually respond in under 2 hours.
            </p>
            <Link
              to="/contact"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
            >
              <span>Submit a message</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Community Hub
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 leading-relaxed">
              Connect with experienced travelers, share tips, and get advice on destinations.
            </p>
            <Link
              to="/community"
              className="text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1.5"
            >
              <span>Explore Community</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Email Support
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 leading-relaxed">
              Reach our support team directly at support@globetrotter.io for urgent queries.
            </p>
            <a
              href="mailto:support@globetrotter.io"
              className="text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1.5"
            >
              <span>support@globetrotter.io</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* Featured Guides */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-2xl text-slate-900">
                Popular Quick Guides
              </h2>
              <p className="text-sm text-slate-500">
                Learn the best techniques to master your travel planning.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HELP_GUIDES.map((guide) => {
              const Icon = guide.icon;
              return (
                <div
                  key={guide.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{guide.category}</span>
                      </span>
                      <span>{guide.readTime}</span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {guide.description}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 inline-flex items-center gap-1.5 pt-4 border-t border-slate-100"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">
              Quick answers to the most common questions about GlobeTrotter.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-heading font-bold text-slate-700">No questions found</h4>
                <p className="text-xs text-slate-400">
                  Try adjusting your search keywords or reach out via our contact form.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                const feedbackState = feedbackGiven[faq.id];

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? 'border-blue-200 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer gap-4"
                    >
                      <span className="font-heading font-semibold text-sm sm:text-base text-slate-900">
                        {faq.question}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80">
                        <p>{faq.answer}</p>

                        {/* Was this helpful feedback */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-medium">Was this answer helpful?</span>
                          {feedbackState !== undefined ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Thanks for your feedback!
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleFeedback(faq.id, true)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Yes</span>
                              </button>
                              <button
                                onClick={() => handleFeedback(faq.id, false)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>No</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Still Need Help CTA */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Still have questions? We're here for you.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Our travel specialists and support engineers are available around the clock to ensure your trip runs effortlessly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                Send Us a Message
              </Link>
              <Link
                to="/community"
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all border border-slate-700"
              >
                Ask the Community
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportPage;
