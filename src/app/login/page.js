'use client';

import { Lock, Phone, ArrowRight, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizeRole = (user = {}) => {
    const explicitRole = [user?.role, user?.user_type, user?.account_type, user?.role_name]
      .find((value) => typeof value === 'string' && value.trim());

    if (explicitRole) {
      const normalized = explicitRole.toLowerCase();
      if (normalized.includes('tenant')) return 'tenant';
      if (normalized.includes('owner')) return 'owner';
      if (normalized.includes('master') || normalized.includes('admin')) return 'master';
    }

    if (user?.is_property_owner) return 'owner';
    return 'dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Please fill in both phone and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { mobile: phone, password });

      if (response.success && response.data?.token) {
        const user = response.data?.user || {};
        const normalizedRole = normalizeRole(user);
        const portalRoute = normalizedRole === 'owner' ? '/owner' : normalizedRole === 'tenant' ? '/tenant' : '/dashboard';

        localStorage.setItem('master_admin_token', response.data.token);
        localStorage.setItem('user_role', normalizedRole);
        localStorage.setItem('user_data', JSON.stringify(user));
        router.replace(portalRoute);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative p-4 sm:p-8 animate-fade-in">
      {/* Overlay to dim background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white/10 dark:bg-black/40 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_0_rgba(59,130,246,0.3)]">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 mb-2 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Meter Portal
            </h1>
            <p className="text-blue-100/80 font-medium tracking-wide">Sign in to your secure account</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-semibold text-center backdrop-blur-md animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-white/90 uppercase tracking-wider ml-1">Phone / ID</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-white/90 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 transition-all" disabled={loading} />
                <span className="text-white/80 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <p className="text-center text-sm font-medium text-white/70">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/register/owner" className="group flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.98]">
                <UserPlus size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                As Owner
              </Link>
              <Link href="/register/tenant" className="group flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.98]">
                <UserPlus size={16} className="text-orange-400 group-hover:scale-110 transition-transform" />
                As Tenant
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

