import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
          <Compass className="w-8 h-8 stroke-[2.2] animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-3">
          404 - Lost Your Way?
        </h1>

        <p className="text-slate-500 text-sm sm:text-base mb-8 max-w-md">
          The page or itinerary you are looking for has been moved, removed, or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
