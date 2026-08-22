import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Scale,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
  Printer,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Gavel,
  BookOpen,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

interface TermSection {
  id: string;
  title: string;
  badge?: string;
  icon: typeof FileText;
  summary: string;
  details: string[];
  callout?: { type: 'note' | 'warning'; text: string };
}

export const TermsPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('acceptance');

  const terms: TermSection[] = [
    {
      id: 'acceptance',
      title: '1. Acceptance & Eligibility',
      badge: 'Agreement',
      icon: CheckCircle2,
      summary:
        'By creating an account or using GlobeTrotter, you represent that you are at least 13 years old (or 16 in the EEA) and agree to abide by these Terms.',
      details: [
        'These Terms of Service ("Terms") govern your access to and use of the GlobeTrotter website, mobile platforms, APIs, and associated itinerary planning tools.',
        'If you are entering into these Terms on behalf of an enterprise or organization, you represent that you have legal authority to bind that entity.',
        'If you do not agree to these Terms, you must discontinue use of the platform immediately.',
      ],
    },
    {
      id: 'accounts',
      title: '2. User Accounts & Security',
      badge: 'Security',
      icon: ShieldCheck,
      summary:
        'You are responsible for safeguarding your login credentials and maintaining the accuracy of your account information.',
      details: [
        'You must provide accurate, current, and complete registration details and promptly update them if changes occur.',
        'You are solely responsible for all activities that take place under your account credentials. Notify us immediately of any unauthorized access or breach of security.',
        'We reserve the right to suspend or terminate accounts that use disposable alias emails to commit fraudulent acts or bypass system constraints.',
      ],
      callout: {
        type: 'note',
        text: 'Two-factor authentication (2FA) is strongly recommended for all accounts to protect saved itineraries and flight records.',
      },
    },
    {
      id: 'planning-ai',
      title: '3. Trip Planning & AI Recommendations',
      badge: 'Platform Services',
      icon: Sparkles,
      summary:
        'AI recommendations, routing times, and estimated costs are provided as planning aids and do not constitute official travel booking guarantees.',
      details: [
        'GlobeTrotter provides itinerary suggestions, route calculations, and estimated budget ranges based on historical and open-source data.',
        'Travel conditions, operating hours, ticket prices, visa requirements, and transit schedules are subject to change without notice. Always verify directly with official tour operators, airlines, and embassies.',
        'GlobeTrotter is not liable for missed flights, itinerary delays, or unexpected attraction closures.',
      ],
      callout: {
        type: 'warning',
        text: 'Always cross-reference visa guidelines and emergency embassy contacts before international departure.',
      },
    },
    {
      id: 'content',
      title: '4. User Content & Community Guidelines',
      badge: 'Community',
      icon: Users,
      summary:
        'You own all itineraries, reviews, and photos you publish, but grant us a license to display and format them within GlobeTrotter.',
      details: [
        'You retain full intellectual property ownership of the itineraries, photographs, notes, and reviews you create.',
        'By sharing an itinerary publicly or in the Community Hub, you grant GlobeTrotter a worldwide, royalty-free, non-exclusive license to host, format, and display such content to other travelers.',
        'You agree not to upload defamatory, hateful, sexually explicit, copyrighted, or unlawful material.',
        'We reserve the right to remove any content that violates our community standards or impinges on third-party intellectual property.',
      ],
    },
    {
      id: 'third-party',
      title: '5. Third-Party Integrations & Maps',
      badge: 'External Services',
      icon: Compass,
      summary:
        'Our service integrates external map providers, flight tracking, and weather data governed by their respective terms.',
      details: [
        'GlobeTrotter utilizes Mapbox and OpenStreetMap services. By using geographic features, you agree to adhere to their respective terms of use.',
        'Links to external booking platforms, airlines, or hotels are provided solely for traveler convenience. We do not control and are not responsible for third-party websites.',
      ],
    },
    {
      id: 'fees',
      title: '6. Subscriptions, Upgrades & Refunds',
      badge: 'Billing',
      icon: Scale,
      summary:
        'Core itinerary planning is free. Optional premium tiers offer offline exports, unlimited collaborator seats, and advanced AI budgeting.',
      details: [
        'Pricing for premium features is transparently listed on our plans page and charged on a monthly or annual billing cycle.',
        'Subscriptions auto-renew unless cancelled at least 24 hours prior to the conclusion of the active billing period.',
        'We offer a 14-day full refund guarantee for first-time annual subscriptions upon request to our billing support desk.',
      ],
    },
    {
      id: 'liability',
      title: '7. Limitation of Liability & Disclaimers',
      badge: 'Legal Disclaimer',
      icon: AlertTriangle,
      summary:
        'To the maximum extent permitted by applicable law, GlobeTrotter is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind.',
      details: [
        'GlobeTrotter and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
        'In no event shall our total aggregate liability exceed the greater of one hundred US dollars ($100) or the amounts paid by you in the past 12 months.',
      ],
    },
    {
      id: 'termination',
      title: '8. Termination & Suspension',
      badge: 'Account Closure',
      icon: Gavel,
      summary:
        'You may terminate your account anytime. We may suspend access in cases of repeated violation of these Terms.',
      details: [
        'You can delete your account and export your data at any time from your account settings.',
        'We may suspend or terminate your account with or without prior notice if we reasonably believe you have violated these Terms or pose a security risk to others.',
      ],
    },
    {
      id: 'governing-law',
      title: '9. Governing Law & Dispute Resolution',
      badge: 'Jurisdiction',
      icon: BookOpen,
      summary:
        'These Terms are governed by the laws of the State of California, USA, without regard to its conflict of law principles.',
      details: [
        'Any dispute arising out of or relating to these Terms shall be resolved through binding individual arbitration under JAMS rules rather than in court.',
        'You and GlobeTrotter agree that each may bring claims against the other only on an individual basis and not as a plaintiff or class member in any class or representative action.',
      ],
    },
  ];

  const filteredTerms = terms.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Terms of Service</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4 text-white">
            Terms of Service
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Please read these terms carefully before exploring and planning your trips with GlobeTrotter. They define your rights and responsibilities.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Version 2.4 - Updated 2025</span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all font-medium text-xs sm:text-sm cursor-pointer shadow-sm ml-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Print Terms</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Plain English Summary Cards */}
        <div className="mb-12 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-slate-900">
                Key Terms at a Glance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                A plain-English summary of our core commitments and expectations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your Content Stays Yours</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You retain full copyright over your itineraries, uploaded travel photos, and notes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free to Plan</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard travel itinerary generation, sharing, and community browsing are 100% free.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Harassment Policy</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We maintain a safe, welcoming environment. Spam, hate speech, and piracy are prohibited.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cancel Anytime</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export your travel data or terminate your profile with one click—no locks or hassles.
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Sticky Navigation + Full Clauses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left TOC Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <label htmlFor="search-terms" className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Filter Clauses
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-terms"
                  type="text"
                  placeholder="e.g. Refunds, Content, Liability..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
                Clause Directory
              </h3>
              <nav className="space-y-1">
                {terms.map((term) => {
                  const Icon = term.icon;
                  const isActive = activeSection === term.id;
                  return (
                    <a
                      key={term.id}
                      href={`#${term.id}`}
                      onClick={() => setActiveSection(term.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{term.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 opacity-60" />
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Legal Help Banner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <HelpCircle className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                Need Legal Clarification?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Have specific terms inquiries or enterprise licensing requirements?
              </p>
              <Link
                to="/contact"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Contact Legal Department</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          {/* Right Detailed Clauses */}
          <div className="lg:col-span-8 space-y-8">
            {filteredTerms.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-slate-800 mb-1">No matching clauses</h3>
                <p className="text-slate-500 text-sm">
                  Try adjusting your search query or reset the search box.
                </p>
              </div>
            ) : (
              filteredTerms.map((term) => {
                const Icon = term.icon;
                return (
                  <section
                    key={term.id}
                    id={term.id}
                    className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors scroll-mt-28"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        {term.badge && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                            {term.badge}
                          </span>
                        )}
                        <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                          {term.title}
                        </h2>
                      </div>
                    </div>

                    {/* Summary box */}
                    <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-100 mb-5 text-sm text-slate-700 font-medium leading-relaxed">
                      {term.summary}
                    </div>

                    {/* Full detail clauses */}
                    <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                      {term.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>

                    {/* Alert / Callout if applicable */}
                    {term.callout && (
                      <div
                        className={`mt-5 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                          term.callout.type === 'warning'
                            ? 'bg-amber-50 border border-amber-200 text-amber-900'
                            : 'bg-blue-50 border border-blue-200 text-blue-900'
                        }`}
                      >
                        {term.callout.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        )}
                        <span>{term.callout.text}</span>
                      </div>
                    )}
                  </section>
                );
              })
            )}

            {/* Bottom Acknowledgment Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl mb-1">
                  Questions about our Terms?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100">
                  Our compliance team is here to assist with any legal queries or partnership guidelines.
                </p>
              </div>

              <Link
                to="/contact"
                className="shrink-0 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                Contact Support Desk
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
