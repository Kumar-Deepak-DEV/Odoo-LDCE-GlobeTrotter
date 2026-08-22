import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const CalendarPage: FC = () => {
  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Month & Year (Default January 2024 matching mockup)
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));

  // Selected day popover state (Default day 15 matching reference mockup)
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    dayNumber: number;
    monthStr: string;
    tripName: string;
    tripId: string;
  } | null>({
    dayNumber: 15,
    monthStr: 'Jan 15',
    tripName: 'Aegean Odyssey',
    tripId: 'trip-aegean',
  });

  const monthTitle = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Previous & Next Month handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date(2024, 0, 1)); // Jump to January 2024
    setSelectedDayInfo({
      dayNumber: 15,
      monthStr: 'Jan 15',
      tripName: 'Aegean Odyssey',
      tripId: 'trip-aegean',
    });
  };

  // 7x5 Calendar Grid construction for January 2024
  // Jan 1, 2024 was Monday. So Sunday Dec 31 is day 0 in week 1.
  const calendarCells = useMemo(() => {
    return [
      // Row 1 (Dec 31 - Jan 6)
      { dayNumber: 31, isCurrentMonth: false, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 1, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 2, isCurrentMonth: true, isTripDay: true, trip: 'Kyoto Autumn', isStart: true, color: 'gray' },
      { dayNumber: 3, isCurrentMonth: true, isTripDay: true, trip: 'Kyoto Autumn', isStart: false, color: 'gray' },
      { dayNumber: 4, isCurrentMonth: true, isTripDay: true, trip: 'Kyoto Autumn', isStart: false, color: 'gray' },
      { dayNumber: 5, isCurrentMonth: true, isTripDay: true, trip: 'Kyoto Autumn', isStart: false, color: 'gray' },
      { dayNumber: 6, isCurrentMonth: true, isTripDay: true, trip: 'Kyoto Autumn', isStart: false, color: 'gray' },

      // Row 2 (Jan 7 - Jan 13)
      { dayNumber: 7, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 8, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 9, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 10, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 11, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },
      { dayNumber: 12, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: true, color: 'blue' },
      { dayNumber: 13, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },

      // Row 3 (Jan 14 - Jan 20)
      { dayNumber: 14, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: true, color: 'blue' },
      { dayNumber: 15, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isHighlightDay: true, isStart: false },
      { dayNumber: 16, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isSolidBlock: true, isStart: false, color: 'blue' },
      { dayNumber: 17, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 18, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 19, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 20, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },

      // Row 4 (Jan 21 - Jan 27)
      { dayNumber: 21, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: true, color: 'blue' },
      { dayNumber: 22, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 23, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 24, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 25, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 26, isCurrentMonth: true, isTripDay: true, trip: 'Aegean Odyssey', isStart: false, color: 'blue' },
      { dayNumber: 27, isCurrentMonth: true, isTripDay: false, trip: null, isStart: false },

      // Row 5 (Jan 28 - Feb 3)
      { dayNumber: 28, isCurrentMonth: true, isTripDay: true, trip: 'PNW Roadtrip', isStart: true, color: 'teal' },
      { dayNumber: 29, isCurrentMonth: true, isTripDay: true, trip: 'PNW Roadtrip', isStart: false, color: 'teal' },
      { dayNumber: 30, isCurrentMonth: true, isTripDay: true, trip: 'PNW Roadtrip', isStart: false, color: 'teal' },
      { dayNumber: 31, isCurrentMonth: true, isTripDay: true, trip: 'PNW Roadtrip', isStart: false, color: 'teal' },
      { dayNumber: 1, isCurrentMonth: false, isTripDay: true, trip: 'PNW Roadtrip', isStart: false, color: 'teal' },
      { dayNumber: 2, isCurrentMonth: false, isTripDay: true, trip: 'PNW Roadtrip', isStart: false, color: 'teal' },
      { dayNumber: 3, isCurrentMonth: false, isTripDay: true, trip: 'PNW Roadtrip', isStart: false, color: 'teal' },
    ];
  }, []);

  const handleCellClick = (cell: (typeof calendarCells)[0]) => {
    if (cell.trip) {
      setSelectedDayInfo({
        dayNumber: cell.dayNumber,
        monthStr: `Jan ${cell.dayNumber}`,
        tripName: cell.trip,
        tripId:
          cell.trip === 'Aegean Odyssey'
            ? 'trip-aegean'
            : cell.trip === 'PNW Roadtrip'
            ? 'trip-pnw'
            : 'trip-kyoto',
      });
    } else {
      setSelectedDayInfo(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* TOP CONTROLS ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-sm outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 shadow-2xs"
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

          {/* Action Buttons: Today & + New Trip */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleTodayClick}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 text-slate-800 text-sm font-semibold rounded-2xl shadow-2xs transition-all cursor-pointer"
            >
              Today
            </button>

            <Link
              to="/trips/new"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Trip</span>
            </Link>
          </div>
        </div>

        {/* MAIN CALENDAR CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Month Navigation & Status Legend Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
            {/* Month Selector with Chevrons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {monthTitle}
              </h2>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span>Ongoing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
                <span>Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* CALENDAR MONTH GRID */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 bg-white border-b border-slate-200">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                <div
                  key={d}
                  className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400 border-r border-slate-100 last:border-r-0"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* 7x5 Grid Cells */}
            <div className="grid grid-cols-7 relative">
              {calendarCells.map((cell, idx) => {
                const isDecOrFeb = !cell.isCurrentMonth;
                const isSolid = cell.isSolidBlock;
                const isHighlight = cell.isHighlightDay;

                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(cell)}
                    className={`min-h-[105px] sm:min-h-[120px] p-2 border-r border-b border-slate-100 relative transition-colors cursor-pointer ${
                      idx % 7 === 6 ? 'border-r-0' : ''
                    } ${idx >= 28 ? 'border-b-0' : ''} ${
                      isSolid
                        ? 'bg-[#2563EB] text-white'
                        : isDecOrFeb
                        ? 'bg-slate-50/40'
                        : 'bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSolid
                            ? 'text-white'
                            : isHighlight
                            ? 'text-teal-600 font-extrabold'
                            : isDecOrFeb
                            ? 'text-slate-300'
                            : 'text-slate-700'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                    </div>

                    {/* Trip Range Span Bar */}
                    {cell.isTripDay && !isSolid && (
                      <div
                        className={`absolute left-0 right-0 bottom-6 sm:bottom-7 py-1 px-2.5 text-[11px] font-bold text-white truncate shadow-2xs ${
                          cell.color === 'blue'
                            ? 'bg-[#2563EB]'
                            : cell.color === 'teal'
                            ? 'bg-[#0D9488]'
                            : 'bg-[#94A3B8]'
                        } ${cell.isStart ? 'rounded-l-sm' : ''}`}
                      >
                        {cell.isStart ? cell.trip : ''}
                      </div>
                    )}

                    {/* Interactive Floating Popover on Day 15 */}
                    {isHighlight && selectedDayInfo && (
                      <div className="absolute top-12 left-0 sm:-left-4 z-30 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 min-w-[200px] animate-fadeIn">
                        <h4 className="text-sm font-bold text-slate-900 font-heading">
                          {selectedDayInfo.monthStr}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {selectedDayInfo.tripName}
                        </p>
                        <Link
                          to="/trips/1"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2.5 hover:underline"
                        >
                          <span>View Itinerary</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default CalendarPage;
