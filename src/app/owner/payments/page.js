'use client';

import { useState, useEffect } from 'react';
import { FileText, IndianRupee, Search, Plus, CheckCircle, XCircle, CreditCard, Banknote, Calendar } from "lucide-react";
import CollectPaymentModal from '@/components/CollectPaymentModal';
import { api } from '@/lib/api';

export default function OwnerPaymentsPage() {
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'pending'
  const [actionLoading, setActionLoading] = useState(null); // id of payment being acted on

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/owner/collection');
      if (res && res.data && res.data.statements) {
        // Map statements to the format expected by the table
        const formatted = res.data.statements.map(stmt => ({
          id: `STMT-${stmt.id}`,
          tenant: stmt.tenant?.name || 'Unknown',
          property: stmt.property?.name || 'Unknown',
          amount: stmt.total || 0,
          date: new Date(stmt.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: stmt.status === 'paid' ? 'Paid' : 'Pending',
          rawDate: new Date(stmt.created_at || Date.now())
        }));
        // Sort by newest first
        formatted.sort((a, b) => b.rawDate - a.rawDate);
        setTransactions(formatted);
      }
      
      const pendingRes = await api.get('/owner/pending-payments');
      if (pendingRes && pendingRes.data) {
        setPendingPayments(pendingRes.data);
      }
    } catch (e) {
      console.error('Failed to load collections:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.post(`/owner/approve-payment/${id}`);
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to approve payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this payment?')) return;
    setActionLoading(id);
    try {
      await api.post(`/owner/reject-payment/${id}`);
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to reject payment');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = transactions.filter(txn => {
    const q = searchQuery.toLowerCase();
    return txn.tenant.toLowerCase().includes(q) || txn.property.toLowerCase().includes(q) || txn.id.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 flex items-center gap-3">
              <Banknote className="text-emerald-500" size={32} /> Payments Center
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage collections, pending approvals, and payment history.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all font-medium"
              />
            </div>
            <button 
              onClick={() => setIsCollectModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus size={20} /> Collect Payment
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1.5 space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm w-full md:w-max">
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex-1 md:w-48 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-emerald-700 shadow ring-1 ring-emerald-500/20' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
          >
            <FileText size={18}/> History
          </button>
          <button 
            onClick={() => setActiveTab('pending')} 
            className={`flex-1 md:w-48 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-white text-orange-600 shadow ring-1 ring-orange-500/20' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
          >
            <div className="relative flex items-center">
              <CreditCard size={18} className={activeTab === 'pending' ? 'text-orange-500' : ''}/>
              {pendingPayments.length > 0 && (
                <span className="absolute -top-1 -right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </div>
            Pending ({pendingPayments.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'history' ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-20 text-center">
                <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-800">No History Found</h3>
                <p className="text-slate-500 mt-2">No transactions match your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">Transaction ID</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">Tenant</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">Property</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">Date</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">Amount</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.map((txn, index) => (
                      <tr key={txn.id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">{txn.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{txn.tenant}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{txn.property}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500 flex items-center gap-1.5"><Calendar size={14}/>{txn.date}</td>
                        <td className="px-6 py-4 font-extrabold text-slate-800">₹{Number(txn.amount).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${txn.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-orange-50 text-orange-600 ring-1 ring-orange-500/20'}`}>
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading pending approvals...</p>
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
                <p className="text-slate-500 text-lg">There are no pending payments to approve right now.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden">
                    
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex items-center gap-5 min-w-[280px] w-full pl-2">
                      <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                        <CreditCard size={26} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xl text-slate-800 mb-1 line-clamp-1">{payment.tenant?.name || 'Unknown Tenant'}</h4>
                        <p className="text-sm text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded inline-block">{payment.property?.name || 'Unknown Property'}</p>
                      </div>
                    </div>

                    <div className="flex-1 w-full md:border-l border-slate-100 md:px-6">
                      <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Details</p>
                        <p className="text-sm font-medium text-slate-700"><span className="text-slate-400">Via:</span> {payment.payment_method}</p>
                        {payment.notes && <p className="text-sm font-medium text-slate-700 mt-1 line-clamp-1" title={payment.notes}><span className="text-slate-400">Notes:</span> {payment.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto md:border-l border-slate-100 md:pl-6 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Amount</p>
                        <p className="font-black text-2xl text-orange-600">₹{Number(payment.amount).toLocaleString('en-IN')}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(payment.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          disabled={actionLoading === payment.id}
                          onClick={() => handleApprove(payment.id)}
                          className="px-6 py-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button 
                          disabled={actionLoading === payment.id}
                          onClick={() => handleReject(payment.id)}
                          className="px-6 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <CollectPaymentModal 
          isOpen={isCollectModalOpen}
          onClose={() => setIsCollectModalOpen(false)}
          onSuccess={() => {
            loadData();
          }}
        />
      </div>
    </div>
  );
}
