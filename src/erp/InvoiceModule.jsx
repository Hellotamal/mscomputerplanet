import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
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
  Edit2
} from 'lucide-react';

export default function InvoiceModule({ invoices, setInvoices }) {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInv, setEditingInv] = useState(null);

  const [invForm, setInvForm] = useState({
    clientName: '',
    clientAddress: '',
    clientGst: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    items: [
      { desc: 'Comprehensive Computer AMC Service', hsn: '9987', qty: 1, rate: 25000 }
    ],
    gstRate: 18,
    status: 'Sent'
  });

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
      clientGst: '',
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
    const cgstRate = taxRate / 2;
    const sgstRate = taxRate / 2;
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    const grandTotal = subtotal + cgstAmount + sgstAmount;

    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Tax Invoice - ${inv.id}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; font-size: 13px; line-height: 1.5; }
            .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; }
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; width: 48%; }
            table.items { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
            table.items th, table.items td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            table.items th { background: #f8fafc; font-weight: bold; }
            .text-right { text-align: right; }
            .totals-table { width: 45%; margin-left: auto; border-collapse: collapse; }
            .totals-table td { padding: 6px 10px; }
            .grand-total { font-weight: bold; font-size: 15px; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; }
          </style>
        </head>
        <body>
          <div class="header-table">
            <h2 style="margin: 0; color: #0b3b60;">M/S COMPUTER PLANET</h2>
            <div>West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007</div>
            <div>Phone: +91-8638083712 | Email: computerplanetpkd@gmail.com</div>
            <div style="font-weight: bold; margin-top: 4px;">
              GSTIN: 18ASTPR6755J1Z0 | State: Assam (18) | MSME: UDYAM-AS-05-0019941
            </div>
          </div>

          <h3 style="text-align: center; margin: 10px 0; text-transform: uppercase; letter-spacing: 1px;">TAX INVOICE / ESTIMATE</h3>

          <div class="meta-grid">
            <div class="box">
              <strong style="color: #64748b; font-size: 11px;">BILLED TO:</strong>
              <div style="font-weight: bold; font-size: 14px; margin-top: 4px;">${inv.clientName}</div>
              <div>${inv.clientAddress || 'Silchar, Assam'}</div>
              <div><strong>GSTIN:</strong> ${inv.clientGst || 'Unregistered / Consumer'}</div>
            </div>
            <div class="box">
              <strong style="color: #64748b; font-size: 11px;">INVOICE DETAILS:</strong>
              <div style="margin-top: 4px;"><strong>Invoice No:</strong> ${inv.id}</div>
              <div><strong>Date:</strong> ${inv.invoiceDate}</div>
              <div><strong>Status:</strong> ${inv.status}</div>
              <div><strong>Place of Supply:</strong> Assam (18)</div>
            </div>
          </div>

          <table class="items">
            <thead>
              <tr>
                <th style="width: 5%;">#</th>
                <th>Item Description / Scope of Service</th>
                <th style="width: 12%;">HSN/SAC</th>
                <th style="width: 8%;" class="text-right">Qty</th>
                <th style="width: 15%;" class="text-right">Rate (₹)</th>
                <th style="width: 18%;" class="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items.map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${it.desc}</strong></td>
                  <td>${it.hsn || '-'}</td>
                  <td class="text-right">${it.qty}</td>
                  <td class="text-right">${Number(it.rate).toLocaleString('en-IN')}</td>
                  <td class="text-right">${(Number(it.qty) * Number(it.rate)).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Sub Total:</td>
              <td class="text-right font-mono">₹${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>CGST (${cgstRate}%):</td>
              <td class="text-right font-mono">₹${cgstAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>SGST (${sgstRate}%):</td>
              <td class="text-right font-mono">₹${sgstAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Amount:</td>
              <td class="text-right font-mono">₹${grandTotal.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <div style="margin-top: 50px; display: flex; justify-content: space-between;">
            <div>
              <div><strong>Bank Details for NEFT/RTGS:</strong></div>
              <div>Bank: Punjab National Bank</div>
              <div>A/C Name: M/S COMPUTER PLANET</div>
              <div>Branch: Silchar | IFSC: PUNB004...</div>
            </div>
            <div style="text-align: center;">
              <div>For <strong>M/S COMPUTER PLANET</strong></div>
              <div style="margin-top: 45px;">Authorized Signatory</div>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer GSTIN (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. 18AAACP..."
                    value={invForm.clientGst}
                    onChange={(e) => setInvForm({ ...invForm, clientGst: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
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
