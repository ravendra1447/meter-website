'use client';

import { Users, Search, Plus, MapPin, Building, Phone, MoreHorizontal, IndianRupee, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await api.get('/owner/tenants');
        if (response.success) {
          setTenants(response.data || []);
        } else {
          setError(response.message || 'Failed to load tenants');
        }
      } catch (err) {
        setError(err.message || 'Error fetching tenants');
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.phone?.includes(search) ||
    t.property_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.unit_no?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-fade-in">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">My Tenants</h2>
          <p className="text-[var(--muted-foreground)] font-medium mt-1">Manage tenants, leases, and balances.</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95">
          <Plus size={18} /> Add Tenant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <Search className="text-[var(--muted-foreground)] ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or unit..."
            className="bg-transparent border-none outline-none text-[var(--foreground)] font-medium w-full placeholder-[var(--muted-foreground)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] p-4 rounded-2xl text-[var(--foreground)] font-medium outline-none sm:w-48">
          <option value="all">All Properties</option>
          {/* Dynamically generating property filters is ideal, keeping it static for UI placeholder */}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl border border-red-500/20 text-center font-bold">
          {error}
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-20 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem]">
          <Users size={48} className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-4" />
          <h3 className="text-xl font-bold text-[var(--foreground)]">No tenants found</h3>
          <p className="text-[var(--muted-foreground)] mt-2">No tenants match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--glass-border)] bg-[var(--accent)]/30">
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Tenant Info</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Contact</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Property & Unit</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] text-right">Balance</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {filteredTenants.map((tenant) => {
                  // Deriving status based on balance or dynamic field
                  const status = tenant.balance > 0 ? (tenant.balance > tenant.rent ? 'Overdue' : 'Due') : 'Active';
                  
                  return (
                    <tr key={tenant.id} className="hover:bg-[var(--accent)]/20 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
                            {(tenant.name || tenant.first_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--foreground)]">{tenant.name || tenant.first_name}</p>
                            <p className="text-xs font-medium text-[var(--muted-foreground)]">ID: TEN-{(tenant.id || 0).toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                            <Phone size={14} className="text-blue-500" /> {tenant.phone || tenant.mobile || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
                            <Mail size={14} className="text-blue-500" /> {tenant.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1">
                          <p className="font-semibold text-[var(--foreground)] text-sm flex items-center gap-1.5"><Building size={14} className="text-emerald-500"/> {tenant.property_name || tenant.property || 'N/A'}</p>
                          <p className="text-xs font-bold bg-[var(--accent)] inline-block px-2 py-0.5 rounded text-[var(--muted-foreground)]">Unit: {tenant.unit_no || tenant.unit || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        {status === 'Active' && <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active</span>}
                        {status === 'Due' && <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Due Soon</span>}
                        {status === 'Overdue' && <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Overdue</span>}
                      </td>
                      <td className="p-5 text-right">
                        <p className="font-bold text-[var(--foreground)] flex items-center justify-end gap-1"><IndianRupee size={14}/> {(tenant.balance || 0).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-[var(--muted-foreground)] font-medium mt-0.5">Rent: ₹{(tenant.rent || tenant.rent_amount || 0).toLocaleString('en-IN')}/mo</p>
                      </td>
                      <td className="p-5 text-center">
                        <button className="p-2 text-[var(--muted-foreground)] hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 border-t border-[var(--glass-border)] flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)] font-medium">Showing {filteredTenants.length} tenants</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-bold bg-[var(--accent)] text-[var(--muted-foreground)] rounded-lg hover:text-[var(--foreground)] transition-colors" disabled>Previous</button>
              <button className="px-4 py-2 text-sm font-bold bg-[var(--accent)] text-[var(--muted-foreground)] rounded-lg hover:text-[var(--foreground)] transition-colors" disabled>Next</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
