'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, CheckCircle2, AlertCircle, Clock, Search, Wrench, User, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OwnerComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/complaints/owner');
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleResolve = async (id) => {
    try {
      await api.put(`/complaints/${id}/status`, { status: 'resolved' });
      toast.success('Ticket marked as resolved');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c => 
    (c.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.tenant_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.property_name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading Helpdesk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 flex items-center gap-3">
              <MessageSquare className="text-indigo-500" size={32} /> Tenant Helpdesk
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage and resolve issues reported by your tenants efficiently.</p>
          </div>
          <div className="relative group w-full md:w-auto min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search tickets, tenants..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition-all shadow-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
              <p className="text-slate-500 text-lg">No active complaints or tickets found.</p>
            </div>
          ) : filteredComplaints.map(c => {
            const isResolved = c.status === 'resolved';

            return (
              <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group relative overflow-hidden">
                
                {/* Left Edge Color */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isResolved ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>

                {/* Left Content */}
                <div className="flex-1 w-full pl-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isResolved ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-orange-50 text-orange-600 ring-1 ring-orange-500/20'}`}>
                      {isResolved ? <CheckCircle2 size={12}/> : <Clock size={12} className="animate-pulse" />} {c.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded">#TKT-{c.id}</span>
                  </div>
                  
                  <h4 className="font-extrabold text-xl text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{c.title}</h4>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed max-w-3xl">{c.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-slate-50 inline-flex px-4 py-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-indigo-400" />
                      <span className="text-slate-700">{c.tenant_name || 'Unknown Tenant'}</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <Building size={14} className="text-indigo-400" />
                      <span className="text-slate-700">{c.property_name || 'Unknown Property'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="w-full md:w-auto shrink-0 md:border-l border-slate-100 md:pl-8 flex md:flex-col justify-end md:justify-center items-end h-full">
                  {!isResolved ? (
                    <button 
                      onClick={() => handleResolve(c.id)}
                      className="w-full md:w-auto bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-emerald-500/30 transform hover:-translate-y-0.5"
                    >
                      <Wrench size={18} /> Mark Resolved
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 size={18} /> Ticket Closed
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
