'use client';

import { Bluetooth, Power, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

export default function TenantMeterPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [powerOn, setPowerOn] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Smart Meter</h2>
          <p className="text-[var(--muted-foreground)]">Control and monitor your smart meter</p>
        </div>
        <button 
          onClick={() => setIsConnected(!isConnected)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md ${isConnected ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600'}`}
        >
          <Bluetooth size={20} />
          <span>{isConnected ? 'Connected' : 'Connect to Meter'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-48 h-48 rounded-full border-8 border-[var(--primary)] flex flex-col items-center justify-center mb-6 relative">
            <span className="text-4xl font-bold">124.5</span>
            <span className="text-sm text-[var(--muted-foreground)] uppercase tracking-wider">Units</span>
            <div className="absolute -bottom-4 bg-[var(--background)] px-2">
              <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <Zap size={12} /> Live
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Current Reading</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Last synced: Just now</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
             <h3 className="text-lg font-semibold mb-4">Meter Controls</h3>
             <div className="flex items-center justify-between p-4 bg-[var(--accent)] rounded-xl">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${powerOn ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                   <Power size={24} />
                 </div>
                 <div>
                   <p className="font-medium">Power Supply</p>
                   <p className="text-xs text-[var(--muted-foreground)]">Main relay control</p>
                 </div>
               </div>
               <button 
                 disabled={!isConnected}
                 onClick={() => setPowerOn(!powerOn)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${powerOn ? 'bg-green-500' : 'bg-[var(--border)]'}`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${powerOn ? 'translate-x-6' : 'translate-x-1'}`} />
               </button>
             </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
             <h3 className="text-lg font-semibold mb-4">Diagnostics</h3>
             <button disabled={!isConnected} className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] hover:bg-[var(--border)] transition-colors rounded-xl font-medium disabled:opacity-50 text-[var(--foreground)]">
               <RefreshCw size={18} />
               Run Diagnostics
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
