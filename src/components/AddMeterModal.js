'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Zap, X, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddMeterModal({ isOpen, onClose, propertyId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    meter_name: '',
    meter_number: '',
    meter_type: 'Electricity',
    tariff_per_unit: '8',
    last_reading: '0',
    location: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.meter_name || !formData.meter_number) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post(`/owner/properties/${propertyId}/meters`, {
        ...formData,
        tariff_per_unit: Number(formData.tariff_per_unit),
        last_reading: Number(formData.last_reading),
        status: 'active'
      });
      
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add meter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--card)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[var(--border)] bg-[var(--accent)]/50">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Zap className="text-[var(--primary)]" size={20} />
            Add Smart Meter
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--background)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Meter Name *</label>
              <input 
                required 
                type="text" 
                name="meter_name"
                value={formData.meter_name}
                onChange={handleChange}
                placeholder="e.g. Room 101 Main" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Meter Number / MAC Address *</label>
              <input 
                required 
                type="text" 
                name="meter_number"
                value={formData.meter_number}
                onChange={handleChange}
                placeholder="Required for Bluetooth / Server sync" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
              />
              <p className="text-[10px] text-[var(--muted-foreground)]">Must exactly match the DL/T645 meter number.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Tariff (₹/Unit)</label>
                <input 
                  type="number" 
                  step="0.1"
                  name="tariff_per_unit"
                  value={formData.tariff_per_unit}
                  onChange={handleChange}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Initial Reading</label>
                <input 
                  type="number"
                  name="last_reading"
                  value={formData.last_reading}
                  onChange={handleChange}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ground Floor Board" 
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Add Meter to Property'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
