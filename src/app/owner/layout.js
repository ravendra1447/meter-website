'use client';

import { LayoutDashboard, Users, Building, LogOut, Bell, IndianRupee, Bluetooth, PieChart, Zap } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function OwnerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Owner User');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (!role) {
      router.replace('/login');
      return;
    }

    if (role === 'tenant') {
      router.replace('/tenant');
      return;
    }

    if (role !== 'owner') {
      router.replace('/dashboard');
      return;
    }

    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData?.name || userData?.first_name) {
          setUserName(userData.name || userData.first_name);
        }
      } catch (e) {}
    }
  }, [router]);

  const navItems = [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard },
    { name: 'My Properties', href: '/owner/properties', icon: Building },
    { name: 'My Tenants', href: '/owner/tenants', icon: Users },
    { name: 'Tenant Meters', href: '/owner/meters', icon: Bluetooth },
    { name: 'Tenant Helpdesk', href: '/owner/complaints', icon: Zap },
    { name: 'Payment History', href: '/owner/payments', icon: IndianRupee },
    { name: 'Expenses & PnL', href: '/owner/expenses', icon: PieChart },
    { name: 'Reports & Analytics', href: '/owner/reports', icon: PieChart },
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Owner Portal</h1>
          </div>
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-1 h-[calc(100vh-8rem)] overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-blue-700' : 'text-gray-500'} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t h-16">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 rounded text-red-600 hover:bg-red-50 transition-colors" onClick={() => { localStorage.removeItem('user_role'); localStorage.removeItem('master_admin_token'); localStorage.removeItem('user_data'); }}>
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-gray-800">Overview</h2>
              <p className="text-xs text-gray-500">Welcome back, {userName || 'Owner'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/owner/profile" className="flex items-center gap-3 pl-4 border-l">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {String(userName || 'O').charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-sm text-gray-700 hidden md:block">{userName || 'Owner'}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
