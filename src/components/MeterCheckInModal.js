'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { AlarmClock, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MeterCheckInModal({ isOpen, onClose, meter, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cutoffDate, setCutoffDate] = useState('');

  if (!isOpen || !meter) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cutoffDate) {
      setError('Please select a date and time.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // The backend expects ISO string. We can send it in local time format.
      // E.g., '2026-08-05T19:00:00.000'
      const dateObj = new Date(cutoffDate);
      const isoString = dateObj.toISOString(); // e.g. 2026-08-05T19:00:00.000Z
      
      // But the backend uses substring(0, 19).replace('T', ' ') so it might be better to format exactly:
      // YYYY-MM-DDTHH:mm:00
      const formattedDate = cutoffDate + ':00.000';

      const res = await api.post(`/smart-meters/${meter.id}/set-cutoff`, {
        cutoff_date: formattedDate
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to set cutoff schedule');
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
            <AlarmClock className="text-[var(--primary)]" size={20} />
            Meter Check In
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--background)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Schedule Saved!</h4>
              <p className="text-[var(--muted-foreground)]">
                The cutoff schedule for {meter.meter_name} has been saved to the cloud successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-1">
                  Target Meter: {meter.meter_name}
                </p>
                <p className="text-xs text-orange-600/80 dark:text-orange-400/80 font-mono">
                  {meter.meter_number}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Auto-Cutoff Schedule
                </label>
                <input 
                  type="datetime-local" 
                  value={cutoffDate}
                  onChange={(e) => setCutoffDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  The meter supply will automatically trip at this exact time.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Schedule...
                    </>
                  ) : (
                    'Set Cutoff Schedule'
                  )}
                </button>
                <p className="text-[10px] text-center text-[var(--muted-foreground)] mt-3">
                  * Note: Unlike the mobile app, the website cannot connect via Bluetooth directly. This schedule will be saved to the cloud and synced automatically.
                </p>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
