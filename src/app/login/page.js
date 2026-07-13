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
        
        const portalRoute = normalizedRole === 'owner' ? '/owner' : normalizedRole === 'tenant' ? '/tenant' : '/dashboard';

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 text-center border-b bg-gray-50">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-blue-100 text-blue-600 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Meter Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tabs */}
          <div className="flex p-1 space-x-1 bg-gray-100 rounded border">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded ${
                activeTab === 'tenant'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home size={16} /> Tenant
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded ${
                activeTab === 'owner'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 size={16} /> Owner
            </button>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" disabled={loading} />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : `Sign In as ${activeTab === 'tenant' ? 'Tenant' : 'Owner'}`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 text-center space-y-4">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/register/tenant" 
              className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              <UserPlus size={16} className="text-gray-500" />
              As Tenant
            </Link>
            <Link 
              href="/register/owner" 
              className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              <UserPlus size={16} className="text-gray-500" />
              As Owner
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
