import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Heart,
  Globe,
  Users,
  Award,
  Zap,
  Leaf,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

interface TeamMember {
  name: string;
  role: string;
  favoriteDestination: string;
  bio: string;
  avatar: string;
}

export const AboutPage: FC = () => {
  const stats = [
    { label: 'Active Explorers', value: '120,000+', icon: Users },
    { label: 'Itineraries Created', value: '450,000+', icon: Compass },
    { label: 'Countries Covered', value: '180+', icon: Globe },
    { label: 'Traveler Rating', value: '4.9 / 5.0', icon: Award },
  ];

  const values = [
    {
      title: 'Unbounded Curiosity',
      desc: 'We build technology that inspires wandering off the beaten path, discovering hidden alleyways, local bakeries, and authentic cultural wonders.',
      icon: Compass,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Community First',
      desc: 'Travel is best shared. We believe in peer-powered inspiration—where genuine reviews, shared routes, and co-planning make every journey unforgettable.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Sustainable Exploration',
      desc: 'We advocate for mindful, eco-conscious tourism that respects local communities, protects natural habitats, and supports local neighborhood economies.',
      icon: Leaf,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Effortless Innovation',
      desc: 'Trip planning should be exciting, not exhausting. We leverage intelligent AI routing, instant currency conversion, and offline caching so travel is seamless.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Spark & Genesis',
      description:
        'Conceived at the LDCE Hackathon to solve the mess of scattered browser tabs, confusing spreadsheets, and fragmented booking confirmations.',
    },
    {
      year: '2024',
      title: 'AI Itinerary Engine Launch',
      description:
        'Introduced intelligent schedule optimization, automated transit estimation, and multi-currency expense splitting for international globetrotters.',
    },
    {
      year: '2025',
      title: 'Real-Time Co-Planning & Community',
      description:
        'Rolled out multiplayer itinerary editing, public guide publishing, and high-resolution offline PDF export capabilities.',
    },
    {
      year: '2026 & Beyond',
      title: 'The Global Travel Operating System',
      description:
        'Expanding worldwide with personalized AI travel concierge agents, verified local expert curators, and zero-connectivity sync.',
    },
  ];

  const team: TeamMember[] = [
    {
      name: 'Aarav Patel',
      role: 'Co-Founder & Product Lead',
      favoriteDestination: 'Kyoto, Japan',
      bio: 'Lifelong backpacker and UX architect. Passionate about crafting digital tools that make wanderlust effortlessly actionable.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Chief Technology Officer',
      favoriteDestination: 'Reykjavik, Iceland',
      bio: 'Distributed systems engineer and AI researcher. Architect of our real-time collaborative map routing engines.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Devansh Sharma',
      role: 'Head of AI & Experience',
      favoriteDestination: 'Amalfi Coast, Italy',
      bio: 'Data scientist transforming open geographic records into personalized, context-aware itinerary recommendations.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Sofia Alvarez',
      role: 'Head of Community & Partnerships',
      favoriteDestination: 'Cusco, Peru',
      bio: 'Travel journalist and community builder connecting global travelers with sustainable local tour guides.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-20 sm:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Our Mission & Story</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight mb-6 text-white leading-tight">
            Empowering Every Traveler to Explore the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Wonder & Ease</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            GlobeTrotter was born from a simple belief: planning an adventure should be as exhilarating and effortless as the journey itself.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/trips/new"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <span>Start Planning a Trip</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/community"
              className="px-6 py-3 bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl transition-all border border-slate-700"
            >
              Explore Community Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="-mt-10 relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 flex-1">
        {/* The Origin Story */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight leading-snug">
              From Scattered Spreadsheets to Seamless Itineraries
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We’ve all been there: dozens of open browser tabs, lost hotel confirmation emails, confusing subway maps, and mismatched group chat recommendations.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              GlobeTrotter was founded to replace that chaos with pure clarity. We combined rich interactive mapping, smart AI scheduling algorithms, multi-currency budgeting, and real-time collaboration into one elegant workspace that travels with you anywhere—even offline.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Unified timeline with day-by-day maps & activities</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Real-time collaborative editing with travel companions</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Instant offline PDF export & calendar synchronizations</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 sm:p-10 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <Compass className="w-12 h-12 text-blue-200 mb-6" />
              <blockquote className="font-heading font-bold text-xl sm:text-2xl mb-6 leading-relaxed">
                "Our north star is simple: make every minute of your trip feel memorable, frictionless, and authentically inspiring."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
                  GT
                </div>
                <div>
                  <div className="font-bold text-sm">The GlobeTrotter Collective</div>
                  <div className="text-xs text-blue-200">Engineered with ❤️ for Global Explorers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Values that Drive Every Feature
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How we approach technology, design, and our global traveler community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${v.color}`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {v.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Milestone Timeline */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              Evolution & Milestones
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              The GlobeTrotter Storyline
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Key chapters in our journey to modernize travel planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">
                    {m.year}
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Team */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              Passionate Builders
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Meet the Team Behind GlobeTrotter
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Designers, engineers, and adventurers dedicated to making travel magical.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-4 ring-blue-50 shadow-sm">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mb-2">
                  {member.role}
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>Loves {member.favoriteDestination}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl shadow-blue-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              Ready to create your next unforgettable story?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Join over 120,000 travelers using GlobeTrotter to discover, customize, and share incredible itineraries.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/trips/new"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl transition-all shadow-md"
              >
                Plan a Trip Now
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-all border border-blue-400/30"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
