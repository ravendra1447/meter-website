'use client';

import { FileText, IndianRupee, Download, AlertCircle, CheckCircle2 } from "lucide-react";
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
    .filter(bill => bill.status === 'Unpaid' || bill.status === 'pending')
    .reduce((total, bill) => total + (bill.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading billing history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <FileText className="text-slate-400" size={32} />
            Billing & Payments
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your rent, view invoices, and track your payment history.</p>
        </div>

        {/* Current Due Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-full ${currentDue > 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {currentDue > 0 ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Current Due</p>
              <h3 className={`text-4xl font-black ${currentDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                ₹{currentDue.toLocaleString('en-IN')}
              </h3>
              {currentDue === 0 && (
                <p className="text-sm font-medium text-slate-400 mt-1">You are all caught up!</p>
              )}
            </div>
          </div>
          
          {currentDue > 0 && (
            <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm focus:ring-4 focus:ring-slate-200">
              Pay Outstanding Balance
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Payment History */}
        {!error && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Payment History</h3>
            </div>
            
            {bills.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50">
                <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-lg font-bold text-slate-700">No invoices yet.</p>
                <p className="text-slate-500">Your billing history will appear here once rent is generated.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bills.map((bill) => {
                  const isPaid = bill.status.toLowerCase() === 'paid';
                  
                  return (
                    <div key={bill.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:px-8 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-5 mb-4 sm:mb-0 w-full sm:w-auto">
                        <div className="p-3 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-slate-800">{bill.month}</p>
                          <p className="text-sm font-medium text-slate-400 font-mono">INV-{bill.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
                        <div className="text-right">
                          <p className="font-extrabold text-xl text-slate-800 flex items-center justify-end">
                            <IndianRupee size={16} className="text-slate-500 mr-1"/> {Number(bill.amount).toLocaleString('en-IN')}
                          </p>
                          <span className={`inline-flex px-3 py-1 mt-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {bill.status}
                          </span>
                        </div>
                        <button 
                          className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:shadow-sm transition-all"
                          title="Download Invoice"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
