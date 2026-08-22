import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Compass,
  Users,
  Trophy,
  BookOpen,
  Plus,
} from 'lucide-react';

interface CommunityNavProps {
  onOpenCreateModal?: () => void;
  createButtonLabel?: string;
}

export const CommunityNav: FC<CommunityNavProps> = ({
  onOpenCreateModal,
  createButtonLabel = 'Create Post',
}) => {
  const location = useLocation();

  const tabs = [
    { label: 'Feed & Discussions', href: '/community', icon: MessageSquare },
    { label: 'Explore Itineraries', href: '/community/guides', icon: Compass },
    { label: 'Travel Buddies', href: '/community/travel-buddies', icon: Users },
    { label: 'Top Curators', href: '/community/leaderboard', icon: Trophy },
    { label: 'Travel Stories', href: '/community/stories', icon: BookOpen },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-20 z-30 shadow-2xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 sm:py-0">
          {/* Scrollable Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                tab.href === '/community'
                  ? location.pathname === '/community'
                  : location.pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 border-b-2 sm:border-b-0 border-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          {onOpenCreateModal && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{createButtonLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityNav;
