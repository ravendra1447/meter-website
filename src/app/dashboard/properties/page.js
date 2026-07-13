'use client';

import { Search, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from 'next/link';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/master/properties');
        setProperties(response.data?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const handleAddProperty = (newProp) => {
    setProperties(prev => [{
      id: newProp.id,
      name: newProp.name,
      owner: { name: 'Unassigned' },
      address: '---',
      city: '',
      status: 'active'
    }, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <Link href="/dashboard/properties/add" className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 font-medium active:scale-95 w-full sm:w-auto justify-center">
          <Plus size={18} /> Add Property
        </Link>
      </div>
      


      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-9 pr-4 py-2 bg-[var(--accent)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--muted-foreground)] uppercase bg-[var(--muted)]">
              <tr>
                <th className="px-6 py-3">Property Name</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--muted-foreground)]">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading properties...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[var(--muted-foreground)]">
                    No properties found.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="border-b border-[var(--border)] hover:bg-[var(--accent)]/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{property.name}</td>
                    <td className="px-6 py-4">{property.owner?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">{[property.address, property.city].filter(Boolean).join(', ')}</td>
                    <td className="px-6 py-4">
                      {property.status === 'active' ? (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)] transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
