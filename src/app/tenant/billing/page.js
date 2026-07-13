'use client';

import { FileText, IndianRupee, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function TenantBillingPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get('/tenant/bills');
        setBills(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load bills');
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const currentDue = bills
    .filter(bill => bill.status === 'Unpaid')
    .reduce((total, bill) => total + (bill.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Billing & Payments</h2>
          <p className="text-[var(--muted-foreground)]">Manage your rent and utility bills</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-red-500 mb-1">Total Current Due</p>
          <h3 className="text-3xl font-bold text-red-600">₹{currentDue.toLocaleString()}</h3>
        </div>
        {currentDue > 0 && (
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md shadow-red-500/20">
            Pay Now
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-[var(--muted-foreground)]">Loading billing history...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
      <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Payment History</h3>
        
        {bills.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted-foreground)]">No billing history found.</div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/50 text-[var(--foreground)]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{bill.month}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{bill.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold flex items-center"><IndianRupee size={14}/> {bill.amount}</p>
                    <p className={`text-xs font-medium ${bill.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{bill.status}</p>
                  </div>
                  <button className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
