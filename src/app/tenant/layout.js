'use client';

import { LayoutDashboard, LogOut, Bell, IndianRupee, Bluetooth, Activity, User, Settings, FileText, Zap } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TenantLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Tenant User');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (!role) {
      router.replace('/login');
      return;
    }

    if (role === 'owner') {
      router.replace('/owner');
      return;
    }

    if (role !== 'tenant') {
      router.replace('/dashboard');
      return;
    }

    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.name || userData.first_name) {
          setUserName(userData.name || userData.first_name);
        }
      } catch (e) {}
    }
  }, [router]);

  const navItems = [
    { name: 'Dashboard', href: '/tenant', icon: LayoutDashboard },
    { name: 'My Billing', href: '/tenant/billing', icon: IndianRupee },
    { name: 'My Meter', href: '/tenant/meter', icon: Bluetooth },
    { name: 'Usage Stats', href: '/tenant/usage', icon: Activity },
    { name: 'Helpdesk', href: '/tenant/complaints', icon: Zap },
    { name: 'Profile', href: '/tenant/profile', icon: User },
    { name: 'Settings', href: '/tenant/settings', icon: Settings },
    { name: 'Agreement', href: '/tenant/agreement', icon: FileText },
  ];

  return (
    <div className="h-full flex overflow-hidden w-full bg-transparent animate-fade-in">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="mobile-overlay backdrop-blur-sm bg-black/40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`print:hidden mobile-sidebar bg-[var(--glass-bg)] backdrop-blur-xl border-r border-[var(--glass-border)] flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'open' : ''}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--glass-border)]">
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">Tenant Portal</h1>
            <p className="text-xs text-[var(--muted-foreground)] font-medium">Your home & billing hub</p>
          </div>
          <button className="mobile-menu-btn p-1 text-[var(--muted-foreground)] hover:text-orange-500 transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 translate-x-1' 
                    : 'hover:bg-white/40 dark:hover:bg-black/20 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:translate-x-1'
                }`}
              >
                <item.icon size={20} className={`${isActive ? 'text-white' : 'text-[var(--muted-foreground)] group-hover:text-orange-500'} transition-colors`} />
                <span className="font-semibold tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[var(--glass-border)]">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl hover:bg-red-500/10 text-red-500 transition-all duration-300 group" onClick={() => { localStorage.removeItem('user_role'); localStorage.removeItem('master_admin_token'); localStorage.removeItem('user_data'); }}>
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full print:overflow-visible">
        {/* Header */}
        <header className="print:hidden h-16 bg-[var(--glass-bg)] backdrop-blur-lg border-b border-[var(--glass-border)] flex items-center justify-between px-4 sm:px-8 z-10 shrink-0 shadow-sm sticky top-0">
          <div className="flex items-center gap-4">
            <button className="mobile-menu-btn p-2 -ml-2 text-[var(--muted-foreground)] hover:text-orange-500 transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">Overview</h2>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">Welcome back, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-all relative group shadow-sm">
              <Bell size={20} className="text-[var(--muted-foreground)] group-hover:text-orange-500 transition-colors" />
            </button>
            <Link href="/tenant/profile" className="flex items-center gap-3 pl-5 border-l border-[var(--glass-border)] group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                {userName.charAt(0)}
              </div>
              <span className="font-semibold text-sm hidden md:block group-hover:text-orange-500 transition-colors">{userName}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent">
          <div className="animate-slide-up h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
