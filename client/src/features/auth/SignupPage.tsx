import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, User, Mail, Lock, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { VoyagoLogo } from '../../components/ui/VoyagoLogo';

export const SignupPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    city: '',
    country: '',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authApi.register(formData);
      if (data?.token && data?.user) {
        login(data.token, data.user);
        const destination = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => navigate(destination), 500);
        return;
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      const serverMsg = axiosErr.response?.data?.error?.message;
      setErrorMessage(serverMsg || 'Failed to create account. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-body selection:bg-blue-500 selection:text-white">
      {/* LEFT COLUMN: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 z-10 min-h-screen overflow-y-auto">
        {/* Voyago Brand Logo Header */}
        <div className="flex items-center">
          <VoyagoLogo asLink href="/login" size="md" />
        </div>

        {/* Center Content / Form */}
        <div className="my-6 max-w-[460px] w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Create an account
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 font-normal">
              Start planning unforgettable journeys with GlobeTrotter.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  First Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. London"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. UK"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login prompt */}
          <div className="mt-6 text-center text-sm text-slate-600 font-normal">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 text-center lg:text-left">
          &copy; {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Square Leaf-Shaped Image Showcase */}
      <div className="w-full lg:w-1/2 bg-slate-900 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-[480px] xl:max-w-[540px] aspect-square flex flex-col justify-end p-8 sm:p-10 lg:p-12 shadow-2xl shadow-black/60">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: '35% 4% 35% 4%' }}
          >
            <img
              src="/images/adventure-mountain.jpg"
              alt="GlobeTrotter Travel"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none" />
          </div>

          <div className="relative z-10 mt-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold font-heading text-white leading-[1.15] tracking-tight drop-shadow-sm mb-3">
              Your next adventure starts here.
            </h2>
            <p className="text-white/80 text-sm font-normal max-w-sm">
              Plan custom itineraries, track budgets, and share your journey with fellow travelers worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
