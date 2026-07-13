'use client';

import { Activity, Zap } from "lucide-react";

export default function TenantUsagePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Usage Stats</h2>
          <p className="text-[var(--muted-foreground)]">Track your power consumption over time</p>
        </div>
      </div>

      <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
        <Activity className="mx-auto text-[var(--muted-foreground)] mb-4" size={48} />
        <h3 className="text-lg font-medium">No usage data yet</h3>
        <p className="text-[var(--muted-foreground)]">Once your smart meter is connected, graphs and stats will appear here.</p>
      </div>
    </div>
  );
}
