'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FileSpreadsheet, Download, TrendingUp, IndianRupee, PieChart, Activity, Building, User } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/owner/reports');
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportToCSV = () => {
    if (!data?.statements) return;
    
    // Create CSV Headers
    const headers = ['Statement ID', 'Date', 'Property Name', 'Tenant Name', 'Total Bill (Rs)', 'Status', 'Due Date'];
    
    // Map data rows
    const rows = data.statements.map(s => [
      s.id,
      new Date(s.created_at).toLocaleDateString(),
      s.property?.name || 'N/A',
      s.tenant?.name || 'N/A',
      s.total,
      s.status,
      new Date(s.due_date).toLocaleDateString()
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rent_collection_report_${data.period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-slate-500 font-medium tracking-wide">Generating Reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 max-w-md mx-auto border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load reports</h2>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const { stats, property_wise } = data;
  const collectionRate = stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Hero Header Region */}
      <div className="bg-white border-b border-slate-200 px-6 py-12 md:py-16 md:px-12 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight flex items-center gap-4">
              <PieChart className="text-slate-400" size={40} />
              Analytics & Reports
            </h1>
            <p className="text-slate-500 text-lg max-w-xl font-medium">Detailed financial insights, collection rates, and property performance metrics for your portfolio.</p>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-sm"
          >
            <FileSpreadsheet size={22} className="text-white" />
            <span>Export to Excel (CSV)</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transform transition hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Billed</p>
                <h3 className="text-4xl font-black text-slate-800">₹{Number(stats.total).toLocaleString('en-IN')}</h3>
              </div>
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <IndianRupee size={28} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-lg">For current period: <strong className="text-slate-700">{data.period}</strong></p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transform transition hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Collected</p>
                <h3 className="text-4xl font-black text-emerald-600">₹{Number(stats.collected).toLocaleString('en-IN')}</h3>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp size={28} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-lg">Amount successfully received</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transform transition hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Collection Rate</p>
                <h3 className="text-4xl font-black text-slate-800">{collectionRate}%</h3>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Activity size={28} />
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2 relative z-10 shadow-inner">
              <div className="bg-indigo-500 h-2.5 rounded-full relative" style={{ width: `${collectionRate}%` }}>
              </div>
            </div>
          </div>

        </div>

        {/* Property Wise Breakdown */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg overflow-hidden">
          <div className="p-8 border-b border-slate-100/50 bg-white/50">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Building size={24} className="text-indigo-500" />
              Property Wise Performance
            </h3>
            <p className="text-slate-500 mt-2 font-medium">A detailed breakdown of billing and collection status for each unit.</p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {property_wise.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <Activity className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-xl font-bold text-slate-700">No data available for this period</p>
                </div>
              ) : (
                property_wise.map((p, idx) => {
                  const isPaid = p.status === 'paid';
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between p-4 gap-6 group">
                      
                      <div className="flex items-center gap-4 min-w-[280px] w-full pl-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                          <Building size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 mb-0.5 group-hover:text-indigo-600 transition-colors">{p.property}</h4>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <User size={12} className="text-indigo-400" />
                            {p.tenant}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto md:border-l border-slate-100 md:pl-8 shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Bill</p>
                          <p className={`font-extrabold text-xl ${isPaid ? 'text-emerald-600' : 'text-slate-800'}`}>₹{Number(p.total).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="w-24 flex justify-end">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-orange-50 text-orange-600 ring-1 ring-orange-500/20'}`}>
                            {p.status_label}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
