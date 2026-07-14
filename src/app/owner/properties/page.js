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
          <div className="flex flex-col gap-4">
            {filteredProperties.map((prop) => {
              const total = Math.max(prop.total_units || prop.units || 1, 1);
              const occupied = prop.occupied_units || prop.occupied || 0;
              const occupancyRate = Math.min((occupied / total) * 100, 100);
              const isFullyOccupied = occupancyRate === 100;

              return (
                <div key={prop.id || Math.random()} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col md:flex-row items-center relative p-4 gap-6">
                  
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-4 min-w-[280px]">
                    <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Building size={26} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{prop.name || 'Unnamed Property'}</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {prop.property_code || prop.code || 'N/A'}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-[120px]">{prop.address || prop.city || 'No address'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Occupancy */}
                  <div className="flex-1 w-full md:w-auto px-4 md:border-l border-slate-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Users size={14} className="text-slate-400" />
                        <span><strong className="text-slate-700">{occupied}</strong> / {total} Occupied</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{Math.round(occupancyRate)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full relative ${isFullyOccupied ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                        style={{ width: `${occupancyRate}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      ></div>
                    </div>
                  </div>

                  {/* Right: Revenue & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto min-w-[200px] md:border-l border-slate-100 md:pl-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5"><TrendingUp size={12} className="inline mr-1" /> Rev</p>
                      <p className="font-extrabold text-lg text-slate-800">₹{Number(prop.revenue || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg border border-slate-200 hover:border-blue-200 transition-all shadow-sm">
                        <Edit size={16} />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:border-red-200 transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 transition-all shadow-sm">
                        <MoreVertical size={16} />
                      </button>
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
