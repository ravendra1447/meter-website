'use client';

import { Lock, Phone, ArrowRight, UserPlus, Building2, Home } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tenant'); // 'tenant' or 'owner'
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
        
        // Ensure user is logging into the correct portal according to their selection, or just route them based on their actual role
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-white/10 dark:bg-black/40 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl overflow-hidden transition-all duration-500">
        
        {/* Left Side: Dynamic Branding based on Tab */}
        <div className={`hidden md:flex flex-col justify-center p-12 w-1/2 transition-colors duration-500 ${activeTab === 'tenant' ? 'bg-gradient-to-br from-orange-600/80 to-red-600/80' : 'bg-gradient-to-br from-emerald-600/80 to-teal-600/80'}`}>
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
              {activeTab === 'tenant' ? <Home className="w-10 h-10 text-white" /> : <Building2 className="w-10 h-10 text-white" />}
            </div>
            <h2 className="text-5xl font-black text-white tracking-tight drop-shadow-md">
              {activeTab === 'tenant' ? 'Welcome Home.' : 'Manage Assets.'}
            </h2>
            <p className="text-white/90 text-lg font-medium max-w-sm leading-relaxed">
              {activeTab === 'tenant' 
                ? 'Sign in to manage your rentals, pay bills, and track your smart meter usage seamlessly.' 
                : 'Sign in to oversee your properties, collect rent, and monitor your entire portfolio.'}
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 space-y-8 bg-black/20 md:bg-transparent">
          
          <div className="text-center md:text-left space-y-2 md:hidden">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Meter Portal</h1>
            <p className="text-blue-100/80 font-medium text-sm">Sign in to your secure account</p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="flex p-1 space-x-1 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'tenant'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home size={18} /> Tenant Login
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'owner'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={18} /> Owner Login
            </button>
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
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${activeTab === 'tenant' ? 'group-focus-within:text-orange-400' : 'group-focus-within:text-emerald-400'} text-white/50`} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${activeTab === 'tenant' ? 'focus:ring-orange-500/50 focus:border-orange-500/50' : 'focus:ring-emerald-500/50 focus:border-emerald-500/50'}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-white/90 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${activeTab === 'tenant' ? 'group-focus-within:text-orange-400' : 'group-focus-within:text-emerald-400'} text-white/50`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${activeTab === 'tenant' ? 'focus:ring-orange-500/50 focus:border-orange-500/50' : 'focus:ring-emerald-500/50 focus:border-emerald-500/50'}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" className={`w-4 h-4 rounded border-white/20 bg-white/10 focus:ring-offset-0 transition-all ${activeTab === 'tenant' ? 'text-orange-500 focus:ring-orange-500/50' : 'text-emerald-500 focus:ring-emerald-500/50'}`} disabled={loading} />
                <span className="text-white/80 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className={`font-medium transition-colors ${activeTab === 'tenant' ? 'text-orange-400 hover:text-orange-300' : 'text-emerald-400 hover:text-emerald-300'}`}>Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full group flex items-center justify-center gap-2 py-4 px-4 text-white font-bold rounded-xl focus:ring-4 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] ${
                activeTab === 'tenant'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 focus:ring-orange-500/30 shadow-orange-500/40'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 focus:ring-emerald-500/30 shadow-emerald-500/40'
              }`}
            >
              {loading ? 'Signing in...' : `Sign In as ${activeTab === 'tenant' ? 'Tenant' : 'Owner'}`}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="pt-8 border-t border-white/10 text-center space-y-4">
            <p className="text-sm font-medium text-white/70">New to the platform?</p>
            <Link 
              href={activeTab === 'tenant' ? "/register/tenant" : "/register/owner"} 
              className={`inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all active:scale-[0.98] ${
                activeTab === 'tenant' ? 'hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              }`}
            >
              <UserPlus size={16} className={activeTab === 'tenant' ? 'text-orange-400' : 'text-emerald-400'} />
              Create a {activeTab === 'tenant' ? 'Tenant' : 'Owner'} Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
