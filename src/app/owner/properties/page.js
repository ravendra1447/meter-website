'use client';

import { Building, Plus, MapPin, IndianRupee, Zap, Users } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/owner/properties');
        setProperties(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Properties</h2>
          <p className="text-[var(--muted-foreground)]">Manage your properties and units</p>
        </div>
        <Link href="/owner/properties/add" className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary)]/90 transition-colors shadow-md shadow-blue-500/20">
          <Plus size={20} />
          <span>Add Property</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <span className="animate-pulse text-[var(--muted-foreground)]">Loading properties...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
          <Building className="mx-auto text-[var(--muted-foreground)] mb-4" size={48} />
          <h3 className="text-lg font-medium">No properties yet</h3>
          <p className="text-[var(--muted-foreground)]">Add a property to start managing tenants and bills.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <Link key={property.id} href={`/owner/properties/${property.id}`} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden hover:shadow-md transition-all hover:scale-[1.02] flex flex-col cursor-pointer block">
              <div className="p-5 border-b border-[var(--border)] bg-[var(--accent)]/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold truncate pr-2">{property.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${property.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {property.status}
                  </span>
                </div>
                <div className="flex items-center text-[var(--muted-foreground)] text-sm mb-1">
                  <MapPin size={14} className="mr-1 shrink-0" />
                  <span className="truncate">{property.city || property.address || 'No address provided'}</span>
                </div>
                <div className="text-xs font-mono text-[var(--muted-foreground)]">Code: {property.property_code}</div>
              </div>
              
              <div className="p-5 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                      <IndianRupee size={12}/> Rent
                    </div>
                    <div className="font-semibold">{property.monthly_rent}</div>
                  </div>
                  <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                      <IndianRupee size={12}/> Deposit
                    </div>
                    <div className="font-semibold">{property.security_deposit_amount}</div>
                  </div>
                  <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                      <Users size={12}/> Tenants
                    </div>
                    <div className="font-semibold">{property.active_tenants_count || 0}</div>
                  </div>
                  <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                      <Zap size={12}/> Meters
                    </div>
                    <div className="font-semibold">{property.electricity_meters_count || 0}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
