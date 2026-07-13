'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FileSpreadsheet, Download, TrendingUp, IndianRupee, PieChart, Activity } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-[var(--muted-foreground)]">Generating Reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center justify-center h-[70vh]">
        {error}
      </div>
    );
  }

  const { stats, statements, property_wise } = data;
  const collectionRate = stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-gradient-to-br from-indigo-950 to-slate-900 -mt-6 -mx-4 md:-mx-8 px-6 md:px-12 py-12 rounded-b-3xl text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <PieChart className="text-indigo-400" size={32} />
            Analytics & Reports
          </h2>
          <p className="text-indigo-200">Track your financial performance and download statements.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30"
        >
          <FileSpreadsheet size={20} />
          <span className="hidden md:inline">Export to Excel (CSV)</span>
          <span className="inline md:hidden">Export</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider mb-1">Total Billed</p>
              <h3 className="text-3xl font-black text-[var(--foreground)]">₹{Number(stats.total).toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <IndianRupee size={24} />
            </div>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">For current period ({data.period})</p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider mb-1">Collected</p>
              <h3 className="text-3xl font-black text-green-600">₹{Number(stats.collected).toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">Amount successfully received</p>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[var(--muted-foreground)] text-sm font-semibold uppercase tracking-wider mb-1">Collection Rate</p>
              <h3 className="text-3xl font-black text-indigo-600">{collectionRate}%</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          
          <div className="w-full bg-[var(--accent)] h-2 rounded-full mt-2 relative z-10">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${collectionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Property Wise Breakdown */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-xl font-bold">Property Wise Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--accent)]/50">
                <th className="p-4 font-semibold text-[var(--muted-foreground)] text-sm">Property</th>
                <th className="p-4 font-semibold text-[var(--muted-foreground)] text-sm">Tenant</th>
                <th className="p-4 font-semibold text-[var(--muted-foreground)] text-sm">Total Bill</th>
                <th className="p-4 font-semibold text-[var(--muted-foreground)] text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {property_wise.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[var(--muted-foreground)]">No data available</td>
                </tr>
              ) : (
                property_wise.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[var(--accent)]/30 transition-colors">
                    <td className="p-4 font-medium">{p.property}</td>
                    <td className="p-4 text-[var(--muted-foreground)]">{p.tenant}</td>
                    <td className="p-4 font-bold">₹{Number(p.total).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.status === 'paid' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                        {p.status_label}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
