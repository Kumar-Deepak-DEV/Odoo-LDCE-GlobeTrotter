import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: '#2563EB',
        hoverBrand: '#1D4ED8',
        secondary: '#14B8A6',
        accent: '#F97316',
        dark: '#0F172A',
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        surface2: '#F1F5F9',
        border: '#E2E8F0',
        inputBorder: '#CBD5E1',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#2563EB',
      },
    },
  },
  plugins: [],
} satisfies Config;
