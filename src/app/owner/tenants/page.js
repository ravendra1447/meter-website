'use client';

import { Users, Plus, Mail, Phone, Home, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function OwnerTenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'requests'
  const [actionLoading, setActionLoading] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/owner/tenants');
      setTenants(res.data || []);
      
      const reqRes = await api.get('/owner/property-requests');
      if (reqRes && reqRes.data) {
        setJoinRequests(reqRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (request) => {
    // Basic auto-approve for website (uses default terms)
    // To do it properly we should prompt for move-in date and rent, but for now we'll send defaults based on property
    setActionLoading(request.id);
    try {
      const terms = {
        property_id: request.property_id,
        tenant_id: request.tenant_id,
        move_in_date: new Date().toISOString().split('T')[0], // today
        monthly_rent: request.property?.monthly_rent || 0,
        security_deposit_amount: request.property?.security_deposit_amount || 0,
        maintenance_charges: request.property?.maintenance_charges || 0,
        water_charges: request.property?.water_charges || 0,
      };
      await api.post(`/owner/property-requests/${request.id}/approve`, terms);
      await loadData();
      alert('Request approved successfully');
    } catch (e) {
      alert(e.message || 'Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    setActionLoading(id);
    try {
      await api.post(`/owner/property-requests/${id}/reject`, { owner_remark: 'Rejected via website' });
      await loadData();
    } catch (e) {
      alert(e.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Tenants</h2>
          <p className="text-[var(--muted-foreground)]">Manage your tenants and their rent</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary)]/90 transition-colors shadow-md shadow-blue-500/20">
          <Plus size={20} />
          <span>Add Tenant</span>
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-[var(--accent)]/50 rounded-lg w-full md:w-auto overflow-x-auto border border-[var(--border)] mb-4">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'active' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
        >
          <Users size={16}/> Active Tenants
        </button>
        <button 
          onClick={() => setActiveTab('requests')} 
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === 'requests' ? 'bg-[var(--background)] shadow text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
        >
          <div className="relative">
            <UserPlus size={16}/>
            {joinRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          Join Requests ({joinRequests.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {activeTab === 'active' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <span className="animate-pulse text-[var(--muted-foreground)]">Loading tenants...</span>
            </div>
          ) : tenants.length === 0 ? (
        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm text-center">
          <Users className="mx-auto text-[var(--muted-foreground)] mb-4" size={48} />
          <h3 className="text-lg font-medium">No tenants yet</h3>
          <p className="text-[var(--muted-foreground)]">Add a tenant to start generating bills.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map(assignment => (
            <Link href={`/owner/tenants/${assignment.id}`} key={assignment.id} className="block group">
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden group-hover:shadow-md group-hover:border-[var(--primary)]/50 transition-all flex flex-col h-full">
                <div className="p-5 border-b border-[var(--border)] bg-[var(--accent)]/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold truncate pr-2 group-hover:text-[var(--primary)] transition-colors">{assignment.tenant?.name || 'Unknown Tenant'}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${assignment.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <div className="flex items-center text-[var(--muted-foreground)] text-sm mb-1">
                    <Home size={14} className="mr-1 shrink-0" />
                    <span className="truncate">{assignment.property_name || 'Unknown Property'} ({assignment.property_code})</span>
                  </div>
                </div>
                
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-sm mb-3">
                      <Phone size={14} className="mr-2 text-[var(--muted-foreground)]" />
                      <span>{assignment.tenant?.mobile || 'N/A'}</span>
                    </div>
                    {assignment.tenant?.email && (
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-[var(--muted-foreground)]" />
                        <span className="truncate">{assignment.tenant.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--muted-foreground)]">Bill Status</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${assignment.bill_status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {assignment.bill_status_label} (₹{assignment.bill_amount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <span className="animate-pulse text-[var(--muted-foreground)]">Loading requests...</span>
            </div>
          ) : joinRequests.length === 0 ? (
            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] text-center">
              <UserPlus className="mx-auto text-[var(--muted-foreground)] mb-3 opacity-50" size={48} />
              <p className="text-lg font-bold">No Join Requests</p>
              <p className="text-[var(--muted-foreground)]">There are no pending requests from tenants.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinRequests.map(request => (
                <div key={request.id} className={`bg-[var(--card)] p-5 rounded-xl border ${request.status === 'pending' ? 'border-blue-500/30 shadow-md' : 'border-[var(--border)] opacity-70'} flex flex-col`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        {request.tenant?.name || 'Unknown User'}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          request.status === 'pending' ? 'bg-blue-500/10 text-blue-500' : 
                          request.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {request.status}
                        </span>
                      </h4>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1 flex items-center gap-1"><Mail size={12}/>{request.tenant?.email || 'N/A'} • <Phone size={12}/>{request.tenant?.mobile || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--accent)]/50 p-3 rounded-lg text-sm mb-4">
                    <p className="font-medium text-[var(--primary)] flex items-center gap-1 mb-1"><Home size={14}/> {request.property?.name}</p>
                    <p className="text-[var(--muted-foreground)] font-mono text-xs mb-2">Code: {request.property?.property_code}</p>
                    {request.tenant_message && (
                      <p className="italic text-[var(--muted-foreground)] border-l-2 border-[var(--border)] pl-2 mt-2">"{request.tenant_message}"</p>
                    )}
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="mt-auto flex gap-3">
                      <button 
                        disabled={actionLoading === request.id}
                        onClick={() => handleApprove(request)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button 
                        disabled={actionLoading === request.id}
                        onClick={() => handleReject(request.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
