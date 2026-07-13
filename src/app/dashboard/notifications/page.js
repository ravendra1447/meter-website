'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Receipt, BarChart2, Power, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/master/notifications');
        setNotifications(response.data || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'bill_due': return <Receipt size={20} className="text-orange-500" />;
      case 'usage': return <BarChart2 size={20} className="text-blue-500" />;
      case 'relay': return <Power size={20} className="text-purple-500" />;
      default: return <Bell size={20} className="text-[var(--foreground)]" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'bill_due': return 'bg-orange-500/10';
      case 'usage': return 'bg-blue-500/10';
      case 'relay': return 'bg-purple-500/10';
      default: return 'bg-[var(--accent)]';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/profile" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-[var(--muted-foreground)] mt-1">Stay updated with your property events.</p>
          </div>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:bg-green-500/10 hover:text-green-500 text-[var(--muted-foreground)] rounded-xl font-medium transition-colors text-sm"
          >
            <CheckCircle2 size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-[var(--muted-foreground)]">
            <Loader2 size={32} className="animate-spin mb-4 text-[var(--primary)]" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <div className="p-4 rounded-full bg-[var(--accent)] mb-4">
              <Bell size={32} className="text-[var(--muted-foreground)]" />
            </div>
            <p className="text-lg font-bold">You're all caught up!</p>
            <p className="text-[var(--muted-foreground)]">No new notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {notifications.map(n => (
              <div 
                key={n.id} 
                className={`p-5 flex gap-4 transition-colors ${n.read ? 'bg-[var(--background)]/50' : 'bg-blue-500/5'}`}
              >
                <div className={`p-3 rounded-full shrink-0 h-min ${getIconBg(n.type)}`}>
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`font-semibold ${n.read ? 'text-[var(--foreground)]' : 'text-blue-600 dark:text-blue-400'}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{n.message}</p>
                </div>
                
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
