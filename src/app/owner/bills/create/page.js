'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Building2, User, FileText, Calculator,
  Printer, ArrowLeft, Zap, Droplets, Banknote, HelpCircle, AlertCircle, Wrench, QrCode
} from 'lucide-react';
import Link from 'next/link';

export default function CreateBillPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    propertyId: '',
    tenantName: '',
    roomNo: '',
    rentAmount: '',
    previousReading: '',
    currentReading: '',
    unitRate: '8.5',
    waterCharges: '',
    otherCharges: '',
    previousDues: '',
    maintenanceCharges: '',
    lateFees: '',
    upiId: '', // Added UPI ID for QR code
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/owner/properties');
        const props = response.data?.data || [];
        setProperties(props);
        if (props.length > 0) {
          setFormData((prev) => ({ ...prev, propertyId: props[0].id }));
        }
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateElectricityCharges = () => {
    const prev = parseFloat(formData.previousReading) || 0;
    const curr = parseFloat(formData.currentReading) || 0;
    const rate = parseFloat(formData.unitRate) || 0;
    const units = Math.max(0, curr - prev);
    return {
      units,
      charges: units * rate,
    };
  };

  const calculateTotal = () => {
    const rent = parseFloat(formData.rentAmount) || 0;
    const water = parseFloat(formData.waterCharges) || 0;
    const other = parseFloat(formData.otherCharges) || 0;
    const prevDues = parseFloat(formData.previousDues) || 0;
    const maintenance = parseFloat(formData.maintenanceCharges) || 0;
    const lateFee = parseFloat(formData.lateFees) || 0;
    const electricity = calculateElectricityCharges().charges;
    return rent + water + electricity + other + prevDues + maintenance + lateFee;
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedProperty = properties.find((p) => p.id === formData.propertyId) || { name: 'N/A', address: 'N/A' };
  const elec = calculateElectricityCharges();
  const total = calculateTotal();

  // Construct UPI URL for QR code
  const upiUrl = formData.upiId ? `upi://pay?pa=${formData.upiId}&pn=${encodeURIComponent(selectedProperty.name)}&am=${total.toFixed(2)}&cu=INR` : '';

  return (
    <div className="max-w-6xl mx-auto pb-20 p-4 md:p-6 animate-in fade-in duration-500">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header (No Print) */}
      <div className="flex items-center justify-between mb-8 no-print">
        <div className="flex items-center gap-4">
          <Link href="/owner" className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent)] transition-colors text-[var(--muted-foreground)]">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate Bill</h1>
            <p className="text-[var(--muted-foreground)] mt-1">Create a comprehensive rent and utility bill.</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <Printer size={18} />
          Print / Save PDF
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Input Form (No Print) */}
        <div className="space-y-6 no-print">
          
          {/* Property & Tenant Details */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden p-6 hover:border-blue-500/30 transition-colors">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="text-blue-500" /> Property & Tenant
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1">Select Property</label>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {loading ? (
                    <option>Loading...</option>
                  ) : properties.length === 0 ? (
                    <option value="">No properties available.</option>
                  ) : (
                    properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1">Tenant Name</label>
                  <input type="text" name="tenantName" value={formData.tenantName} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="e.g. Rahul Kumar" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1">Room No</label>
                  <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="e.g. 101" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><QrCode size={16} className="text-pink-500"/> Your UPI ID (For QR Code)</label>
                <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 font-mono" placeholder="e.g. yourname@upi" />
              </div>
            </div>
          </div>

          {/* Primary Charges */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden p-6 hover:border-purple-500/30 transition-colors">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="text-purple-500" /> Primary Charges
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><Banknote size={16}/> Rent Amount (₹)</label>
                  <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><Droplets size={16} className="text-blue-400"/> Water Charges (₹)</label>
                  <input type="number" name="waterCharges" value={formData.waterCharges} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="0" />
                </div>
              </div>
              
              <div className="border-t border-[var(--border)] pt-4 mt-4">
                <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-3 flex items-center gap-1"><Zap size={16} className="text-yellow-500"/> Electricity Meter</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Prev Read</label>
                    <input type="number" name="previousReading" value={formData.previousReading} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Curr Read</label>
                    <input type="number" name="currentReading" value={formData.currentReading} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Rate / Unit</label>
                    <input type="number" name="unitRate" value={formData.unitRate} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="8.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Charges & Dues */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden p-6 hover:border-orange-500/30 transition-colors">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> Additional & Dues
            </h2>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><AlertCircle size={16} className="text-red-400"/> Previous Dues (₹)</label>
                  <input type="number" name="previousDues" value={formData.previousDues} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><Wrench size={16}/> Maintenance (₹)</label>
                  <input type="number" name="maintenanceCharges" value={formData.maintenanceCharges} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><AlertCircle size={16}/> Late Fees (₹)</label>
                  <input type="number" name="lateFees" value={formData.lateFees} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--muted-foreground)] block mb-1 flex items-center gap-1"><HelpCircle size={16}/> Other Charges (₹)</label>
                  <input type="number" name="otherCharges" value={formData.otherCharges} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" placeholder="0" />
                </div>
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div id="printable-invoice" className="bg-white text-black p-8 rounded-2xl shadow-xl border border-gray-200 h-fit max-w-[800px] mx-auto w-full font-sans relative overflow-hidden">
          {/* Decorative background element for premium feel */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>

          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-6 relative z-10">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">INVOICE</h1>
              <p className="text-indigo-600 mt-1 font-bold tracking-wide uppercase text-sm">Monthly Rent & Utility Bill</p>
            </div>
            <div className="text-right">
              <h3 className="font-black text-gray-800 text-2xl tracking-tight">{selectedProperty.name}</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-[200px] ml-auto font-medium">{selectedProperty.address || 'Address not available'}</p>
            </div>
          </div>

          <div className="flex justify-between mb-8 relative z-10 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</p>
              <p className="font-bold text-lg text-gray-800">{formData.tenantName || 'Tenant Name'}</p>
              <p className="text-gray-600 font-medium">Room: <span className="font-bold text-gray-800">{formData.roomNo || 'N/A'}</span></p>
            </div>
            <div className="text-right flex gap-8">
               <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
                <p className="font-bold text-gray-800">{formData.billDate}</p>
               </div>
               <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Due Date</p>
                <p className="font-bold text-indigo-700">{formData.dueDate}</p>
               </div>
            </div>
          </div>

          <table className="w-full mb-8 text-left border-collapse relative z-10">
            <thead>
              <tr className="border-b-2 border-gray-800 text-sm">
                <th className="pb-3 text-gray-800 font-bold uppercase tracking-wider w-1/2">Description</th>
                <th className="pb-3 text-gray-800 font-bold uppercase tracking-wider text-right">Details</th>
                <th className="pb-3 text-gray-800 font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {/* Primary Charges */}
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-bold text-gray-900">Room Rent</p>
                  <p className="text-xs text-gray-500 mt-0.5">Monthly accommodation charge</p>
                </td>
                <td className="py-4 text-right">-</td>
                <td className="py-4 text-right font-bold text-gray-900">₹{Number(formData.rentAmount || 0).toFixed(2)}</td>
              </tr>
              
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-bold text-gray-900">Electricity Charges</p>
                  <p className="text-xs text-gray-500 mt-0.5">Readings: {formData.previousReading || 0} to {formData.currentReading || 0}</p>
                </td>
                <td className="py-4 text-right font-medium text-sm">
                  {elec.units} units @ ₹{formData.unitRate}
                </td>
                <td className="py-4 text-right font-bold text-gray-900">₹{elec.charges.toFixed(2)}</td>
              </tr>

              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-bold text-gray-900">Water Charges</p>
                </td>
                <td className="py-4 text-right">-</td>
                <td className="py-4 text-right font-bold text-gray-900">₹{Number(formData.waterCharges || 0).toFixed(2)}</td>
              </tr>

              {/* Maintenance */}
              {parseFloat(formData.maintenanceCharges) > 0 && (
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-bold text-gray-900">Maintenance</p>
                  </td>
                  <td className="py-4 text-right">-</td>
                  <td className="py-4 text-right font-bold text-gray-900">₹{Number(formData.maintenanceCharges || 0).toFixed(2)}</td>
                </tr>
              )}

              {/* Other */}
              {parseFloat(formData.otherCharges) > 0 && (
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-bold text-gray-900">Other Charges</p>
                  </td>
                  <td className="py-4 text-right">-</td>
                  <td className="py-4 text-right font-bold text-gray-900">₹{Number(formData.otherCharges || 0).toFixed(2)}</td>
                </tr>
              )}

              {/* Dues & Fees */}
              {parseFloat(formData.previousDues) > 0 && (
                <tr className="border-b border-gray-100 bg-orange-50/50">
                  <td className="py-4 px-2 rounded-l-lg">
                    <p className="font-bold text-orange-700">Previous Dues</p>
                    <p className="text-xs text-orange-600/70 mt-0.5">Pending balance from last month</p>
                  </td>
                  <td className="py-4 text-right">-</td>
                  <td className="py-4 px-2 text-right font-bold text-orange-700 rounded-r-lg">₹{Number(formData.previousDues || 0).toFixed(2)}</td>
                </tr>
              )}

              {parseFloat(formData.lateFees) > 0 && (
                <tr className="border-b border-gray-100 bg-red-50/50">
                  <td className="py-4 px-2 rounded-l-lg">
                    <p className="font-bold text-red-700">Late Fees</p>
                  </td>
                  <td className="py-4 text-right">-</td>
                  <td className="py-4 px-2 text-right font-bold text-red-700 rounded-r-lg">₹{Number(formData.lateFees || 0).toFixed(2)}</td>
                </tr>
              )}

            </tbody>
          </table>

          <div className="flex justify-between items-end pt-4 relative z-10">
            {/* UPI QR Code Section */}
            <div className="w-1/3">
               {formData.upiId ? (
                 <div className="bg-white p-3 rounded-xl border-2 border-indigo-100 shadow-sm inline-block">
                   <p className="text-[10px] font-bold text-center uppercase tracking-wider text-indigo-600 mb-2">Scan to Pay via UPI</p>
                   <img 
                     src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiUrl)}&margin=0`} 
                     alt="UPI QR Code"
                     className="w-[100px] h-[100px] mx-auto"
                     crossOrigin="anonymous"
                   />
                   <p className="text-[10px] text-center text-gray-500 mt-2 font-mono break-all">{formData.upiId}</p>
                 </div>
               ) : (
                 <div className="h-[120px] w-[120px] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs text-center p-4">
                   Add UPI ID to generate QR
                 </div>
               )}
            </div>

            {/* Totals Section */}
            <div className="w-1/2">
              <div className="flex justify-between py-2 text-gray-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 mt-2 border-t-2 border-gray-900 bg-gray-50 rounded-lg px-4 -mx-4">
                <span className="text-xl font-black text-gray-900 uppercase tracking-wider">Total Due</span>
                <span className="text-2xl font-black text-indigo-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500 relative z-10">
            <p className="font-medium text-gray-700">Thank you for your timely payment.</p>
            <p className="mt-1 text-xs">Generated electronically via Property Management System.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
