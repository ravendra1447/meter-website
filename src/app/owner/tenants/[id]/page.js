'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, Phone, Mail, Home, IndianRupee, FileText, Send, CheckCircle2 } from "lucide-react";
import PrintableInvoice from "@/components/PrintableInvoice";

export default function TenantBillingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tenantAssignmentId = params.id; // property_tenant_id

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await api.get('/owner/tenants');
        const tenants = response.data || [];
        const found = tenants.find(t => t.id === Number(tenantAssignmentId));
        if (found) {
          setTenant(found);
        } else {
          setError('Tenant not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load tenant details');
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [tenantAssignmentId]);

  const sendReminder = () => {
    if (!tenant) return;
    
    const mobile = tenant.tenant?.mobile;
    if (!mobile) {
      alert("Tenant mobile number is missing!");
      return;
    }

    const bd = tenant.bill_breakdown || {};
    let msg = `Hello ${tenant.tenant?.name},\n\n`;
    msg += `This is a reminder from your property owner regarding your pending bill for ${tenant.property_name}.\n\n`;
    msg += `🧾 *Bill Breakdown*\n`;
    if (bd.rent > 0) msg += `- Rent: ₹${bd.rent}\n`;
    if (bd.maintenance > 0) msg += `- Maintenance: ₹${bd.maintenance}\n`;
    if (bd.water > 0) msg += `- Water: ₹${bd.water}\n`;
    if (bd.electricity > 0) msg += `- Light Bill: ₹${bd.electricity}\n`;
    msg += `----------------------\n`;
    msg += `*Total Due: ₹${tenant.bill_amount}*\n\n`;
    msg += `Please pay the amount as soon as possible to avoid late fees.\nThank you!`;

    const encodedMsg = encodeURIComponent(msg);
    const phone = mobile.startsWith('+') ? mobile.substring(1) : (mobile.length === 10 ? `91${mobile}` : mobile);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendReceipt = () => {
    if (!tenant) return;
    
    const mobile = tenant.tenant?.mobile;
    if (!mobile) {
      alert("Tenant mobile number is missing!");
      return;
    }

    let msg = `Hello ${tenant.tenant?.name},\n\n`;
    msg += `✅ *Payment Received*\n\n`;
    msg += `We have successfully received your payment of ₹${tenant.bill_amount} for this month's rent and utilities.\n`;
    msg += `Thank you for your prompt payment!\n\n`;
    msg += `Regards,\nProperty Owner`;

    const encodedMsg = encodeURIComponent(msg);
    const phone = mobile.startsWith('+') ? mobile.substring(1) : (mobile.length === 10 ? `91${mobile}` : mobile);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateBill = () => {
    alert('Generate Bill functionality coming soon');
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-[var(--muted-foreground)]">Loading Tenant Details...</p>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">{error || 'Tenant not found'}</div>
        <button onClick={() => router.push('/owner/tenants')} className="text-indigo-500 font-medium hover:underline">
          Back to Tenants
        </button>
      </div>
    );
  }

  const isPaid = tenant.bill_status === 'paid';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/owner/tenants')}
          className="p-2 hover:bg-[var(--accent)] rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">{tenant.tenant?.name || 'Unknown Tenant'}</h2>
          <p className="text-[var(--muted-foreground)] text-sm flex items-center gap-1">
            <Home size={14}/> {tenant.property_name || 'Property'} • <span className="font-mono bg-[var(--accent)] px-1 rounded">{tenant.property_code}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="col-span-1 space-y-6">
          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm text-center">
            <div className="w-24 h-24 mx-auto bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mb-4">
              <User size={48} />
            </div>
            <h3 className="text-xl font-bold">{tenant.tenant?.name}</h3>
            <p className="text-[var(--muted-foreground)] text-sm mb-6">Tenant ID: #{tenant.tenant_id}</p>
            
            <div className="space-y-3 text-left border-t border-[var(--border)] pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)]"><Phone size={16}/></div>
                <span>{tenant.tenant?.mobile || 'N/A'}</span>
              </div>
              {tenant.tenant?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)]"><Mail size={16}/></div>
                  <span>{tenant.tenant?.email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
            <h4 className="font-bold mb-4">Contract Details</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Move In</span>
                <span className="font-medium">{new Date(tenant.move_in_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Rent</span>
                <span className="font-medium">₹{tenant.monthly_rent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Deposit</span>
                <span className="font-medium">₹{tenant.security_deposit_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Maintenance</span>
                <span className="font-medium">₹{tenant.maintenance_charges || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Water</span>
                <span className="font-medium">₹{tenant.water_charges || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Overview */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              {isPaid ? (
                <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 size={14}/> Paid
                </div>
              ) : (
                <div className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {tenant.bill_status_label || 'Due'}
                </div>
              )}
            </div>
            
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">Current Statement</p>
            <h2 className="text-5xl font-black mb-8">₹{tenant.bill_amount?.toLocaleString('en-IN') || 0}</h2>
            
            <div className="flex flex-wrap gap-4">
              {!isPaid ? (
                <button 
                  onClick={sendReminder}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Send size={18}/> Send WhatsApp Reminder
                </button>
              ) : (
                <button 
                  onClick={sendReceipt}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                >
                  <CheckCircle2 size={18}/> Send WhatsApp Receipt
                </button>
              )}
              <button 
                onClick={printInvoice}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors backdrop-blur-md"
              >
                <FileText size={18}/> Download Invoice
              </button>
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
            <h4 className="font-bold text-lg mb-4">Past Statements</h4>
            <div className="text-center py-10">
              <FileText className="mx-auto text-[var(--muted-foreground)] opacity-30 mb-3" size={48} />
              <p className="text-[var(--muted-foreground)]">No past statements available.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Printable Invoice */}
      <PrintableInvoice invoiceData={{
        invoiceNo: `INV-${tenant.tenant_id}-${new Date().getMonth()+1}`,
        period: `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
        ownerName: "Property Owner",
        ownerMobile: "N/A",
        tenantName: tenant.tenant?.name,
        tenantMobile: tenant.tenant?.mobile,
        propertyName: tenant.property_name,
        propertyCode: tenant.property_code,
        rent: tenant.bill_breakdown?.rent || 0,
        maintenance: tenant.bill_breakdown?.maintenance || 0,
        water: tenant.bill_breakdown?.water || 0,
        electricity: tenant.bill_breakdown?.electricity || 0,
        total: tenant.bill_amount,
        status: tenant.bill_status
      }} />
    </div>
  );
}
