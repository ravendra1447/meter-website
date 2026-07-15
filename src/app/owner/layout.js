'use client';

import { LayoutDashboard, Users, Building, LogOut, Bell, Banknote, Bluetooth, PieChart, Zap, FileText } from "lucide-react";
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
    { name: 'Payment History', href: '/owner/payments', icon: Banknote },
    { name: 'Generate Bill', href: '/owner/bills/create', icon: FileText },
    { name: 'Expenses & PnL', href: '/owner/expenses', icon: PieChart },
    { name: 'Reports & Analytics', href: '/owner/reports', icon: PieChart },
  ];

  return (
    <div className="h-screen flex bg-slate-50/50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden transition-all duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-slate-50 to-slate-100/50 border-r border-slate-200/60 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-200/60 bg-white/40 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Owner Portal</h1>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-5 space-y-2 h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white shadow-sm border border-slate-100/50 text-indigo-700 font-bold' 
                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm font-semibold'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100/50 text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-500'}`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-5 border-t border-slate-200/60 h-20 bg-white/40 backdrop-blur-md">
          <Link href="/login" className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl text-rose-600 font-bold hover:bg-rose-50 hover:shadow-sm transition-all border border-transparent hover:border-rose-100" onClick={() => { localStorage.removeItem('user_role'); localStorage.removeItem('master_admin_token'); localStorage.removeItem('user_data'); }}>
            <LogOut size={20} />
            <span>Secure Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 sm:px-10 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-5">
            <button className="md:hidden text-slate-500 hover:text-slate-800 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 transition-all" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
              <p className="text-sm font-medium text-slate-500">Welcome back, <span className="text-slate-700">{userName || 'Owner'}</span> 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 hover:shadow-sm transition-all relative group">
              <Bell size={20} className="group-hover:animate-wiggle" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <Link href="/owner/profile" className="flex items-center gap-4 pl-6 border-l border-slate-200/80 group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all transform group-hover:-translate-y-0.5">
                {String(userName || 'O').charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-[15px] text-slate-700 hidden lg:block group-hover:text-indigo-600 transition-colors">{userName || 'Owner'}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
