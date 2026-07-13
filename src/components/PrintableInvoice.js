export default function PrintableInvoice({ invoiceData }) {
  if (!invoiceData) return null;

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8 text-sm">
      <div className="border-b-2 border-black pb-6 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider mb-2">Invoice / Receipt</h1>
          <p className="font-medium text-gray-600">Invoice No: {invoiceData.invoiceNo || 'N/A'}</p>
          <p className="font-medium text-gray-600">Date: {new Date().toLocaleDateString('en-IN')}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">{invoiceData.ownerName}</h2>
          <p className="text-gray-600">Ph: {invoiceData.ownerMobile}</p>
        </div>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">Billed To</h3>
          <p className="font-bold text-lg">{invoiceData.tenantName}</p>
          <p className="text-gray-600">Ph: {invoiceData.tenantMobile}</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">Property Details</h3>
          <p className="font-bold">{invoiceData.propertyName}</p>
          <p className="text-gray-600">Code: {invoiceData.propertyCode}</p>
        </div>
      </div>

      <div className="border-t border-black pt-4 mb-4">
        <h3 className="font-bold text-lg mb-4">Charges for {invoiceData.period}</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 font-bold uppercase text-xs text-gray-500">Description</th>
              <th className="py-2 font-bold uppercase text-xs text-gray-500 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3">Monthly Rent</td>
              <td className="py-3 text-right font-medium">{invoiceData.rent}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3">Maintenance Charges</td>
              <td className="py-3 text-right font-medium">{invoiceData.maintenance}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3">Water Charges</td>
              <td className="py-3 text-right font-medium">{invoiceData.water}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="py-3">Electricity / Light Bill</td>
              <td className="py-3 text-right font-medium">{invoiceData.electricity}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 text-lg font-black border-b-4 border-black">
            <span>Total Due:</span>
            <span>₹{invoiceData.total}</span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold text-gray-600">
            <span>Status:</span>
            <span className={invoiceData.status === 'paid' ? 'text-green-600' : 'text-red-600'}>
              {invoiceData.status === 'paid' ? 'PAID' : 'DUE'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p>This is a computer-generated invoice and does not require a physical signature.</p>
        <p>Thank you for your prompt payment.</p>
      </div>
    </div>
  );
}
