'use client';

import { Activity, CreditCard, IndianRupee, Users, Home, Zap } from "lucide-react";
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
        <div className="text-[var(--muted-foreground)]">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 font-medium">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">Total Collected</h3>
            <IndianRupee className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
          <div className="text-2xl font-bold">₹{stats?.total_collected?.toLocaleString() || 0}</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center">
            <span className="font-medium mr-1">Outstanding:</span> ₹{stats?.outstanding?.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">Active Tenants</h3>
            <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
          <div className="text-2xl font-bold">{stats?.active_tenants || 0}</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center">
            <span className="font-medium mr-1">Total Users:</span> {stats?.tenants_count || 0} registered
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">Properties</h3>
            <Home className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
          <div className="text-2xl font-bold">{stats?.properties_count || 0}</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center">
            <span className="font-medium mr-1">Owners:</span> {stats?.owners_count || 0} registered
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">Smart Meters</h3>
            <Zap className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>
          <div className="text-2xl font-bold">{stats?.meters_count || 0}</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center">
            <span className="font-medium mr-1">Collection Rate:</span> {stats?.collection_rate_pct || 0}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="bg-[var(--card)] lg:col-span-4 p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--accent)]/50">
            <IndianRupee className="h-8 w-8 text-[var(--muted-foreground)] mb-2" />
            <span className="text-[var(--muted-foreground)]">Total Billed: ₹{stats?.total_billed?.toLocaleString() || 0}</span>
            <span className="text-[var(--muted-foreground)] text-sm text-center px-4">Revenue charts will appear here</span>
          </div>
        </div>
        
        <div className="bg-[var(--card)] lg:col-span-3 p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Summary</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-medium shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Collection Rate</p>
                <p className="text-sm text-[var(--muted-foreground)]">Overall payment efficiency</p>
              </div>
              <div className="font-bold text-sm text-[var(--foreground)]">
                {stats?.collection_rate_pct || 0}%
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-medium shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Active Tenants</p>
                <p className="text-sm text-[var(--muted-foreground)]">Currently renting properties</p>
              </div>
              <div className="font-bold text-sm text-[var(--foreground)]">
                {stats?.active_tenants || 0}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-medium shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Meters</p>
                <p className="text-sm text-[var(--muted-foreground)]">Total active smart meters</p>
              </div>
              <div className="font-bold text-sm text-[var(--foreground)]">
                {stats?.meters_count || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
