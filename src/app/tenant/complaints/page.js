'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TenantComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    description: ''
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/complaints/my');
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      toast.success('Complaint submitted!');
      setIsAdding(false);
      fetchData();
      setFormData({ title: '', category: 'Plumbing', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit complaint');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Helpdesk & Complaints</h2>
          <p className="text-slate-500">Report issues to your property owner.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold"
        >
          {isAdding ? 'Cancel' : <><Plus size={20} /> New Issue</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Report an Issue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Issue Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              >
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Appliance</option>
                <option>Security</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-slate-700">Short Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Tap leaking in kitchen"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-slate-700">Detailed Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the problem in detail..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                required
              />
            </div>
          </div>
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all">Submit Issue</button>
        </form>
      )}

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
            <MessageSquare className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500">No complaints submitted yet.</p>
          </div>
        ) : complaints.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-full ${c.status === 'resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
              {c.status === 'resolved' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-slate-800">{c.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${c.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-2">{c.category}</p>
              <p className="text-slate-600 text-sm">{c.description}</p>
              <p className="text-xs text-slate-400 mt-4">Submitted on: {new Date(c.created_at).toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
