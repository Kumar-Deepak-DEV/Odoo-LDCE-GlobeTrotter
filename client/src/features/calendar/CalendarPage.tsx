import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
  Plane,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { tripApi } from '../../api/tripApi';

export interface CalendarTrip {
  id: string;
  title: string;
  subtitle: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'ongoing' | 'upcoming' | 'completed';
  color: string;
}

const DEFAULT_TRIPS: CalendarTrip[] = [
  {
    id: 'trip-kyoto',
    title: 'Kyoto Autumn',
    subtitle: 'Day 1: Arashiyama Bamboo Grove & Gion',
    startDate: '2024-01-02',
    endDate: '2024-01-06',
    status: 'completed',
    color: '#64748B', // Slate gray
  },
  {
    id: 'trip-aegean',
    title: 'Aegean Odyssey',
    subtitle: 'Day 4: Mykonos Exploration',
    startDate: '2024-01-12',
    endDate: '2024-01-18',
    status: 'ongoing',
    color: '#2563EB', // Royal blue
  },
  {
    id: 'trip-pnw',
    title: 'PNW Roadtrip',
    subtitle: 'Day 1: Seattle to Olympic National Park',
    startDate: '2024-01-28',
    endDate: '2024-02-03',
    status: 'upcoming',
    color: '#14B8A6', // Vibrant teal/green
  },
  {
    id: 'trip-alpine',
    title: 'Swiss Alps Expedition',
    subtitle: 'Day 2: Zermatt & Matterhorn Glacier Trail',
    startDate: '2024-02-12',
    endDate: '2024-02-18',
    status: 'upcoming',
    color: '#14B8A6',
  },
  {
    id: 'trip-sakura',
    title: 'Tokyo Cherry Blossom',
    subtitle: 'Day 3: Shinjuku Gyoen & Meguro River',
    startDate: '2024-03-20',
    endDate: '2024-03-27',
    status: 'upcoming',
    color: '#2563EB',
  },
  {
    id: 'trip-amalfi',
    title: 'Amalfi Coast Getaway',
    subtitle: 'Day 2: Positano Cliffside & Capri Boat Tour',
    startDate: '2024-04-14',
    endDate: '2024-04-20',
    status: 'upcoming',
    color: '#14B8A6',
  },
];

export const CalendarPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Month Date State (Default Jan 2024 matching reference mockup)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 0, 1));
  const [allTrips, setAllTrips] = useState<CalendarTrip[]>(DEFAULT_TRIPS);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await tripApi.getTrips({ limit: 20 });
        if (res?.trips && res.trips.length > 0) {
          const mapped: CalendarTrip[] = res.trips.map((t) => ({
            id: t.id,
            title: t.name,
            subtitle: 'Custom Day Exploration',
            startDate: t.startDate ? t.startDate.split('T')[0] : '2024-01-10',
            endDate: t.endDate ? t.endDate.split('T')[0] : '2024-01-16',
            status: (t.status?.toLowerCase() || 'upcoming') as 'ongoing' | 'upcoming' | 'completed',
            color: t.status === 'ONGOING' ? '#2563EB' : t.status === 'COMPLETED' ? '#64748B' : '#14B8A6',
          }));
          setAllTrips([...DEFAULT_TRIPS, ...mapped]);
        }
      } catch {
        // Keep defaults
      }
    };
    loadTrips();
  }, []);

  // Selected Day Popover
  const [activePopover, setActivePopover] = useState<{
    dayNumber: number;
    monthStr: string;
    tripTitle: string;
    subtitle: string;
    status: 'ongoing' | 'upcoming' | 'completed';
    tripId: string;
  } | null>({
    dayNumber: 15,
    monthStr: 'Jan 15',
    tripTitle: 'Aegean Odyssey',
    subtitle: 'Day 4: Mykonos Exploration',
    status: 'ongoing',
    tripId: 'trip-aegean',
  });

  const monthTitle = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setActivePopover(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setActivePopover(null);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date(2024, 0, 1));
    setActivePopover({
      dayNumber: 15,
      monthStr: 'Jan 15',
      tripTitle: 'Aegean Odyssey',
      subtitle: 'Day 4: Mykonos Exploration',
      status: 'ongoing',
      tripId: 'trip-aegean',
    });
  };

  // Format date helper: YYYY-MM-DD
  const formatDateISO = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Dynamically compute calendar days for the selected month & year
  const calendarCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month (0=Sun, 1=Mon, ..., 6=Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Number of days in current month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Number of days in previous month
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      date: Date;
      dateStr: string;
      day: number;
      isCurrentMonth: boolean;
      isRingDay: boolean;
      isSolidBlueDay: boolean;
      trip: CalendarTrip | null;
      isStart: boolean;
    }[] = [];

    // Filter trips by status and search query
    const activeTripsList = allTrips.filter((t) => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSearch =
        !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    // 1. Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      const dStr = formatDateISO(d);

      // Check for trip spanning this date
      const matchingTrip = activeTripsList.find(
        (t) => t.startDate <= dStr && dStr <= t.endDate
      ) || null;

      const isStart = matchingTrip
        ? matchingTrip.startDate === dStr || d.getDay() === 0
        : false;

      cells.push({
        date: d,
        dateStr: dStr,
        day: dayNum,
        isCurrentMonth: false,
        isRingDay: false,
        isSolidBlueDay: false,
        trip: matchingTrip,
        isStart,
      });
    }

    // 2. Current month days (1 to totalDaysInMonth)
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dStr = formatDateISO(d);

      // Check for trip spanning this date
      const matchingTrip = activeTripsList.find(
        (t) => t.startDate <= dStr && dStr <= t.endDate
      ) || null;

      const isStart = matchingTrip
        ? matchingTrip.startDate === dStr || d.getDay() === 0
        : false;

      // Special highlight days (Jan 15 & Jan 17 matching mockup design)
      const isRingDay = year === 2024 && month === 0 && dayNum === 15;
      const isSolidBlueDay = year === 2024 && month === 0 && dayNum === 17;

      cells.push({
        date: d,
        dateStr: dStr,
        day: dayNum,
        isCurrentMonth: true,
        isRingDay,
        isSolidBlueDay,
        trip: matchingTrip,
        isStart,
      });
    }

    // 3. Next month leading days to fill 35 or 42 grid cells (5 or 6 complete weeks)
    const targetCellCount = cells.length <= 35 ? 35 : 42;
    const remainingCells = targetCellCount - cells.length;

    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const d = new Date(year, month + 1, dayNum);
      const dStr = formatDateISO(d);

      const matchingTrip = activeTripsList.find(
        (t) => t.startDate <= dStr && dStr <= t.endDate
      ) || null;

      const isStart = matchingTrip
        ? matchingTrip.startDate === dStr || d.getDay() === 0
        : false;

      cells.push({
        date: d,
        dateStr: dStr,
        day: dayNum,
        isCurrentMonth: false,
        isRingDay: false,
        isSolidBlueDay: false,
        trip: matchingTrip,
        isStart,
      });
    }

    return cells;
  }, [currentDate, allTrips, statusFilter, searchQuery]);

  const handleCellClick = (cell: (typeof calendarCells)[0]) => {
    if (cell.trip) {
      setActivePopover({
        dayNumber: cell.day,
        monthStr: cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tripTitle: cell.trip.title,
        subtitle: cell.trip.subtitle,
        status: cell.trip.status,
        tripId: cell.trip.id,
      });
    } else if (cell.isRingDay) {
      setActivePopover({
        dayNumber: 15,
        monthStr: 'Jan 15',
        tripTitle: 'Aegean Odyssey',
        subtitle: 'Day 4: Mykonos Exploration',
        status: 'ongoing',
        tripId: 'trip-aegean',
      });
    } else {
      setActivePopover(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* TOP CONTROLS: Search on Left, Today & Filter on Right */}
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-sm outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 shadow-2xs placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Today & Filter Icon */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleTodayClick}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 text-slate-800 text-sm font-semibold rounded-2xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Today</span>
              {allTrips.length > 0 && (
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold">
                  {allTrips.length}
                </span>
              )}
            </button>

            {/* Filter Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                aria-label="Filter trips"
                className={`p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-700 shadow-2xs transition-all cursor-pointer flex items-center justify-center ${
                  statusFilter !== 'all' ? 'ring-2 ring-blue-500 text-blue-600' : ''
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* Filter Dropdown */}
              {showFilterMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowFilterMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40 animate-fadeIn">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Filter by Status
                    </div>
                    {(['all', 'ongoing', 'upcoming', 'completed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 capitalize ${
                          statusFilter === status ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{status === 'all' ? 'All Trips' : status}</span>
                        {statusFilter === status && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CALENDAR CARD (Matching Reference Image) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Header inside Card: Dynamic Month Title + Chevrons on Right */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              {monthTitle}
            </h2>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* DYNAMIC CALENDAR GRID */}
          <div className="border border-slate-200/80 rounded-2xl overflow-visible shadow-2xs bg-white">
            {/* Weekdays Row */}
            <div className="grid grid-cols-7 border-b border-slate-200/80 bg-white">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                <div
                  key={d}
                  className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Dynamic Days Grid */}
            <div className="grid grid-cols-7 relative divide-x divide-y divide-slate-100">
              {calendarCells.map((cell, idx) => {
                const isOverflow = !cell.isCurrentMonth;
                const isRing = cell.isRingDay;
                const isSolidBlue = cell.isSolidBlueDay;
                const hasTrip = !!cell.trip;

                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(cell)}
                    className={`min-h-[105px] sm:min-h-[115px] p-2.5 relative transition-colors cursor-pointer ${
                      isOverflow ? 'bg-white' : 'bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Day Number / Ring / Solid Circle */}
                    <div className="flex items-center justify-start">
                      {isRing ? (
                        <div className="w-7 h-7 rounded-full border-2 border-[#14B8A6] flex items-center justify-center text-[#14B8A6] font-bold text-xs">
                          {cell.day}
                        </div>
                      ) : isSolidBlue ? (
                        <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {cell.day}
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-semibold ${
                            isOverflow ? 'text-slate-300' : 'text-slate-800'
                          }`}
                        >
                          {cell.day}
                        </span>
                      )}
                    </div>

                    {/* Continuous Multi-Day Trip Span Bar */}
                    {hasTrip && cell.trip && (
                      <div
                        style={{ backgroundColor: cell.trip.color }}
                        className={`absolute left-0 right-0 bottom-4 sm:bottom-5 py-1 px-2 text-[11px] font-bold text-white truncate shadow-2xs transition-all hover:brightness-110 ${
                          cell.isStart ? 'rounded-l-sm' : ''
                        }`}
                      >
                        {cell.isStart ? cell.trip.title : ''}
                      </div>
                    )}

                    {/* Interactive Popover Tooltip */}
                    {isRing && activePopover && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-12 left-0 sm:-left-2 z-30 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 min-w-[210px] sm:min-w-[230px] animate-fadeIn"
                      >
                        {/* Triangle pointer at top */}
                        <div className="w-3 h-3 bg-white border-t border-l border-slate-100 transform rotate-45 absolute -top-1.5 left-5" />

                        {/* Status Line */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activePopover.status === 'ongoing'
                                ? 'bg-blue-600'
                                : activePopover.status === 'upcoming'
                                ? 'bg-teal-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                            {activePopover.status.toUpperCase()} EVENT
                          </span>
                        </div>

                        {/* Trip Heading */}
                        <h4 className="font-heading font-bold text-sm text-slate-900">
                          {activePopover.tripTitle}
                        </h4>

                        {/* Subtitle */}
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {activePopover.subtitle}
                        </p>

                        {/* View Itinerary CTA */}
                        <Link
                          to="/trips"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-3 group"
                        >
                          <span>View Itinerary</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CALENDAR LEGEND (Centered at bottom of card matching image) */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span>Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
              <span>Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* BOTTOM 3 FEATURED CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: NEXT ADVENTURE - Pacific Northwest */}
          <div
            onClick={() => {
              setCurrentDate(new Date(2024, 0, 1));
              setActivePopover({
                dayNumber: 28,
                monthStr: 'Jan 28',
                tripTitle: 'PNW Roadtrip',
                subtitle: 'Day 1: Seattle to Olympic National Park',
                status: 'upcoming',
                tripId: 'trip-pnw',
              });
            }}
            className="group relative h-48 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Pacific Northwest Coast"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/90 block mb-1">
                NEXT ADVENTURE
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Pacific Northwest
              </h3>
            </div>
          </div>

          {/* Card 2: RECENTLY VISITED - Kyoto, Japan */}
          <div
            onClick={() => {
              setCurrentDate(new Date(2024, 0, 1));
              setActivePopover({
                dayNumber: 2,
                monthStr: 'Jan 2',
                tripTitle: 'Kyoto Autumn',
                subtitle: 'Day 1: Arashiyama Bamboo Grove',
                status: 'completed',
                tripId: 'trip-kyoto',
              });
            }}
            className="group relative h-48 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
              alt="Kyoto Japan"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/90 block mb-1">
                RECENTLY VISITED
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Kyoto, Japan
              </h3>
            </div>
          </div>

          {/* Card 3: Solid Blue Plan New Trip Card */}
          <div className="bg-[#2563EB] rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-sm">
            <div>
              {/* White Airplane Takeoff Icon */}
              <div className="mb-3">
                <Plane className="w-7 h-7 text-white stroke-[2.2] -rotate-45" />
              </div>

              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-snug">
                Ready to start planning your next journey?
              </h3>
            </div>

            <div className="pt-4">
              <Link
                to="/trips/new"
                className="inline-block px-5 py-2.5 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
              >
                Plan New Trip
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalendarPage;
