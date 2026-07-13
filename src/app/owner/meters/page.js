'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Power, Plus, Zap, Trash2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OwnerMetersPage() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relayLoading, setRelayLoading] = useState({});
  const router = useRouter();

  const fetchMeters = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/meters');
      setMeters(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load meters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  const toggleRelay = async (e, meter) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    
    const currentStatus = meter.smart_meter?.relay_status || meter.relay_status || 'ON';
    const targetAction = currentStatus.toUpperCase() === 'ON' ? 'OFF' : 'ON';
    
    setRelayLoading(prev => ({ ...prev, [meter.id]: true }));
    try {
      await api.post(`/owner/meters/${meter.id}/remote-relay`, { action: targetAction });
      // Update local state for immediate feedback
      setMeters(prevMeters => prevMeters.map(m => {
        if (m.id === meter.id) {
          return { ...m, relay_status: targetAction.toLowerCase(), smart_meter: { ...m.smart_meter, relay_status: targetAction.toLowerCase() } };
        }
        return m;
      }));
    } catch (err) {
      alert(err.message || 'Failed to toggle relay');
    } finally {
      setRelayLoading(prev => ({ ...prev, [meter.id]: false }));
    }
  };

  const deleteMeter = async (e, id) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click

    if (!confirm('Are you sure you want to delete this meter?')) return;
    try {
      await api.delete(`/owner/meters/${id}`);
      fetchMeters();
    } catch (err) {
      alert(err.message || 'Failed to delete meter');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-gradient-to-r from-green-900 to-teal-900 -mt-6 -mx-4 md:-mx-8 px-6 md:px-12 py-12 rounded-b-3xl text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-2">Smart Meters</h2>
          <p className="text-green-200">Monitor and control your properties' electricity.</p>
        </div>
        <button 
          onClick={() => alert('Please add meters from the Property Details page.')}
          className="flex items-center gap-2 bg-white text-green-900 px-5 py-2.5 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>Add Meter</span>
        </button>
      </div>

      <div className="pt-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            <p className="text-[var(--muted-foreground)]">Loading smart meters...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center gap-2">
            <ShieldAlert size={20}/> {error}
          </div>
        )}

        {!loading && !error && meters.length === 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] p-12 rounded-3xl text-center shadow-sm">
            <Zap className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">No Smart Meters Found</h3>
            <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
              You haven't added any smart meters yet. Go to a Property's Details page to add a meter.
            </p>
          </div>
        )}

        {!loading && !error && meters.length > 0 && (
          <div className="space-y-4">
            {meters.map((meter) => {
              const currentStatus = (meter.smart_meter?.relay_status || meter.relay_status || 'ON').toUpperCase();
              const isRelayOn = currentStatus === 'ON';
              
              return (
                <Link 
                  href={`/owner/meters/${meter.id}`}
                  key={meter.id} 
                  className={`block bg-[var(--card)] rounded-2xl border-2 transition-all group shadow-sm hover:shadow-md ${isRelayOn ? 'border-green-500/30 hover:border-green-500/60' : 'border-red-500/30 hover:border-red-500/60'}`}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className={`p-4 rounded-full flex items-center justify-center ${isRelayOn ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      <Zap size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-green-500 transition-colors">{meter.meter_name || 'Smart Meter'}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] font-mono">{meter.meter_number}</p>
                      {meter.property && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">{meter.property.name}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => toggleRelay(e, meter)}
                        disabled={relayLoading[meter.id]}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${
                          isRelayOn 
                            ? 'bg-green-500/10 border-green-500 text-green-600 hover:bg-green-500 hover:text-white' 
                            : 'bg-red-500/10 border-red-500 text-red-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        {relayLoading[meter.id] ? (
                          <div className={`w-4 h-4 border-2 rounded-full border-b-transparent animate-spin ${isRelayOn ? 'border-green-600' : 'border-red-600'}`}></div>
                        ) : (
                          <>
                            <Power size={16} />
                            <span className="font-bold text-xs">{currentStatus}</span>
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={(e) => deleteMeter(e, meter.id)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
