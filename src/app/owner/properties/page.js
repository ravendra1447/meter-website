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
    <div className="space-y-6 pb-20 max-w-6xl mx-auto p-4 md:p-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
          <p className="text-gray-600 mt-1">Manage all your rental properties and units.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 font-medium">
          <Plus size={18} /> Add Property
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border p-2 rounded flex items-center gap-3">
        <Search className="text-gray-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search by property name, code, or city..."
          className="bg-transparent border-none outline-none text-gray-900 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded border border-red-200 text-center font-bold">
          {error}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded">
          <Building size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
          <p className="text-gray-500 mt-2">You haven't added any properties yet or none match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div key={prop.id || Math.random()} className="bg-white p-5 rounded border shadow-sm flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                  <Building size={20} />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{prop.name || 'Unnamed Property'}</h3>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded border mb-4 self-start">
                {prop.property_code || prop.code || 'N/A'}
              </span>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{prop.address || prop.city || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>{prop.occupied_units || prop.occupied || 0} / {prop.total_units || prop.units || 0} Units Occupied</span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${Math.min(((prop.occupied_units || prop.occupied || 0) / Math.max((prop.total_units || prop.units || 1), 1)) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t mt-auto">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Monthly Rev</p>
                  <p className="font-bold text-gray-900">₹{Number(prop.revenue || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded border">
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 bg-gray-50 hover:bg-red-50 text-red-600 rounded border">
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
