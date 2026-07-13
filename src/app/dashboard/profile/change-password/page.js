'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, KeyRound, ShieldAlert, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setTimeout(() => router.push('/dashboard/profile'), 1500);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Update your security credentials.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.type === 'success' ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="bg-[var(--accent)]/50 px-8 py-6 border-b border-[var(--border)] flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Security Check</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Ensure your account stays secure.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input 
                type="password" 
                name="currentPassword" 
                value={formData.currentPassword} 
                onChange={handleChange} 
                required
                placeholder="••••••••"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" 
              />
            </div>
          </div>

          <div className="h-px w-full bg-[var(--border)] my-4"></div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input 
                type="password" 
                name="newPassword" 
                value={formData.newPassword} 
                onChange={handleChange} 
                required
                placeholder="••••••••"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required
                placeholder="••••••••"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/dashboard/profile" className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] font-semibold transition-colors">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Updating...</>
              ) : (
                <><Lock size={18} /> Update Password</>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
