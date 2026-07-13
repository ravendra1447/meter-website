'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Building2, Hash, Bluetooth, Zap, 
  Settings2, Box, Battery, Wallet, 
  ArrowLeft, Save, Loader2, Shield
} from 'lucide-react';
import Link from 'next/link';

export default function AddMeterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  const [formData, setFormData] = useState({
    propertyId: '',
    meter_name: 'Main Meter',
    meter_number: `MTR-${Math.floor(Date.now() % 10000)}`,
    bluetooth_mac: '',
    model_number: 'GENUS-1020',
    series_number: `SN-${Math.floor(Date.now() % 10000)}`,
    meter_type: 'prepaid',
    tariff_per_unit: '8.5',
    initial_balance: '500',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/master/properties');
        const props = response.data?.data || [];
        setProperties(props);
        if (props.length > 0) {
          setFormData(prev => ({ ...prev, propertyId: props[0].id }));
        }
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.propertyId) {
      setError('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        meter_name: formData.meter_name.trim(),
        meter_number: formData.meter_number.trim(),
        model_number: formData.model_number.trim(),
        series_number: formData.series_number.trim(),
        meter_type: formData.meter_type,
        tariff_per_unit: Number(formData.tariff_per_unit) || 8.5,
        initial_balance: Number(formData.initial_balance) || 0,
        current_balance: Number(formData.initial_balance) || 0,
        status: 'active',
        bluetooth_mac: formData.bluetooth_mac.trim() || undefined,
      };

      // Ensure correct endpoint structure according to backend
      await api.post(`/owner/properties/${formData.propertyId}/meters`, payload);
      
      router.push('/dashboard/meters');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Failed to add smart meter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/meters" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Electricity Meter</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Configure smart meter settings and link to a property.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
          <Shield size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Link Property */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Building2 size={20} />
            </div>
            <h2 className="text-lg font-bold">Property Assignment</h2>
          </div>
          <div className="p-6">
            <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">Select Property</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
              <select 
                name="propertyId" 
                value={formData.propertyId} 
                onChange={handleChange} 
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                {propertiesLoading ? (
                  <option value="">Loading properties...</option>
                ) : properties.length === 0 ? (
                  <option value="">No properties available. Add a property first.</option>
                ) : (
                  <>
                    <option value="" disabled>Select a property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </>
                )}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Meter Details */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Zap size={20} />
            </div>
            <h2 className="text-lg font-bold">Meter Identifiers</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Meter Name</label>
              <div className="relative">
                <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="meter_name" value={formData.meter_name} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Meter Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="meter_number" value={formData.meter_number} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Bluetooth MAC (Optional)</label>
              <div className="relative">
                <Bluetooth className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="text" name="bluetooth_mac" value={formData.bluetooth_mac} onChange={handleChange} placeholder="AA:BB:CC:DD:EE:FF" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono" />
              </div>
              <p className="text-xs text-[var(--muted-foreground)] ml-1 mt-1">Required if you want to connect to this meter locally via BLE.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Model Number</label>
              <div className="relative">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="model_number" value={formData.model_number} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Series Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="series_number" value={formData.series_number} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono" />
              </div>
            </div>

          </div>
        </div>

        {/* Configurations */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-green-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Wallet size={20} />
            </div>
            <h2 className="text-lg font-bold">Billing & Balance</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Meter Type</label>
              <div className="relative">
                <Battery className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <select 
                  name="meter_type" 
                  value={formData.meter_type} 
                  onChange={handleChange} 
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all appearance-none"
                >
                  <option value="prepaid">Prepaid (Token & Balance)</option>
                  <option value="postpaid">Postpaid (Monthly Billing)</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Tariff per Unit (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">₹</span>
                <input required type="number" min="0" step="0.1" name="tariff_per_unit" value={formData.tariff_per_unit} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Initial Balance (₹)</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="number" min="0" name="initial_balance" value={formData.initial_balance} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
            </div>

          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/dashboard/meters" className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] font-semibold transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading || properties.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Saving Meter...</>
            ) : (
              <><Save size={18} /> Add Smart Meter</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
