import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Globe,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

interface ContactFormData {
  fullName: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
}

export const ContactPage: FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    category: 'general',
    priority: 'normal',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate realistic API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTicketId(`GT-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      category: 'general',
      priority: 'normal',
      subject: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  const globalOffices = [
    {
      city: 'San Francisco',
      country: 'United States',
      role: 'Global Headquarters & Engineering',
      address: '100 Montgomery St, Suite 1800, San Francisco, CA 94104',
      timezone: 'PST (UTC-8)',
    },
    {
      city: 'Ahmedabad',
      country: 'India',
      role: 'Innovation & Core Development Lab',
      address: 'LDCE Campus Rd, Navrangpura, Ahmedabad, Gujarat 380015',
      timezone: 'IST (UTC+5:30)',
    },
    {
      city: 'London',
      country: 'United Kingdom',
      role: 'European Travel Partnerships',
      address: '25 Bank Street, Canary Wharf, London E14 5JP',
      timezone: 'GMT (UTC+0)',
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      role: 'Asia-Pacific Regional Hub',
      address: 'Roppongi Hills Mori Tower, Minato-ku, Tokyo 106-6108',
      timezone: 'JST (UTC+9)',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>We're Here for You</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4 text-white">
            Contact GlobeTrotter
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have a question about planning your dream trip, a feature suggestion, or partnership opportunities? Reach out to our global team.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                    Ticket Created: {ticketId}
                  </span>
                  <h2 className="text-2xl font-extrabold font-heading text-slate-900 mb-2">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. We've received your request and sent a confirmation to <strong className="text-slate-900">{formData.email}</strong>. Our team typically responds within 2–4 hours.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Topic:</span>
                    <span className="capitalize">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Subject:</span>
                    <span className="truncate max-w-[200px]">{formData.subject}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Send Another Message</span>
                  </button>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
                  >
                    <span>Back to Explore</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-slate-900 mb-1">
                    Send us a Message
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Fill out the details below and we'll get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Maya Chen"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. maya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    >
                      <option value="general">General Question</option>
                      <option value="planning">Trip Planning / AI Builder</option>
                      <option value="collab">Collaborative Itineraries</option>
                      <option value="partnership">Business & Partnerships</option>
                      <option value="bug">Bug Report / Technical Issue</option>
                      <option value="privacy">Privacy & Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    >
                      <option value="normal">Normal (within 12h)</option>
                      <option value="high">High (Active travel assistance)</option>
                      <option value="urgent">Urgent (Account / Security)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    placeholder="Brief summary of your inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us what you need help with, what you are planning, or how we can improve GlobeTrotter..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-y"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-400">
                    Protected by GlobeTrotter Security Shield.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Channels & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Cards */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>Direct Contact Channels</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Email Us</h4>
                    <p className="text-xs text-slate-500 mb-1">For general questions and support</p>
                    <a href="mailto:support@globetrotter.io" className="text-xs font-bold text-blue-600 hover:underline">
                      support@globetrotter.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Global Helpline</h4>
                    <p className="text-xs text-slate-500 mb-1">Toll-free 24/7 emergency traveler assistance</p>
                    <a href="tel:+18005558768" className="text-xs font-bold text-emerald-600 hover:underline">
                      +1 (800) 555-TROTTER
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Response Times</h4>
                    <p className="text-xs text-slate-500">Live chat: Instant (&lt;2 min)</p>
                    <p className="text-xs text-slate-500">Email tickets: 2–4 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Self-Serve Box */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-blue-200 mb-2" />
              <h3 className="font-heading font-bold text-lg mb-1">
                Looking for immediate answers?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mb-4 leading-relaxed">
                Check our interactive Help Center with answers to 90% of traveler questions.
              </p>
              <Link
                to="/support"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
              >
                <span>Visit Support & FAQs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Global Hubs & Locations */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              Worldwide Presence
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Our Global Offices & Hubs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Where our team designs, codes, and powers your next adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalOffices.map((office, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2 font-heading font-bold text-base text-slate-900 mb-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{office.city}</span>
                </div>
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  {office.country} • <span className="text-slate-600">{office.timezone}</span>
                </div>
                <p className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-3">
                  {office.role}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {office.address}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
