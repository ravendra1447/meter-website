'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Building2, MapPin, Navigation, Home, Hash, LayoutGrid, 
  Wallet, Shield, Wrench, Droplets, CarFront, Zap,
  CalendarDays, CalendarRange, Repeat, BellRing,
  ArrowLeft, Save, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    floor: '',
    rooms: '',
    monthly_rent: '',
    security_deposit_amount: '',
    maintenance_charges: '',
    water_charges: '',
    parking_charges: '',
    electricity_tariff: '',
    contract_start: '',
    contract_end: '',
    payment_cycle: '1 Month',
    rent_due_date: '7th',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        address: `${formData.address1.trim()}, ${formData.address2.trim()}`.replace(/^, | , $/g, ''),
        city: formData.city.trim(),
        floor: formData.floor.trim(),
        rooms: formData.rooms.trim(),
        monthly_rent: Number(formData.monthly_rent) || 0,
        security_deposit_amount: Number(formData.security_deposit_amount) || 0,
        maintenance_charges: Number(formData.maintenance_charges) || 0,
        water_charges: Number(formData.water_charges) || 0,
        parking_charges: Number(formData.parking_charges) || 0,
        electricity_tariff: Number(formData.electricity_tariff) || 0,
        contract_start: formData.contract_start || null,
        contract_end: formData.contract_end || null,
        payment_cycle: formData.payment_cycle.trim(),
        rent_due_date: formData.rent_due_date.trim(),
        status: 'active',
      };

      // Depending on the exact API endpoint. Assuming it's /owner/properties
      await api.post('/owner/property', payload);
      router.push('/dashboard/properties');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Configure property details, rent structure, and contract terms.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
          <Shield size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Property Details */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Building2 size={20} />
            </div>
            <h2 className="text-lg font-bold">Property Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Property Name</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. 2nd Floor, Room 101" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Address Line 1</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="Street, Building name" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Address Line 2</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Landmark, Area" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City name" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Floor</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                  <input type="text" name="floor" value={formData.floor} onChange={handleChange} placeholder="e.g. 2nd" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Rooms</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                  <input type="text" name="rooms" value={formData.rooms} onChange={handleChange} placeholder="e.g. 2BHK" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Rent Details */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-green-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Wallet size={20} />
            </div>
            <h2 className="text-lg font-bold">Rent Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Monthly Rent</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">₹</span>
                <input required type="number" min="0" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} placeholder="0.00" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Security Deposit</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="number" min="0" name="security_deposit_amount" value={formData.security_deposit_amount} onChange={handleChange} placeholder="0.00" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 pt-2 pb-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Maintenance</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="number" min="0" name="maintenance_charges" value={formData.maintenance_charges} onChange={handleChange} placeholder="0.00" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Water Charges</label>
              <div className="relative">
                <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input type="number" min="0" name="water_charges" value={formData.water_charges} onChange={handleChange} placeholder="0.00" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Parking Charges</label>
              <div className="relative">
                <CarFront className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="number" min="0" name="parking_charges" value={formData.parking_charges} onChange={handleChange} placeholder="0.00" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Electricity / Unit</label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input type="number" min="0" step="0.1" name="electricity_tariff" value={formData.electricity_tariff} onChange={handleChange} placeholder="e.g. 8.5" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Contract Actions */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="bg-[var(--accent)]/50 px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <CalendarDays size={20} />
            </div>
            <h2 className="text-lg font-bold">Contract & Payment Rules</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Start Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="date" name="contract_start" value={formData.contract_start} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">End Date</label>
              <div className="relative">
                <CalendarRange className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="date" name="contract_end" value={formData.contract_end} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Payment Cycle</label>
              <div className="relative">
                <Repeat className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="text" name="payment_cycle" value={formData.payment_cycle} onChange={handleChange} placeholder="e.g. 1 Month" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Rent Due Date</label>
              <div className="relative">
                <BellRing className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input type="text" name="rent_due_date" value={formData.rent_due_date} onChange={handleChange} placeholder="e.g. 7th" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3 text-orange-400">
              <Zap size={20} className="shrink-0" />
              <p className="text-sm font-medium">Auto-Action: Electricity will be automatically disconnected if rent is not paid by the Due Date.</p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/dashboard/properties" className="px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] font-semibold transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Saving Property...</>
            ) : (
              <><Save size={18} /> Save & Create Property</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
