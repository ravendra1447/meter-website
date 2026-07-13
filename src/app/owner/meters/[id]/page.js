'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ChevronLeft, Zap, Power, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function MeterControlPage() {
  const params = useParams();
  const router = useRouter();
  const meterId = params.id;

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relayLoading, setRelayLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/owner/meters/${meterId}/smart-status`);
      setStatus(res.data);
    } catch (err) {
      console.error('Error loading meter status:', err);
      setError(err.message || 'Failed to load meter status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Poll every 15s for live updates
    return () => clearInterval(interval);
  }, [meterId]);

  const toggleRelay = async (targetAction) => {
    if (!confirm(`Are you sure you want to turn the supply ${targetAction.toUpperCase()}?`)) return;
    
    setRelayLoading(true);
    try {
      await api.post(`/owner/meters/${meterId}/remote-relay`, { action: targetAction });
      // Optimistic update
      setStatus(prev => ({ ...prev, relay_status: targetAction }));
      alert(`Relay turned ${targetAction.toUpperCase()} successfully.`);
    } catch (err) {
      console.error('Relay action failed:', err);
      alert(err.message || 'Failed to execute relay action');
    } finally {
      setRelayLoading(false);
    }
  };

  if (loading && !status) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        <p className="text-[var(--muted-foreground)]">Connecting to Smart Meter...</p>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <ShieldAlert size={64} className="text-orange-500 opacity-50" />
        <h2 className="text-2xl font-bold">Meter Connection Failed</h2>
        <p className="text-[var(--muted-foreground)]">{error}</p>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const isOnline = status?.is_online;
  const relayStatus = status?.relay_status || 'off';

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-[var(--accent)] rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Meter Diagnostics</h2>
          <div className="flex items-center text-sm text-[var(--muted-foreground)] gap-2 mt-1">
            <span>Live Telemetry & Control</span>
          </div>
        </div>
      </div>

      {/* Online Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${isOnline ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap size={24} />
            {isOnline && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-ping"></span>}
          </div>
          <div>
            <h3 className="font-bold">{isOnline ? 'Meter is Online' : 'Meter is Offline'}</h3>
            <p className="text-sm opacity-80">{isOnline ? 'Receiving live telemetry data' : 'Cannot reach meter. Showing last known state.'}</p>
          </div>
        </div>
      </div>

      {/* Readings Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wider">Voltage</div>
          <div className="text-2xl font-bold font-mono">
            {status?.voltage?.toFixed(1) || '0.0'} <span className="text-sm text-[var(--muted-foreground)]">V</span>
          </div>
        </div>
        <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wider">Current</div>
          <div className="text-2xl font-bold font-mono">
            {status?.current?.toFixed(2) || '0.00'} <span className="text-sm text-[var(--muted-foreground)]">A</span>
          </div>
        </div>
        <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wider">Active Power</div>
          <div className="text-2xl font-bold font-mono">
            {status?.power?.toFixed(0) || '0'} <span className="text-sm text-[var(--muted-foreground)]">W</span>
          </div>
        </div>
        <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm border-l-4 border-l-[var(--primary)]">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wider">Total Energy</div>
          <div className="text-2xl font-bold font-mono text-[var(--primary)]">
            {status?.total_energy_kwh?.toFixed(2) || '0.00'} <span className="text-sm opacity-60">kWh</span>
          </div>
        </div>
      </div>

      {/* Control Section */}
      <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Power className={relayStatus === 'on' ? 'text-green-500' : 'text-red-500'} />
              Supply Control
            </h3>
            <p className="text-[var(--muted-foreground)] mt-2 max-w-md">
              Current state: <strong className={relayStatus === 'on' ? 'text-green-500' : 'text-red-500'}>{relayStatus.toUpperCase()}</strong>. 
              {relayStatus === 'on' ? ' Power is currently flowing to the unit.' : ' Power is cut off from the unit.'}
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              disabled={relayLoading || relayStatus === 'on'}
              onClick={() => toggleRelay('on')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${relayStatus === 'on' ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500' : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30'}`}
            >
              {relayLoading && relayStatus === 'off' ? 'Turning ON...' : 'TURN ON'}
            </button>
            <button 
              disabled={relayLoading || relayStatus === 'off'}
              onClick={() => toggleRelay('off')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${relayStatus === 'off' ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'}`}
            >
              {relayLoading && relayStatus === 'on' ? 'Turning OFF...' : 'TURN OFF'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
