'use client';

import { Activity, IndianRupee, Clock, Zap, MapPin, Building2, User, Phone, CheckCircle2, FileText, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import PrintableInvoice from "@/components/PrintableInvoice";

export default function TenantDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/tenant/dashboard');
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="text-[var(--muted-foreground)] font-medium">Loading your portal...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 backdrop-blur-md px-6 py-4 rounded-2xl font-medium shadow-sm">
          {error || 'No active property linked to this account.'}
        </div>
      </div>
    );
  }

  const { property, statement, stats } = data;
  const isPaid = statement?.status === 'paid';

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight">Welcome Home.</h2>
          <p className="text-[var(--muted-foreground)] font-medium mt-2 text-lg">Manage your rent, electricity, and bills in one place.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] px-4 py-2 rounded-2xl shadow-sm">
          <Building2 size={18} className="text-indigo-500" />
          <span className="font-bold text-sm text-[var(--foreground)]">{property?.name || 'Property'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Statement Card - Takes up 8 columns */}
        <div className="lg:col-span-8 space-y-8">
          <div className={`relative overflow-hidden rounded-[2.5rem] text-white shadow-2xl transition-all duration-500 ${isPaid ? 'bg-gradient-to-br from-emerald-500 to-teal-800' : 'bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900'}`}>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/30 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                  <Clock size={16} className={isPaid ? 'text-emerald-300' : 'text-orange-300'} />
                  <span className="text-sm font-bold tracking-widest uppercase text-white/90">
                    {isPaid ? 'Fully Paid' : `Due: ${statement?.due_date}`}
                  </span>
                </div>
                
                {isPaid && (
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 size={24} />
                    <span className="font-bold text-lg">Settled</span>
                  </div>
                )}
              </div>
              
              <div className="mb-12">
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3">Current Balance</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-6xl md:text-7xl font-black drop-shadow-lg tracking-tighter">₹{statement?.total?.toLocaleString('en-IN') || 0}</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Rent</p>
                  <p className="text-xl font-bold text-white">₹{statement?.rent || 0}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Light</p>
                  <p className="text-xl font-bold text-white">₹{statement?.electricity_amount || 0}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Water</p>
                  <p className="text-xl font-bold text-white">₹{statement?.water_amount || 0}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Maint.</p>
                  <p className="text-xl font-bold text-white">₹{statement?.maintenance || 0}</p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 items-center print:hidden">
                {!isPaid && (
                  <button className="bg-white text-indigo-950 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg">
                    <IndianRupee size={22} className="text-indigo-600" /> Pay Securely
                  </button>
                )}
                <button 
                  onClick={() => window.print()}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all backdrop-blur-md border border-white/20 hover:border-white/40 active:scale-95"
                >
                  <FileText size={18}/> Get Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side sidebars - Takes up 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Usage Stats */}
          <div className="group bg-[var(--glass-bg)] backdrop-blur-xl p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl">
                <Zap size={24} className="group-hover:animate-pulse" />
              </div>
              <span className="bg-[var(--accent)]/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Electricity</span>
            </div>
            
            <div className="space-y-1 mb-8">
              <p className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-wider">This Month's Usage</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-[var(--foreground)] tracking-tighter">{stats?.monthUsage || 0}</p>
                <span className="text-lg font-bold text-[var(--muted-foreground)]">kWh</span>
              </div>
            </div>

            <div className="w-full bg-[var(--accent)] h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: `${stats?.usagePercent || 0}%` }}></div>
            </div>
            <p className="mt-3 text-right text-xs font-bold text-[var(--muted-foreground)]">{stats?.usagePercent || 0}% of average</p>
          </div>

          {/* Property Info */}
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-extrabold text-[var(--foreground)] mb-6 flex items-center justify-between">
              Property Details
              <Building2 size={20} className="text-[var(--muted-foreground)] opacity-50" />
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-[var(--accent)] rounded-xl text-[var(--muted-foreground)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">{property?.property_code}</p>
                  <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed mt-1">
                    {property?.address}, {property?.city}, {property?.state} - {property?.pincode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-[var(--accent)] rounded-xl text-[var(--muted-foreground)]">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Landlord</p>
                  <p className="font-bold text-[var(--foreground)]">{property?.owner_name || 'Owner'}</p>
                  <a href={`tel:${property?.owner_mobile}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-500 hover:text-indigo-600 mt-1 transition-colors">
                    <Phone size={14} />
                    {property?.owner_mobile || 'N/A'}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Hidden Printable Invoice */}
      <PrintableInvoice invoiceData={{
        invoiceNo: `INV-${property?.id}-${new Date().getMonth()+1}`,
        period: `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
        ownerName: property?.owner_name || "Property Owner",
        ownerMobile: property?.owner_mobile || "N/A",
        tenantName: "Tenant", // would ideally use user context
        tenantMobile: "N/A",
        propertyName: property?.name,
        propertyCode: property?.property_code,
        rent: statement?.rent || 0,
        maintenance: statement?.maintenance || 0,
        water: statement?.water_amount || 0,
        electricity: statement?.electricity_amount || 0,
        total: statement?.total,
        status: statement?.status
      }} />
    </div>
  );
}
