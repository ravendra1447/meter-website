'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Save, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState(() => {
    let initialData = { name: '', email: '' };
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          initialData = {
            name: userData.name || userData.first_name || '',
            email: userData.email || '',
          };
        } catch (e) {}
      }
    }
    return initialData;
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simulate API call and update local storage
    setTimeout(() => {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userData.name = formData.name;
          userData.email = formData.email;
          localStorage.setItem('user_data', JSON.stringify(userData));
        } catch (e) {}
      }

      setLoading(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => router.push('/owner/profile'), 1500);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/owner/profile" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Update your personal information.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          <ShieldCheck size={20} />
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="bg-[var(--accent)]/50 px-8 py-6 border-b border-[var(--border)] flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {formData.name.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Basic Information</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Ensure your details are up to date.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/owner/profile" className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] font-semibold transition-colors">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
