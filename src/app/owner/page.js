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
        <p className="text-[var(--muted-foreground)]">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const properties = data?.properties || [];

  return (
    <div className="-mt-6 -mx-4 md:-mx-8">
      {/* 1. Large Gradient Header */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800 pt-12 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-indigo-100 font-medium tracking-wide mb-2 uppercase text-sm">Total Pending Rent</p>
          <h1 className="text-white text-5xl md:text-6xl font-black tracking-tight mb-8">
            ₹{stats.pending_amount?.toLocaleString('en-IN') || 0}
          </h1>
          
          <div className="flex items-center justify-between max-w-md mt-4">
            <div>
              <p className="text-white text-3xl font-black">{stats.properties || 0}</p>
              <p className="text-indigo-200 text-sm font-medium">Properties</p>
            </div>
            <div>
              <p className="text-white text-3xl font-black">{stats.tenants || 0}</p>
              <p className="text-indigo-200 text-sm font-medium">Tenants</p>
            </div>
            <div>
              <p className="text-white text-3xl font-black">{stats.meters || 0}</p>
              <p className="text-indigo-200 text-sm font-medium">Meters</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Content Container */}
      <div className="relative z-20 -mt-10 mx-auto max-w-5xl px-4 md:px-8 mb-20">
        <div className="bg-[var(--background)] rounded-t-3xl shadow-xl min-h-screen pt-8 px-4 md:px-8">
          
          {/* Quick Actions */}
          <h2 className="text-xl font-bold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Link href="/owner/tenants" className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 hover:shadow-md transition-all group">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                <Inbox size={24} />
              </div>
              <span className="font-semibold text-sm text-center">Join Requests</span>
            </Link>
            
            <Link href="/owner/billing-schedules" className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 hover:shadow-md transition-all group">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <span className="font-semibold text-sm text-center">Billing Schedules</span>
            </Link>

            <Link href="/owner/payments" className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:shadow-md transition-all group">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <span className="font-semibold text-sm text-center">Pending Payments</span>
            </Link>

            <Link href="/owner/meters" className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-green-500/50 hover:shadow-md transition-all group">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl group-hover:scale-110 transition-transform">
                <PlusCircle size={24} />
              </div>
              <span className="font-semibold text-sm text-center">Smart Meters</span>
            </Link>

            <Link href="/owner/add-payment" className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:shadow-md transition-all group">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                <PointOfSale size={24} />
              </div>
              <span className="font-semibold text-sm text-center">Collect Payment</span>
            </Link>
          </div>

          {/* Financial Health Visual Chart */}
          {(() => {
            const totalAmount = (data?.statements || []).reduce((sum, s) => sum + Number(s.total || 0), 0);
            const collectedAmount = (data?.statements || []).reduce((sum, s) => sum + (s.status === 'paid' ? Number(s.total || 0) : 0), 0);
            const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0;
            
            return (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-5 flex items-center justify-between">
                  Financial Health
                  <Link href="/owner/reports" className="text-sm font-medium text-indigo-500 hover:underline">View Reports &rarr;</Link>
                </h2>
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider mb-1">Total Expected Collection</p>
                      <h3 className="text-2xl font-black">₹{totalAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-px h-12 bg-[var(--border)] hidden md:block"></div>
                    <div>
                      <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider mb-1">Collected So Far</p>
                      <h3 className="text-2xl font-black text-green-600">₹{collectedAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-px h-12 bg-[var(--border)] hidden md:block"></div>
                    <div>
                      <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider mb-1">Collection Rate</p>
                      <h3 className="text-2xl font-black text-indigo-600">{collectionRate}%</h3>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[var(--accent)] h-4 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${collectionRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm text-[var(--muted-foreground)]">
                    <span className="font-medium text-green-600">{collectionRate}% Paid</span>
                    <span className="font-medium text-orange-500">{100 - collectionRate}% Pending</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Lease Expiry Alerts */}
          {data?.expiring_leases?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-orange-500">
                <BellRing size={24} />
                Lease Expirations (Next 30 Days)
              </h2>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 shadow-sm space-y-4">
                {data.expiring_leases.map(lease => {
                  const daysLeft = Math.ceil((new Date(lease.agreement_to) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={lease.assignment_id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-[var(--card)] p-4 rounded-2xl shadow-sm border border-orange-500/20">
                      <div>
                        <h4 className="font-bold text-lg">{lease.tenant_name}</h4>
                        <p className="text-[var(--muted-foreground)] text-sm flex items-center gap-1"><Building2 size={14}/> {lease.property_name}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 text-left sm:text-right">
                        <p className="text-orange-600 font-bold">Expires in {daysLeft} days</p>
                        <p className="text-[var(--muted-foreground)] text-xs">Date: {new Date(lease.agreement_to).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rent Collection Status */}
          <h2 className="text-xl font-bold mb-5">Rent Collection Status</h2>
          
          {properties.length === 0 ? (
            <div className="text-center p-10 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
              <Building2 className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-4" size={48} />
              <p className="text-[var(--muted-foreground)]">No properties added yet.</p>
              <Link href="/owner/properties/add" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium">Add Property</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map(p => {
                const ptId = p.property_tenant_id;
                const isPaid = p.bill_status === 'paid';
                return (
                  <div key={p.id} className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Building2 size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1 mt-1">
                          <User size={14}/> {p.tenant_name || 'Vacant'} • <span className="font-mono text-xs bg-[var(--accent)] px-1 rounded">{p.property_code}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-indigo-500">₹{p.bill_amount?.toLocaleString('en-IN') || 0}</p>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {p.bill_status_label || 'Due'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {ptId && !isPaid && (
                      <div className="mt-5 pt-5 border-t border-[var(--border)]">
                        <button 
                          onClick={() => sendReminder(ptId)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 font-bold rounded-xl transition-colors"
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
