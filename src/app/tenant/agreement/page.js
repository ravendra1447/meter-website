'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FileText, Building2, User, Phone, MapPin, IndianRupee, Shield, Droplets, Wrench } from "lucide-react";

export default function TenantAgreementPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const response = await api.get('/tenant/property');
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load agreement');
      } finally {
        setLoading(false);
      }
    };
    fetchAgreement();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
        <p className="text-[var(--muted-foreground)]">Loading your agreement...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Lease Agreement</h2>
            <p className="text-[var(--muted-foreground)]">View your current rental agreement</p>
          </div>
        </div>
        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
          <FileText className="mx-auto text-[var(--muted-foreground)] mb-4" size={48} />
          <h3 className="text-lg font-medium">No agreement found</h3>
          <p className="text-[var(--muted-foreground)]">You have not been assigned to a property with a digital agreement yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h2 className="text-2xl font-bold">Rental Agreement</h2>
        <p className="text-[var(--muted-foreground)]">Your digital tenancy contract and charges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Property & Owner Details */}
        <div className="space-y-6">
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="bg-blue-500/10 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
              <Building2 className="text-blue-500" size={20} />
              <h3 className="font-bold text-lg">Property Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Property Name</p>
                <p className="font-medium text-lg">{data.property?.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Address</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
                  <p>{data.property?.address}, {data.property?.city}, {data.property?.state} - {data.property?.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="bg-orange-500/10 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
              <User className="text-orange-500" size={20} />
              <h3 className="font-bold text-lg">Owner Contact</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Owner Name</p>
                <p className="font-medium text-lg">{data.owner?.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">Mobile</p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={16} className="text-[var(--muted-foreground)] shrink-0" />
                  <p>{data.owner?.mobile}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financials & Terms */}
        <div className="space-y-6">
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="bg-green-500/10 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
              <IndianRupee className="text-green-500" size={20} />
              <h3 className="font-bold text-lg">Rent & Charges</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <IndianRupee size={16} />
                  <span>Monthly Rent</span>
                </div>
                <span className="font-black text-xl">₹{data.monthly_rent}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Shield size={16} />
                  <span>Security Deposit</span>
                </div>
                <span className="font-bold">₹{data.security_deposit_amount}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Wrench size={16} />
                  <span>Maintenance (Monthly)</span>
                </div>
                <span className="font-bold">₹{data.maintenance_charges || 0}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Droplets size={16} className="text-blue-500" />
                  <span>Water Charges (Monthly)</span>
                </div>
                <span className="font-bold">₹{data.water_charges || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="bg-purple-500/10 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
              <FileText className="text-purple-500" size={20} />
              <h3 className="font-bold text-lg">Terms</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Move-In Date</span>
                <span className="font-medium">{data.move_in_date || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Contract Status</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold uppercase">{data.status}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
