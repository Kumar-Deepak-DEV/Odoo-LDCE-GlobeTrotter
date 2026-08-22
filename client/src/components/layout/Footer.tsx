import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-slate-200/80 py-10 mt-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Compass className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">
              GlobeTrotter
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 font-medium">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="hover:text-blue-600 transition-colors">
              Support
            </Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">
              Contact Us
            </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-500">
            &copy; 2024 GlobeTrotter Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
