'use client';

import { Search, Bluetooth, Zap, Battery, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import Link from 'next/link';
import { BluetoothConnectModal } from "@/components/BluetoothConnectModal";

export default function MetersPage() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBluetoothModalOpen, setIsBluetoothModalOpen] = useState(false);

  useEffect(() => {
    const fetchMeters = async () => {
      try {
        const response = await api.get('/master/meters');
        setMeters(response.data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load meters');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeters();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Smart Meters Dashboard</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBluetoothModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors font-medium"
          >
            <Bluetooth size={18} /> Connect BLE
          </button>
          <Link 
            href="/dashboard/meters/add"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors shadow-md shadow-purple-500/20 font-medium"
          >
            <Zap size={18} /> Add Meter
          </Link>
        </div>
      </div>

      <BluetoothConnectModal 
        isOpen={isBluetoothModalOpen} 
        onClose={() => setIsBluetoothModalOpen(false)} 
        onMeterConnected={(device) => {
          setMeters(prev => {
            if (prev.find(m => m.meter_number === device.id)) return prev;
            return [{
              id: device.id,
              meter_name: device.name || 'Bluetooth Meter',
              meter_number: device.id,
              status: 'active',
              property: { name: 'Direct BLE Connection' },
              last_reading: '---',
              meter_type: 'bluetooth',
              current_balance: 0
            }, ...prev];
          });
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--muted-foreground)]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading meters...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-6 rounded-xl text-center">
          {error}
        </div>
      ) : meters.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--accent)]/50">
          No meters found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {meters.map((meter) => (
            <div key={meter.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 gap-4">
              
              {/* Info Section */}
              <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                <div className={`p-3 rounded-full shrink-0 ${meter.status === 'active' ? 'bg-blue-500/10 text-blue-500' : 'bg-[var(--accent)] text-[var(--muted-foreground)]'}`}>
                  <Bluetooth size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {meter.meter_name || meter.meter_number}
                    <span className={`flex h-2 w-2 rounded-full ${meter.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{meter.property?.name || 'Unassigned Property'}</p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12 flex-1 sm:flex-none px-2 sm:px-6 sm:border-l border-[var(--border)]">
                <div className="space-y-1">
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1"><Zap size={14}/> Reading</p>
                  <p className="font-bold">{meter.last_reading || 0} kWh</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1"><Battery size={14}/> Type</p>
                  <p className="font-bold capitalize">{meter.meter_type || 'Unknown'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-[var(--muted-foreground)]">Balance</p>
                  <p className="font-bold text-green-600 dark:text-green-400">₹{meter.current_balance || 0}</p>
                </div>
              </div>
              
              {/* Action Section */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--border)] flex justify-end">
                <button className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--primary)] text-[var(--foreground)] hover:text-white rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
