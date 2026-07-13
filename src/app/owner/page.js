'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  Inbox, Calendar, CreditCard, PlusCircle, PointOfSale, Building2, BellRing, User 
} from "lucide-react";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendReminder = async (propertyTenantId) => {
    if (!propertyTenantId) return;
    try {
      await api.post(`/owner/tenants/${propertyTenantId}/remind`);
      alert('Reminder sent successfully');
    } catch (e) {
      alert(e.message || 'Failed to send reminder');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-[var(--muted-foreground)] animate-pulse font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 backdrop-blur-sm font-medium p-4 rounded-xl">{error}</div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const properties = data?.properties || [];

  return (
    <div className="-mt-6 -mx-4 md:-mx-8 animate-fade-in">
      {/* 1. Large Gradient Header */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 pt-12 pb-24 px-6 md:px-12 overflow-hidden shadow-inner">
        {/* Background Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-emerald-100 font-bold tracking-widest mb-2 uppercase text-xs opacity-90">Total Pending Rent</p>
          <h1 className="text-white text-5xl md:text-6xl font-extrabold tracking-tight mb-8 drop-shadow-md">
            ₹{Number(stats.pending_amount || 0).toLocaleString('en-IN')}
          </h1>
          
          <div className="flex items-center justify-between max-w-md mt-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
            <div className="text-center group">
              <p className="text-white text-3xl font-black group-hover:scale-110 transition-transform">{stats.properties || 0}</p>
              <p className="text-emerald-100 text-sm font-bold uppercase tracking-wide mt-1">Properties</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center group">
              <p className="text-white text-3xl font-black group-hover:scale-110 transition-transform">{stats.tenants || 0}</p>
              <p className="text-emerald-100 text-sm font-bold uppercase tracking-wide mt-1">Tenants</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center group">
              <p className="text-white text-3xl font-black group-hover:scale-110 transition-transform">{stats.meters || 0}</p>
              <p className="text-emerald-100 text-sm font-bold uppercase tracking-wide mt-1">Meters</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Content Container */}
      <div className="relative z-20 -mt-10 mx-auto max-w-5xl px-4 md:px-8 mb-20">
        <div className="bg-transparent rounded-t-3xl min-h-screen pt-8">
          
          {/* Quick Actions */}
          <h2 className="text-xl font-bold mb-5 text-[var(--foreground)] tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Link href="/owner/tenants" className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                <Inbox size={24} />
              </div>
              <span className="font-bold text-sm text-center text-[var(--foreground)]">Join Requests</span>
            </Link>
            
            <Link href="/owner/billing-schedules" className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-teal-500/50 hover:shadow-[0_8px_30px_rgb(20,184,166,0.15)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-3 bg-teal-500/10 text-teal-500 rounded-xl group-hover:bg-teal-500/20 group-hover:scale-110 transition-all">
                <Calendar size={24} />
              </div>
              <span className="font-bold text-sm text-center text-[var(--foreground)]">Billing Schedules</span>
            </Link>

            <Link href="/owner/payments" className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
                <CreditCard size={24} />
              </div>
              <span className="font-bold text-sm text-center text-[var(--foreground)]">Pending Payments</span>
            </Link>

            <Link href="/owner/meters" className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgb(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
                <PlusCircle size={24} />
              </div>
              <span className="font-bold text-sm text-center text-[var(--foreground)]">Smart Meters</span>
            </Link>

            <Link href="/owner/add-payment" className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 md:col-span-4 lg:col-span-1 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                <PointOfSale size={24} />
              </div>
              <span className="font-bold text-sm text-center text-[var(--foreground)]">Collect Payment</span>
            </Link>
          </div>

          {/* Financial Health Visual Chart */}
          {(() => {
            const totalAmount = (data?.statements || []).reduce((sum, s) => sum + Number(s.total || 0), 0);
            const collectedAmount = (data?.statements || []).reduce((sum, s) => sum + (s.status === 'paid' ? Number(s.total || 0) : 0), 0);
            const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0;
            
            return (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-5 flex items-center justify-between text-[var(--foreground)] tracking-tight">
                  Financial Health
                  <Link href="/owner/reports" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 hover:underline transition-colors">View Reports &rarr;</Link>
                </h2>
                <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="group">
                      <p className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-wider mb-1">Total Expected</p>
                      <h3 className="text-3xl font-black text-[var(--foreground)] group-hover:scale-105 transition-transform origin-left">₹{totalAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-px h-16 bg-[var(--glass-border)] hidden md:block"></div>
                    <div className="group">
                      <p className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-wider mb-1">Collected So Far</p>
                      <h3 className="text-3xl font-black text-emerald-600 group-hover:scale-105 transition-transform origin-left">₹{collectedAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-px h-16 bg-[var(--glass-border)] hidden md:block"></div>
                    <div className="group">
                      <p className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-wider mb-1">Collection Rate</p>
                      <h3 className="text-3xl font-black text-teal-600 group-hover:scale-105 transition-transform origin-left">{collectionRate}%</h3>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[var(--accent)]/50 h-5 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      style={{ width: `${collectionRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm font-bold">
                    <span className="text-emerald-600">{collectionRate}% Paid</span>
                    <span className="text-orange-500">{100 - collectionRate}% Pending</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Lease Expiry Alerts */}
          {Array.isArray(data?.expiring_leases) && data.expiring_leases.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-orange-600 tracking-tight">
                <BellRing size={24} className="animate-pulse" />
                Lease Expirations (Next 30 Days)
              </h2>
              <div className="bg-orange-500/10 backdrop-blur-md border border-orange-500/30 rounded-3xl p-6 shadow-sm space-y-4">
                {data.expiring_leases.map(lease => {
                  const daysLeft = Math.ceil((new Date(lease.agreement_to) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={lease.assignment_id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white/50 dark:bg-black/20 p-5 rounded-2xl shadow-sm border border-orange-500/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors">
                      <div>
                        <h4 className="font-extrabold text-lg text-[var(--foreground)]">{lease.tenant_name}</h4>
                        <p className="text-[var(--muted-foreground)] text-sm font-medium flex items-center gap-1.5 mt-1"><Building2 size={16}/> {lease.property_name}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 text-left sm:text-right">
                        <p className="text-orange-600 font-black text-lg">Expires in {daysLeft} days</p>
                        <p className="text-[var(--muted-foreground)] text-sm font-medium">Date: {new Date(lease.agreement_to).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rent Collection Status */}
          <h2 className="text-xl font-bold mb-5 text-[var(--foreground)] tracking-tight">Rent Collection Status</h2>
          
          {properties.length === 0 ? (
            <div className="text-center p-12 bg-[var(--glass-bg)] backdrop-blur-xl rounded-3xl border border-[var(--glass-border)] shadow-sm">
              <Building2 className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-4" size={56} />
              <p className="text-[var(--foreground)] font-semibold text-lg">No properties added yet.</p>
              <p className="text-[var(--muted-foreground)] font-medium mb-6 mt-1">Start by adding your first property to manage tenants.</p>
              <Link href="/owner/properties/add" className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:scale-95">Add Property</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map(p => {
                const ptId = p.property_tenant_id;
                const isPaid = p.bill_status === 'paid';
                return (
                  <div key={p.id} className="group bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-3xl border border-[var(--glass-border)] shadow-sm hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start gap-5">
                      <div className="p-3.5 bg-emerald-500/10 text-emerald-600 rounded-2xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all shadow-inner">
                        <Building2 size={26} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-xl text-[var(--foreground)]">{p.name}</h3>
                        <p className="text-sm font-medium text-[var(--muted-foreground)] flex items-center gap-1.5 mt-1.5">
                          <User size={16}/> {p.tenant_name || 'Vacant'} • <span className="font-mono text-xs font-bold bg-[var(--accent)]/50 px-2 py-0.5 rounded shadow-sm border border-[var(--glass-border)]">{p.property_code}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-2xl ${isPaid ? 'text-emerald-500' : 'text-[var(--foreground)]'}`}>₹{Number(p.bill_amount || 0).toLocaleString('en-IN')}</p>
                        <div className="mt-1.5">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-widest ${isPaid ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/20' : 'bg-orange-500/20 text-orange-600 border border-orange-500/20'}`}>
                            {p.bill_status_label || 'Due'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {ptId && !isPaid && (
                      <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
                        <button 
                          onClick={() => sendReminder(ptId)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500/10 text-orange-600 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-500/20 hover:border-transparent font-bold rounded-xl transition-all shadow-sm hover:shadow-orange-500/30 active:scale-[0.99]"
                        >
                          <BellRing size={18} /> Send Payment Reminder
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
