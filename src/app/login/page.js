'use client';

import { Lock, Phone, ArrowRight, UserPlus, Building2, Home, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tenant'); // 'tenant', 'owner', 'master'
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
        
        let portalRoute = '/dashboard';
        if (normalizedRole === 'owner') portalRoute = '/owner';
        else if (normalizedRole === 'tenant') portalRoute = '/tenant';
        else if (normalizedRole === 'master') portalRoute = '/dashboard';

        localStorage.setItem('master_admin_token', response.data.token);
        localStorage.setItem('user_role', normalizedRole);
        localStorage.setItem('user_data', JSON.stringify(user));
        router.replace(portalRoute);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] p-4 font-sans selection:bg-slate-200">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-slate-100 to-transparent -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 mb-5 shadow-sm">
            <Lock size={26} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Please enter your details to sign in.</p>
        </div>

        <div className="px-8 pb-8 space-y-7">
          
          {/* Tabs */}
          <div className="flex p-1.5 space-x-1 bg-slate-50/80 rounded-2xl border border-slate-100 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'tenant'
                  ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Home size={16} strokeWidth={2} /> Tenant
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'owner'
                  ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <Building2 size={16} strokeWidth={2} /> Owner
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'master'
                  ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <ShieldCheck size={16} strokeWidth={2} /> Master
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" strokeWidth={1.5} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your registered number"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-300 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all text-sm font-medium"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" strokeWidth={1.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-300 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all text-sm font-medium tracking-wider"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In as {activeTab === 'tenant' ? 'Tenant' : activeTab === 'owner' ? 'Owner' : 'Master'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {activeTab !== 'master' && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 text-center space-y-4">
            <p className="text-sm font-medium text-slate-500">New to the platform?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/register/tenant" 
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-bold hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all"
              >
                <UserPlus size={16} className="text-slate-400" />
                Register Tenant
              </Link>
              <Link 
                href="/register/owner" 
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-bold hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all"
              >
                <UserPlus size={16} className="text-slate-400" />
                Register Owner
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
