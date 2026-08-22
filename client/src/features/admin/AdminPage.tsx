import { useState, useMemo, useEffect, useCallback } from 'react';
import type { FC, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Pencil,
  Trash2,
  Bell,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  X,
  Check,
  LifeBuoy,
  Plus,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/adminApi';
import type { AdminStatsResponse } from '../../api/adminApi';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  joinedDate: string;
}

interface PopularCityStat {
  id: string;
  name: string;
  country: string;
  totalTrips: number;
  avgStayDays: number;
  popularityScore: number;
}

interface PopularActivityStat {
  id: string;
  name: string;
  cityName: string;
  category: string;
  price: number;
  bookings: number;
  rating: number;
}

const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'usr-1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    role: 'ADMIN',
    joinedDate: 'Jan 12, 2024',
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: 'USER',
    joinedDate: 'Feb 05, 2024',
  },
  {
    id: 'usr-3',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    role: 'USER',
    joinedDate: 'Feb 18, 2024',
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena@example.com',
    role: 'USER',
    joinedDate: 'Mar 01, 2024',
  },
  {
    id: 'usr-5',
    name: 'David Kim',
    email: 'david.k@example.com',
    role: 'ADMIN',
    joinedDate: 'Mar 10, 2024',
  },
];

const INITIAL_CITIES: PopularCityStat[] = [
  { id: 'c1', name: 'Paris', country: 'France', totalTrips: 3420, avgStayDays: 5.2, popularityScore: 98 },
  { id: 'c2', name: 'Tokyo', country: 'Japan', totalTrips: 3180, avgStayDays: 7.4, popularityScore: 96 },
  { id: 'c3', name: 'Amalfi Coast', country: 'Italy', totalTrips: 2450, avgStayDays: 4.8, popularityScore: 92 },
  { id: 'c4', name: 'New York', country: 'United States', totalTrips: 2190, avgStayDays: 4.5, popularityScore: 89 },
  { id: 'c5', name: 'Santorini', country: 'Greece', totalTrips: 1870, avgStayDays: 4.1, popularityScore: 87 },
];

const INITIAL_ACTIVITIES: PopularActivityStat[] = [
  { id: 'a1', name: 'Louvre Museum Tour', cityName: 'Paris', category: 'Culture', price: 45, bookings: 1420, rating: 4.9 },
  { id: 'a2', name: 'Eiffel Tower Dinner', cityName: 'Paris', category: 'Food', price: 180, bookings: 980, rating: 4.8 },
  { id: 'a3', name: 'Shibuya Food & Neon Walk', cityName: 'Tokyo', category: 'Food', price: 65, bookings: 1120, rating: 4.9 },
  { id: 'a4', name: 'Positano Coastal Boat Cruise', cityName: 'Amalfi Coast', category: 'Adventure', price: 110, bookings: 840, rating: 4.9 },
  { id: 'a5', name: 'Westminster Historical Walk', cityName: 'London', category: 'Sightseeing', price: 0, bookings: 1650, rating: 4.7 },
];

export const AdminPage: FC = () => {
  const { user } = useAuth();

  // Top Nav active tab
  const [activeNavTab, setActiveNavTab] = useState<'Dashboard' | 'Users' | 'Analytics' | 'Settings'>('Dashboard');

  // Sub-Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<
    'users' | 'cities' | 'activities' | 'analytics'
  >('users');

  // Search & Role Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [users, setUsers] = useState<AdminUserItem[]>(INITIAL_USERS);
  const [adminStats, setAdminStats] = useState<AdminStatsResponse['stats'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Feedback
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserItem | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Admin stats and users from backend API
  const loadAdminData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.allSettled([
        adminApi.getAdminStats(),
        adminApi.getAdminUsers({ limit: 50 }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.stats) {
        setAdminStats(statsRes.value.stats);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.users) {
        const mappedUsers: AdminUserItem[] = usersRes.value.users.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role as 'ADMIN' | 'USER',
          joinedDate: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }));
        if (mappedUsers.length > 0) {
          setUsers(mappedUsers);
        }
      }
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleSaveEditUser = (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setToastMessage(`Updated ${editingUser.name}'s profile successfully.`);
    setTimeout(() => setToastMessage(null), 2500);
    setEditingUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    const target = deletingUser;
    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    setToastMessage(`Removed user ${target.name}.`);
    setTimeout(() => setToastMessage(null), 2500);
    setDeletingUser(null);

    if (!target.id.startsWith('usr-')) {
      try {
        await adminApi.deleteAdminUser(target.id);
      } catch {
        // Handled
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* ADMIN HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl text-blue-600 tracking-tight">
              GlobeTrotter
            </span>
            <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
              Admin
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {(['Dashboard', 'Users', 'Analytics', 'Settings'] as const).map((tab) => {
              const isActive = activeNavTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveNavTab(tab);
                    if (tab === 'Users') setActiveSubTab('users');
                    if (tab === 'Analytics') setActiveSubTab('analytics');
                  }}
                  className={`relative py-2 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Admin Notifications"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              aria-label="Admin Settings"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <SettingsIcon className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Support</span>
            </button>

            {/* Admin Avatar */}
            <div className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-200 overflow-hidden ml-1">
              <img
                src={
                  user?.photoUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt="Admin avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SUB-NAVIGATION TABS (PILLS) */}
        <div>
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSubTab('users')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'users'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Manage Users
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('cities')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'cities'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Popular Cities
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('activities')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'activities'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Popular Activities
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('analytics')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              User Trends & Analytics
            </button>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {toastMessage && (
          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl animate-fadeIn max-w-md mx-auto">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 4 METRIC KPI STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Users */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <div className="text-xs font-semibold text-slate-500">
              Total Users
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {adminStats ? adminStats.totalUsers.toLocaleString() : '12,450'}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑12%</span>
              </span>
            </div>
          </div>

          {/* Card 2: Total Trips */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <div className="text-xs font-semibold text-slate-500">
              Total Trips
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {adminStats ? adminStats.totalTrips.toLocaleString() : '8,320'}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑5%</span>
              </span>
            </div>
          </div>

          {/* Card 3: Active Trips */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <div className="text-xs font-semibold text-slate-500">
              Active Trips
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {adminStats?.activeTrips !== undefined ? adminStats.activeTrips.toLocaleString() : '1,240'}
              </span>
              <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>↓2%</span>
              </span>
            </div>
          </div>

          {/* Card 4: Total Stops */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <div className="text-xs font-semibold text-slate-500">
              Total Stops
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {adminStats ? adminStats.totalStops.toLocaleString() : '3,120'}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑8%</span>
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: MANAGE USERS TABLE VIEW */}
        {activeSubTab === 'users' && (
          <div className="space-y-4">
            {/* Table Search & Role Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Role Filter Segmented Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {(['ALL', 'USER', 'ADMIN'] as const).map((r) => {
                  const isActive = roleFilter === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleFilter(r)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'ALL' ? 'All' : r === 'USER' ? 'User' : 'Admin'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* USERS DATA TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Joined</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {u.name}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {u.email}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                              u.role === 'ADMIN'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                          {u.joinedDate}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingUser(u)}
                              aria-label={`Edit ${u.name}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingUser(u)}
                              aria-label={`Delete ${u.name}`}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER / PAGINATION */}
              <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-medium">
                  Showing 1 to {filteredUsers.length} of 12,450 entries
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold ${
                      currentPage === 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className="w-8 h-8 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    2
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className="w-8 h-8 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    3
                  </button>

                  <span className="px-1 text-slate-400 text-xs">...</span>

                  <button
                    type="button"
                    className="px-2.5 h-8 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    1245
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POPULAR CITIES VIEW */}
        {activeSubTab === 'cities' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  Top Trending Destinations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by global bookings and user itinerary selections.
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Country</th>
                    <th className="py-3.5 px-4">Total Trips</th>
                    <th className="py-3.5 px-4">Avg Duration</th>
                    <th className="py-3.5 px-4">Popularity Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_CITIES.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.country}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{c.totalTrips.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-500">{c.avgStayDays} days</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.popularityScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{c.popularityScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: POPULAR ACTIVITIES VIEW */}
        {activeSubTab === 'activities' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  Top Recommended Activities
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Most saved and scheduled items by GlobeTrotter travelers.
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Activity</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Bookings</th>
                    <th className="py-3.5 px-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_ACTIVITIES.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{act.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{act.cityName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {act.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {act.price === 0 ? 'Free' : `$${act.price}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{act.bookings.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-amber-600 font-bold">★ {act.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USER TRENDS & ANALYTICS VIEW */}
        {activeSubTab === 'analytics' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Platform Growth & Conversion Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <div className="text-xs font-semibold text-blue-700">Daily Active Planners</div>
                <div className="text-2xl font-extrabold text-blue-900">4,890</div>
                <p className="text-xs text-blue-600">+18% compared to last week</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="text-xs font-semibold text-emerald-700">Itineraries Exported</div>
                <div className="text-2xl font-extrabold text-emerald-900">1,940</div>
                <p className="text-xs text-emerald-600">82% completed with &gt; 3 stops</p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                <div className="text-xs font-semibold text-purple-700">Community Engagement</div>
                <div className="text-2xl font-extrabold text-purple-900">14.2k</div>
                <p className="text-xs text-purple-600">Likes, shares and comments</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Edit User Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as 'ADMIN' | 'USER',
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">
              Remove User?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to remove <strong>{deletingUser.name}</strong> ({deletingUser.email})? This will revoke all their permissions and itineraries.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Admin Support Desk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Need assistance with system telemetry, server logs, or platform moderation?
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>System Status: All systems operational</span>
              </div>
              <p className="text-slate-500">Database connection: Active · Latency: 24ms</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="mt-5 w-full py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
