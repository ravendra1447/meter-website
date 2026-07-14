'use client';

import { Building, MapPin, Users, Plus, Search, MoreVertical, Edit, Trash2, Home, TrendingUp, CheckCircle2 } from "lucide-react";
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
        setError(err?.message || 'Error fetching properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const safeSearch = (search || "").toLowerCase();
  
  const filteredProperties = (Array.isArray(properties) ? properties : []).filter(prop => 
    (prop.name || "").toLowerCase().includes(safeSearch) || 
    (prop.property_code || "").toLowerCase().includes(safeSearch) ||
    (prop.city || "").toLowerCase().includes(safeSearch)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/40">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 flex items-center gap-3">
              <Home className="text-blue-500" size={32} /> My Properties
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage all your rental properties and units in one place.</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
            <Plus size={20} /> Add Property
          </button>
        </div>

        {/* Search and Filter */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by property name, code, or city..."
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all shadow-sm text-lg font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg"></div>
            <p className="text-slate-500 font-medium tracking-wide">Loading your properties...</p>
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 max-w-md mx-auto border border-red-100 text-center transform transition-all hover:scale-105 duration-300">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load</h2>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl p-16 rounded-3xl border border-dashed border-slate-300 text-center shadow-sm max-w-3xl mx-auto mt-8">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Building size={40} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No properties found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg mb-8">You haven't added any properties yet or none match your search criteria.</p>
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:shadow-md transition-all duration-300">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const total = Math.max(prop.total_units || prop.units || 1, 1);
              const occupied = prop.occupied_units || prop.occupied || 0;
              const occupancyRate = Math.min((occupied / total) * 100, 100);
              const isFullyOccupied = occupancyRate === 100;

              return (
                <div key={prop.id || Math.random()} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col relative">
                  
                  {/* Card Header Background */}
                  <div className="h-24 bg-gradient-to-r from-slate-50 to-blue-50/30 absolute top-0 left-0 right-0 z-0 border-b border-slate-100/50"></div>

                  <div className="p-6 relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Building size={28} />
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center bg-white border border-slate-200 text-slate-700 shadow-sm text-xs font-extrabold px-3 py-1.5 rounded-full tracking-wide">
                          {prop.property_code || prop.code || 'N/A'}
                        </span>
                        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{prop.name || 'Unnamed Property'}</h3>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium">
                        <MapPin size={18} className="text-slate-400" />
                        <span className="truncate">{prop.address || prop.city || 'No address provided'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium">
                        <Users size={18} className="text-slate-400" />
                        <span><strong className="text-slate-700">{occupied}</strong> of <strong className="text-slate-700">{total}</strong> Units Occupied</span>
                      </div>
                    </div>

                    {/* Occupancy Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 shadow-inner">
                      <div 
                        className={`h-full rounded-full relative ${isFullyOccupied ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                        style={{ width: `${occupancyRate}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-5 border-t border-slate-100 mt-auto">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp size={12}/> Monthly Rev</p>
                        <p className="font-extrabold text-xl text-slate-800">₹{Number(prop.revenue || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 hover:border-blue-200 transition-all">
                          <Edit size={18} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl border border-slate-200 hover:border-red-200 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
