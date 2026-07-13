'use client';

import { QrCode, Search } from "lucide-react";

export default function TenantJoinPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Join Property</h2>
          <p className="text-[var(--muted-foreground)]">Link your account to a new property or unit</p>
        </div>
      </div>

      <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
        <QrCode className="mx-auto text-[var(--primary)] mb-6" size={64} />
        <h3 className="text-lg font-bold mb-2">Scan QR Code</h3>
        <p className="text-[var(--muted-foreground)] mb-6">Ask your property owner for their unique QR code to link your account instantly.</p>
        <button className="w-full bg-[var(--primary)] text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 font-medium">
          Open Scanner
        </button>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)]">Or enter code manually</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="text" placeholder="Enter Property Code" className="flex-1 px-4 py-3 bg-[var(--accent)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
          <button className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-xl font-medium hover:opacity-90">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
