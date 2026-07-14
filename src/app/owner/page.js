'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Inbox, Calendar, CreditCard, PlusCircle, Wallet, Banknote, Building2, BellRing, User
} from "lucide-react";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/dashboard');
      if (response && response.data) {
        setData(response.data);
      } else {
        setData({});
      }
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendReminder = async (propertyTenantId) => {
    if (!propertyTenantId) return;
    try {
      await api.post(`/owner/tenants/${propertyTenantId}/remind`);
      alert('Reminder sent successfully');
    } catch (e) {
      alert(e?.message || 'Failed to send reminder');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">{error}</div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const properties = Array.isArray(data?.properties) ? data.properties.filter(Boolean) : [];
  const safeStatements = Array.isArray(data?.statements) ? data.statements.filter(Boolean) : [];

  const totalAmount = safeStatements.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const collectedAmount = safeStatements.reduce((sum, s) => sum + (s.status === 'paid' ? Number(s.total || 0) : 0), 0);
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
        <p className="text-gray-600">Total Pending Rent: ₹{Number(stats.pending_amount || 0).toLocaleString('en-IN')}</p>

        <div className="flex gap-6 mt-4 text-sm font-medium text-gray-700">
          <div><span className="font-bold text-gray-900">{stats.properties || 0}</span> Properties</div>
          <div><span className="font-bold text-gray-900">{stats.tenants || 0}</span> Tenants</div>
          <div><span className="font-bold text-gray-900">{stats.meters || 0}</span> Meters</div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Link href="/owner/tenants" className="p-4 border rounded shadow-sm hover:bg-gray-50 flex flex-col items-center gap-2">
            <Inbox size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Join Requests</span>
          </Link>
          <Link href="/owner/billing-schedules" className="p-4 border rounded shadow-sm hover:bg-gray-50 flex flex-col items-center gap-2">
            <Calendar size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Billing Schedules</span>
          </Link>
          <Link href="/owner/payments" className="p-4 border rounded shadow-sm hover:bg-gray-50 flex flex-col items-center gap-2">
            <CreditCard size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Pending Payments</span>
          </Link>
          <Link href="/owner/meters" className="p-4 border rounded shadow-sm hover:bg-gray-50 flex flex-col items-center gap-2">
            <PlusCircle size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Smart Meters</span>
          </Link>
          <Link href="/owner/add-payment" className="p-4 border rounded shadow-sm hover:bg-gray-50 flex flex-col items-center gap-2">
            <Banknote size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Collect Payment</span>
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Financial Health</h2>
          <Link href="/owner/reports" className="text-blue-600 hover:underline text-sm">View Reports</Link>
        </div>
        <div className="border p-6 rounded shadow-sm bg-white">
          <div className="grid grid-cols-3 gap-4 mb-4 text-center divide-x">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Expected</p>
              <p className="text-2xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Collected</p>
              <p className="text-2xl font-bold text-green-600">₹{collectedAmount.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-600">{collectionRate}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${collectionRate}%` }}></div>
          </div>
        </div>
      </div>

      {Array.isArray(data?.expiring_leases) && data.expiring_leases.filter(Boolean).length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
            <BellRing size={20} /> Lease Expirations
          </h2>
          <div className="space-y-3">
            {data.expiring_leases.filter(Boolean).map(lease => {
              const daysLeft = lease.agreement_to ? Math.ceil((new Date(lease.agreement_to) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
              return (
                <div key={lease.assignment_id || Math.random()} className="border border-red-200 bg-red-50 p-4 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{lease.tenant_name || 'Unknown Tenant'}</h4>
                    <p className="text-gray-600 text-sm flex items-center gap-1"><Building2 size={14} /> {lease.property_name || 'Unknown Property'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">Expires in {daysLeft} days</p>
                    <p className="text-gray-500 text-sm">{lease.agreement_to ? new Date(lease.agreement_to).toLocaleDateString('en-IN') : 'N/A'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Rent Collection Status</h2>

        {properties.length === 0 ? (
          <div className="p-8 border rounded text-center text-gray-500">
            <p className="mb-4">No properties added yet.</p>
            <Link href="/owner/properties/add" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Property</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(p => {
              const ptId = p.property_tenant_id;
              const isPaid = p.bill_status === 'paid';
              return (
                <div key={p.id || Math.random()} className="border p-5 rounded shadow-sm bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="p-3 bg-gray-100 rounded text-gray-600">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{p.name || 'Unnamed Property'}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <User size={14} /> {p.tenant_name || 'Vacant'} • <span className="bg-gray-100 px-1 py-0.5 rounded border text-xs">{p.property_code || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-xl ${isPaid ? 'text-green-600' : 'text-gray-900'}`}>₹{Number(p.bill_amount || 0).toLocaleString('en-IN')}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.bill_status_label || 'Due'}
                      </span>
                    </div>
                  </div>

                  {ptId && !isPaid && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => sendReminder(ptId)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <BellRing size={16} /> Send Payment Reminder
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}