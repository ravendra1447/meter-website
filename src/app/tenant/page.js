'use client';

import { Activity, IndianRupee, Clock, Zap, MapPin, Building2, User, Phone, CheckCircle2, FileText } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        <p className="text-[var(--muted-foreground)]">Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">{error || 'No active property linked.'}</div>
      </div>
    );
  }

  const { property, statement, stats } = data;
  const isPaid = statement?.status === 'paid';

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tenant Dashboard</h2>
          <p className="text-[var(--muted-foreground)]">Welcome to your property portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Property & Owner details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-1">{property?.name || 'Property'}</h3>
            <p className="text-sm font-mono text-[var(--muted-foreground)] mb-4">{property?.property_code}</p>
            
            <div className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
              <MapPin size={16} className="shrink-0 mt-0.5" />
              <p>{property?.address}, {property?.city}, {property?.state} - {property?.pincode}</p>
            </div>
            
            <hr className="my-6 border-[var(--border)]" />
            
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Owner Details</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <p className="font-semibold">{property?.owner_name || 'Owner'}</p>
                <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                  <Phone size={14} />
                  <span>{property?.owner_mobile || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} /> Electricity Usage
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--muted-foreground)] text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold">{stats?.monthUsage || 0} <span className="text-sm font-normal text-[var(--muted-foreground)]">kWh</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[var(--primary)] flex items-center justify-center font-bold">
                {stats?.usagePercent || 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statement & Payments */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-8 rounded-3xl text-white shadow-lg relative overflow-hidden ${isPaid ? 'bg-gradient-to-br from-green-600 to-emerald-800' : 'bg-gradient-to-br from-indigo-900 to-purple-900'}`}>
            <div className="absolute top-0 right-0 p-4">
              {isPaid ? (
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 backdrop-blur-md">
                  <CheckCircle2 size={14}/> Paid
                </div>
              ) : (
                <div className="bg-orange-500/30 text-orange-200 px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md">
                  Due: {statement?.due_date}
                </div>
              )}
            </div>
            
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-2">Current Statement</p>
            <h2 className="text-5xl font-black mb-8">₹{statement?.total?.toLocaleString('en-IN') || 0}</h2>
            
            <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
              <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3">Breakdown</h4>
              <div className="space-y-2 text-sm text-white/90">
                <div className="flex justify-between">
                  <span>Rent</span>
                  <span className="font-medium">₹{statement?.rent || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance</span>
                  <span className="font-medium">₹{statement?.maintenance || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Water</span>
                  <span className="font-medium">₹{statement?.water_amount || 0}</span>
                </div>
                <div className="flex justify-between text-yellow-300">
                  <span>Light Bill</span>
                  <span className="font-medium">₹{statement?.electricity_amount || 0}</span>
                </div>
              </div>
            </div>

            {!isPaid && (
              <div className="mt-6 flex flex-wrap gap-4 print:hidden">
                <button className="bg-white text-[var(--background)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg shadow-white/20">
                  <IndianRupee size={18}/> Pay Now
                </button>
              </div>
            )}
            
            <div className="mt-6 print:hidden">
              <button 
                onClick={() => window.print()}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors backdrop-blur-md border border-white/20"
              >
                <FileText size={18}/> Download Invoice
              </button>
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
