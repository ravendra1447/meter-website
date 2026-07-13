'use client';

import { Building, MapPin, Users, Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/owner/properties');
        if (response.success) {
          setProperties(response.data || []);
        } else {
          setError(response.message || 'Failed to load properties');
        }
      } catch (err) {
        setError(err.message || 'Error fetching properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = (Array.isArray(properties) ? properties : []).filter(prop => 
    prop.name?.toLowerCase().includes(search.toLowerCase()) || 
    prop.property_code?.toLowerCase().includes(search.toLowerCase()) ||
    prop.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-fade-in">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">My Properties</h2>
          <p className="text-[var(--muted-foreground)] font-medium mt-1">Manage all your rental properties and units.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all active:scale-95">
          <Plus size={18} /> Add Property
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex items-center gap-3 shadow-sm">
        <Search className="text-[var(--muted-foreground)] ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search by property name, code, or city..."
          className="bg-transparent border-none outline-none text-[var(--foreground)] font-medium w-full placeholder-[var(--muted-foreground)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl border border-red-500/20 text-center font-bold">
          {error}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem]">
          <Building size={48} className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-4" />
          <h3 className="text-xl font-bold text-[var(--foreground)]">No properties found</h3>
          <p className="text-[var(--muted-foreground)] mt-2">You haven't added any properties yet or none match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div key={prop.id} className="group bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-[2rem] border border-[var(--glass-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building size={24} />
                </div>
                <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-2">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-1 relative z-10">{prop.name}</h3>
              <span className="inline-block bg-[var(--accent)] text-[var(--muted-foreground)] text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider mb-4 relative z-10">
                {prop.property_code || prop.code || 'N/A'}
              </span>

              <div className="space-y-3 mb-6 relative z-10">
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                  <MapPin size={16} className="text-emerald-500/70" />
                  <span className="truncate">{prop.address || prop.city || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                  <Users size={16} className="text-blue-500/70" />
                  <span>{prop.occupied_units || prop.occupied || 0} / {prop.total_units || prop.units || 0} Units Occupied</span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="w-full bg-[var(--accent)] h-2 rounded-full overflow-hidden mb-6 relative z-10">
                <div 
                  className={`h-full rounded-full ${(prop.occupied_units || prop.occupied || 0) === (prop.total_units || prop.units || 1) ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                  style={{ width: `${Math.min(((prop.occupied_units || prop.occupied || 0) / Math.max((prop.total_units || prop.units || 1), 1)) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[var(--glass-border)] relative z-10">
                <div>
                  <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Monthly Rev</p>
                  <p className="font-bold text-[var(--foreground)]">₹{Number(prop.revenue || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-[var(--accent)] hover:bg-emerald-500/10 text-[var(--foreground)] hover:text-emerald-500 rounded-xl transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 bg-[var(--accent)] hover:bg-red-500/10 text-[var(--foreground)] hover:text-red-500 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
