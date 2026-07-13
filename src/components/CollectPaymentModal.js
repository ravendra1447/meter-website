'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { X, Receipt, IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CollectPaymentModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  
  const [meters, setMeters] = useState([]);
  const [selectedMeterId, setSelectedMeterId] = useState('');
  
  const [billDetails, setBillDetails] = useState(null);
  const [billError, setBillError] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProperties();
      // Reset state
      setSelectedPropertyId('');
      setMeters([]);
      setSelectedMeterId('');
      setBillDetails(null);
      setBillError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/owner/properties');
      setProperties(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMeters = async (propertyId) => {
    if (!propertyId) {
      setMeters([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/owner/properties/${propertyId}/meters`);
      setMeters(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadBill = async (meterId) => {
    if (!meterId) {
      setBillDetails(null);
      return;
    }
    setLoading(true);
    setBillError(null);
    try {
      const res = await api.get(`/owner/meters/${meterId}/charges`);
      setBillDetails(res.data);
      if (!res.data?.tenant) {
        setBillError(res.data?.message || 'No active tenant assigned to this meter.');
      }
    } catch (e) {
      setBillError(e.message || 'Failed to load bill');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (e) => {
    const val = e.target.value;
    setSelectedPropertyId(val);
    setSelectedMeterId('');
    setBillDetails(null);
    setBillError(null);
    loadMeters(val);
  };

  const handleMeterChange = (e) => {
    const val = e.target.value;
    setSelectedMeterId(val);
    setBillDetails(null);
    setBillError(null);
    loadBill(val);
  };

  const handleCollectPayment = async () => {
    if (!billDetails?.tenant) return;
    
    const tenantId = billDetails.tenant.id;
    const amount = parseFloat(billDetails.total_amount || '0');
    
    if (amount <= 0) {
      alert('No outstanding balance to pay.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/owner/tenants/${tenantId}/cash-recharge`, { amount });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (e) {
      alert(e.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold">Collect Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--accent)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <CheckCircle2 size={64} className="text-green-500" />
              <h3 className="text-xl font-bold">Payment Collected</h3>
              <p className="text-[var(--muted-foreground)] text-center">
                The payment has been successfully applied to the tenant's account.
              </p>
            </div>
          ) : (
            <>
              {/* Selections */}
              <div className="space-y-4 bg-[var(--card)] p-4 rounded-xl border border-[var(--border)]">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Property</label>
                  <select 
                    value={selectedPropertyId} 
                    onChange={handlePropertyChange}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
                    disabled={loading || submitting}
                  >
                    <option value="">Select Property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {meters.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Meter</label>
                    <select 
                      value={selectedMeterId} 
                      onChange={handleMeterChange}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
                      disabled={loading || submitting}
                    >
                      <option value="">Select Meter</option>
                      {meters.map(m => (
                        <option key={m.id} value={m.id}>{m.meter_name} ({m.meter_number})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && <div className="text-center py-4"><span className="animate-pulse">Loading...</span></div>}

              {/* Bill Error */}
              {billError && (
                <div className="flex items-start gap-3 p-4 bg-orange-500/10 text-orange-500 rounded-xl">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{billError}</p>
                </div>
              )}

              {/* Bill Details */}
              {billDetails && !billError && billDetails.tenant && (
                <div className="bg-[var(--accent)] p-5 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4 text-[var(--primary)]">
                    <Receipt size={20} />
                    <span className="font-bold">Bill for {billDetails.tenant.name}</span>
                  </div>

                  <div className="space-y-3">
                    {(billDetails.line_items || []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{item.description || 'Charge'}</p>
                          {item.type === 'rent' && <p className="text-xs text-[var(--muted-foreground)]">Monthly billing</p>}
                        </div>
                        <span className="font-medium flex items-center gap-1">
                          <IndianRupee size={12} />
                          {parseFloat(item.amount || '0').toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-4 border-t border-[var(--border)]"></div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[var(--muted-foreground)]">Total Bill</span>
                    <span className="text-2xl font-black text-[var(--primary)] flex items-center gap-1">
                      <IndianRupee size={20} />
                      {parseFloat(billDetails.total_amount || '0').toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
            <button
              onClick={handleCollectPayment}
              disabled={loading || submitting || !billDetails || billError || !billDetails.tenant}
              className="w-full bg-[var(--primary)] text-white font-semibold py-3 rounded-xl hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? 'Processing...' : 'Apply Payment'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
