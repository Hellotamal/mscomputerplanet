import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  CheckCircle2, 
  Building, 
  IndianRupee,
  X,
  Edit2,
  MessageSquare,
  QrCode
} from 'lucide-react';

function numberToIndianWords(num) {
  if (!num || isNaN(num) || num === 0) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return 'Rupees ' + str.trim() + ' Only';
}

export default function InvoiceModule({ invoices, setInvoices }) {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInv, setEditingInv] = useState(null);

  const [invForm, setInvForm] = useState({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientGst: '',
    placeOfSupply: 'Assam (18)',
    taxType: 'intra', // 'intra' = CGST+SGST, 'inter' = IGST
    invoiceDate: new Date().toISOString().split('T')[0],
    items: [
      { desc: 'Comprehensive Computer AMC Service', hsn: '9987', qty: 1, rate: 25000 }
    ],
    gstRate: 18,
    status: 'Sent'
  });

  const handleSendInvoiceWhatsApp = (inv) => {
    const subtotal = calculateSubtotal(inv.items);
    const taxMultiplier = 1 + ((Number(inv.gstRate) || 18) / 100);
    const grandTotal = Math.round(subtotal * taxMultiplier);
    const rawPhone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const message = `*M/S COMPUTER PLANET - TAX INVOICE*
---------------------------------------------
*Invoice No:* ${inv.id}
*Date:* ${inv.invoiceDate}
*Billed To:* ${inv.clientName}
${inv.clientGst ? `*Client GSTIN:* ${inv.clientGst}\n` : ''}*Status:* ${inv.status}
---------------------------------------------
*Items Summary:*
${inv.items.map((it, i) => `${i + 1}. ${it.desc} (${it.qty}x) - Rs. ${(it.qty * it.rate).toLocaleString('en-IN')}`).join('\n')}
---------------------------------------------
*Sub Total:* Rs. ${subtotal.toLocaleString('en-IN')}
*GST (${inv.gstRate}%):* Rs. ${(grandTotal - subtotal).toLocaleString('en-IN')}
*GRAND TOTAL:* Rs. ${grandTotal.toLocaleString('en-IN')}
*In Words:* ${numberToIndianWords(grandTotal)}
---------------------------------------------
*Bank Account Details for Payment:*
• Bank: Punjab National Bank
• A/C Name: M/S COMPUTER PLANET
• Branch: Silchar
• IFSC: PUNB0074300
• UPI ID: 8638083712@okbizaxis
---------------------------------------------
*M/S COMPUTER PLANET*
MSME: UDYAM-AS-05-0019941 | GSTIN: 18ASTPR6755J1Z0
West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007
Support Helpline: +91-8638083712`;

    const targetUrl = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank');
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddItemRow = () => {
    setInvForm({
      ...invForm,
      items: [...invForm.items, { desc: '', hsn: '', qty: 1, rate: 0 }]
    });
  };

  const handleRemoveItemRow = (idx) => {
    if (invForm.items.length === 1) return;
    setInvForm({
      ...invForm,
      items: invForm.items.filter((_, i) => i !== idx)
    });
  };

  const handleItemChange = (idx, field, val) => {
    const updated = [...invForm.items];
    updated[idx][field] = field === 'qty' || field === 'rate' ? Number(val) : val;
    setInvForm({ ...invForm, items: updated });
  };

  const calculateSubtotal = (items) => {
    return items.reduce((acc, item) => acc + ((Number(item.qty) || 0) * (Number(item.rate) || 0)), 0);
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!invForm.clientName || invForm.items.length === 0) {
      alert('Please provide client name and at least one item.');
      return;
    }

    const created = {
      ...invForm,
      id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`
    };

    setInvoices([created, ...invoices]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleStartEdit = (inv) => {
    setEditingInv(inv);
    setInvForm({ ...inv });
  };

  const handleUpdateInvoice = (e) => {
    e.preventDefault();
    setInvoices(invoices.map(inv => inv.id === editingInv.id ? { ...invForm, id: editingInv.id } : inv));
    setEditingInv(null);
    resetForm();
  };

  const handleDeleteInvoice = (id, clientName) => {
    if (window.confirm(`Are you sure you want to remove invoice ${id} for ${clientName}?`)) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const resetForm = () => {
    setInvForm({
      clientName: '',
      clientAddress: '',
      clientPhone: '',
      clientGst: '',
      placeOfSupply: 'Assam (18)',
      taxType: 'intra',
      invoiceDate: new Date().toISOString().split('T')[0],
      items: [
        { desc: 'Comprehensive Computer AMC Service', hsn: '9987', qty: 1, rate: 25000 }
      ],
      gstRate: 18,
      status: 'Sent'
    });
  };

  const handlePrintInvoice = (inv) => {
    const subtotal = calculateSubtotal(inv.items);
    const taxRate = Number(inv.gstRate) || 18;
    const isInterState = inv.taxType === 'inter' || (inv.placeOfSupply && !inv.placeOfSupply.includes('Assam') && !inv.placeOfSupply.includes('18'));
    
    const cgstRate = isInterState ? 0 : taxRate / 2;
    const sgstRate = isInterState ? 0 : taxRate / 2;
    const igstRate = isInterState ? taxRate : 0;

    const cgstAmount = isInterState ? 0 : Math.round((subtotal * cgstRate) / 100);
    const sgstAmount = isInterState ? 0 : Math.round((subtotal * sgstRate) / 100);
    const igstAmount = isInterState ? Math.round((subtotal * igstRate) / 100) : 0;
    const grandTotal = subtotal + cgstAmount + sgstAmount + igstAmount;
    const words = numberToIndianWords(grandTotal);

    const upiUri = encodeURIComponent(`upi://pay?pa=8638083712@okbizaxis&pn=MS%20COMPUTER%20PLANET&am=${grandTotal}&cu=INR&tn=Invoice%20${inv.id}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=0&data=${upiUri}`;

    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>GST Tax Invoice - ${inv.id} - M/S COMPUTER PLANET</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 28px; color: #0f172a; font-size: 12px; line-height: 1.45; }
            .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand-name { font-size: 22px; font-weight: 900; color: #0b3b60; margin: 0; letter-spacing: -0.5px; }
            .subhead { color: #475569; font-size: 11px; margin-top: 2px; }
            .tagline { font-weight: bold; color: #0f172a; font-size: 11px; margin-top: 4px; }
            .invoice-title { text-align: center; margin: 12px 0 10px 0; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; background: #f1f5f9; padding: 4px; border-radius: 4px; }
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 14px; gap: 12px; }
            .box { border: 1px solid #cbd5e1; padding: 10px 12px; border-radius: 6px; width: 48%; }
            .box-title { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 4px; }
            table.items { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
            table.items th, table.items td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; }
            table.items th { background: #f8fafc; font-weight: bold; font-size: 11px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals-container { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; }
            .words-box { width: 50%; border: 1px dashed #cbd5e1; padding: 10px; border-radius: 6px; font-size: 11px; }
            .totals-table { width: 45%; border-collapse: collapse; }
            .totals-table td { padding: 5px 8px; font-size: 12px; }
            .grand-total { font-weight: 900; font-size: 14px; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; background: #f0fdf4; color: #15803d; }
            .payment-footer { margin-top: 25px; border-top: 1px solid #cbd5e1; padding-top: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
            .qr-wrapper { display: flex; gap: 12px; align-items: center; }
            .qr-img { border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px; background: #fff; }
          </style>
        </head>
        <body>
          ${getCompanyPrintHeaderHtml({
            documentTitle: 'TAX INVOICE',
            rightBadgeText: 'ORIGINAL FOR RECIPIENT',
            rightBadgeSubtext: 'GST INVOICE'
          })}

          <div class="meta-grid">
            <div class="box">
              <div class="box-title">Billed To (Customer Details)</div>
              <div style="font-weight: bold; font-size: 13px; color: #0f172a;">${inv.clientName}</div>
              <div style="margin-top: 2px;">${inv.clientAddress || 'Silchar, Cachar, Assam'}</div>
              ${inv.clientPhone ? `<div>Phone: ${inv.clientPhone}</div>` : ''}
              <div style="margin-top: 3px;"><strong>GSTIN / UIN:</strong> ${inv.clientGst || 'Unregistered / End Consumer'}</div>
            </div>
            <div class="box">
              <div class="box-title">Invoice & Supply Particulars</div>
              <div><strong>Invoice No:</strong> <span style="font-family: monospace; font-weight: bold;">${inv.id}</span></div>
              <div><strong>Invoice Date:</strong> ${inv.invoiceDate}</div>
              <div><strong>Place of Supply:</strong> ${inv.placeOfSupply || 'Assam (18)'}</div>
              <div><strong>Supply Type:</strong> ${isInterState ? 'Inter-State (IGST Applicable)' : 'Intra-State (CGST + SGST Applicable)'}</div>
              <div><strong>Payment Status:</strong> <span style="font-weight: bold; color: #059669;">${inv.status}</span></div>
            </div>
          </div>

          <table class="items">
            <thead>
              <tr>
                <th style="width: 5%;" class="text-center">#</th>
                <th>Description of Goods / Scope of Technical Service</th>
                <th style="width: 12%;" class="text-center">HSN/SAC</th>
                <th style="width: 8%;" class="text-right">Qty</th>
                <th style="width: 15%;" class="text-right">Rate (₹)</th>
                <th style="width: 18%;" class="text-right">Taxable Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items.map((it, idx) => `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td><strong>${it.desc}</strong></td>
                  <td class="text-center font-mono">${it.hsn || '9987'}</td>
                  <td class="text-right">${it.qty}</td>
                  <td class="text-right">${Number(it.rate).toLocaleString('en-IN')}</td>
                  <td class="text-right">${(Number(it.qty) * Number(it.rate)).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="words-box">
              <strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Amount Chargeable in Words:</strong>
              <div style="font-weight: bold; color: #0f172a; margin-top: 3px; font-size: 11px;">${words}</div>
              <div style="margin-top: 10px; font-size: 10px; color: #64748b;">
                <strong>Declaration:</strong> Certified that the particulars given above are true and correct, and the amount indicated represents the price actually charged.
              </div>
            </div>

            <table class="totals-table">
              <tr>
                <td>Total Taxable Value:</td>
                <td class="text-right font-mono font-bold">₹${subtotal.toLocaleString('en-IN')}</td>
              </tr>
              ${isInterState ? `
                <tr>
                  <td>IGST (${igstRate}%):</td>
                  <td class="text-right font-mono">₹${igstAmount.toLocaleString('en-IN')}</td>
                </tr>
              ` : `
                <tr>
                  <td>Central GST - CGST (${cgstRate}%):</td>
                  <td class="text-right font-mono">₹${cgstAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>State GST - SGST (${sgstRate}%):</td>
                  <td class="text-right font-mono">₹${sgstAmount.toLocaleString('en-IN')}</td>
                </tr>
              `}
              <tr class="grand-total">
                <td>Invoice Grand Total:</td>
                <td class="text-right font-mono">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <div class="payment-footer">
            <div class="qr-wrapper">
              <img src="${qrUrl}" alt="Scan & Pay UPI QR" class="qr-img" width="105" height="105" />
              <div>
                <div style="font-weight: bold; font-size: 11px; color: #0f172a;">Direct Bank Transfer / UPI Scan:</div>
                <div style="font-size: 11px; margin-top: 2px;">• Bank: <strong>Punjab National Bank</strong></div>
                <div style="font-size: 11px;">• A/C Name: <strong>M/S COMPUTER PLANET</strong></div>
                <div style="font-size: 11px;">• Account No: <strong style="font-family: monospace;">0743002100018899</strong></div>
                <div style="font-size: 11px;">• IFSC Code: <strong style="font-family: monospace;">PUNB0074300</strong> (Silchar Branch)</div>
                <div style="font-size: 11px;">• UPI VPA: <strong style="font-family: monospace;">8638083712@okbizaxis</strong></div>
              </div>
            </div>

            <div style="text-align: right; min-width: 200px;">
              <div style="font-size: 11px;">For <strong>M/S COMPUTER PLANET</strong></div>
              <div style="height: 45px;"></div>
              <div style="border-top: 1px solid #0f172a; display: inline-block; padding-top: 4px; font-weight: bold; font-size: 11px;">
                Authorized Signatory / Proprietor
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search invoice number, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create GST Invoice</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredInvoices.map((inv) => {
          const subtotal = calculateSubtotal(inv.items);
          const taxMultiplier = 1 + ((Number(inv.gstRate) || 18) / 100);
          const totalWithTax = Math.round(subtotal * taxMultiplier);

          return (
            <div
              key={inv.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                    {inv.id}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {inv.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Date: {inv.invoiceDate}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {inv.clientName}
                </h4>
                <div className="text-xs text-slate-500">
                  {inv.items.map(it => `${it.desc} (${it.qty}x)`).join(', ')}
                </div>
                {inv.clientGst && (
                  <div className="text-[11px] font-mono text-slate-400">
                    Client GST: {inv.clientGst}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total (incl. {inv.gstRate}% GST)</div>
                  <div className="text-xl font-black font-mono text-slate-900">
                    ₹{totalWithTax.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(inv)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Edit Invoice"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteInvoice(inv.id, inv.clientName)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                    title="Remove Invoice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSendInvoiceWhatsApp(inv)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    title="Send Invoice Summary & UPI Details via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handlePrintInvoice(inv)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Invoice Modal */}
      {(showCreateModal || editingInv) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingInv ? `Edit Invoice: ${editingInv.id}` : 'Generate GST Tax Invoice'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">From: M/S Computer Planet (GSTIN: 18ASTPR6755J1Z0)</p>
              </div>
              <button 
                onClick={() => { setShowCreateModal(false); setEditingInv(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingInv ? handleUpdateInvoice : handleSaveInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Punjab National Bank Silchar"
                    value={invForm.clientName}
                    onChange={(e) => setInvForm({ ...invForm, clientName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Phone (for WhatsApp) *</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94350 12345"
                    value={invForm.clientPhone || ''}
                    onChange={(e) => setInvForm({ ...invForm, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 18AAACP2965C1Z1"
                    value={invForm.clientGst}
                    onChange={(e) => setInvForm({ ...invForm, clientGst: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Place of Supply</label>
                  <input
                    type="text"
                    placeholder="e.g. Assam (18)"
                    value={invForm.placeOfSupply || 'Assam (18)'}
                    onChange={(e) => setInvForm({ ...invForm, placeOfSupply: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GST Tax Type</label>
                  <select
                    value={invForm.taxType || 'intra'}
                    onChange={(e) => setInvForm({ ...invForm, taxType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="intra">Intra-State (CGST + SGST)</option>
                    <option value="inter">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Club Road, Silchar - 788001"
                    value={invForm.clientAddress}
                    onChange={(e) => setInvForm({ ...invForm, clientAddress: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invForm.invoiceDate}
                    onChange={(e) => setInvForm({ ...invForm, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Invoice Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {invForm.items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2.5 sm:p-0 bg-white sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-slate-200 shadow-sm sm:shadow-none">
                      <input
                        type="text"
                        placeholder="Item Description"
                        required
                        value={item.desc}
                        onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                        className="w-full sm:flex-grow px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="HSN"
                          value={item.hsn}
                          onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                          className="w-20 sm:w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-16 sm:w-14 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-center"
                        />
                        <input
                          type="number"
                          placeholder="Rate ₹"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="flex-grow sm:flex-grow-0 sm:w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-right"
                        />
                        {invForm.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 shrink-0"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GST Rate and Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GST Tax Bracket</label>
                  <select
                    value={invForm.gstRate}
                    onChange={(e) => setInvForm({ ...invForm, gstRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="18">18% GST (IT Hardware, AMC & Networking)</option>
                    <option value="12">12% GST (Renewable Solar Systems)</option>
                    <option value="5">5% GST (Consumables)</option>
                    <option value="0">0% (Exempted / Estimate)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Status</label>
                  <select
                    value={invForm.status}
                    onChange={(e) => setInvForm({ ...invForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Sent">Sent / Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setEditingInv(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-500"
                >
                  {editingInv ? 'Save Invoice Changes' : 'Save & Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
