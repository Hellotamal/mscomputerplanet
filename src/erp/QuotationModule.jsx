import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Trash2, 
  Edit2, 
  Copy, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Calendar, 
  Building2, 
  IndianRupee, 
  ArrowRightCircle, 
  CheckCircle, 
  Send,
  HelpCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

export function numberToIndianWords(num) {
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

const CATEGORIES = [
  'Banking IT AMC',
  'Solar Rooftop EPC',
  'CCTV & Security',
  'Hardware & Spares Supply',
  'Networking & Server Setup',
  'General Technical Services'
];

const DEFAULT_TERMS = 
`1. Payment Terms: 50% mobilization advance along with formal purchase order, balance upon delivery / installation.
2. Delivery & Execution: Within 7-10 working days from PO confirmation.
3. Warranty: 1-Year comprehensive on-site warranty for hardware; manufacturer performance warranty on solar components.
4. Taxes: GST as indicated above.
5. Quotation Validity: 30 days from the date of issue.`;

export default function QuotationModule({ quotations, setQuotations, invoices, setInvoices, setActiveTab }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);

  // Form State
  const [form, setForm] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: '',
    contactPerson: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    clientGst: '',
    category: 'Banking IT AMC',
    placeOfSupply: 'Assam (18)',
    taxType: 'intra', // 'intra' (CGST+SGST) or 'inter' (IGST)
    status: 'Draft',
    items: [
      { desc: 'Comprehensive Hardware AMC & Maintenance Support', hsn: '9987', qty: 1, unit: 'Quarter', rate: 25000 }
    ],
    gstRate: 18,
    terms: DEFAULT_TERMS,
    notes: ''
  });

  const calculateSubtotal = (items) => {
    return (items || []).reduce((acc, item) => acc + ((Number(item.qty) || 0) * (Number(item.rate) || 0)), 0);
  };

  const calculateQuoteTotals = (q) => {
    const subtotal = calculateSubtotal(q.items);
    const taxRate = Number(q.gstRate) || 0;
    const isInterState = q.taxType === 'inter' || (q.placeOfSupply && !q.placeOfSupply.includes('Assam') && !q.placeOfSupply.includes('18'));
    
    const cgstRate = isInterState ? 0 : taxRate / 2;
    const sgstRate = isInterState ? 0 : taxRate / 2;
    const igstRate = isInterState ? taxRate : 0;

    const cgstAmount = isInterState ? 0 : Math.round((subtotal * cgstRate) / 100);
    const sgstAmount = isInterState ? 0 : Math.round((subtotal * sgstRate) / 100);
    const igstAmount = isInterState ? Math.round((subtotal * igstRate) / 100) : 0;
    const grandTotal = subtotal + cgstAmount + sgstAmount + igstAmount;

    return {
      subtotal,
      taxRate,
      isInterState,
      cgstRate,
      sgstRate,
      igstRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal
    };
  };

  // Filtered List
  const filteredQuotations = (quotations || []).filter(q => {
    const matchesSearch = 
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      (q.contactPerson && q.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
      (q.category && q.category.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || q.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // KPI Metrics
  const totalPipelineValue = (quotations || []).reduce((acc, q) => {
    const { grandTotal } = calculateQuoteTotals(q);
    return acc + grandTotal;
  }, 0);

  const approvedQuotations = (quotations || []).filter(q => q.status === 'Approved' || q.status === 'Converted');
  const approvedValue = approvedQuotations.reduce((acc, q) => acc + calculateQuoteTotals(q).grandTotal, 0);
  const pendingCount = (quotations || []).filter(q => q.status === 'Sent' || q.status === 'Draft').length;

  // Handlers for Row Editing in Modal
  const handleAddItemRow = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { desc: '', hsn: '', qty: 1, unit: 'Nos', rate: 0 }]
    }));
  };

  const handleRemoveItemRow = (idx) => {
    if (form.items.length <= 1) return;
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleItemChange = (idx, field, val) => {
    const updated = [...form.items];
    updated[idx][field] = (field === 'qty' || field === 'rate') ? Number(val) : val;
    setForm(prev => ({ ...prev, items: updated }));
  };

  const resetForm = () => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    setForm({
      id: `QT-2026-${nextNum}`,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clientName: '',
      contactPerson: '',
      clientPhone: '',
      clientEmail: '',
      clientAddress: '',
      clientGst: '',
      category: 'Banking IT AMC',
      placeOfSupply: 'Assam (18)',
      taxType: 'intra',
      status: 'Draft',
      items: [
        { desc: 'Comprehensive Hardware AMC & Maintenance Support', hsn: '9987', qty: 1, unit: 'Quarter', rate: 25000 }
      ],
      gstRate: 18,
      terms: DEFAULT_TERMS,
      notes: ''
    });
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleStartEdit = (quote) => {
    setEditingQuote(quote);
    setForm({ ...quote });
  };

  const handleSaveQuote = (e) => {
    e.preventDefault();
    if (!form.clientName || form.items.length === 0) {
      alert('Please provide client name and at least one item.');
      return;
    }

    if (editingQuote) {
      setQuotations(quotations.map(q => q.id === editingQuote.id ? { ...form } : q));
      setEditingQuote(null);
    } else {
      setQuotations([form, ...quotations]);
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteQuote = (id, clientName) => {
    if (window.confirm(`Are you sure you want to delete quotation ${id} for "${clientName}"?`)) {
      setQuotations(quotations.filter(q => q.id !== id));
    }
  };

  const handleDuplicateQuote = (quote) => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const duplicated = {
      ...quote,
      id: `QT-2026-${nextNum}`,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Draft',
      notes: `Duplicated from ${quote.id}. ${quote.notes || ''}`
    };
    setQuotations([duplicated, ...quotations]);
  };

  // Convert Quotation to Official GST Invoice
  const handleConvertToInvoice = (quote) => {
    if (!setInvoices) {
      alert('Invoice module integration is unavailable.');
      return;
    }

    const confirmConvert = window.confirm(
      `Convert Quotation ${quote.id} into an Official GST Tax Invoice?\n\nThis will create a new GST invoice with all items and mark this quotation as "Converted".`
    );
    if (!confirmConvert) return;

    const newInvoiceId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice = {
      id: newInvoiceId,
      invoiceDate: new Date().toISOString().split('T')[0],
      clientName: quote.clientName,
      clientAddress: quote.clientAddress || 'Silchar, Cachar, Assam',
      clientPhone: quote.clientPhone || '',
      clientGst: quote.clientGst || '',
      placeOfSupply: quote.placeOfSupply || 'Assam (18)',
      taxType: quote.taxType || 'intra',
      gstRate: quote.gstRate || 18,
      status: 'Sent',
      items: quote.items.map(it => ({
        desc: it.desc,
        hsn: it.hsn || '9987',
        qty: it.qty,
        rate: it.rate
      }))
    };

    setInvoices([newInvoice, ...(invoices || [])]);

    // Mark quotation as Converted
    setQuotations(quotations.map(q => q.id === quote.id ? { ...q, status: 'Converted', notes: (q.notes ? q.notes + ' ' : '') + `[Converted to Invoice ${newInvoiceId}]` } : q));

    const viewNow = window.confirm(`Invoice ${newInvoiceId} created successfully!\n\nWould you like to open the Invoices tab now?`);
    if (viewNow && setActiveTab) {
      setActiveTab('invoices');
    }
  };

  // 1-Click WhatsApp Dispatch
  const handleSendQuoteWhatsApp = (quote) => {
    const { subtotal, grandTotal, taxRate } = calculateQuoteTotals(quote);
    const rawPhone = (quote.clientPhone || '').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const itemsSummary = quote.items.map((it, idx) => 
      `${idx + 1}. *${it.desc}* - ${it.qty} ${it.unit || 'Nos'} @ Rs. ${Number(it.rate).toLocaleString('en-IN')}`
    ).join('\n');

    const message = `*M/S COMPUTER PLANET - COMMERCIAL QUOTATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Quotation No:* ${quote.id}
*Date:* ${quote.date} | *Valid Until:* ${quote.validUntil}
*Client:* ${quote.clientName}
${quote.contactPerson ? `*Attn:* ${quote.contactPerson}\n` : ''}*Category:* ${quote.category}
*Status:* ${quote.status}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Scope of Supply & Services:*
${itemsSummary}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Taxable Subtotal:* Rs. ${subtotal.toLocaleString('en-IN')}
*GST (${taxRate}%):* Rs. ${(grandTotal - subtotal).toLocaleString('en-IN')}
*ESTIMATED TOTAL:* Rs. ${grandTotal.toLocaleString('en-IN')}
*Amount in Words:* ${numberToIndianWords(grandTotal)}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Key Terms & Conditions:*
${quote.terms || 'Standard payment terms apply. 1-year warranty on equipment.'}

*Firm Credentials & Bank Details:*
• M/S COMPUTER PLANET
• Bank: Punjab National Bank | Branch: Silchar
• A/C IFSC: PUNB0074300 | UPI: 8638083712@okbizaxis
• MSME: UDYAM-AS-05-0019941 | GSTIN: 18ASTPR6755J1Z0
• West Kachudharam, Chincoorie, Silchar - 788007
• Helpline: +91-8638083712`;

    const targetUrl = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank');
  };

  // Print Official Commercial Quotation
  const handlePrintQuote = (quote) => {
    const { subtotal, grandTotal, isInterState, cgstRate, sgstRate, igstRate, cgstAmount, sgstAmount, igstAmount } = calculateQuoteTotals(quote);
    const words = numberToIndianWords(grandTotal);

    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Quotation ${quote.id} - ${quote.clientName} - M/S COMPUTER PLANET</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 28px; color: #0f172a; font-size: 12px; line-height: 1.45; }
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
            .terms-box { margin-top: 18px; border: 1px solid #e2e8f0; background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 11px; }
            .terms-title { font-weight: bold; text-transform: uppercase; color: #0f172a; margin-bottom: 5px; font-size: 11px; }
            .footer-sig { margin-top: 35px; display: flex; justify-content: space-between; align-items: flex-end; }
          </style>
        </head>
        <body>
          ${getCompanyPrintHeaderHtml({
            documentTitle: 'COMMERCIAL PROPOSAL & ESTIMATE',
            rightBadgeText: quote.id,
            rightBadgeSubtext: 'OFFICIAL QUOTATION'
          })}

          <div class="meta-grid">
            <div class="box">
              <div class="box-title">Client / Recipient Details</div>
              <div style="font-weight: bold; font-size: 13px; color: #0f172a;">${quote.clientName}</div>
              ${quote.contactPerson ? `<div><strong>Attn:</strong> ${quote.contactPerson}</div>` : ''}
              <div style="margin-top: 2px;">${quote.clientAddress || 'Silchar, Cachar, Assam'}</div>
              ${quote.clientPhone ? `<div><strong>Phone:</strong> ${quote.clientPhone}</div>` : ''}
              ${quote.clientEmail ? `<div><strong>Email:</strong> ${quote.clientEmail}</div>` : ''}
              ${quote.clientGst ? `<div style="margin-top: 3px;"><strong>GSTIN:</strong> ${quote.clientGst}</div>` : ''}
            </div>
            <div class="box">
              <div class="box-title">Proposal & Validity Particulars</div>
              <div><strong>Quotation No:</strong> <span style="font-family: monospace; font-weight: bold;">${quote.id}</span></div>
              <div><strong>Quotation Date:</strong> ${quote.date}</div>
              <div><strong>Proposal Validity:</strong> <span style="color: #b45309; font-weight: bold;">Valid until ${quote.validUntil}</span></div>
              <div><strong>Service Category:</strong> ${quote.category}</div>
              <div><strong>Place of Supply:</strong> ${quote.placeOfSupply || 'Assam (18)'}</div>
              <div><strong>Tax Type:</strong> ${isInterState ? 'Inter-State (IGST Applicable)' : 'Intra-State (CGST + SGST Applicable)'}</div>
            </div>
          </div>

          <table class="items">
            <thead>
              <tr>
                <th style="width: 4%;" class="text-center">#</th>
                <th>Description of Goods / Scope of Technical Work</th>
                <th style="width: 10%;" class="text-center">HSN/SAC</th>
                <th style="width: 8%;" class="text-right">Qty</th>
                <th style="width: 9%;" class="text-center">Unit</th>
                <th style="width: 14%;" class="text-right">Rate (₹)</th>
                <th style="width: 16%;" class="text-right">Taxable Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${quote.items.map((it, idx) => `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td><strong>${it.desc}</strong></td>
                  <td class="text-center font-mono">${it.hsn || '9987'}</td>
                  <td class="text-right">${it.qty}</td>
                  <td class="text-center">${it.unit || 'Nos'}</td>
                  <td class="text-right">${Number(it.rate).toLocaleString('en-IN')}</td>
                  <td class="text-right">${(Number(it.qty) * Number(it.rate)).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="words-box">
              <strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Total Estimate in Words:</strong>
              <div style="font-weight: bold; color: #0f172a; margin-top: 3px; font-size: 11px;">${words}</div>
              <div style="margin-top: 10px; font-size: 10.5px; color: #475569;">
                <strong>Bank Details for Settlement / Advance:</strong><br/>
                Punjab National Bank, Silchar Branch<br/>
                Account: M/S COMPUTER PLANET | IFSC: PUNB0074300<br/>
                UPI VPA: 8638083712@okbizaxis
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
                <td>GRAND TOTAL (INCL. GST):</td>
                <td class="text-right font-mono">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          ${quote.terms ? `
            <div class="terms-box">
              <div class="terms-title">Commercial Terms & Conditions</div>
              <div style="white-space: pre-line; color: #334155;">${quote.terms}</div>
            </div>
          ` : ''}

          <div class="footer-sig">
            <div style="font-size: 11px; color: #64748b;">
              <div>Customer Acceptance / Seal & Signature</div>
              <div style="margin-top: 40px; border-top: 1px dashed #94a3b8; width: 220px; padding-top: 4px;">
                Authorized Representative Signature
              </div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #0f172a;">
              <div style="font-weight: bold;">For M/S COMPUTER PLANET</div>
              <div style="margin-top: 40px; border-top: 1px dashed #94a3b8; width: 220px; padding-top: 4px; display: inline-block;">
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Converted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Summary KPI Widgets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-blue" />
            <span>Commercial Quotations & Estimates</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate customized commercial proposals for Banking IT AMCs, Solar Rooftop EPC, CCTV surveillance, and hardware bids.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Proposals</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{(quotations || []).length}</div>
          <div className="text-xs text-slate-500 mt-1">Active client quotations</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pipeline Value</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            ₹{totalPipelineValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Cumulative quoted estimate</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved / Converted</div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
            {approvedQuotations.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ₹{approvedValue.toLocaleString('en-IN')} won contracts
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Under Review</div>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">{pendingCount}</div>
          <div className="text-xs text-amber-600 font-medium mt-1">Draft or client consideration</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by quote ID, client name, contact, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent / Pending</option>
            <option value="Approved">Approved</option>
            <option value="Converted">Converted to Invoice</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-3.5">
        {filteredQuotations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">No quotations found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your search or create a new quotation proposal.</p>
          </div>
        ) : (
          filteredQuotations.map((q) => {
            const { subtotal, grandTotal } = calculateQuoteTotals(q);
            const isExpired = new Date(q.validUntil) < new Date() && q.status !== 'Approved' && q.status !== 'Converted';

            return (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                      {q.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(q.status)}`}>
                      {q.status}
                    </span>
                    <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Date: {q.date}
                    </span>
                    {isExpired ? (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Expired on {q.validUntil}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700">
                        Valid until: {q.validUntil}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {q.clientName}
                    </h3>
                    {q.contactPerson && (
                      <div className="text-xs text-slate-600 font-medium">
                        Attn: {q.contactPerson} {q.clientPhone ? `(${q.clientPhone})` : ''}
                      </div>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-500 line-clamp-2">
                    {q.items.map((it, idx) => `${it.desc} (${it.qty} ${it.unit || 'Nos'})`).join(' • ')}
                  </div>

                  {q.notes && (
                    <div className="text-[11px] text-slate-400 italic">
                      Note: {q.notes}
                    </div>
                  )}
                </div>

                {/* Right: Pricing & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Estimated Total (incl. {q.gstRate}% GST)</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Taxable: ₹{subtotal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Convert to Invoice Button */}
                    {q.status !== 'Converted' ? (
                      <button
                        onClick={() => handleConvertToInvoice(q)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                        title="Convert this approved quotation directly into a GST Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>To Invoice</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Invoiced</span>
                      </span>
                    )}

                    {/* WhatsApp Button */}
                    <button
                      onClick={() => handleSendQuoteWhatsApp(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition border border-emerald-200"
                      title="Send Quotation breakdown via WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={() => handlePrintQuote(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      title="Print Official Quotation with Company Logo"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>

                    {/* Duplicate Button */}
                    <button
                      onClick={() => handleDuplicateQuote(q)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Clone as New Draft Quotation"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleStartEdit(q)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Quotation"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteQuote(q.id, q.clientName)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Delete Quotation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Quotation Modal */}
      {(showCreateModal || editingQuote) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-brand-blue">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingQuote ? `Edit Quotation: ${editingQuote.id}` : 'Create Commercial Quotation / Proposal'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure item pricing, tax breakdowns, commercial terms, and client particulars.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingQuote(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveQuote} className="space-y-5 pt-4">
              {/* Top Row: Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quotation ID</label>
                  <input
                    type="text"
                    required
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quotation Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    required
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent / Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Converted">Converted to Invoice</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Client Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Client & Commercial Profile</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Client / Organization Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Punjab National Bank / Green Valley Tea Estate"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Service Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Contact Person / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Manager (IT) / Administrator"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Phone (for WhatsApp Quote)</label>
                    <input
                      type="text"
                      placeholder="e.g. +91-9435012345"
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. manager@domain.com"
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Site / Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Club Road, Silchar, Cachar, Assam - 788001"
                      value={form.clientAddress}
                      onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Client GSTIN (if registered)</label>
                    <input
                      type="text"
                      placeholder="e.g. 18AAACP2965C1Z1"
                      value={form.clientGst}
                      onChange={(e) => setForm({ ...form, clientGst: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Tax & GST Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Place of Supply</label>
                  <input
                    type="text"
                    value={form.placeOfSupply}
                    onChange={(e) => setForm({ ...form, placeOfSupply: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">GST Tax Type</label>
                  <select
                    value={form.taxType}
                    onChange={(e) => setForm({ ...form, taxType: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="intra">Intra-State (Assam: CGST + SGST)</option>
                    <option value="inter">Inter-State (Outside Assam: IGST)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">GST Tax Rate</label>
                  <select
                    value={form.gstRate}
                    onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value={0}>0% (Exempt / Nil)</option>
                    <option value={5}>5% (Solar Spares / Specific)</option>
                    <option value={12}>12% (Renewable Energy EPC)</option>
                    <option value={18}>18% (Standard IT AMC & Services)</option>
                    <option value={28}>28% (Luxury / High Security)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Scope of Work / Hardware Line Items</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item Row</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="w-full sm:w-2/5">
                        <input
                          type="text"
                          required
                          placeholder="Description of item / technical scope..."
                          value={item.desc}
                          onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                      </div>

                      <div className="w-20">
                        <input
                          type="text"
                          placeholder="HSN/SAC"
                          value={item.hsn}
                          onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-center"
                        />
                      </div>

                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-center font-bold"
                        />
                      </div>

                      <div className="w-20">
                        <select
                          value={item.unit || 'Nos'}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full px-1.5 py-1.5 rounded-lg border border-slate-300 bg-white text-center"
                        >
                          <option value="Nos">Nos</option>
                          <option value="Set">Set</option>
                          <option value="Quarter">Quarter</option>
                          <option value="Year">Year</option>
                          <option value="Job">Job</option>
                          <option value="Lot">Lot</option>
                          <option value="kWp">kWp</option>
                          <option value="Mtrs">Mtrs</option>
                        </select>
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Rate ₹"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-right font-mono font-bold"
                        />
                      </div>

                      <div className="w-24 text-right font-mono font-bold text-slate-800 text-xs">
                        ₹{((Number(item.qty) || 0) * (Number(item.rate) || 0)).toLocaleString('en-IN')}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={form.items.length <= 1}
                        className={`p-1.5 rounded-lg transition ${
                          form.items.length <= 1 ? 'opacity-30 cursor-not-allowed' : 'text-rose-600 hover:bg-rose-50'
                        }`}
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Terms & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Commercial Terms & Conditions</label>
                  <textarea
                    rows={4}
                    value={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Internal Notes / Tender Reference</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Discussed with branch AGM. Follow up next Monday."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  ></textarea>
                </div>
              </div>

              {/* Real-time Calculation Summary Bar */}
              {(() => {
                const { subtotal, grandTotal, taxRate } = calculateQuoteTotals(form);
                return (
                  <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-300">
                        Taxable: <span className="font-mono font-bold">₹{subtotal.toLocaleString('en-IN')}</span> | GST ({taxRate}%): <span className="font-mono font-bold">₹{(grandTotal - subtotal).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                        {numberToIndianWords(grandTotal)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Quotation Grand Total</div>
                      <div className="text-2xl font-black font-mono text-emerald-400">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingQuote(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold shadow transition"
                >
                  {editingQuote ? 'Update Quotation' : 'Save & Issue Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
