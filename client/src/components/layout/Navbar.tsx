import { useState } from 'react';
import type { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  User,
  LogOut,
  PlusCircle,
  Shield,
  Menu,
  X,
  Bell,
  Heart,
  Plus,
  Calendar,
  Users,
  Plane,
  Sun,
  Sparkles,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface NotificationItem {
  id: string;
  type: 'trip' | 'collab' | 'alert' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'trip',
    title: 'Upcoming: Aegean Odyssey',
    message: 'Your Aegean cruise begins soon. Day 4: Mykonos Exploration is scheduled!',
    time: '15m ago',
    read: false,
    link: '/calendar',
  },
  {
    id: 'notif-2',
    type: 'collab',
    title: 'Co-Planning Update',
    message: 'Elena added "Fushimi Inari Shrine" to your Kyoto Autumn itinerary.',
    time: '1h ago',
    read: false,
    link: '/trips',
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: 'Weather Update',
    message: 'Sunny skies forecasted for Pacific Northwest Roadtrip this weekend.',
    time: '4h ago',
    read: false,
    link: '/calendar',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'AI Smart Recommendation',
    message: 'We discovered 3 hidden cafes near your stay in Tokyo!',
    time: '1d ago',
    read: true,
    link: '/search',
  },
];

import { VoyagoLogo } from '../ui/VoyagoLogo';

export const Navbar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'all' | 'trip' | 'alert'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismissNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    navigate(item.link);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeNotifTab === 'all') return true;
    if (activeNotifTab === 'trip') return n.type === 'trip' || n.type === 'collab';
    if (activeNotifTab === 'alert') return n.type === 'alert' || n.type === 'system';
    return true;
  });

  const navLinks = [
    { label: 'Explore', href: '/dashboard' },
    { label: 'Trips', href: '/trips' },
    { label: 'Search', href: '/search' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Community', href: '/community' },
  ];

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Voyago Brand Logo */}
        <VoyagoLogo asLink size="md" />

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              (link.href === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/')) ||
              (link.href === '/trips' && (location.pathname === '/trips' || location.pathname.startsWith('/trips/'))) ||
              (link.href === '/search' && location.pathname === '/search') ||
              (link.href === '/calendar' && location.pathname === '/calendar') ||
              (link.href === '/community' && (location.pathname === '/community' || location.pathname.startsWith('/community/')));

            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}

          {/* Conditional Admin Nav Link if Admin */}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className={`relative py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/admin'
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Admin
              {location.pathname === '/admin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-fadeIn" />
              )}
            </Link>
          )}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Add Trip Button */}
          <Link
            to="/trips/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Trip</span>
          </Link>

          {/* Functional Notification Bell & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              aria-label="Notifications"
              className={`relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ${
                showNotifications ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-200' : ''
              }`}
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full ring-2 ring-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 sm:right-auto sm:-left-36 lg:right-0 lg:left-auto mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-fadeIn">
                  {/* Header */}
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          title="Mark all as read"
                          className="p-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">Mark read</span>
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAll}
                          title="Clear all"
                          className="p-1.5 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="px-4 py-2 flex items-center gap-1.5 border-b border-slate-100/60 bg-slate-50/50">
                    {(['all', 'trip', 'alert'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveNotifTab(tab)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                          activeNotifTab === tab
                            ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tab === 'all' ? 'All' : tab === 'trip' ? 'Trips' : 'Alerts'}
                      </button>
                    ))}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No notifications</p>
                        <p className="text-[11px] text-slate-400">You're all caught up with your trips!</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => {
                        return (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                              !notif.read ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            {/* Icon badge based on type */}
                            <div
                              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                                notif.type === 'trip'
                                  ? 'bg-blue-100 text-blue-600'
                                  : notif.type === 'collab'
                                  ? 'bg-teal-100 text-teal-600'
                                  : notif.type === 'alert'
                                  ? 'bg-amber-100 text-amber-600'
                                  : 'bg-purple-100 text-purple-600'
                              }`}
                            >
                              {notif.type === 'trip' && <Plane className="w-4 h-4" />}
                              {notif.type === 'collab' && <Users className="w-4 h-4" />}
                              {notif.type === 'alert' && <Sun className="w-4 h-4" />}
                              {notif.type === 'system' && <Sparkles className="w-4 h-4" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-1">
                                <h4
                                  className={`text-xs font-heading truncate ${
                                    !notif.read
                                      ? 'font-bold text-slate-900'
                                      : 'font-medium text-slate-700'
                                  }`}
                                >
                                  {notif.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                {notif.message}
                              </p>
                            </div>

                            {/* Unread indicator / Dismiss */}
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 absolute right-3 top-4" />
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleDismissNotif(notif.id, e)}
                              className="opacity-0 group-hover:opacity-100 absolute right-2.5 bottom-2.5 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-md transition-all cursor-pointer"
                              title="Dismiss"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Link to Calendar */}
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                    <Link
                      to="/calendar"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>View Full Trip Calendar</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Saved / Favorites Trigger */}
          <Link
            to="/search?tab=saved"
            aria-label="Saved items"
            className="p-2 text-slate-600 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
          </Link>

          {/* User Profile / Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-100 transition-all cursor-pointer"
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.firstName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.firstName ? user.firstName[0] : 'U'}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile & Settings
                    </Link>

                    <Link
                      to="/trips"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-blue-600" />
                      My Trips
                    </Link>

                    <Link
                      to="/calendar"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      Trip Calendar
                    </Link>

                    <Link
                      to="/community"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Users className="w-4 h-4 text-amber-600" />
                      Community Hub
                    </Link>

                    <Link
                      to="/trips/new"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                      Plan a Trip
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/trips/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50"
            >
              + Add Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
