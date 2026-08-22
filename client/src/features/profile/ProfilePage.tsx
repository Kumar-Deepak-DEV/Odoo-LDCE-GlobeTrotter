import { useState, useRef, useEffect, useCallback } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  User,
  Users,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || 'Alex');
  const [lastName, setLastName] = useState(user?.lastName || 'Thompson');
  const [city, setCity] = useState(user?.city || 'San Francisco');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [email] = useState(user?.email || 'alex.thompson@example.com');
  const [bio, setBio] = useState(
    user?.bio ||
      'Avid traveler, amateur photographer, and coffee enthusiast. Always looking for the next adventure off the beaten path.'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.photoUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );

  // Editable toggles
  const [isEditingName, setIsEditingName] = useState(false);

  // Preferences State
  const [preferredCurrency, setPreferredCurrency] = useState('USD ($)');
  const [language, setLanguage] = useState('English (US)');
  const [receiveNewsletter, setReceiveNewsletter] = useState(true);

  // Security Panel State
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Modals & Feedback State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch fresh profile on mount
  const loadProfile = useCallback(async () => {
    try {
      const res = await userApi.getUserProfile();
      if (res?.user) {
        const u = res.user;
        setFirstName(u.firstName);
        setLastName(u.lastName);
        if (u.city) setCity(u.city);
        if (u.country) setCountry(u.country);
        if (u.bio) setBio(u.bio);
        if (u.photoUrl) setAvatarUrl(u.photoUrl);
        updateUser(u);
      }
    } catch {
      // Keep state
    }
  }, [updateUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);

    try {
      const res = await userApi.updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        city: city.trim(),
        country: country.trim(),
        bio: bio.trim(),
        photoUrl: avatarUrl,
      });

      if (res?.user) {
        updateUser(res.user);
      }
    } catch {
      // Update local context
      if (user) {
        updateUser({
          ...user,
          firstName,
          lastName,
          city,
          country,
          bio,
          photoUrl: avatarUrl,
        });
      }
    }

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handlePasswordUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setPasswordSuccess(null);
    }, 3000);
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
    setShowDeleteModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* PAGE TITLE & SUBTITLE */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1.5 font-normal">
            Manage your personal information, security preferences, and view your travel history.
          </p>
        </div>

        {/* TOP SECTION: 2-COLUMN GRID (MAIN FORM & SETTINGS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: PROFILE DETAILS & SECURITY */}
          <div className="lg:col-span-2 space-y-6">
            {/* MAIN PROFILE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
              {saveSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-medium">Changes saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  {/* Avatar Upload Column */}
                  <div className="flex flex-col items-center shrink-0 mx-auto sm:mx-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img
                        src={avatarUrl}
                        alt="Profile avatar"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-slate-100 shadow-md group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2.5 hover:underline cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>

                  {/* Form Inputs */}
                  <div className="flex-1 w-full space-y-5">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Last Name
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsEditingName(!isEditingName)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={email}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm cursor-not-allowed outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Contact support to change your email.
                      </p>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* COLLAPSIBLE SECURITY CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="text-lg font-bold font-heading text-slate-900">
                    Security
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your password and secure your account.
                  </p>
                </div>
                <div className="p-2 text-slate-400">
                  {isSecurityOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Collapsible Content */}
              {isSecurityOpen && (
                <div className="p-6 pt-0 border-t border-slate-100 animate-fadeIn">
                  {passwordSuccess && (
                    <div className="my-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Current Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPassword ? 'Hide password' : 'Show password'}</span>
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: PREFERENCES & DANGER ZONE */}
          <div className="space-y-6">
            {/* TRAVEL PREFERENCES CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Travel Preferences
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Currency
                </label>
                <select
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="JPY (¥)">JPY (¥)</option>
                  <option value="CAD ($)">CAD ($)</option>
                  <option value="INR (₹)">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Español">Español</option>
                  <option value="Français">Français</option>
                  <option value="Deutsch">Deutsch</option>
                  <option value="日本語">日本語</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={receiveNewsletter}
                    onChange={(e) => setReceiveNewsletter(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Receive newsletter & deals
                  </span>
                </label>
              </div>
            </div>

            {/* DELETE ACCOUNT (DANGER ZONE) CARD */}
            <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-6 space-y-3">
              <h3 className="font-heading font-bold text-base text-red-900">
                Delete Account
              </h3>
              <p className="text-xs text-red-700/80 leading-relaxed font-normal">
                Once you delete your account, there is no going back. All your travel history and saved deals will be permanently removed.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2.5 bg-[#EF4444] hover:bg-red-600 active:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: PREPLANNED TRIPS */}
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Preplanned Trips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Swiss Alps Retreat */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src="/images/adventure-dolomites.jpg"
                  alt="Swiss Alps Retreat"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Upcoming
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                    Swiss Alps Retreat
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Oct 12 - Oct 19, 2024</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    2 Travelers
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/trips/1/builder')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View Itinerary
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Tokyo City Explorer */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src="/images/tokyo.jpg"
                  alt="Tokyo City Explorer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Planning
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                    Tokyo City Explorer
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dec 05 - Dec 15, 2024</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    1 Traveler
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/trips/2/builder')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PREVIOUS TRIPS */}
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Previous Trips
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1: Amalfi Coast Getaway */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src="/images/amalfi.jpg"
                  alt="Amalfi Coast Getaway"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                    Amalfi Coast Getaway
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Completed Jun 2023</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate('/trips/new?destination=Amalfi')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline text-sm cursor-pointer"
                  >
                    Book Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">
              Permanently Delete Account?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone. You will lose all your itineraries, saved places, and account details.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
