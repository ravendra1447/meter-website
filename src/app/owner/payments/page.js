'use client';

import { useState, useEffect } from 'react';
import { FileText, IndianRupee, Search, Plus, CheckCircle, XCircle } from "lucide-react";
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
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Global Payment History</h2>
          <p className="text-[var(--muted-foreground)]">Track rent and bills across all your tenants</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search tenant or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <button 
            onClick={() => setIsCollectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Collect Payment</span>
            <span className="sm:hidden">Collect</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-[var(--accent)]/50 rounded-lg w-full md:w-auto overflow-x-auto border border-[var(--border)] mb-4">
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
        >
          <FileText size={16}/> Payment History
        </button>
        <button 
          onClick={() => setActiveTab('pending')} 
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
        >
          <div className="relative">
            <IndianRupee size={16}/>
            {pendingPayments.length > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          Pending Approvals ({pendingPayments.length})
        </button>
      </div>

      {activeTab === 'history' ? (
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--accent)] border-b border-[var(--border)]">
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Transaction ID</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Tenant</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Property</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Date</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Amount</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--muted-foreground)]">
                    <span className="animate-pulse">Loading payment history...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--muted-foreground)]">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn, index) => (
                  <tr key={txn.id} className={`border-b border-[var(--border)] hover:bg-[var(--accent)] transition-colors ${index === filteredTransactions.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="p-4 font-medium text-sm">{txn.id}</td>
                    <td className="p-4 font-medium text-sm">{txn.tenant}</td>
                    <td className="p-4 text-sm text-[var(--muted-foreground)]">{txn.property}</td>
                    <td className="p-4 text-sm text-[var(--muted-foreground)]">{txn.date}</td>
                    <td className="p-4 font-bold flex items-center"><IndianRupee size={14}/>{txn.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <span className="animate-pulse text-[var(--muted-foreground)]">Loading pending payments...</span>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center">
              <CheckCircle className="mx-auto text-green-500 mb-3 opacity-50" size={48} />
              <p className="text-lg font-bold">All Caught Up!</p>
              <p className="text-[var(--muted-foreground)]">There are no pending payments to approve.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPayments.map(payment => (
                <div key={payment.id} className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{payment.tenant?.name || 'Unknown Tenant'}</h4>
                      <p className="text-sm text-[var(--muted-foreground)]">{payment.property?.name || 'Unknown Property'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-orange-500 flex items-center justify-end"><IndianRupee size={16}/>{payment.amount}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">{new Date(payment.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="bg-[var(--accent)]/50 p-3 rounded-lg text-sm mb-4">
                    <p><span className="text-[var(--muted-foreground)]">Method:</span> <span className="font-medium capitalize">{payment.payment_method}</span></p>
                    {payment.notes && <p className="mt-1"><span className="text-[var(--muted-foreground)]">Notes:</span> {payment.notes}</p>}
                  </div>
                  <div className="mt-auto flex gap-3">
                    <button 
                      disabled={actionLoading === payment.id}
                      onClick={() => handleApprove(payment.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button 
                      disabled={actionLoading === payment.id}
                      onClick={() => handleReject(payment.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={18} /> Reject
                    </button>
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
  );
}
