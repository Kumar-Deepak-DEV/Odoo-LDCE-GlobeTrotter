import { useState, useRef, useId } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  UploadCloud,
  MapPin,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { tripApi } from '../../api/tripApi';

interface DestinationSuggestion {
  id: string;
  name: string;
  country: string;
  costLevel: '$' | '$$' | '$$$';
  image: string;
  defaultCover: string;
}

const SUGGESTED_DESTINATIONS: DestinationSuggestion[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    costLevel: '$$$',
    image: '/images/paris.jpg',
    defaultCover: '/images/paris.jpg',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    costLevel: '$$',
    image: '/images/tokyo.jpg',
    defaultCover: '/images/tokyo.jpg',
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    costLevel: '$$$',
    image: '/images/newyork.jpg',
    defaultCover: '/images/newyork.jpg',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    costLevel: '$',
    image: '/images/bali.jpg',
    defaultCover: '/images/bali.jpg',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    costLevel: '$$',
    image: '/images/rome.jpg',
    defaultCover: '/images/rome.jpg',
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    costLevel: '$$$',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    defaultCover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
  },
];

export const CreateTripPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputId = useId();

  // Initial destination from query params if any
  const prefillDest = searchParams.get('destination') || '';

  // Form State
  const [tripName, setTripName] = useState(
    prefillDest ? `Trip to ${prefillDest}` : ''
  );
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2024-10-12');
  const [endDate, setEndDate] = useState('2024-10-20');
  const [isPublic, setIsPublic] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedDestinationId, setAddedDestinationId] = useState<string | null>(
    null
  );

  // Custom Calendar Popup State
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(
    'start'
  );
  const [calendarMonth, setCalendarMonth] = useState(new Date(2024, 9, 1)); // October 2024

  // Date Validation
  const isDateInvalid = Boolean(
    startDate && endDate && new Date(endDate) < new Date(startDate)
  );

  // Format date helper for UI display (e.g., Oct 12, 2024)
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2])
        );
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Calendar calculations
  const monthName = calendarMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    );
  };

  const handleSelectDay = (day: number) => {
    const y = calendarMonth.getFullYear();
    const m = String(calendarMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;

    if (showDatePicker === 'start') {
      setStartDate(formatted);
      setShowDatePicker('end');
    } else if (showDatePicker === 'end') {
      setEndDate(formatted);
      setShowDatePicker(null);
    }
  };

  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverPhoto(event.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyDestination = (dest: DestinationSuggestion) => {
    setTripName(`Trip to ${dest.name}`);
    setCoverPhoto(dest.defaultCover);
    setAddedDestinationId(dest.id);

    setTimeout(() => {
      setAddedDestinationId(null);
    }, 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!tripName.trim()) {
      alert('Please enter a trip name.');
      return;
    }

    if (isDateInvalid) {
      alert('End date must be on or after start date.');
      return;
    }

    setIsSubmitting(true);

    const tripData = {
      name: tripName.trim(),
      description: description.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isPublic,
      coverPhotoUrl: coverPhoto || '/images/adventure-mountain.jpg',
      status: 'UPCOMING' as const,
    };

    try {
      // Send to backend API
      const data = await tripApi.createTrip(tripData);
      const tripId = data?.trip?.id || `trip_${Date.now()}`;
      navigate(`/trips/${tripId}/builder`);
    } catch (err: unknown) {
      // Mock creation fallback for demo / offline
      const mockTripId = `trip_${Date.now()}`;
      const savedTrips = JSON.parse(
        localStorage.getItem('globetrotter_custom_trips') || '[]'
      );
      savedTrips.unshift({
        ...tripData,
        id: mockTripId,
        createdAt: new Date().toISOString(),
        stops: [],
      });
      localStorage.setItem(
        'globetrotter_custom_trips',
        JSON.stringify(savedTrips)
      );

      navigate(`/trips/${mockTripId}/builder`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* TOP FORM CARD: PLAN A NEW TRIP */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 transition-all">
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight mb-6">
            Plan a new trip
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Name */}
            <div>
              <label
                htmlFor="tripName"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Trip Name <span className="text-red-500">*</span>
              </label>
              <input
                id="tripName"
                type="text"
                required
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g., Summer in Europe"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this trip about?"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 resize-none"
              />
            </div>

            {/* Date Pickers Row with Calendar Flyout */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Start Date
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowDatePicker(
                        showDatePicker === 'start' ? null : 'start'
                      )
                    }
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm flex items-center gap-3 transition-all cursor-pointer text-left ${
                      showDatePicker === 'start'
                        ? 'border-blue-600 ring-4 ring-blue-100 text-slate-900 font-medium'
                        : 'border-slate-300 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{formatDisplayDate(startDate) || 'Select date'}</span>
                  </button>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    End Date
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setShowDatePicker(showDatePicker === 'end' ? null : 'end')
                    }
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm flex items-center gap-3 transition-all cursor-pointer text-left ${
                      isDateInvalid
                        ? 'border-red-400 ring-4 ring-red-100 text-red-900'
                        : showDatePicker === 'end'
                        ? 'border-blue-600 ring-4 ring-blue-100 text-slate-900 font-medium'
                        : 'border-slate-300 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{formatDisplayDate(endDate) || 'Select date'}</span>
                  </button>
                  {isDateInvalid && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>End date must be on or after start date</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Month Calendar Dropdown */}
              {showDatePicker && (
                <div className="absolute left-0 sm:left-0 z-30 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 w-full max-w-[320px] sm:max-w-[340px] animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-heading font-bold text-sm text-slate-900">
                      {monthName}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayStr = `${calendarMonth.getFullYear()}-${String(
                        calendarMonth.getMonth() + 1
                      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                      const isStart = startDate === dayStr;
                      const isEnd = endDate === dayStr;
                      const inRange =
                        startDate &&
                        endDate &&
                        new Date(dayStr) > new Date(startDate) &&
                        new Date(dayStr) < new Date(endDate);

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDay(day)}
                          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition-all cursor-pointer ${
                            isStart
                              ? 'border-2 border-teal-500 bg-white text-teal-700 font-bold'
                              : isEnd
                              ? 'bg-blue-600 text-white font-bold'
                              : inRange
                              ? 'bg-blue-50 text-blue-800'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>
                      Setting:{' '}
                      <strong className="text-slate-800 capitalize">
                        {showDatePicker} date
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(null)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Photo Upload Area */}
            <div>
              <input
                id={coverFileInputId}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="sr-only"
              />

              {coverPhoto ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[21/9] sm:aspect-[24/9] group">
                  <img
                    src={coverPhoto}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-slate-800 text-xs font-semibold rounded-xl shadow-md hover:bg-slate-50"
                    >
                      Change Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverPhoto(null)}
                      className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor={coverFileInputId}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-slate-50/80 transition-all flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-3 transition-colors">
                    <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 group-hover:underline mb-1">
                    {isUploading ? 'Uploading...' : 'Click to upload a cover photo'}
                  </div>
                  <p className="text-xs text-slate-400">PNG, JPG or GIF up to 10MB</p>
                </label>
              )}
            </div>

            {/* Make this trip public Toggle Switch */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <label
                  id="make-trip-public-label"
                  className="text-sm font-semibold text-slate-900 block"
                >
                  Make this trip public
                </label>
                <p
                  id="make-trip-public-help"
                  className="text-xs text-slate-500 mt-0.5"
                >
                  Public trips can be viewed and copied by others
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isPublic}
                aria-labelledby="make-trip-public-label"
                aria-describedby="make-trip-public-help"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  isPublic ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="px-6 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isDateInvalid}
                className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Trip'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* BOTTOM SECTION: SUGGESTED DESTINATIONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Suggested Destinations
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click + to autofill trip name & cover photo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SUGGESTED_DESTINATIONS.map((dest) => {
              const isAdded = addedDestinationId === dest.id;

              return (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Cost Level Pill Badge */}
                    <div className="absolute top-3 right-3 bg-[#F97316] text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                      {dest.costLevel}
                    </div>
                  </div>

                  {/* Bottom Content Row */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        {dest.country}
                      </p>
                    </div>

                    {/* Plus / Add Action Button */}
                    <button
                      type="button"
                      onClick={() => handleApplyDestination(dest)}
                      aria-label={`Select ${dest.name}`}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default CreateTripPage;
