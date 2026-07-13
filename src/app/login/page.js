'use client';

import { Lock, Phone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        localStorage.setItem('master_admin_token', response.data.token);
        
        const role = response.data.user?.role;
        if (role) {
          localStorage.setItem('user_role', role);
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
        
        if (role === 'owner' || response.data.user?.is_property_owner) {
          router.push('/owner');
        } else if (role === 'tenant') {
          router.push('/tenant');
        } else {
          router.push('/dashboard');
        }
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--muted)] p-4 sm:p-8">
      <div className="w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-blue-500/10">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              MasterAdmin
            </h1>
            <p className="text-[var(--muted-foreground)]">Sign in to manage your system</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number / ID</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-2 bg-[var(--accent)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-[var(--accent)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" disabled={loading} />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[var(--primary)] hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
