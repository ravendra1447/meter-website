'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, X, Zap } from 'lucide-react';

export default function CreateBillingScheduleModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meters, setMeters] = useState([]);
  
  const [formData, setFormData] = useState({
    schedule_name: '',
    meter_id: '',
    schedule_type: 'monthly',
    run_time: '09:00',
    enabled: true
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/owner/meters').then(res => setMeters(res.data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.schedule_name || !formData.meter_id || !formData.run_time) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const selectedMeter = meters.find(m => m.id === Number(formData.meter_id));
      await api.post(`/owner/billing-schedules`, {
        ...formData,
        smart_meter_id: selectedMeter?.smart_meter_id || null,
        cron_expression: `0 ${formData.run_time.split(':')[1]} ${formData.run_time.split(':')[0]} 1 * *`, // Placeholder cron
      });
      
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--card)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[var(--border)] bg-purple-500/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="text-purple-500" size={20} />
            Create Auto-Billing Schedule
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--background)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Schedule Name *</label>
              <input 
                required 
                type="text" 
                name="schedule_name"
                value={formData.schedule_name}
                onChange={handleChange}
                placeholder="e.g. 1st of Every Month - Room 101" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Select Smart Meter *</label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
                <select
                  required
                  name="meter_id"
                  value={formData.meter_id}
                  onChange={handleChange}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                >
                  <option value="">Select a meter</option>
                  {meters.map(m => (
                    <option key={m.id} value={m.id}>{m.meter_name} ({m.meter_number})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Schedule Type</label>
                <select
                  name="schedule_type"
                  value={formData.schedule_type}
                  onChange={handleChange}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Time of Day</label>
                <input 
                  required 
                  type="time" 
                  name="run_time"
                  value={formData.run_time}
                  onChange={handleChange}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="enabled"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
              />
              <label htmlFor="enabled" className="text-sm font-medium">Enable this schedule immediately</label>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-purple-500/25"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Create Schedule'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
