'use client';

import { Lock, Phone, ArrowRight, User, Home } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function TenantRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // In a real scenario, we'd hit /auth/register/tenant
      // For now, simulating registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
        <div className="relative z-10 w-full max-w-md bg-white/10 rounded-3xl border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.2)] backdrop-blur-xl p-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Registration Successful!</h2>
          <p className="text-orange-100/80 font-medium">Welcome to the platform, {formData.name}. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative p-4 sm:p-8 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white/10 dark:bg-black/40 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(249,115,22,0.2)] backdrop-blur-md overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_0_rgba(249,115,22,0.3)]">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 mb-2 shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Tenant Registration
            </h1>
            <p className="text-orange-100/80 font-medium tracking-wide text-sm">Join to manage your rent & bills</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-semibold text-center backdrop-blur-md animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5 group">
              <label className="text-xs font-bold text-white/90 uppercase tracking-wider ml-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-bold text-white/90 uppercase tracking-wider ml-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-white/90 uppercase tracking-wider ml-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all backdrop-blur-sm text-sm"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-white/90 uppercase tracking-wider ml-1">Confirm *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all backdrop-blur-sm text-sm"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 group flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-xl hover:from-orange-400 hover:to-rose-500 focus:ring-4 focus:ring-orange-500/30 transition-all shadow-lg hover:shadow-orange-500/40 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? 'Creating Account...' : 'Register'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-sm font-medium text-white/70">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-bold hover:underline transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
