import { useState, useRef, useEffect } from 'react';
import { Bluetooth, X, Play, RefreshCw, StopCircle, HardDrive, Zap, ChevronDown, ChevronUp, Send, FileText, Activity } from 'lucide-react';
import { useBluetooth } from '@/hooks/useBluetooth';

export function BluetoothConnectModal({ isOpen, onClose, onMeterConnected }) {
  const {
    device,
    server,
    error,
    isConnecting,
    receivedData,
    logs,
    connect,
    simulateConnection,
    disconnect,
    readCharacteristic,
    writeCharacteristic,
    startNotifications,
    setReceivedData,
    setLogs
  } = useBluetooth();

  const [serviceUuid, setServiceUuid] = useState('');
  const [readCharUuid, setReadCharUuid] = useState('');
  const [notifyCharUuid, setNotifyCharUuid] = useState('');
  const [writeCharUuid, setWriteCharUuid] = useState('');
  const [writeData, setWriteData] = useState('');
  
  const [manualReadValue, setManualReadValue] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const logEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      const result = await connect(serviceUuid || undefined);
      if (result?.device && onMeterConnected) {
        onMeterConnected(result.device);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRead = async () => {
    if (!serviceUuid || !readCharUuid) {
      alert("Please enter Service and Read Characteristic UUIDs.");
      return;
    }
    try {
      const val = await readCharacteristic(serviceUuid.toLowerCase(), readCharUuid.toLowerCase());
      setManualReadValue(val);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleWrite = async () => {
    if (!serviceUuid || !writeCharUuid) {
      alert("Please enter Service and Write Characteristic UUIDs.");
      return;
    }
    if (!writeData) return;
    
    try {
      await writeCharacteristic(serviceUuid.toLowerCase(), writeCharUuid.toLowerCase(), writeData);
      setWriteData(''); // Clear input after successful write
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!serviceUuid || !notifyCharUuid) {
      alert("Please enter Service and Notification Characteristic UUIDs.");
      return;
    }
    try {
      await startNotifications(serviceUuid.toLowerCase(), notifyCharUuid.toLowerCase());
    } catch (err) {
      console.error(err);
    }
  };

  // Helper for log colors
  const getLogStyle = (type) => {
    switch(type) {
      case 'info': return 'text-cyan-400 bg-cyan-400/10';
      case 'request': return 'text-amber-400 bg-amber-400/10';
      case 'response': return 'text-emerald-400 bg-emerald-400/10';
      case 'error': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 transition-all duration-500">
      <div className="bg-[var(--card)]/90 backdrop-blur-3xl w-full max-w-3xl rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in-95 duration-500">
        
        {/* Dynamic Background Glow */}
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${device ? 'bg-emerald-500/20' : isConnecting ? 'bg-blue-500/20' : 'bg-purple-500/10'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${device ? 'bg-cyan-500/20' : 'bg-indigo-500/10'}`}></div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5 bg-white/5 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-3 tracking-tight">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-inner ${isConnecting ? 'animate-pulse' : ''}`}>
              <Bluetooth className={device ? 'text-emerald-400' : 'text-blue-400'} size={22} />
            </div>
            Smart Meter Connection
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 hover:rotate-90 transition-all duration-300 text-[var(--muted-foreground)]">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10 custom-scrollbar">
          {error && (
            <div className="p-4 bg-gradient-to-r from-rose-500/20 to-red-500/10 border border-rose-500/30 text-rose-500 rounded-2xl text-sm flex items-start gap-3 animate-in slide-in-from-top-2 shadow-lg shadow-rose-500/5">
              <Zap className="shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold tracking-wide uppercase text-xs mb-1">Connection Failed</p>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Connection Status Panel */}
          <div className={`relative flex flex-col sm:flex-row gap-5 items-center justify-between p-5 rounded-3xl border transition-all duration-700 overflow-hidden ${device ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${device ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 text-white' : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 text-gray-400'}`}>
                {isConnecting ? <RefreshCw className="animate-spin" size={26} /> : <HardDrive size={26} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg tracking-tight">{device ? device.name || 'Unknown Meter' : 'No Meter Connected'}</p>
                <div className="flex items-center gap-2 mt-1">
                  {device && <span className="flex w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>}
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-medium">
                    {isConnecting ? 'Negotiating GATT connection...' : device ? 'Secure Connection Established' : 'Ready to pair with nearby meters'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 shrink-0">
              {device ? (
                <button onClick={disconnect} className="w-full sm:w-auto px-6 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 active:scale-95">
                  <StopCircle size={18} /> Disconnect
                </button>
              ) : (
                <>
                  <button onClick={async () => {
                    const result = await simulateConnection();
                    if (result?.device && onMeterConnected) onMeterConnected(result.device);
                  }} disabled={isConnecting} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 group">
                    <Activity size={18} className="group-hover:animate-pulse" /> Simulate
                  </button>
                  <button onClick={handleConnect} disabled={isConnecting} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 group">
                    <Bluetooth size={18} className="group-hover:animate-bounce" />
                    {isConnecting ? 'Pairing...' : 'Scan & Connect'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Diagnostics / UUID Inputs */}
          {device && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 tracking-tight">Data Integration</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Configure GATT UUIDs to interact with the meter's data streams.</p>
                </div>
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)} 
                  className="p-2 bg-white/5 border border-white/10 text-[var(--foreground)] hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-xs font-bold tracking-wide active:scale-95"
                >
                  {showAdvanced ? 'Hide Settings' : 'Show Settings'}
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-5 rounded-2xl border border-white/5 shadow-inner animate-in fade-in">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Primary Service UUID</label>
                    <input type="text" value={serviceUuid} onChange={(e) => setServiceUuid(e.target.value)} placeholder="e.g. 0000ffe0-..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Read Characteristic</label>
                    <input type="text" value={readCharUuid} onChange={(e) => setReadCharUuid(e.target.value)} placeholder="e.g. 0000ffe1-..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Notify Characteristic</label>
                    <input type="text" value={notifyCharUuid} onChange={(e) => setNotifyCharUuid(e.target.value)} placeholder="e.g. 0000ffe1-..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Write Characteristic</label>
                    <input type="text" value={writeCharUuid} onChange={(e) => setWriteCharUuid(e.target.value)} placeholder="e.g. 0000ffe2-..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={handleRead} className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold tracking-wide hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-center">
                  Read Status
                </button>
                <button onClick={handleSubscribe} className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm font-bold tracking-wide hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Play size={16} className="fill-current" /> Stream Live Data
                </button>
              </div>
              
              {/* Write UI */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    value={writeData} 
                    onChange={(e) => setWriteData(e.target.value)} 
                    placeholder="Enter raw command to transmit..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleWrite()}
                  />
                  <Zap size={16} className="absolute right-4 top-3.5 text-[var(--muted-foreground)] group-focus-within:text-amber-500 transition-colors" />
                </div>
                <button onClick={handleWrite} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold tracking-wide hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0">
                  <Send size={16} /> Transmit
                </button>
              </div>

              {manualReadValue && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in slide-in-from-bottom-2 shadow-inner">
                  <p className="text-[10px] font-bold text-emerald-500/80 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Last Read Snapshot
                  </p>
                  <code className="text-sm sm:text-base font-mono bg-black/30 px-3 py-2 rounded-lg block break-all text-emerald-300 shadow-inner border border-black/50">{manualReadValue}</code>
                </div>
              )}
            </div>
          )}

          {/* Full Communication Log */}
          <div className="space-y-3 pt-4 border-t border-white/10 animate-in fade-in duration-1000 flex-1 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-base flex items-center gap-2 tracking-tight">
                <FileText size={18} className="text-[var(--muted-foreground)]" />
                Terminal Log
              </h3>
              <button onClick={() => setLogs([])} className="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[var(--muted-foreground)] hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/10 transition-all uppercase tracking-widest font-bold active:scale-95">
                Clear Console
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-[#050505] rounded-2xl p-4 font-mono text-xs text-gray-300 space-y-2 shadow-inner border border-white/10 custom-scrollbar h-[250px] sm:h-[350px] relative">
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
              
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 italic space-y-3">
                  <FileText size={32} className="opacity-20" />
                  <p>Awaiting communication events...</p>
                </div>
              ) : (
                <div className="pt-2 pb-4 space-y-1.5">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors break-all group">
                      <span className="text-gray-600 shrink-0 select-none opacity-50 group-hover:opacity-100 transition-opacity">[{new Date(log.timestamp).toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3})}]</span> 
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2">
                          <span className={`${getLogStyle(log.type)} px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border border-current/20`}>{log.type}</span>
                          <span className="text-gray-300 font-medium">{log.message}</span>
                        </div>
                        {log.data && (
                          <span className="text-white bg-[#111] px-2.5 py-1.5 rounded-md mt-1 block text-[11px] border border-white/10 shadow-inner">
                            <span className="opacity-50 select-none mr-2">❯</span>{log.data}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={logEndRef} className="h-4"></div>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
