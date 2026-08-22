import type { FC } from 'react';
import { Link } from 'react-router-dom';

export interface VoyagoLogoProps {
  /** Size variant for icon and wordmark */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Text color variant: 'dark' (default #0F172A) or 'light' (white for dark backgrounds) */
  variant?: 'dark' | 'light';
  /** Whether to render the 'Voyago' wordmark next to the icon mark */
  showText?: boolean;
  /** Optional subtitle or badge */
  tagline?: string;
  /** Whether to wrap the logo in a React Router Link to /dashboard (default: false) */
  asLink?: boolean;
  /** Optional link target if asLink is true (default: '/dashboard') */
  href?: string;
  /** Extra container className */
  className?: string;
}

/**
 * Standalone pure vector icon mark for Voyago:
 * Features a modern voyager paper-plane / compass needle with dynamic gradient fold
 * and an orbiting waypoint route arc.
 */
export const VoyagoIcon: FC<{ size?: number | string; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      aria-label="Voyago Icon"
    >
      <defs>
        {/* Primary Voyager Blue Gradient */}
        <linearGradient id="voyagoPrimary" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Wing Shadow / Fold Facet */}
        <linearGradient id="voyagoFacet" x1="20" y1="8" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.95" />
        </linearGradient>

        {/* Orbiting Route Arc Gradient */}
        <linearGradient id="voyagoArc" x1="6" y1="28" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
        </linearGradient>

        {/* Soft Drop Shadow Filter */}
        <filter id="voyagoShadow" x="0" y="2" width="40" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2563EB" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background soft glow / rounded tile container */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="url(#voyagoPrimary)"
        className="transition-colors"
      />

      {/* Orbiting Journey Route Arc */}
      <path
        d="M 8 28 C 12 33 22 34 30 28"
        stroke="#93C5FD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 3.5"
        opacity="0.8"
      />

      {/* Origami Voyager Flight Mark (Stylized Compass Airplane) */}
      <g filter="url(#voyagoShadow)">
        {/* Left Wing Facet */}
        <path
          d="M 20 8 L 10 24 L 20 20 Z"
          fill="#60A5FA"
        />

        {/* Right Main Wing */}
        <path
          d="M 20 8 L 30 24 L 20 20 Z"
          fill="#FFFFFF"
        />

        {/* Center Fold Keel */}
        <path
          d="M 20 20 L 10 24 L 20 26 L 30 24 Z"
          fill="url(#voyagoFacet)"
          opacity="0.85"
        />

        {/* Compass North Star / Flight Nose Node */}
        <circle cx="20" cy="8" r="1.5" fill="#FFFFFF" />

        {/* Trailing Waypoint Dot */}
        <circle cx="29" cy="27" r="1.75" fill="#60A5FA" />
      </g>
    </svg>
  );
};

/**
 * Modern Voyago Logo & Wordmark Component
 */
export const VoyagoLogo: FC<VoyagoLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  tagline,
  asLink = false,
  href = '/dashboard',
  className = '',
}) => {
  // Size dimensions mapping
  const sizeConfig = {
    sm: {
      iconSize: 28,
      textSize: 'text-lg',
      taglineSize: 'text-[9px]',
      gap: 'gap-2',
      dotSize: 'w-1.5 h-1.5',
    },
    md: {
      iconSize: 34,
      textSize: 'text-2xl',
      taglineSize: 'text-[10px]',
      gap: 'gap-2.5',
      dotSize: 'w-2 h-2',
    },
    lg: {
      iconSize: 42,
      textSize: 'text-3xl',
      taglineSize: 'text-xs',
      gap: 'gap-3',
      dotSize: 'w-2.5 h-2.5',
    },
    xl: {
      iconSize: 52,
      textSize: 'text-4xl sm:text-5xl',
      taglineSize: 'text-sm',
      gap: 'gap-3.5',
      dotSize: 'w-3 h-3',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;
  const isLight = variant === 'light';

  const content = (
    <div
      className={`inline-flex items-center ${currentSize.gap} group select-none ${className}`}
    >
      {/* Stylized Icon Mark */}
      <div className="relative group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
        <VoyagoIcon size={currentSize.iconSize} />
      </div>

      {/* "Voyago" Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight">
            <span
              className={`font-heading font-extrabold tracking-[-0.035em] ${currentSize.textSize} ${
                isLight ? 'text-white' : 'text-[#0F172A]'
              } transition-colors leading-none`}
            >
              Voyago
            </span>
            {/* Subtle Brand Blue Accent Dot on the brand name */}
            <span
              className={`ml-0.5 rounded-full bg-[#2563EB] ${currentSize.dotSize} inline-block animate-pulse`}
              style={{ animationDuration: '3s' }}
            />
          </div>

          {/* Optional Tagline */}
          {tagline && (
            <span
              className={`font-medium uppercase tracking-widest ${currentSize.taglineSize} ${
                isLight ? 'text-blue-200' : 'text-slate-500'
              } -mt-0.5`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        to={href}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-xl"
        aria-label="Voyago Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default VoyagoLogo;
