'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Inbox, Calendar, CreditCard, PlusCircle, Wallet, Banknote, Building2, BellRing, User,
  TrendingUp, Activity, PieChart, CheckCircle2, AlertCircle, ArrowRight
} from "lucide-react";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/dashboard');
      if (response && response.data) {
        setData(response.data);
      } else {
        setData({});
      }
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data');
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
      alert(e?.message || 'Failed to send reminder');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec]">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-slate-600 font-medium tracking-wide">Loading Premium Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-8">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 max-w-md w-full border border-red-100 text-center transform transition-all hover:scale-105 duration-300">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={loadData} className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors shadow-md">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const properties = Array.isArray(data?.properties) ? data.properties.filter(Boolean) : [];
  const safeStatements = Array.isArray(data?.statements) ? data.statements.filter(Boolean) : [];

  const totalAmount = safeStatements.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const collectedAmount = safeStatements.reduce((sum, s) => sum + (s.status === 'paid' ? Number(s.total || 0) : 0), 0);
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Owner Dashboard
            </h1>
            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Total Pending Rent: <span className="text-slate-800 font-bold">₹{Number(stats.pending_amount || 0).toLocaleString('en-IN')}</span>
            </p>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
            <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md duration-300">
              <span className="text-2xl font-bold text-slate-800">{stats.properties || 0}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Properties</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md duration-300">
              <span className="text-2xl font-bold text-slate-800">{stats.tenants || 0}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tenants</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform transition hover:-translate-y-1 hover:shadow-md duration-300">
              <span className="text-2xl font-bold text-slate-800">{stats.meters || 0}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Meters</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800 px-2 flex items-center gap-2">
            <Activity size={20} className="text-indigo-500" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { href: "/owner/tenants", icon: Inbox, label: "Join Requests", color: "from-blue-500 to-cyan-400" },
              { href: "/owner/billing-schedules", icon: Calendar, label: "Billing Schedules", color: "from-purple-500 to-pink-500" },
              { href: "/owner/payments", icon: CreditCard, label: "Pending Payments", color: "from-orange-400 to-rose-400" },
              { href: "/owner/meters", icon: PlusCircle, label: "Smart Meters", color: "from-emerald-400 to-teal-500" },
              { href: "/owner/add-payment", icon: Banknote, label: "Collect Payment", color: "from-indigo-500 to-blue-600" }
            ].map((action, idx) => (
              <Link key={idx} href={action.href} className="group relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-transparent transition-all duration-300 transform hover:-translate-y-1">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 text-center group-hover:text-slate-900 transition-colors">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Financial Health */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <PieChart size={20} className="text-green-500" /> Financial Health
              </h2>
              <Link href="/owner/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                View Reports <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Expected</p>
                <p className="text-3xl font-extrabold text-slate-800">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-xs font-bold text-green-600/70 uppercase tracking-wider mb-2">Collected</p>
                <p className="text-3xl font-extrabold text-green-600">₹{collectedAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600/70 uppercase tracking-wider mb-2">Collection Rate</p>
                <p className="text-3xl font-extrabold text-blue-600">{collectionRate}%</p>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                <span>Progress</span>
                <span className="text-slate-800">{collectionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full relative" 
                  style={{ width: `${collectionRate}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Expiring Leases */}
          {Array.isArray(data?.expiring_leases) && data.expiring_leases.filter(Boolean).length > 0 && (
            <div className="bg-gradient-to-b from-rose-50 to-white rounded-3xl p-8 shadow-sm border border-rose-100 flex flex-col">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-600">
                <BellRing size={20} className="animate-bounce" /> Lease Expirations
              </h2>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[300px]">
                {data.expiring_leases.filter(Boolean).map(lease => {
                  const daysLeft = lease.agreement_to ? Math.ceil((new Date(lease.agreement_to) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
                  return (
                    <div key={lease.assignment_id || Math.random()} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{lease.tenant_name || 'Unknown Tenant'}</h4>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-md">
                          {daysLeft} days left
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm flex items-center gap-1.5 mb-1">
                        <Building2 size={14} className="text-slate-400" /> {lease.property_name || 'Unknown Property'}
                      </p>
                      <p className="text-slate-400 text-xs font-medium">
                        Expires: {lease.agreement_to ? new Date(lease.agreement_to).toLocaleDateString('en-IN') : 'N/A'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rent Collection Status */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-slate-800 px-2 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-blue-500" /> Rent Collection Status
          </h2>

          {properties.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No properties added yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">Get started by adding your first property to track rent, tenants, and smart meters effortlessly.</p>
              <Link href="/owner/properties/add" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                <PlusCircle size={18} /> Add Property
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {properties.map(p => {
                const ptId = p.property_tenant_id;
                const isPaid = p.bill_status === 'paid';
                return (
                  <div key={p.id || Math.random()} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Left: Property Info */}
                    <div className="flex items-center gap-4 flex-1 w-full min-w-[250px]">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'} transition-colors`}>
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{p.name || 'Unnamed Property'}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            {p.property_code || 'N/A'}
                          </span>
                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <User size={12} className="text-slate-400" /> {p.tenant_name || 'Vacant'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle: Amount & Status */}
                    <div className="flex items-center justify-between md:justify-center gap-6 w-full md:w-auto md:border-l border-slate-100 md:px-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Due Amount</p>
                        <p className={`font-extrabold text-xl ${isPaid ? 'text-green-600' : 'text-slate-800'}`}>
                          ₹{Number(p.bill_amount || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${isPaid ? 'bg-green-100 text-green-700 ring-1 ring-green-500/20' : 'bg-red-100 text-red-700 ring-1 ring-red-500/20'}`}>
                          {p.bill_status_label || 'Due'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-full md:w-auto md:border-l border-slate-100 md:pl-6 shrink-0 flex justify-end">
                      {ptId && !isPaid ? (
                        <button
                          onClick={() => sendReminder(ptId)}
                          className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center justify-center gap-2 group-hover:shadow-sm"
                        >
                          <BellRing size={14} className="group-hover:animate-wiggle" /> Send Reminder
                        </button>
                      ) : (
                         <div className="px-4 py-2 text-xs font-bold text-slate-400 flex items-center gap-2">
                           <CheckCircle2 size={14} className="text-green-500" /> Settled
                         </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}