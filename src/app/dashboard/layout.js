'use client';

import { LayoutDashboard, Users, Settings, LogOut, Bell, Home, Building, Bluetooth } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Admin User');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role && role !== 'master') {
      if (role === 'owner') {
        router.push('/owner');
      } else if (role === 'tenant') {
        router.push('/tenant');
      } else {
        router.push('/login');
      }
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/properties', icon: Building },
    { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
    { name: 'Owners', href: '/dashboard/owners', icon: Home },
    { name: 'Smart Meters', href: '/dashboard/meters', icon: Bluetooth },
  ];

  return (
    <div className="h-full flex overflow-hidden w-full">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`mobile-sidebar bg-[var(--card)] border-r border-[var(--border)] flex flex-col ${isSidebarOpen ? 'open' : ''}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            MasterAdmin
          </h1>
          <button className="mobile-menu-btn p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-blue-500/20' 
                    : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" onClick={() => { localStorage.removeItem('user_role'); localStorage.removeItem('master_admin_token'); }}>
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="mobile-menu-btn p-2 -ml-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold truncate hidden sm:block">Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-[var(--accent)] transition-colors relative">
              <Bell size={20} className="text-[var(--muted-foreground)]" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/dashboard/profile" className="flex items-center gap-3 pl-4 border-l border-[var(--border)] hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {userName.charAt(0)}
              </div>
              <span className="font-medium text-sm hidden md:block hover:text-[var(--primary)] transition-colors">{userName}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
