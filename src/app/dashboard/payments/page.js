'use client';

import { IndianRupee, Search, Filter } from "lucide-react";

export default function AdminGlobalPaymentsPage() {
  const transactions = [
    { id: 'TXN-9012', owner: 'Vikram Singh', tenant: 'Rahul Sharma', property: 'A-101', amount: 4500, date: 'Jul 10, 2026', status: 'Paid' },
    { id: 'TXN-9013', owner: 'Vikram Singh', tenant: 'Priya Patel', property: 'B-205', amount: 3200, date: 'Jul 05, 2026', status: 'Pending' },
    { id: 'TXN-9014', owner: 'Anil Kumar', tenant: 'Amit Singh', property: 'C-302', amount: 5100, date: 'Jul 01, 2026', status: 'Paid' },
    { id: 'TXN-9015', owner: 'Anil Kumar', tenant: 'Suresh Rai', property: 'D-405', amount: 2800, date: 'Jun 28, 2026', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Master Payment Ledger</h2>
          <p className="text-[var(--muted-foreground)]">Complete system-wide transaction history</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search ID, Owner, Tenant..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <button className="p-2 border border-[var(--border)] bg-[var(--card)] rounded-lg hover:bg-[var(--accent)] transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--accent)] border-b border-[var(--border)]">
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Transaction ID</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Owner</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Tenant</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Property</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Date</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Amount</th>
                <th className="p-4 font-semibold text-sm text-[var(--muted-foreground)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn.id} className={`border-b border-[var(--border)] hover:bg-[var(--accent)] transition-colors ${index === transactions.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="p-4 font-medium text-sm">{txn.id}</td>
                  <td className="p-4 text-sm font-semibold">{txn.owner}</td>
                  <td className="p-4 text-sm">{txn.tenant}</td>
                  <td className="p-4 text-sm text-[var(--muted-foreground)]">{txn.property}</td>
                  <td className="p-4 text-sm text-[var(--muted-foreground)]">{txn.date}</td>
                  <td className="p-4 font-bold flex items-center"><IndianRupee size={14}/>{txn.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
