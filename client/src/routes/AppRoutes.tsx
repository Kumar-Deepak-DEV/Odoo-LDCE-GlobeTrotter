import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MyTripsPage } from '../features/trip/MyTripsPage';
import { CreateTripPage } from '../features/trip/CreateTripPage';
import { ItineraryBuilderPage } from '../features/trip/ItineraryBuilderPage';
import { ItineraryViewPage } from '../features/trip/ItineraryViewPage';
import { SharedTripPage } from '../features/trip/SharedTripPage';
import { SearchPage } from '../features/search/SearchPage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { CommunityPage } from '../features/community/CommunityPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { AdminPage } from '../features/admin/AdminPage';

export const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Trips routes */}
      <Route path="/trips" element={<MyTripsPage />} />
      <Route path="/trips/new" element={<CreateTripPage />} />
      <Route path="/trips/:id/builder" element={<ItineraryBuilderPage />} />
      <Route path="/trips/:id" element={<ItineraryViewPage />} />
      <Route path="/trips/:id/public" element={<SharedTripPage />} />
      <Route path="/trips/share/:id" element={<SharedTripPage />} />
      <Route path="/share/:id" element={<SharedTripPage />} />

      {/* Search, Calendar, Community, Profile, Admin */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
