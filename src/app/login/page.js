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
        
        // Route based on actual role
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fcfb] p-4">
      
      <div className="w-full max-w-md bg-white border border-teal-100 rounded-xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-teal-50 bg-[#f4faf9]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Meter Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your secure account</p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tabs */}
          <div className="flex p-1 space-x-1 bg-gray-50 rounded-lg border border-gray-100">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`w-full flex flex-col items-center justify-center gap-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'tenant'
                  ? 'bg-white text-teal-700 shadow-sm border border-teal-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home size={18} /> Tenant
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`w-full flex flex-col items-center justify-center gap-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'owner'
                  ? 'bg-white text-teal-700 shadow-sm border border-teal-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building2 size={18} /> Owner
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={`w-full flex flex-col items-center justify-center gap-1 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'master'
                  ? 'bg-white text-teal-700 shadow-sm border border-teal-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck size={18} /> Master
            </button>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Phone Number / ID</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-gray-800 placeholder:text-gray-400 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-gray-800 placeholder:text-gray-400 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" disabled={loading} />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : `Sign In as ${activeTab === 'tenant' ? 'Tenant' : activeTab === 'owner' ? 'Owner' : 'Master'}`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

        </div>

        {activeTab !== 'master' && (
          <div className="p-6 bg-[#f8fcfb] border-t border-teal-50 text-center space-y-4">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/register/tenant" 
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-teal-100 rounded-lg text-teal-700 text-sm font-medium hover:bg-teal-50 transition-colors"
              >
                <UserPlus size={16} className="text-teal-500" />
                As Tenant
              </Link>
              <Link 
                href="/register/owner" 
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-teal-100 rounded-lg text-teal-700 text-sm font-medium hover:bg-teal-50 transition-colors"
              >
                <UserPlus size={16} className="text-teal-500" />
                As Owner
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
