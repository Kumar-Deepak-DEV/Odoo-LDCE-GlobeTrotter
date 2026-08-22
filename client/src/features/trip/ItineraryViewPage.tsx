import { useState, useMemo } from 'react';
import type { FC, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  List as ListIcon,
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  Landmark,
  Utensils,
  Footprints,
  Pencil,
  X,
  TrendingDown,
  ChevronRight,
  Share2,
  Users,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

interface ItineraryActivity {
  id: string;
  dayNumber: number;
  name: string;
  category: 'Culture' | 'Food' | 'Sightseeing' | 'Adventure';
  durationMin: number;
  cost: number;
  isFree?: boolean;
}

interface ItineraryStop {
  id: string;
  cityName: string;
  country: string;
  budgetAllocated: number;
  isOverBudget?: boolean;
  overBudgetAmount?: number;
  activities: ItineraryActivity[];
}

const INITIAL_STOPS: ItineraryStop[] = [
  {
    id: 'stop-paris',
    cityName: 'Paris',
    country: 'France',
    budgetAllocated: 1100,
    isOverBudget: true,
    overBudgetAmount: 120,
    activities: [
      {
        id: 'act-1',
        dayNumber: 1,
        name: 'Louvre Museum',
        category: 'Culture',
        durationMin: 120,
        cost: 45,
      },
      {
        id: 'act-2',
        dayNumber: 2,
        name: 'Eiffel Tower Dinner',
        category: 'Food',
        durationMin: 150,
        cost: 180,
      },
    ],
  },
  {
    id: 'stop-london',
    cityName: 'London',
    country: 'UK',
    budgetAllocated: 1100,
    isOverBudget: false,
    activities: [
      {
        id: 'act-3',
        dayNumber: 3,
        name: 'Westminster Walk',
        category: 'Sightseeing',
        durationMin: 90,
        cost: 0,
        isFree: true,
      },
    ],
  },
];

export const ItineraryViewPage: FC = () => {
  const { id } = useParams<{ id?: string }>();

  // Page View Modes: List vs Calendar
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Trip Information
  const [tripTitle] = useState('European Highlights');
  const [tripDates] = useState('Oct 12 - Oct 25, 2024');
  const [tripDurationDays] = useState(14);

  // Budget State
  const [totalBudget, setTotalBudget] = useState(2200);
  const [stops] = useState<ItineraryStop[]>(INITIAL_STOPS);

  // Adjust Budget Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [tempBudget, setTempBudget] = useState(totalBudget);

  // Calculations
  const totalEstimatedCost = 2450; // matching mockup
  const balance = totalBudget - totalEstimatedCost;
  const isOverBudget = balance < 0;
  const avgCostPerDay = Math.round(totalEstimatedCost / tripDurationDays);

  // Filtered Stops based on Search
  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) return stops;
    return stops
      .map((stop) => ({
        ...stop,
        activities: stop.activities.filter(
          (act) =>
            act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            act.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stop.cityName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter(
        (stop) =>
          stop.activities.length > 0 ||
          stop.cityName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [stops, searchQuery]);

  const handleCategoryIcon = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Culture':
        return <Landmark className="w-3.5 h-3.5 text-teal-600" />;
      case 'Food':
        return <Utensils className="w-3.5 h-3.5 text-teal-600" />;
      case 'Sightseeing':
        return <Footprints className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <Landmark className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  const handleBudgetSave = (e: FormEvent) => {
    e.preventDefault();
    setTotalBudget(tempBudget);
    setShowAdjustModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* TOP CONTROLS ROW: SEARCH & LIST/CALENDAR TOGGLE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search itinerary..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List vs Calendar View Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-blue-50 text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar</span>
            </button>
          </div>
        </div>

        {/* GLOBAL WARNING ALERT: OVER BUDGET BANNER */}
        {isOverBudget && (
          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-sm font-medium flex items-center gap-3 animate-fadeIn shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
            <span>This trip is currently over budget.</span>
          </div>
        )}

        {/* TRIP TITLE, DATES & ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold font-heading text-slate-900 tracking-tight">
              {tripTitle}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1.5">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>{tripDates}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Share Trip Button */}
            <button
              type="button"
              onClick={() => {
                const shareUrl = `${window.location.origin}/share/${id || 'demo-trip-1'}`;
                navigator.clipboard.writeText(shareUrl);
                alert(`Public trip link copied: ${shareUrl}`);
              }}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Trip</span>
            </button>

            {/* View on Calendar Link */}
            <Link
              to="/calendar"
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>View on Calendar</span>
            </Link>

            {/* Post to Community Button */}
            <Link
              to="/community"
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Post to Community</span>
            </Link>

            {/* Edit Itinerary Builder */}
            <Link
              to={`/trips/${id || '1'}/builder`}
              className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl flex items-center gap-1 shadow-2xs"
            >
              <span>Edit Builder</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* MAIN 2-COLUMN VIEW CONTENT */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            {/* LEFT COLUMN: TIMELINE & ACTIVITIES (7 Cols on desktop) */}
            <div className="lg:col-span-7 space-y-8">
              {filteredStops.map((stop, index) => (
                <div key={stop.id} className="relative">
                  {/* Stop Destination Header Node */}
                  <div className="flex items-center gap-3">
                    {/* Concentric Bullseye Node */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-4 ${
                        index === 0
                          ? 'border-teal-500 bg-white ring-2 ring-teal-100'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          index === 0 ? 'bg-teal-500' : 'bg-slate-400'
                        }`}
                      />
                    </div>

                    <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                      {stop.cityName}, {stop.country}
                    </h2>

                    {/* Over Budget Pill for Stop */}
                    {stop.isOverBudget && stop.overBudgetAmount && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                        <TrendingDown className="w-3 h-3" />
                        Over budget by ${stop.overBudgetAmount}
                      </span>
                    )}
                  </div>

                  {/* Vertical Timeline Line & Activities */}
                  <div className="border-l-2 border-slate-200/90 ml-2.5 pl-6 sm:pl-8 space-y-3.5 pt-4 pb-4">
                    {stop.activities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-slate-200 transition-all group"
                      >
                        {/* Left: Square Day Badge + Details */}
                        <div className="flex items-center gap-4">
                          {/* Day Badge */}
                          <div className="w-12 h-12 rounded-xl bg-blue-50/80 text-blue-700 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                              DAY
                            </span>
                            <span className="text-base font-extrabold leading-none">
                              {act.dayNumber}
                            </span>
                          </div>

                          {/* Activity Name & Category */}
                          <div>
                            <h3 className="font-heading font-bold text-base text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                              {act.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                {handleCategoryIcon(act.category)}
                                <span>{act.category}</span>
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{act.durationMin} min</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Cost Pill Badge */}
                        <div className="shrink-0">
                          <span
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                              act.isFree
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]'
                            }`}
                          >
                            {act.isFree ? 'Free' : `$${act.cost}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: DARK MODE BUDGET BREAKDOWN CARD (5 Cols on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 border border-slate-800">
                {/* Estimated Cost Big Metric */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    ESTIMATED COST
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mt-1">
                    ${totalEstimatedCost.toLocaleString()}
                  </div>
                </div>

                {/* Total Budget & Balance Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">Total Budget</span>
                    <span className="font-bold text-white text-base">
                      ${totalBudget.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-medium">Balance</span>
                    <span
                      className={`font-bold text-base ${
                        balance < 0 ? 'text-[#F87171]' : 'text-emerald-400'
                      }`}
                    >
                      {balance < 0
                        ? `-$${Math.abs(balance).toLocaleString()}`
                        : `+$${balance.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Avg Cost Per Day Pill Box */}
                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">Avg. cost per day</span>
                  <span className="font-extrabold text-[#2DD4BF] text-base">
                    ${avgCostPerDay}
                  </span>
                </div>

                {/* Category Breakdown Progress Bar */}
                <div className="space-y-3 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    CATEGORY BREAKDOWN
                  </div>

                  {/* Multi-segment Horizontal Progress Bar */}
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#14B8A6] transition-all"
                      style={{ width: '45%' }}
                      title="Food: 45%"
                    />
                    <div
                      className="h-full bg-[#818CF8] transition-all"
                      style={{ width: '35%' }}
                      title="Sightseeing: 35%"
                    />
                    <div
                      className="h-full bg-[#FB923C] transition-all"
                      style={{ width: '20%' }}
                      title="Adventure: 20%"
                    />
                  </div>

                  {/* Legend Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
                      <span>Food 45%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
                      <span>Sightseeing 35%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
                      <span>Adventure 20%</span>
                    </div>
                  </div>
                </div>

                {/* Over Allocated Warning Inside Card */}
                {isOverBudget && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Trip is over total allocated budget by{' '}
                      <strong>${Math.abs(balance).toLocaleString()}</strong>.
                    </span>
                  </div>
                )}

                {/* Adjust Budget Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    setTempBudget(totalBudget);
                    setShowAdjustModal(true);
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-semibold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Adjust Budget</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* CALENDAR VIEW MODE */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Itinerary Timeline Calendar
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Oct 12 – Oct 25, 2024
              </span>
            </div>

            {/* Interactive Timeline Calendar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { day: 1, date: 'Oct 12', city: 'Paris', title: 'Louvre Museum Tour', cost: '$45', time: '120 min' },
                { day: 2, date: 'Oct 13', city: 'Paris', title: 'Eiffel Tower Dinner', cost: '$180', time: '150 min' },
                { day: 3, date: 'Oct 14', city: 'London', title: 'Westminster Walk', cost: 'Free', time: '90 min' },
                { day: 4, date: 'Oct 15', city: 'London', title: 'Tower of London & Crown Jewels', cost: '$35', time: '120 min' },
                { day: 5, date: 'Oct 16', city: 'London', title: 'West End Musical', cost: '$120', time: '160 min' },
              ].map((item) => (
                <div
                  key={item.day}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 hover:bg-blue-50/50 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md">
                      Day {item.day} • {item.date}
                    </span>
                    <span className="font-semibold text-slate-700">{item.city}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>{item.time}</span>
                    <span className="font-bold text-slate-800">{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADJUST BUDGET */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Adjust Trip Budget
              </h3>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBudgetSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Budget ($ USD)
                </label>
                <input
                  type="number"
                  min={500}
                  step={50}
                  required
                  value={tempBudget}
                  onChange={(e) => setTempBudget(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-base font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Dynamic Recalculation Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Cost:</span>
                  <span className="font-bold text-slate-900">${totalEstimatedCost}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>New Balance:</span>
                  <span
                    className={`font-bold ${
                      tempBudget - totalEstimatedCost < 0
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    ${tempBudget - totalEstimatedCost}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default ItineraryViewPage;
