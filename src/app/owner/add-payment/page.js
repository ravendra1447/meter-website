'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ChevronLeft, Receipt, CheckCircle, AlertCircle, Building2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CollectPaymentPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  
  const [meters, setMeters] = useState([]);
  const [selectedMeterId, setSelectedMeterId] = useState("");
  
  const [billDetails, setBillDetails] = useState(null);
  const [billError, setBillError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/owner/properties');
        setProperties(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProperties();
  }, []);

  const handlePropertyChange = async (e) => {
    const propId = e.target.value;
    setSelectedPropertyId(propId);
    setSelectedMeterId("");
    setBillDetails(null);
    setBillError(null);
    setMeters([]);

    if (propId) {
      setLoading(true);
      try {
        const res = await api.get(`/owner/properties/${propId}/meters`);
        setMeters(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMeterChange = async (e) => {
    const meterId = e.target.value;
    setSelectedMeterId(meterId);
    setBillDetails(null);
    setBillError(null);

    if (meterId) {
      setLoading(true);
      try {
        const res = await api.get(`/owner/meters/${meterId}/charges`);
        setBillDetails(res.data);
        if (!res.data.tenant) {
          setBillError(res.data.message || 'No active tenant assigned to this meter.');
        }
      } catch (err) {
        setBillError(err.message || 'Failed to load bill');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePayment = async () => {
    if (!billDetails || !billDetails.tenant) return;
    
    const tenantId = billDetails.tenant.id;
    const amount = Number(billDetails.total_amount) || 0;
    
    if (amount <= 0) {
      alert('No outstanding balance to pay.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/owner/tenants/${tenantId}/cash-recharge`, { amount });
      setSuccess(true);
    } catch (e) {
      alert(e.message || 'Payment failed');
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black mb-2">Payment Successful</h2>
        <p className="text-[var(--muted-foreground)] mb-8">
          The payment of ₹{Number(billDetails?.total_amount || 0).toLocaleString('en-IN')} has been applied successfully to the tenant's account.
        </p>
        <Link href="/owner" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="-mt-6 -mx-4 md:-mx-8 min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white pt-6 pb-24 px-4 md:px-8">
      
      <div className="flex items-center gap-4 mb-8 max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Collect Payment</h1>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Selection Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-3xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-200">Select Property</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                <select 
                  value={selectedPropertyId}
                  onChange={handlePropertyChange}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all [&>option]:text-black"
                >
                  <option value="">Select a property...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedPropertyId && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-semibold text-indigo-200">Select Smart Meter</label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <select 
                    value={selectedMeterId}
                    onChange={handleMeterChange}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all [&>option]:text-black"
                  >
                    <option value="">Select a meter...</option>
                    {meters.map(m => (
                      <option key={m.id} value={m.id}>{m.meter_name} ({m.meter_number})</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error */}
        {billError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="shrink-0" size={20}/>
            <p>{billError}</p>
          </div>
        )}

        {/* Bill Details */}
        {billDetails && !billError && billDetails.tenant && (
          <div className="bg-[#EAF5F4] text-gray-900 p-6 md:p-8 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-teal-900">Bill for {billDetails.tenant.name}</h3>
                <p className="text-sm text-teal-700">Billing Period: {billDetails.period}</p>
              </div>
            </div>

            <div className="space-y-4">
              {billDetails.line_items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.description || 'Charge'}</p>
                    {item.type === 'rent' && <p className="text-xs text-gray-500">Monthly billing</p>}
                  </div>
                  <p className="font-semibold">₹{Number(item.amount || 0).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-teal-200 border-dashed"></div>

            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-500 uppercase tracking-wider text-sm">Total Due</span>
              <span className="font-black text-4xl text-teal-900">₹{Number(billDetails.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {billDetails && !billError && billDetails.tenant && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-indigo-950 to-transparent">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={handlePayment}
              disabled={submitting}
              className="w-full py-4 bg-white text-indigo-900 font-black text-lg rounded-2xl hover:bg-indigo-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-900"></div>
              ) : (
                <>
                  <CheckCircle size={24} />
                  Apply Payment • ₹{Number(billDetails.total_amount || 0).toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
