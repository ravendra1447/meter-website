'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Edit, Lock, ChevronRight, History, 
  Settings, Bell, LogOut, ShieldCheck, Mail, Phone,
  IndianRupee, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    let initialUser = { name: 'Tenant User', mobile: 'N/A', email: 'N/A', role: 'tenant' };
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          initialUser = {
            name: userData.name || userData.first_name || 'Tenant User',
            mobile: userData.mobile || userData.phone || 'N/A',
            email: userData.email || 'N/A',
            role: localStorage.getItem('user_role') || 'tenant'
          };
        } catch (e) {}
      } else {
        initialUser.role = localStorage.getItem('user_role') || 'tenant';
      }
    }
    return initialUser;
  });
  const [loading, setLoading] = useState(false);



  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('master_admin_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  const ActionCard = ({ icon: Icon, title, subtitle, onClick, variant = 'default' }) => {
    const isDanger = variant === 'danger';
    return (
      <div 
        onClick={onClick}
        className={`flex items-center justify-between p-4 bg-[var(--card)] border ${isDanger ? 'border-red-500/20' : 'border-[var(--border)]'} rounded-xl cursor-pointer hover:shadow-md transition-all group`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className={`font-semibold ${isDanger ? 'text-red-500' : 'text-[var(--foreground)]'}`}>{title}</h3>
            {subtitle && <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {!isDanger && <ChevronRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors" />}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header Profile Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[var(--border)]">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 opacity-90"></div>
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="w-28 h-28 rounded-full bg-white/20 p-2 backdrop-blur-md shadow-xl shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-500">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} className="opacity-70" />
                <span>{user.mobile}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="opacity-70" />
                <span>{user.email}</span>
              </div>
            </div>
            
            <div className="pt-2 flex justify-center sm:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                <ShieldCheck size={14} />
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <button onClick={() => router.push('/tenant/profile/edit')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg active:scale-95">
              <Edit size={18} /> Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Column 1: Rent & Documents */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--muted-foreground)] px-1 uppercase tracking-wider text-sm">Rent & Documents</h2>
          <div className="space-y-3">
            <ActionCard 
              icon={IndianRupee} 
              title="My Billing" 
              subtitle="View bills and make payments"
              onClick={() => router.push('/tenant/billing')}
            />
            <ActionCard 
              icon={FileText} 
              title="Rental Agreement" 
              subtitle="View your contract terms"
              onClick={() => router.push('/tenant/agreement')}
            />
          </div>
        </div>

        {/* Column 2: Settings & Security */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--muted-foreground)] px-1 uppercase tracking-wider text-sm">Settings & Security</h2>
          <div className="space-y-3">
            <ActionCard 
              icon={Lock} 
              title="Change Password" 
              subtitle="Update your security credentials"
              onClick={() => router.push('/tenant/profile/change-password')}
            />
            <ActionCard 
              icon={Settings} 
              title="App Settings" 
              subtitle="Preferences and display"
              onClick={() => router.push('/tenant/settings')}
            />
            <ActionCard 
              icon={Bell} 
              title="Notifications" 
              subtitle="Manage alerts and updates"
              onClick={() => router.push('/tenant/notifications')}
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-[var(--border)] mt-8">
        <ActionCard 
          icon={LogOut} 
          title="Log Out" 
          subtitle="End your current session safely"
          variant="danger"
          onClick={handleLogout}
        />
      </div>

    </div>
  );
}
