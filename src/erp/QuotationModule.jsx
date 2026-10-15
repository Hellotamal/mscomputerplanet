import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml, generateEntityId } from './erpSecurity';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  Edit2, 
  Copy, 
  MessageSquare, 
  FileText, 
  X, 
  Building2, 
  CheckCircle, 
  Tag,
  Lock,
  Maximize2,
  Minimize2,
  Type,
  SlidersHorizontal,
  Check,
  Sparkles
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

const CATEGORIES = [
  'Banking IT AMC',
  'Solar Rooftop EPC',
  'CCTV & Security',
  'Hardware & Spares Supply',
  'Networking & Server Setup',
  'General Technical Services'
];

const FONT_OPTIONS = [
  { id: 'Inter', name: 'Inter (Modern Tech / Enterprise)', family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { id: 'Segoe UI', name: 'Segoe UI (Corporate Standard)', family: "'Segoe UI', -apple-system, Tahoma, Geneva, Verdana, sans-serif" },
  { id: 'Roboto', name: 'Roboto (Clean Precision)', family: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif" },
  { id: 'Montserrat', name: 'Montserrat (Executive / Bold)', family: "'Montserrat', 'Segoe UI', sans-serif" },
  { id: 'Arial', name: 'Arial / System Sans', family: "Arial, Helvetica, sans-serif" }
];

const FONT_SIZE_OPTIONS = [
  { id: 'compact', name: 'Compact (9.5pt - Fit 1 Page Best)', baseSize: '9.5pt', lineHeight: '1.35', tablePadding: '4px 6px', headerPadding: '6px 8px' },
  { id: 'standard', name: 'Standard (10.5pt - Balanced)', baseSize: '10.5pt', lineHeight: '1.45', tablePadding: '6px 8px', headerPadding: '8px 10px' },
  { id: 'comfort', name: 'Comfort (12pt - Large & Relaxed)', baseSize: '12pt', lineHeight: '1.55', tablePadding: '8px 10px', headerPadding: '10px 12px' }
];

const THEME_OPTIONS = [
  { 
    id: 'tech_blue', 
    name: 'Tech Indigo / Enterprise Blue', 
    primary: '#1e40af', 
    primaryLight: '#eff6ff', 
    accent: '#2563eb', 
    badgeBg: '#dbeafe', 
    badgeText: '#1e40af',
    tableHeaderBg: '#1e3a8a',
    tableHeaderText: '#ffffff',
    border: '#cbd5e1'
  },
  { 
    id: 'modern_slate', 
    name: 'Titanium Slate / Deep Dark', 
    primary: '#0f172a', 
    primaryLight: '#f8fafc', 
    accent: '#334155', 
    badgeBg: '#e2e8f0', 
    badgeText: '#0f172a',
    tableHeaderBg: '#0f172a',
    tableHeaderText: '#ffffff',
    border: '#cbd5e1'
  },
  { 
    id: 'emerald_corp', 
    name: 'Green Energy / Solar Emerald', 
    primary: '#065f46', 
    primaryLight: '#ecfdf5', 
    accent: '#059669', 
    badgeBg: '#d1fae5', 
    badgeText: '#065f46',
    tableHeaderBg: '#064e3b',
    tableHeaderText: '#ffffff',
    border: '#a7f3d0'
  },
  { 
    id: 'classic_navy', 
    name: 'Classic Banking Navy', 
    primary: '#172554', 
    primaryLight: '#f0f9ff', 
    accent: '#0369a1', 
    badgeBg: '#e0f2fe', 
    badgeText: '#0369a1',
    tableHeaderBg: '#172554',
    tableHeaderText: '#ffffff',
    border: '#bae6fd'
  }
];

const DEFAULT_TERMS = 
`1. Payment Terms: 50% mobilization advance along with formal purchase order, balance upon delivery / installation.
2. Delivery & Execution: Within 7-10 working days from PO confirmation.
3. Warranty: 1-Year comprehensive on-site warranty for hardware; manufacturer performance warranty on solar components.
4. Taxes: GST as indicated above.
5. Quotation Validity: 30 days from the date of issue.`;

export default function QuotationModule({ 
  quotations, 
  setQuotations, 
  invoices, 
  setInvoices, 
  setActiveTab, 
  isAdmin = false, 
  currentUser: _currentUser = null 
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [isModalMaximized, setIsModalMaximized] = useState(false);

  // Print typography & layout preferences
  const [printFontFamily, setPrintFontFamily] = useState(() => {
    return localStorage.getItem('cp_quote_font_family') || 'Inter';
  });
  const [printFontSize, setPrintFontSize] = useState(() => {
    return localStorage.getItem('cp_quote_font_size') || 'compact';
  });
  const [printTheme, setPrintTheme] = useState(() => {
    return localStorage.getItem('cp_quote_theme') || 'tech_blue';
  });
  const [printFitOnePage, setPrintFitOnePage] = useState(() => {
    return localStorage.getItem('cp_quote_fit_one_page') !== 'false';
  });
  const [showPrintConfigModal, setShowPrintConfigModal] = useState(false);

  const handleUpdatePrintPrefs = (font, size, theme, fitOne) => {
    setPrintFontFamily(font);
    setPrintFontSize(size);
    setPrintTheme(theme);
    setPrintFitOnePage(fitOne);
    try {
      localStorage.setItem('cp_quote_font_family', font);
      localStorage.setItem('cp_quote_font_size', size);
      localStorage.setItem('cp_quote_theme', theme);
      localStorage.setItem('cp_quote_fit_one_page', String(fitOne));
    } catch {
      // ignore storage failure
    }
  };

  // Form State
  const [form, setForm] = useState(() => ({
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
  }));

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
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can create quotations.');
      return;
    }
    resetForm();
    setShowCreateModal(true);
  };

  const handleStartEdit = (quote) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can edit quotations.');
      return;
    }
    setEditingQuote(quote);
    setForm({ ...quote });
  };

  const handleSaveQuote = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can save quotations.');
      return;
    }
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
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can delete quotations.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete quotation ${id} for "${clientName}"?`)) {
      setQuotations(quotations.filter(q => q.id !== id));
    }
  };

  const handleDuplicateQuote = (quote) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can duplicate quotations.');
      return;
    }
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
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can convert quotations into GST invoices.');
      return;
    }
    if (!setInvoices) {
      alert('Invoice module integration is unavailable.');
      return;
    }

    const confirmConvert = window.confirm(
      `Convert Quotation ${quote.id} into an Official GST Tax Invoice?\n\nThis will create a new GST invoice with all items and mark this quotation as "Converted".`
    );
    if (!confirmConvert) return;

    const newInvoiceId = generateEntityId('INV-2026');
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
• M/S COMPUTER PLANET - IT Solutions, Banking AMC & Renewable Energy
• 1. Registered Office: West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007
• 2. Branch Office: Maligaon, Guwahati, Assam, Pin - 781011
• Tel: +91-8638083712 / 9954493909
• Web: www.mscomputerplanet.com | Email: computerplanetpkd@gmail.com
• MSME Reg: UDYAM-AS-05-0019941 | GSTIN: 18ASTPR6755J1Z0
• Bank: Punjab National Bank | Branch: Silchar
• A/C IFSC: PUNB0074300 | UPI: 8638083712@okbizaxis`;

    const targetUrl = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank');
  };

  // Print Official Commercial Quotation
  const handlePrintQuote = (quote) => {
    const { subtotal, grandTotal, isInterState, cgstRate, sgstRate, igstRate, cgstAmount, sgstAmount, igstAmount } = calculateQuoteTotals(quote);
    const words = numberToIndianWords(grandTotal);

    const curFont = printFontFamily;
    const curSize = printFontSize;
    const curTheme = printTheme;
    const curFitOnePage = printFitOnePage;

    const fontObj = FONT_OPTIONS.find(f => f.id === curFont) || FONT_OPTIONS[0];
    const sizeObj = FONT_SIZE_OPTIONS.find(s => s.id === curSize) || FONT_SIZE_OPTIONS[0];
    const themeObj = THEME_OPTIONS.find(t => t.id === curTheme) || THEME_OPTIONS[0];

    const formatItemDescHtml = (desc) => {
      if (!desc) return '';
      const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        return `<div style="font-weight: 600; color: #0f172a;">${escapeHtml(desc)}</div>`;
      }
      const title = lines[0];
      const specs = lines.slice(1);
      return `
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">${escapeHtml(title)}</div>
        <div class="item-specs" style="font-size: 0.9em; color: #475569; line-height: 1.4; padding-left: 2px;">
          ${specs.map(s => `<span style="display: block; margin-top: 1px;">• ${escapeHtml(s)}</span>`).join('')}
        </div>
      `;
    };

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Popup blocker prevented print window from opening. Please allow popups for this site.');
      return;
    }

    printWin.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Quotation ${quote.id} - ${quote.clientName} - M/S COMPUTER PLANET</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
      @page {
        size: A4 portrait;
        margin: 0; /* Zero margin suppresses browser header timestamps and footer URLs */
      }
      * {
        box-sizing: border-box;
      }
      :root {
        --quote-font: ${fontObj.family};
        --quote-font-size: ${sizeObj.baseSize};
        --quote-line-height: ${sizeObj.lineHeight};
        --quote-tbl-pad: ${sizeObj.tablePadding};
        --quote-hdr-pad: ${sizeObj.headerPadding};
        --quote-primary: ${themeObj.primary};
        --quote-primary-light: ${themeObj.primaryLight};
        --quote-accent: ${themeObj.accent};
        --quote-border: ${themeObj.border};
        --quote-th-bg: ${themeObj.tableHeaderBg};
        --quote-th-color: ${themeObj.tableHeaderText};
      }
      body {
        margin: 0;
        padding: 0;
        background: #f1f5f9;
        font-family: var(--quote-font);
        font-size: var(--quote-font-size);
        line-height: var(--quote-line-height);
        color: #0f172a;
        -webkit-font-smoothing: antialiased;
      }
      .no-print {
        display: block;
      }
      @media screen {
        .print-page {
          max-width: 210mm;
          margin: 20px auto 40px auto;
          background: #ffffff;
          padding: 8mm 10mm;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
      }
      @media print {
        body {
          background: #ffffff !important;
          padding: 0 !important;
          margin: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-page {
          box-shadow: none !important;
          margin: 0 !important;
          border-radius: 0 !important;
          border: none !important;
          max-width: 100% !important;
          width: 100% !important;
          padding: 7mm 9mm !important;
        }
        .avoid-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      }
      body.fit-one-page .print-page {
        padding: 6mm 8mm !important;
      }
      body.fit-one-page .meta-grid {
        margin-bottom: 8px !important;
      }
      body.fit-one-page .item-specs {
        font-size: 8.5pt !important;
      }
      body.fit-one-page table.items th,
      body.fit-one-page table.items td {
        padding: 3.5px 5px !important;
      }
      body.fit-one-page .terms-box {
        margin-top: 8px !important;
        padding: 6px 10px !important;
      }
      body.fit-one-page .footer-sig {
        margin-top: 18px !important;
      }

      .meta-grid { display: flex; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
      .box { border: 1px solid var(--quote-border); padding: 8px 12px; border-radius: 6px; width: 49%; background: #ffffff; }
      .box-title { font-size: 9.5px; text-transform: uppercase; font-weight: 800; color: var(--quote-primary); letter-spacing: 0.5px; margin-bottom: 5px; border-bottom: 1px solid #f1f5f9; padding-bottom: 3px; }
      table.items { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; }
      table.items th, table.items td { border: 1px solid var(--quote-border); padding: var(--quote-tbl-pad); text-align: left; vertical-align: top; }
      table.items th { background: var(--quote-th-bg); color: var(--quote-th-color); font-weight: 700; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.3px; }
      table.items tbody tr:nth-child(even) { background: #f8fafc; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .totals-container { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 8px; gap: 12px; }
      .words-box { width: 50%; border: 1px solid var(--quote-border); padding: 10px; border-radius: 6px; background: #fafafa; }
      .totals-table { width: 48%; border-collapse: collapse; }
      .totals-table td { padding: 4px 8px; font-size: 11px; }
      .grand-total { font-weight: 900; font-size: 13px; border-top: 2px solid var(--quote-primary); border-bottom: 2px solid var(--quote-primary); background: var(--quote-primary-light); color: var(--quote-primary); }
      .terms-box { margin-top: 12px; border: 1px solid var(--quote-border); background: #f8fafc; padding: 10px 12px; border-radius: 6px; font-size: 10px; }
      .terms-title { font-weight: 800; text-transform: uppercase; color: var(--quote-primary); margin-bottom: 4px; font-size: 10px; letter-spacing: 0.5px; }
      .footer-sig { margin-top: 26px; display: flex; justify-content: space-between; align-items: flex-end; }
    </style>
  </head>
  <body class="${curFitOnePage ? 'fit-one-page' : ''}">
    
    <!-- Top Interactive Toolbar (Hidden in Print) -->
    <div class="no-print" style="position: sticky; top: 0; z-index: 10000; background: #0f172a; color: #f8fafc; padding: 10px 16px; border-bottom: 2px solid #3b82f6; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong style="font-size: 12px; letter-spacing: 0.3px; color: #ffffff;">M/S COMPUTER PLANET</strong>
          <span style="color: #64748b;">|</span>
          <span style="font-size: 11px; color: #94a3b8; font-family: monospace; font-weight: bold;">${escapeHtml(quote.id)}</span>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
          <!-- Font Family Selector -->
          <div style="display: flex; align-items: center; gap: 4px;">
            <label for="fontSelect" style="font-size: 11px; font-weight: bold; color: #94a3b8;">Font:</label>
            <select id="fontSelect" style="background: #1e293b; color: #ffffff; border: 1px solid #475569; border-radius: 6px; padding: 3px 6px; font-size: 11px; cursor: pointer; outline: none;">
              ${FONT_OPTIONS.map(f => `<option value="${f.id}" ${f.id === curFont ? 'selected' : ''}>${f.name.split(' (')[0]}</option>`).join('')}
            </select>
          </div>

          <!-- Font Size Selector -->
          <div style="display: flex; align-items: center; gap: 4px;">
            <label for="sizeSelect" style="font-size: 11px; font-weight: bold; color: #94a3b8;">Size:</label>
            <select id="sizeSelect" style="background: #1e293b; color: #ffffff; border: 1px solid #475569; border-radius: 6px; padding: 3px 6px; font-size: 11px; cursor: pointer; outline: none;">
              ${FONT_SIZE_OPTIONS.map(s => `<option value="${s.id}" ${s.id === curSize ? 'selected' : ''}>${s.id === 'compact' ? 'Compact (9.5pt)' : s.id === 'standard' ? 'Standard (10.5pt)' : 'Comfort (12pt)'}</option>`).join('')}
            </select>
          </div>

          <!-- Theme Selector -->
          <div style="display: flex; align-items: center; gap: 4px;">
            <label for="themeSelect" style="font-size: 11px; font-weight: bold; color: #94a3b8;">Theme:</label>
            <select id="themeSelect" style="background: #1e293b; color: #ffffff; border: 1px solid #475569; border-radius: 6px; padding: 3px 6px; font-size: 11px; cursor: pointer; outline: none;">
              ${THEME_OPTIONS.map(t => `<option value="${t.id}" ${t.id === curTheme ? 'selected' : ''}>${t.name.split(' / ')[0]}</option>`).join('')}
            </select>
          </div>

          <!-- Fit 1 Page Checkbox -->
          <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #cbd5e1; cursor: pointer; background: #1e293b; padding: 3px 6px; border-radius: 6px; border: 1px solid #475569;">
            <input type="checkbox" id="fitOnePageCheck" ${curFitOnePage ? 'checked' : ''} style="cursor: pointer; accent-color: #3b82f6;"/>
            <span>Fit 1 Page</span>
          </label>

          <!-- Action buttons -->
          <button onclick="window.print()" style="display: inline-flex; align-items: center; gap: 4px; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; padding: 4px 12px; font-size: 11px; font-weight: bold; cursor: pointer;">
            <span>🖨️ Print / PDF</span>
          </button>

          <button onclick="window.close()" style="background: #334155; color: #cbd5e1; border: none; border-radius: 6px; padding: 4px 10px; font-size: 11px; cursor: pointer;">
            ✕ Close
          </button>
        </div>
      </div>

      <div style="max-width: 1200px; margin: 6px auto 0 auto; padding-top: 4px; border-top: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; font-size: 10.5px; color: #94a3b8;">
        <span>✨ <strong>Clean Mode Active:</strong> Browser date/time headers and URL footers are removed via zero page margins.</span>
        <span>💡 <em>Tip: If date or URL still appears, uncheck "Headers and footers" in print dialog settings.</em></span>
      </div>
    </div>

    <!-- Printable Quotation Container -->
    <div class="print-page">
      ${getCompanyPrintHeaderHtml({
        documentTitle: 'COMMERCIAL PROPOSAL & TECHNICAL ESTIMATE',
        rightBadgeText: quote.id,
        rightBadgeSubtext: 'OFFICIAL QUOTATION'
      })}

      <div class="meta-grid">
        <div class="box">
          <div class="box-title">Client / Recipient Particulars</div>
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${escapeHtml(quote.clientName)}</div>
          ${quote.contactPerson ? `<div style="margin-top: 2px;"><strong>Attn:</strong> ${escapeHtml(quote.contactPerson)}</div>` : ''}
          <div style="margin-top: 2px; color: #334155;">${escapeHtml(quote.clientAddress || 'Silchar, Cachar, Assam')}</div>
          ${quote.clientPhone ? `<div style="margin-top: 2px;"><strong>Phone:</strong> ${escapeHtml(quote.clientPhone)}</div>` : ''}
          ${quote.clientEmail ? `<div style="margin-top: 1px;"><strong>Email:</strong> ${escapeHtml(quote.clientEmail)}</div>` : ''}
          ${quote.clientGst ? `<div style="margin-top: 3px; font-family: monospace;"><strong>GSTIN:</strong> ${escapeHtml(quote.clientGst)}</div>` : ''}
        </div>
        <div class="box">
          <div class="box-title">Proposal & Validity Particulars</div>
          <div><strong>Quotation No:</strong> <span class="font-mono" style="font-weight: 800; color: var(--quote-primary);">${escapeHtml(quote.id)}</span></div>
          <div><strong>Quotation Date:</strong> ${escapeHtml(quote.date)}</div>
          <div><strong>Proposal Validity:</strong> <span style="color: #b45309; font-weight: bold;">Valid until ${escapeHtml(quote.validUntil)}</span></div>
          <div><strong>Service Category:</strong> ${escapeHtml(quote.category)}</div>
          <div><strong>Place of Supply:</strong> ${escapeHtml(quote.placeOfSupply || 'Assam (18)')}</div>
          <div><strong>Tax Classification:</strong> ${isInterState ? 'Inter-State (IGST Applicable)' : 'Intra-State (CGST + SGST Applicable)'}</div>
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
              <td class="text-center font-mono" style="color: #64748b;">${idx + 1}</td>
              <td>${formatItemDescHtml(it.desc)}</td>
              <td class="text-center font-mono">${escapeHtml(it.hsn || '9987')}</td>
              <td class="text-right font-mono" style="font-weight: 600;">${Number(it.qty) || 0}</td>
              <td class="text-center">${escapeHtml(it.unit || 'Nos')}</td>
              <td class="text-right font-mono">${Number(it.rate || 0).toLocaleString('en-IN')}</td>
              <td class="text-right font-mono" style="font-weight: 700;">${((Number(it.qty) || 0) * (Number(it.rate) || 0)).toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals-container avoid-break">
        <div class="words-box">
          <strong style="color: #64748b; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.3px;">Total Estimate in Words:</strong>
          <div style="font-weight: 800; color: #0f172a; margin-top: 3px; font-size: 11px;">${words}</div>
          <div style="margin-top: 8px; font-size: 10px; color: #475569; line-height: 1.4; border-top: 1px dotted var(--quote-border); padding-top: 6px;">
            <strong style="color: #0f172a;">Official Bank Details for Settlement / Advance:</strong><br/>
            Punjab National Bank, Silchar Branch<br/>
            A/C Name: <strong>M/S COMPUTER PLANET</strong> | IFSC: <span class="font-mono">PUNB0074300</span><br/>
            UPI VPA: <span class="font-mono" style="font-weight: 700; color: var(--quote-primary);">8638083712@okbizaxis</span>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dotted var(--quote-border); font-size: 9px; color: #64748b; line-height: 1.35;">
              <strong>1. Regd. Office:</strong> West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007<br/>
              <strong>2. Branch Office:</strong> Maligaon, Guwahati, Assam, Pin - 781011 | <strong>Tel:</strong> +91-8638083712 / 9954493909<br/>
              <strong>Web:</strong> www.mscomputerplanet.com | <strong>Email:</strong> computerplanetpkd@gmail.com
            </div>
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
            <td style="font-weight: 800;">GRAND TOTAL (INCL. GST):</td>
            <td class="text-right font-mono" style="font-size: 14px;">₹${grandTotal.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      ${quote.terms ? `
        <div class="terms-box avoid-break">
          <div class="terms-title">Commercial Terms & Conditions</div>
          <div style="white-space: pre-line; color: #334155; line-height: 1.45;">${escapeHtml(quote.terms)}</div>
        </div>
      ` : ''}

      <div class="footer-sig avoid-break">
        <div style="font-size: 10.5px; color: #64748b;">
          <div>Customer Acceptance / Seal & Signature</div>
          <div style="margin-top: 36px; border-top: 1px dashed #94a3b8; width: 220px; padding-top: 4px;">
            Authorized Representative Signature
          </div>
        </div>
        <div style="text-align: right; font-size: 10.5px; color: #0f172a;">
          <div style="font-weight: 800; color: var(--quote-primary);">For M/S COMPUTER PLANET</div>
          <div style="margin-top: 36px; border-top: 1px dashed #94a3b8; width: 220px; padding-top: 4px; display: inline-block;">
            Authorized Signatory / Enterprise Operations
          </div>
        </div>
      </div>
    </div>

    <script>
      window.onbeforeprint = function() {
        window._origTitle = document.title;
        document.title = '';
      };
      window.onafterprint = function() {
        if (window._origTitle) document.title = window._origTitle;
      };

      const fontSelect = document.getElementById('fontSelect');
      const sizeSelect = document.getElementById('sizeSelect');
      const themeSelect = document.getElementById('themeSelect');
      const fitOnePageCheck = document.getElementById('fitOnePageCheck');

      const FONT_MAP = {
        'Inter': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        'Segoe UI': "'Segoe UI', -apple-system, Tahoma, Geneva, Verdana, sans-serif",
        'Roboto': "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
        'Montserrat': "'Montserrat', 'Segoe UI', sans-serif",
        'Arial': "Arial, Helvetica, sans-serif"
      };

      const SIZE_MAP = {
        'compact': { baseSize: '9.5pt', lineHeight: '1.35', tblPad: '4px 6px', hdrPad: '6px 8px' },
        'standard': { baseSize: '10.5pt', lineHeight: '1.45', tblPad: '6px 8px', hdrPad: '8px 10px' },
        'comfort': { baseSize: '12pt', lineHeight: '1.55', tblPad: '8px 10px', hdrPad: '10px 12px' }
      };

      const THEME_MAP = {
        'tech_blue': { primary: '#1e40af', light: '#eff6ff', accent: '#2563eb', border: '#cbd5e1', thBg: '#1e3a8a', thColor: '#ffffff' },
        'modern_slate': { primary: '#0f172a', light: '#f8fafc', accent: '#334155', border: '#cbd5e1', thBg: '#0f172a', thColor: '#ffffff' },
        'emerald_corp': { primary: '#065f46', light: '#ecfdf5', accent: '#059669', border: '#a7f3d0', thBg: '#064e3b', thColor: '#ffffff' },
        'classic_navy': { primary: '#172554', light: '#f0f9ff', accent: '#0369a1', border: '#bae6fd', thBg: '#172554', thColor: '#ffffff' }
      };

      function applyPreferences() {
        const fVal = fontSelect.value;
        const sVal = sizeSelect.value;
        const tVal = themeSelect.value;
        const fitOne = fitOnePageCheck.checked;

        document.documentElement.style.setProperty('--quote-font', FONT_MAP[fVal] || FONT_MAP['Inter']);

        const sObj = SIZE_MAP[sVal] || SIZE_MAP['compact'];
        document.documentElement.style.setProperty('--quote-font-size', sObj.baseSize);
        document.documentElement.style.setProperty('--quote-line-height', sObj.lineHeight);
        document.documentElement.style.setProperty('--quote-tbl-pad', sObj.tblPad);
        document.documentElement.style.setProperty('--quote-hdr-pad', sObj.hdrPad);

        const tObj = THEME_MAP[tVal] || THEME_MAP['tech_blue'];
        document.documentElement.style.setProperty('--quote-primary', tObj.primary);
        document.documentElement.style.setProperty('--quote-primary-light', tObj.light);
        document.documentElement.style.setProperty('--quote-accent', tObj.accent);
        document.documentElement.style.setProperty('--quote-border', tObj.border);
        document.documentElement.style.setProperty('--quote-th-bg', tObj.thBg);
        document.documentElement.style.setProperty('--quote-th-color', tObj.thColor);

        if (fitOne) {
          document.body.classList.add('fit-one-page');
        } else {
          document.body.classList.remove('fit-one-page');
        }

        try {
          localStorage.setItem('cp_quote_font_family', fVal);
          localStorage.setItem('cp_quote_font_size', sVal);
          localStorage.setItem('cp_quote_theme', tVal);
          localStorage.setItem('cp_quote_fit_one_page', String(fitOne));
        } catch(e) {}
      }

      fontSelect.addEventListener('change', applyPreferences);
      sizeSelect.addEventListener('change', applyPreferences);
      themeSelect.addEventListener('change', applyPreferences);
      fitOnePageCheck.addEventListener('change', applyPreferences);
    </script>
  </body>
</html>`);
    printWin.document.close();
    printWin.focus();
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span>📍 <strong>1. Regd. Office:</strong> West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007</span>
            <span>🏢 <strong>2. Branch Office:</strong> Maligaon, Guwahati, Assam, Pin - 781011</span>
            <span>📞 <strong>Tel:</strong> +91-8638083712 / 9954493909</span>
            <span>🌐 <strong>Web:</strong> <a href="https://www.mscomputerplanet.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.mscomputerplanet.com</a></span>
            <span>✉️ <strong>Email:</strong> <a href="mailto:computerplanetpkd@gmail.com" className="text-blue-600 hover:underline">computerplanetpkd@gmail.com</a></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPrintConfigModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 shadow-sm transition"
            title="Configure Quotation Font Family, Size, and Print Theme"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Font & Print Style</span>
          </button>

          {isAdmin ? (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Quotation</span>
            </button>
          ) : (
            <button
              onClick={() => alert("Access Denied: Creating quotations is restricted to Administrator accounts.")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition shrink-0"
              title="Quotation creation restricted to Administrator"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>New Quotation (Admin Only)</span>
            </button>
          )}
        </div>
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
                    {q.items.map(it => `${it.desc} (${it.qty} ${it.unit || 'Nos'})`).join(' • ')}
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
                    {isAdmin && (
                      q.status !== 'Converted' ? (
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
                      )
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

                    {/* Duplicate, Edit, Delete Buttons */}
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => handleDuplicateQuote(q)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Clone as New Draft Quotation"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleStartEdit(q)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Edit Quotation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteQuote(q.id, q.clientName)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="Delete Quotation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span
                        className="p-1.5 px-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold flex items-center gap-1 border border-slate-200"
                        title="Modifications restricted to Administrator"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px]">Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Quotation Modal */}
      {(showCreateModal || editingQuote) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5">
          <div className={`relative bg-white shadow-2xl border border-slate-200 overflow-y-auto transition-all duration-200 ${
            isModalMaximized 
              ? 'fixed inset-2 sm:inset-4 max-w-none w-auto max-h-[calc(100vh-1rem)] h-[calc(100vh-1rem)] rounded-2xl p-4 sm:p-7 z-50' 
              : 'rounded-3xl max-w-5xl w-full p-5 sm:p-7 max-h-[92vh]'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 sticky top-0 bg-white z-10">
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
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsModalMaximized(!isModalMaximized)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1 text-xs font-semibold"
                  title={isModalMaximized ? "Restore Window Size" : "Maximize Window for Large View"}
                >
                  {isModalMaximized ? (
                    <>
                      <Minimize2 className="w-4 h-4 text-brand-blue" />
                      <span className="hidden sm:inline">Restore</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 text-brand-blue" />
                      <span className="hidden sm:inline">Maximize Window</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingQuote(null);
                    setIsModalMaximized(false);
                  }}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  title="Close Dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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

                <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap sm:flex-nowrap items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      {/* Auto-adjustable & Draggable Description Box */}
                      <div className="flex-1 min-w-[240px]">
                        <textarea
                          required
                          rows={1}
                          placeholder="Description of item / technical scope..."
                          value={item.desc}
                          onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.max(38, e.target.scrollHeight)}px`;
                          }}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = `${Math.max(38, el.scrollHeight)}px`;
                            }
                          }}
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium resize-y min-h-[38px] leading-snug focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                          title="Auto-adjusts height as you type, or drag bottom-right corner to expand"
                        />
                      </div>

                      <div className="w-20 shrink-0">
                        <input
                          type="text"
                          placeholder="HSN/SAC"
                          value={item.hsn}
                          onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white font-mono text-center h-[38px]"
                        />
                      </div>

                      <div className="w-16 shrink-0">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white text-center font-bold h-[38px]"
                        />
                      </div>

                      <div className="w-20 shrink-0">
                        <select
                          value={item.unit || 'Nos'}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full px-1.5 py-2 rounded-lg border border-slate-300 bg-white text-center h-[38px]"
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

                      <div className="w-24 shrink-0">
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Rate ₹"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white text-right font-mono font-bold h-[38px]"
                        />
                      </div>

                      <div className="w-24 shrink-0 text-right font-mono font-bold text-slate-800 text-xs py-2.5">
                        ₹{((Number(item.qty) || 0) * (Number(item.rate) || 0)).toLocaleString('en-IN')}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={form.items.length <= 1}
                        className={`p-2 rounded-lg transition shrink-0 ${
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-600">Commercial Terms & Conditions</label>
                    <span className="text-[10px] text-slate-400">Draggable corner</span>
                  </div>
                  <textarea
                    rows={4}
                    value={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    title="Drag bottom corner to resize"
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-600">Internal Notes / Tender Reference</label>
                    <span className="text-[10px] text-slate-400">Draggable corner</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="e.g. Discussed with branch AGM. Follow up next Monday."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    title="Drag bottom corner to resize"
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

      {/* Quotation Font & Print Style Configuration Modal */}
      {showPrintConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Quotation Typography & Print Theme</h3>
                  <p className="text-xs text-slate-500">Configure font family, font size, and color accents for printed quotes</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintConfigModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              {/* Font Family */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-600" />
                  <span>Font Family (Typography)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FONT_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleUpdatePrintPrefs(f.id, printFontSize, printTheme, printFitOnePage)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        printFontFamily === f.id
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{f.name.split(' (')[0]}</div>
                        <div className="text-[10px] text-slate-400">{f.name.includes('(') ? f.name.split('(')[1].replace(')', '') : 'Standard'}</div>
                      </div>
                      {printFontFamily === f.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Document Font Size & Spacing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SIZE_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleUpdatePrintPrefs(printFontFamily, s.id, printTheme, printFitOnePage)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        printFontSize === s.id
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{s.id === 'compact' ? 'Compact' : s.id === 'standard' ? 'Standard' : 'Comfort'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.baseSize}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Colors */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Color Theme & Table Accent</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleUpdatePrintPrefs(printFontFamily, printFontSize, t.id, printFitOnePage)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        printTheme === t.id
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: t.primary }}></span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{t.name.split(' / ')[0]}</div>
                        <div className="text-[10px] text-slate-400 truncate">{t.name.split(' / ')[1] || 'Corporate'}</div>
                      </div>
                      {printTheme === t.id && <Check className="w-4 h-4 text-blue-600 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Page Fit Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printFitOnePage}
                    onChange={(e) => handleUpdatePrintPrefs(printFontFamily, printFontSize, printTheme, e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Always Optimize to Fit on 1 Page</span>
                    <span className="text-[11px] text-slate-500">Applies compact row padding and suppresses orphaned page breaks for standard IT hardware quotes.</span>
                  </div>
                </label>
              </div>

              {/* Mini Sample Preview */}
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Live Style Preview</div>
                <div
                  className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs"
                  style={{
                    fontFamily: (FONT_OPTIONS.find(f => f.id === printFontFamily) || FONT_OPTIONS[0]).family
                  }}
                >
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <span className="font-bold text-slate-900 text-xs">M/S COMPUTER PLANET</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: (THEME_OPTIONS.find(t => t.id === printTheme) || THEME_OPTIONS[0]).badgeBg,
                        color: (THEME_OPTIONS.find(t => t.id === printTheme) || THEME_OPTIONS[0]).badgeText
                      }}
                    >
                      QT-2026-921
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">Intel Core i5 Desktop PC • 16GB DDR4 • 512GB NVMe SSD</div>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100 text-xs font-mono">
                    <span className="text-slate-500">Total (incl. GST):</span>
                    <span className="font-black text-slate-900">₹39,530</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPrintConfigModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
