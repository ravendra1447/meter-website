'use client';

import { Activity, CreditCard, IndianRupee, Users, Home, Zap, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/master/dashboard');
        setStats(data.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-[var(--muted-foreground)] animate-pulse font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 backdrop-blur-sm font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Dashboard Overview</h1>
          <p className="text-[var(--muted-foreground)] mt-1 font-medium">Here's what's happening with your properties today.</p>
        </div>
        <div className="flex gap-3">
          <button className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-blue-500/30 font-bold active:scale-[0.98]">
            Generate Report
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Total Collected</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
              <IndianRupee className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--foreground)]">₹{stats?.total_collected?.toLocaleString() || 0}</div>
          <p className="text-sm text-[var(--muted-foreground)] mt-3 flex items-center font-medium">
            <span className="text-orange-500 mr-2 flex items-center bg-orange-500/10 px-2 py-0.5 rounded-full">Outstanding:</span> ₹{stats?.outstanding?.toLocaleString() || 0}
          </p>
        </div>

        <div className="group bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:shadow-[0_8px_30px_rgb(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Active Tenants</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--foreground)]">{stats?.active_tenants || 0}</div>
          <p className="text-sm text-[var(--muted-foreground)] mt-3 flex items-center font-medium">
            <span className="text-blue-500 mr-2 flex items-center bg-blue-500/10 px-2 py-0.5 rounded-full">Total Users:</span> {stats?.tenants_count || 0} registered
          </p>
        </div>

        <div className="group bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Properties</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
              <Home className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--foreground)]">{stats?.properties_count || 0}</div>
          <p className="text-sm text-[var(--muted-foreground)] mt-3 flex items-center font-medium">
            <span className="text-emerald-600 mr-2 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">Owners:</span> {stats?.owners_count || 0} registered
          </p>
        </div>

        <div className="group bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:shadow-[0_8px_30px_rgb(239,68,68,0.15)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-row items-center justify-between pb-4">
            <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Smart Meters</h3>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
              <Zap className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--foreground)]">{stats?.meters_count || 0}</div>
          <p className="text-sm text-[var(--muted-foreground)] mt-3 flex items-center font-medium">
            <span className="text-red-500 mr-2 flex items-center bg-red-500/10 px-2 py-0.5 rounded-full">Rate:</span> {stats?.collection_rate_pct || 0}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl lg:col-span-4 p-8 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:shadow-md transition-all">
          <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">Financial Overview</h3>
          <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl bg-white/30 dark:bg-black/20 group hover:bg-white/50 dark:hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <IndianRupee className="h-8 w-8 text-blue-500" />
            </div>
            <span className="text-[var(--foreground)] font-bold text-lg">Total Billed: ₹{stats?.total_billed?.toLocaleString() || 0}</span>
            <span className="text-[var(--muted-foreground)] font-medium text-sm text-center px-4 mt-2">Revenue charts will appear here</span>
          </div>
        </div>
        
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl lg:col-span-3 p-8 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:shadow-md transition-all">
          <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">System Summary</h3>
          <div className="space-y-6">
            <div className="group flex items-center gap-5 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-black/20 transition-colors border border-transparent hover:border-[var(--glass-border)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-base font-bold leading-none text-[var(--foreground)]">Collection Rate</p>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Overall payment efficiency</p>
              </div>
              <div className="font-extrabold text-lg text-[var(--foreground)]">
                {stats?.collection_rate_pct || 0}%
              </div>
            </div>
            
            <div className="group flex items-center gap-5 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-black/20 transition-colors border border-transparent hover:border-[var(--glass-border)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-base font-bold leading-none text-[var(--foreground)]">Active Tenants</p>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Currently renting properties</p>
              </div>
              <div className="font-extrabold text-lg text-[var(--foreground)]">
                {stats?.active_tenants || 0}
              </div>
            </div>
            
            <div className="group flex items-center gap-5 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-black/20 transition-colors border border-transparent hover:border-[var(--glass-border)]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-base font-bold leading-none text-[var(--foreground)]">Meters</p>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">Total active smart meters</p>
              </div>
              <div className="font-extrabold text-lg text-[var(--foreground)]">
                {stats?.meters_count || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
