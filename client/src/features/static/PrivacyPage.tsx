import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  UserCheck,
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Printer,
  Mail,
  ArrowRight,
  Scale,
  Clock,
  Key,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

interface Section {
  id: string;
  title: string;
  badge?: string;
  icon: typeof Shield;
  content: string[];
  subsections?: { title: string; desc: string }[];
}

export const PrivacyPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('collection');

  const sections: Section[] = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      badge: 'Data Intake',
      icon: Database,
      content: [
        'We collect information to provide better services to all our travelers—from figuring out basic stuff like your preferred language, to more complex itineraries like personalized destination suggestions and budget estimates.',
      ],
      subsections: [
        {
          title: 'Account Information',
          desc: 'When you create a GlobeTrotter account, we collect your name, email address, password hash, profile avatar, and home currency preference.',
        },
        {
          title: 'Trip & Itinerary Data',
          desc: 'Details of trips you construct, including destinations, departure dates, hotel bookings, flight notes, activity checklists, and custom pinned locations.',
        },
        {
          title: 'Community & Social Contributions',
          desc: 'Public reviews, travel tips, photos, comments, and shared itinerary guides you publish within our community portal.',
        },
        {
          title: 'Device & Usage Logs',
          desc: 'IP addresses, browser type, operating system version, access timestamps, and telemetry regarding the features you engage with most frequently.',
        },
      ],
    },
    {
      id: 'usage',
      title: '2. How We Use Your Data',
      badge: 'Processing',
      icon: Sparkles,
      content: [
        'We strictly process your personal data for legitimate business purposes and to deliver an unmatched personalized travel planning experience.',
      ],
      subsections: [
        {
          title: 'Itinerary Generation & AI Customization',
          desc: 'Powering automated schedule planning, routing optimizations, budget estimations, and regional suggestions matching your travel style.',
        },
        {
          title: 'Collaboration & Sharing',
          desc: 'Enabling real-time collaborative itinerary editing with travel companions and sharing read-only public trip links.',
        },
        {
          title: 'Account Security & Fraud Prevention',
          desc: 'Verifying user identity, monitoring suspicious activities, preventing unauthorized access, and maintaining database integrity.',
        },
        {
          title: 'Service Notifications',
          desc: 'Sending itinerary change alerts, collaborative invite notices, community replies, and important platform policy updates.',
        },
      ],
    },
    {
      id: 'sharing',
      title: '3. Data Sharing & Third Parties',
      badge: 'Third Parties',
      icon: Globe,
      content: [
        'GlobeTrotter does not sell, rent, or monetize your personal data to advertising brokers. We only share information with trusted service providers under strict data privacy agreements.',
      ],
      subsections: [
        {
          title: 'Cloud Infrastructure & Hosting',
          desc: 'Our databases and servers are hosted on enterprise-grade AWS and Google Cloud data centers with end-to-end encryption at rest.',
        },
        {
          title: 'Map & Geo-Location Providers',
          desc: 'Coordinates and search queries are routed via Mapbox and OpenStreetMap APIs to render interactive destination maps and travel routes.',
        },
        {
          title: 'Legal Compliance & Protection',
          desc: 'We may disclose data when legally subpoenaed or required by law enforcement to safeguard rights, property, and traveler safety.',
        },
      ],
    },
    {
      id: 'cookies',
      title: '4. Cookies & Local Storage',
      badge: 'Tracking',
      icon: Key,
      content: [
        'We use cookies, session tokens, and HTML5 local storage to maintain your logged-in session, remember filter preferences, and cache offline trip data.',
      ],
      subsections: [
        {
          title: 'Essential Session Cookies',
          desc: 'Required for authentication tokens (JWT) and secure user identification.',
        },
        {
          title: 'Preference & Offline Cache',
          desc: 'Stores your active currency, theme settings, and offline cached itineraries for reliable access on the road.',
        },
        {
          title: 'Analytical Measurement',
          desc: 'Anonymized aggregation to observe aggregate feature usage and system performance without profiling individual behaviors.',
        },
      ],
    },
    {
      id: 'security',
      title: '5. Data Security & Storage',
      badge: 'Protection',
      icon: Lock,
      content: [
        'Security is built into our core architecture. We employ military-grade 256-bit AES encryption for all data at rest and TLS 1.3 encryption for all data in transit.',
      ],
      subsections: [
        {
          title: 'Encryption Standards',
          desc: 'All sensitive user data, passwords, and tokens undergo salted SHA-256 hashing and zero-knowledge storage protocols.',
        },
        {
          title: 'Access Control',
          desc: 'Strict role-based access control (RBAC) ensures only authorized personnel can access infrastructure under audited conditions.',
        },
        {
          title: 'Automatic Backups',
          desc: 'Hourly encrypted incremental backups ensure your itineraries are never lost due to hardware failures.',
        },
      ],
    },
    {
      id: 'rights',
      title: '6. Your Rights (GDPR & CCPA)',
      badge: 'User Rights',
      icon: UserCheck,
      content: [
        'Regardless of your geographic location, we extend comprehensive privacy controls and data autonomy to every registered user.',
      ],
      subsections: [
        {
          title: 'Right to Access & Portability',
          desc: 'You can export all your itineraries, expenses, and account history in clean JSON or PDF format at any time.',
        },
        {
          title: 'Right to Rectification & Deletion',
          desc: 'You can modify your profile information or initiate a permanent account purge directly from your Profile settings.',
        },
        {
          title: 'Opt-Out of Marketing Communications',
          desc: 'Unsubscribe from digest emails or promotional updates with a single click in your email preferences.',
        },
      ],
    },
    {
      id: 'retention',
      title: '7. Data Retention & Deletion',
      badge: 'Retention',
      icon: Clock,
      content: [
        'We retain your account information as long as your account remains active. If you choose to delete your account, all personal identifiers, trips, and saved bookmarks are permanently purged from production databases within 30 days.',
      ],
    },
    {
      id: 'contact-dpo',
      title: '8. Contact Data Protection Officer',
      badge: 'Assistance',
      icon: Mail,
      content: [
        'If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact our dedicated Data Protection Officer (DPO).',
      ],
      subsections: [
        {
          title: 'Email Contact',
          desc: 'privacy@globetrotter.io (Response time within 24–48 business hours)',
        },
        {
          title: 'Mailing Address',
          desc: 'GlobeTrotter Privacy Office, 100 Montgomery St, Suite 1800, San Francisco, CA 94104, USA',
        },
      ],
    },
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.subsections?.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Transparency & Trust</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4 text-white">
            Privacy Policy
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Your privacy is fundamental to how we build GlobeTrotter. Learn how we safeguard, process, and protect your travel adventures and personal information.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Effective Date: January 1, 2025</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>GDPR & CCPA Compliant</span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all font-medium text-xs sm:text-sm cursor-pointer shadow-sm hover:shadow-blue-500/20 ml-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Print Policy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Quick Highlights 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-2">
              End-to-End Protection
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              All trip records, payment details, and personal credentials use 256-bit encryption and salted hashing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-2">
              No Data Selling
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We do not sell, rent, or trade your travel habits or personal itineraries to advertisers. Ever.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-2">
              Total User Autonomy
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Download your full travel archive anytime or permanently delete your account with a single request.
            </p>
          </div>
        </div>

        {/* Layout: Sidebar + Document Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Search within policy */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <label htmlFor="search-policy" className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Search Policy
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-policy"
                  type="text"
                  placeholder="e.g., Cookies, GDPR, Retention..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
                Sections Navigation
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{section.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 opacity-60" />
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl text-white shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6 text-blue-200 mb-3" />
              <h4 className="font-heading font-bold text-base mb-1">Questions on your data?</h4>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                Our Data Protection and Compliance team responds to all privacy inquiries within 48 hours.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <span>Contact Privacy Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Right Document Sections */}
          <div className="lg:col-span-8 space-y-8">
            {filteredSections.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-slate-800 mb-1">No matching sections</h3>
                <p className="text-slate-500 text-sm">
                  Try searching for a different keyword such as "cookies", "data", or "encryption".
                </p>
              </div>
            ) : (
              filteredSections.map((section) => {
                const Icon = section.icon;
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors scroll-mt-28"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        {section.badge && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                            {section.badge}
                          </span>
                        )}
                        <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    {section.subsections && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {section.subsections.map((sub, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-start gap-2 mb-1.5">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <h3 className="font-heading font-semibold text-sm text-slate-900">
                                {sub.title}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                              {sub.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })
            )}

            {/* Bottom Verification Seal */}
            <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-sm sm:text-base">
                    Verified Global Data Governance
                  </h4>
                  <p className="text-xs text-slate-400">
                    Compliant with EU General Data Protection Regulation (GDPR) and California Privacy Rights Act (CPRA).
                  </p>
                </div>
              </div>

              <Link
                to="/terms"
                className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
              >
                View Terms of Service &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
