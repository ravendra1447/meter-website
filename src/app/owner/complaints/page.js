'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OwnerComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold">Tenant Tickets & Helpdesk</h2>
        <p className="text-[var(--muted-foreground)]">Manage issues reported by your tenants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {complaints.length === 0 ? (
          <div className="md:col-span-2 text-center py-10 bg-[var(--card)] rounded-2xl border border-[var(--border)]">
            <MessageSquare className="mx-auto text-[var(--muted-foreground)] opacity-30 mb-3" size={48} />
            <p className="text-[var(--muted-foreground)]">No tickets found.</p>
          </div>
        ) : complaints.map(c => (
          <div key={c.id} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${c.status === 'resolved' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                  {c.status === 'resolved' ? <CheckCircle2 size={14}/> : <Clock size={14}/>} {c.status}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] font-mono">#{c.id}</span>
              </div>
              
              <h4 className="font-bold text-lg mb-1">{c.title}</h4>
              <p className="text-[var(--muted-foreground)] text-sm mb-4 line-clamp-3">{c.description}</p>
              
              <div className="flex items-center gap-4 text-sm font-medium mb-4 p-3 bg-[var(--accent)] rounded-xl">
                <div>
                  <p className="text-[var(--muted-foreground)] text-xs">Tenant</p>
                  <p>{c.tenant_name}</p>
                </div>
                <div className="w-px h-8 bg-[var(--border)]"></div>
                <div>
                  <p className="text-[var(--muted-foreground)] text-xs">Property</p>
                  <p>{c.property_name}</p>
                </div>
              </div>
            </div>

            {c.status !== 'resolved' && (
              <button 
                onClick={() => handleResolve(c.id)}
                className="w-full bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
