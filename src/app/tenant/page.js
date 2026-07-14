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
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
          <Building2 size={18} className="text-slate-400" />
          <span className="font-bold text-sm text-slate-700">{property?.name || 'Property'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Statement Card - Takes up 8 columns */}
        <div className="lg:col-span-8 space-y-8">
          <div className={`relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-sm transition-all duration-500`}>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
                  <Clock size={16} className={isPaid ? 'text-emerald-500' : 'text-red-500'} />
                  <span className={`text-sm font-bold tracking-widest uppercase ${isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPaid ? 'Fully Paid' : `Due: ${statement?.due_date}`}
                  </span>
                </div>
                
                {isPaid && (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={24} />
                    <span className="font-bold text-lg">Settled</span>
                  </div>
                )}
              </div>
              
              <div className="mb-12">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-3">Current Balance</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-800">₹{statement?.total?.toLocaleString('en-IN') || 0}</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-3xl p-6 border border-slate-200">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Rent</p>
                  <p className="text-xl font-bold text-slate-800">₹{statement?.rent || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Light</p>
                  <p className="text-xl font-bold text-slate-800">₹{statement?.electricity_amount || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Water</p>
                  <p className="text-xl font-bold text-slate-800">₹{statement?.water_amount || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Maint.</p>
                  <p className="text-xl font-bold text-slate-800">₹{statement?.maintenance || 0}</p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 items-center print:hidden">
                {!isPaid && (
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all active:scale-95 text-lg">
                    <IndianRupee size={22} className="text-white" /> Pay Securely
                  </button>
                )}
                <button 
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all border border-slate-200 active:scale-95"
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
          <div className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
                <Zap size={24} />
              </div>
              <span className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500">Electricity</span>
            </div>
            
            <div className="space-y-1 mb-8">
              <p className="text-[var(--muted-foreground)] text-sm font-bold uppercase tracking-wider">This Month's Usage</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-[var(--foreground)] tracking-tighter">{stats?.monthUsage || 0}</p>
                <span className="text-lg font-bold text-[var(--muted-foreground)]">kWh</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 rounded-full" style={{ width: `${stats?.usagePercent || 0}%` }}></div>
            </div>
            <p className="mt-3 text-right text-xs font-bold text-[var(--muted-foreground)]">{stats?.usagePercent || 0}% of average</p>
          </div>

          {/* Property Info */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center justify-between">
              Property Details
              <Building2 size={20} className="text-slate-400" />
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-50 rounded-xl text-slate-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{property?.property_code}</p>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed mt-1">
                    {property?.address}, {property?.city}, {property?.state} - {property?.pincode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-50 rounded-xl text-slate-500">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Landlord</p>
                  <p className="font-bold text-slate-800">{property?.owner_name || 'Owner'}</p>
                  <a href={`tel:${property?.owner_mobile}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mt-1 transition-colors">
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
