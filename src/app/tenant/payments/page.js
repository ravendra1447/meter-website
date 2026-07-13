'use client';

import { Activity, Clock } from "lucide-react";
import { useState } from "react";

export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payments History</h2>
          <p className="text-[var(--muted-foreground)]">View your past rent and bill payments.</p>
        </div>
      </div>

      <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
        <Clock className="mx-auto text-[var(--muted-foreground)] mb-4" size={48} />
        <h3 className="text-lg font-medium">No past payments</h3>
        <p className="text-[var(--muted-foreground)]">Your payment history will appear here once you make a payment.</p>
      </div>
    </div>
  );
}
