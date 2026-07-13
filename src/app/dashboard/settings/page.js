'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BellRing, Settings, Globe, Moon, IndianRupee, Activity, Power, Save, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [settings, setSettings] = useState({
    billReminders: true,
    relayAlerts: true,
    usageReports: true,
    language: 'English',
    theme: 'Light',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button 
      type="button" 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Settings</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage notifications, language, and theme preferences.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          <ShieldCheck size={20} />
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Notifications Section */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <BellRing size={20} />
            </div>
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>
          <div className="p-2 divide-y divide-[var(--border)]">
            <div className="flex items-center justify-between p-4 hover:bg-[var(--accent)]/50 transition-colors rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)]"><BellRing size={18} /></div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Bill Reminders</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Receive alerts before due dates</p>
                </div>
              </div>
              <ToggleSwitch checked={settings.billReminders} onChange={() => handleToggle('billReminders')} />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[var(--accent)]/50 transition-colors rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)]"><Power size={18} /></div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Relay Status Alerts</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Get notified when meters connect/disconnect</p>
                </div>
              </div>
              <ToggleSwitch checked={settings.relayAlerts} onChange={() => handleToggle('relayAlerts')} />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[var(--accent)]/50 transition-colors rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)]"><Activity size={18} /></div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Usage Reports</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Weekly power consumption summaries</p>
                </div>
              </div>
              <ToggleSwitch checked={settings.usageReports} onChange={() => handleToggle('usageReports')} />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Settings size={20} />
            </div>
            <h2 className="text-lg font-bold">App Preferences</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Language</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <select 
                  name="language" 
                  value={settings.language} 
                  onChange={handleChange} 
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Theme</label>
              <div className="relative">
                <Moon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <select 
                  name="theme" 
                  value={settings.theme} 
                  onChange={handleChange} 
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
                >
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center justify-between p-4 bg-[var(--accent)]/50 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-green-500"><IndianRupee size={18} /></div>
                <p className="font-semibold text-[var(--foreground)]">Currency</p>
              </div>
              <p className="font-bold">INR (₹)</p>
            </div>

          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/dashboard/profile" className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] font-semibold transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={18} /> Save Settings</>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
