'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, IndianRupee, Trash2, Calendar, FileText, PieChart } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    category: 'Maintenance',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const fetchData = async () => {
    try {
      const [expRes, propRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/owner/properties')
      ]);
      setExpenses(expRes.data);
      setProperties(propRes.data);
      if (propRes.data.length > 0) {
        setFormData(f => ({ ...f, property_id: propRes.data[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      toast.success('Expense added!');
      setIsAdding(false);
      fetchData();
      setFormData(f => ({ ...f, amount: '', description: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Expenses & PnL Tracker</h2>
          <p className="text-[var(--muted-foreground)]">Track your property maintenance costs.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          {isAdding ? 'Cancel' : <><Plus size={20} /> Add Expense</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-500/10 text-red-600 p-6 rounded-2xl border border-red-500/20">
          <h3 className="font-bold mb-2 flex items-center gap-2"><PieChart size={20}/> Total Expenses</h3>
          <p className="text-3xl font-black">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
          <h3 className="font-bold text-lg mb-4">Add New Expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property</label>
              <select 
                value={formData.property_id} 
                onChange={e => setFormData({...formData, property_id: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2"
                required
              >
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2"
              >
                <option>Maintenance</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Taxes</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input 
                type="number" 
                value={formData.amount} 
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2"
                required min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date" 
                value={formData.expense_date} 
                onChange={e => setFormData({...formData, expense_date: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input 
                type="text" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="e.g. Fixed the leaking tap in Kitchen"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <button type="submit" className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg font-bold">Save Expense</button>
        </form>
      )}

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--accent)] text-[var(--muted-foreground)]">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Property</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {expenses.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-[var(--muted-foreground)]">No expenses recorded yet.</td></tr>
            ) : expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-[var(--accent)]/50 transition-colors">
                <td className="p-4 flex items-center gap-2"><Calendar size={16}/> {new Date(exp.expense_date).toLocaleDateString('en-IN')}</td>
                <td className="p-4 font-medium">{exp.property_name}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-[var(--accent)] rounded-full text-xs font-medium">{exp.category}</span>
                  {exp.description && <p className="text-xs text-[var(--muted-foreground)] mt-1">{exp.description}</p>}
                </td>
                <td className="p-4 font-bold text-red-500">₹{exp.amount}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
