'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Calendar, PieChart, Receipt, Building2, TrendingDown, ChevronDown, CheckCircle2 } from 'lucide-react';
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
      toast.success('Expense added successfully!');
      setIsAdding(false);
      fetchData();
      setFormData(f => ({ ...f, amount: '', description: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading Expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 flex items-center gap-3">
              <Receipt className="text-rose-500" size={32} /> Expenses & PnL Tracker
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Monitor and manage all your property maintenance costs.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Expenses</p>
              <p className="text-2xl font-extrabold text-rose-600">₹{totalExpenses.toLocaleString('en-IN')}</p>
            </div>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {isAdding ? 'Cancel Entry' : <><Plus size={20} /> Add Expense</>}
            </button>
          </div>
        </div>

        {/* Add Expense Form (Animated collapse could be added, using simple conditional for now) */}
        {isAdding && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-400"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieChart size={20} className="text-rose-500"/> Record New Expense
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Property</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={formData.property_id} 
                      onChange={e => setFormData({...formData, property_id: e.target.value})}
                      className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 font-medium appearance-none transition-all"
                      required
                    >
                      {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                  <div className="relative">
                    <PieChart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 font-medium appearance-none transition-all"
                    >
                      <option>Maintenance</option>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>Taxes</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={formData.amount} 
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 font-bold transition-all"
                      required min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      value={formData.expense_date} 
                      onChange={e => setFormData({...formData, expense_date: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 font-medium transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                  <input 
                    type="text" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g. Fixed the leaking tap in Kitchen"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 font-medium transition-all"
                  />
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <CheckCircle2 size={18} /> Save Expense
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-slate-800 px-2 flex items-center gap-2">
            <TrendingDown size={20} className="text-rose-500" /> Recent Expenses
          </h2>

          {expenses.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No expenses recorded</h3>
              <p className="text-slate-500">You haven't added any expenses yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {expenses.map(exp => (
                <div key={exp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between p-4 gap-6 group relative overflow-hidden">
                  
                  {/* Subtle edge highlight */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex items-center gap-5 min-w-[280px] pl-2 md:pl-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                      <Receipt size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-0.5">{exp.property_name}</h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(exp.expense_date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full md:w-auto px-4 md:border-l border-slate-100">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
                      {exp.category}
                    </span>
                    <p className="text-sm text-slate-500 font-medium truncate max-w-md">
                      {exp.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto min-w-[150px] md:border-l border-slate-100 md:pl-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Amount</p>
                      <p className="font-extrabold text-xl text-rose-600">₹{Number(exp.amount).toLocaleString('en-IN')}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(exp.id)} 
                      className="w-10 h-10 flex items-center justify-center bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 transition-all shadow-sm"
                      title="Delete Expense"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
