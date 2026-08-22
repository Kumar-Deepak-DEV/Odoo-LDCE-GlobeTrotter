import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route Wrapper
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { NotFoundPage } from '../components/layout/NotFoundPage';

// Feature Pages
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MyTripsPage } from '../features/trip/MyTripsPage';
import { CreateTripPage } from '../features/trip/CreateTripPage';
import { ItineraryBuilderPage } from '../features/trip/ItineraryBuilderPage';
import { ItineraryViewPage } from '../features/trip/ItineraryViewPage';
import { SharedItineraryPage } from '../features/trip/SharedItineraryPage';
import { SearchPage } from '../features/search/SearchPage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { CommunityPage } from '../features/community/CommunityPage';
import { CommunityGuidesPage } from '../features/community/CommunityGuidesPage';
import { CommunityLeaderboardPage } from '../features/community/CommunityLeaderboardPage';
import { TravelBuddiesPage } from '../features/community/TravelBuddiesPage';
import { CommunityStoriesPage } from '../features/community/CommunityStoriesPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';

// Static Info & Legal Pages
import { PrivacyPage } from '../features/static/PrivacyPage';
import { TermsPage } from '../features/static/TermsPage';
import { SupportPage } from '../features/static/SupportPage';
import { ContactPage } from '../features/static/ContactPage';
import { AboutPage } from '../features/static/AboutPage';

// Root redirect helper component
const RootRedirect: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Public Info & Legal Pages */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Public Shared Itinerary Routes */}
      <Route path="/share/:slug" element={<SharedItineraryPage />} />
      <Route path="/trips/:id/public" element={<SharedItineraryPage />} />
      <Route path="/trips/share/:id" element={<SharedItineraryPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <MyTripsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/new"
        element={
          <ProtectedRoute>
            <CreateTripPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id/builder"
        element={
          <ProtectedRoute>
            <ItineraryBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            <ItineraryViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/guides"
        element={
          <ProtectedRoute>
            <CommunityGuidesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/leaderboard"
        element={
          <ProtectedRoute>
            <CommunityLeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/travel-buddies"
        element={
          <ProtectedRoute>
            <TravelBuddiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community/stories"
        element={
          <ProtectedRoute>
            <CommunityStoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Route (Protected + Admin Role required) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
