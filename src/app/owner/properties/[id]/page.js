'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Building, MapPin, IndianRupee, Users, Zap, Calendar, 
  Settings, ChevronLeft, Plus, Settings2, ShieldAlert, AlarmClock
} from 'lucide-react';
import Link from 'next/link';
import MeterCheckInModal from '@/components/MeterCheckInModal';
import AddMeterModal from '@/components/AddMeterModal';
import AddTenantModal from '@/components/AddTenantModal';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  const [property, setProperty] = useState(null);
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meters'); // 'meters', 'tenants', 'billing'
  const [checkInMeter, setCheckInMeter] = useState(null);
  const [isAddMeterOpen, setIsAddMeterOpen] = useState(false);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);

  const loadData = async () => {
    try {
      const propRes = await api.get(`/owner/properties/${propertyId}`);
      setProperty(propRes.data);
      
      const metersRes = await api.get(`/owner/properties/${propertyId}/meters`);
      setMeters(metersRes.data || []);
    } catch (err) {
      console.error('Error loading property details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        <p className="text-[var(--muted-foreground)]">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <ShieldAlert size={64} className="text-orange-500 opacity-50" />
        <h2 className="text-2xl font-bold">Property Not Found</h2>
        <p className="text-[var(--muted-foreground)]">The property you are looking for does not exist or you don't have access.</p>
        <button onClick={() => router.push('/owner/properties')} className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg">
          Back to Properties
        </button>
      </div>
    );
  }

  const activeTenants = property.active_tenants || [];

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/owner/properties')}
          className="p-2 hover:bg-[var(--accent)] rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">{property.name}</h2>
          <div className="flex items-center text-sm text-[var(--muted-foreground)] gap-2 mt-1">
            <span className="font-mono bg-[var(--accent)] px-2 py-0.5 rounded text-xs">{property.property_code}</span>
            <span className="flex items-center gap-1"><MapPin size={14}/> {property.address}</span>
          </div>
        </div>
      </div>

      {/* Property Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1"><IndianRupee size={14}/> Monthly Rent</div>
          <div className="text-xl font-bold">₹{property.monthly_rent}</div>
        </div>
        <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1"><IndianRupee size={14}/> Deposit</div>
          <div className="text-xl font-bold">₹{property.security_deposit_amount}</div>
        </div>
        <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1"><Users size={14}/> Active Tenants</div>
          <div className="text-xl font-bold">{activeTenants.length}</div>
        </div>
        <div className="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="text-xs text-[var(--muted-foreground)] mb-1 flex items-center gap-1"><Zap size={14}/> Smart Meters</div>
          <div className="text-xl font-bold">{meters.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--accent)]/50 rounded-lg w-full md:w-auto overflow-x-auto border border-[var(--border)]">
        <button onClick={() => setActiveTab('meters')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'meters' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}>
          <Zap size={16}/> Smart Meters
        </button>
        <button onClick={() => setActiveTab('tenants')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'tenants' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}>
          <Users size={16}/> Tenants
        </button>
        <button onClick={() => setActiveTab('billing')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'billing' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}>
          <Settings2 size={16}/> Billing Config
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'meters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Smart Meters</h3>
              <button 
                onClick={() => setIsAddMeterOpen(true)}
                className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Plus size={16}/> Add Meter
              </button>
            </div>
            
            {meters.length === 0 ? (
              <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center">
                <Zap className="mx-auto text-[var(--muted-foreground)] mb-3 opacity-50" size={32} />
                <p className="text-[var(--muted-foreground)]">No meters assigned to this property yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meters.map(meter => (
                  <div key={meter.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all group flex flex-col overflow-hidden">
                    <Link href={`/owner/meters/${meter.id}`} className="p-5 block flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-[var(--primary)] transition-colors">{meter.meter_name}</h4>
                          <p className="text-xs text-[var(--muted-foreground)] font-mono mt-1">{meter.meter_number}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${meter.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {meter.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-[var(--border)] pt-4">
                        <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${meter.relay_status === 'on' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          Relay: {meter.relay_status?.toUpperCase() || 'OFF'}
                        </span>
                        <span className="text-[var(--primary)] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Live Status <ChevronLeft size={16} className="rotate-180" />
                        </span>
                      </div>
                    </Link>
                    <div className="px-5 pb-5 mt-auto">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setCheckInMeter(meter);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--accent)] hover:bg-[var(--primary)]/10 text-[var(--foreground)] hover:text-[var(--primary)] font-semibold rounded-lg transition-colors text-sm border border-[var(--border)]"
                      >
                        <AlarmClock size={16} /> Check In (Schedule Cutoff)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Active Tenants</h3>
              <button 
                onClick={() => setIsAddTenantOpen(true)}
                className="flex items-center gap-2 bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--primary)]/90"
              >
                <Plus size={16}/> Add Tenant
              </button>
            </div>

            {activeTenants.length === 0 ? (
              <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center">
                <Users className="mx-auto text-[var(--muted-foreground)] mb-3 opacity-50" size={32} />
                <p className="text-[var(--muted-foreground)]">Property is currently vacant.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTenants.map(assignment => (
                  <div key={assignment.id} className="bg-[var(--card)] p-5 rounded-xl border border-[var(--border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                        {assignment.tenant?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-base">{assignment.tenant?.name}</h4>
                        <p className="text-sm text-[var(--muted-foreground)]">{assignment.tenant?.mobile}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:flex gap-4 md:gap-8 items-center text-sm bg-[var(--accent)]/30 p-3 rounded-lg md:bg-transparent md:p-0">
                      <div>
                        <p className="text-[var(--muted-foreground)] text-xs mb-0.5">Move In</p>
                        <p className="font-medium flex items-center gap-1"><Calendar size={14}/> {new Date(assignment.move_in_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[var(--muted-foreground)] text-xs mb-0.5">Base Rent</p>
                        <p className="font-medium">₹{assignment.monthly_rent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Billing Configuration</h3>
            <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <Settings2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Automated Billing</h4>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Manage how rent and meter charges are calculated and billed to tenants in this property.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
                <div>
                  <p className="text-sm font-semibold mb-2">Default Charges</p>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    <li className="flex justify-between"><span>Maintenance:</span> <span className="font-medium text-[var(--foreground)]">₹{property.maintenance_charges}</span></li>
                    <li className="flex justify-between"><span>Water Charges:</span> <span className="font-medium text-[var(--foreground)]">₹{property.water_charges}</span></li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Actions</p>
                  <button onClick={() => alert('Feature coming soon')} className="text-sm text-[var(--primary)] font-medium hover:underline flex items-center gap-1">
                    <Settings size={14}/> Edit Property Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MeterCheckInModal 
        isOpen={!!checkInMeter}
        onClose={() => setCheckInMeter(null)}
        meter={checkInMeter}
      />
      <AddMeterModal 
        isOpen={isAddMeterOpen}
        onClose={() => setIsAddMeterOpen(false)}
        propertyId={params.id}
        onSuccess={loadData}
      />
      <AddTenantModal 
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        propertyId={params.id}
        onSuccess={loadData}
      />
    </div>
  );
}
