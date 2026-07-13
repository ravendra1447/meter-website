'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Users, X, MapPin, UserPlus } from 'lucide-react';

export default function AddTenantModal({ isOpen, onClose, propertyId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    move_in_date: new Date().toISOString().split('T')[0],
    accepted_payment_methods: 'cash,online'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post(`/owner/tenants`, {
        ...formData,
        property_id: propertyId
      });
      
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add tenant');
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
            <UserPlus className="text-[var(--primary)]" size={20} />
            Add Tenant Manually
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--background)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Tenant Name *</label>
              <input 
                required 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Mobile *</label>
                <input 
                  required 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Temporary Password *</label>
              <input 
                required 
                type="text" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Give this to tenant to login" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Move In Date</label>
              <input 
                required 
                type="date" 
                name="move_in_date"
                value={formData.move_in_date}
                onChange={handleChange}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all [color-scheme:dark]" 
              />
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
                  'Add Tenant'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
