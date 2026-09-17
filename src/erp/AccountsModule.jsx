import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml } from './erpSecurity';
import { 
  IndianRupee, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Trash2, 
  Edit2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Calendar, 
  CheckCircle2, 
  X, 
  Building2, 
  CreditCard, 
  Wallet, 
  FileText, 
  Send, 
  TrendingUp, 
  TrendingDown,
  ShieldCheck,
  AlertCircle
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

const INCOME_CATEGORIES = [
  'AMC Revenue',
  'Hardware Sales',
  'Solar Project Milestone',
  'Service & Repairs Revenue',
  'Retail Counter Cash',
  'Bank Interest & Other Receipts'
];

const EXPENSE_CATEGORIES = [
  'Inventory & Spares Procurement',
  'Staff Salaries & Wages',
  'Engineer Travel & Field DA',
  'Office Rent & Premises',
  'Electricity & Utilities',
  'Internet & Telecom',
  'Statutory Tax Payment (GST)',
  'Freight, Courier & Logistics',
  'Office Refreshment & Consumables',
  'Bank Charges & Fees'
];

const CONTRA_CATEGORIES = [
  'Petty Cash Withdrawal',
  'Cash Deposit to Bank',
  'Inter-Bank Transfer'
];

const PAYMENT_MODES = [
  'Bank Transfer (NEFT)',
  'Bank Transfer (RTGS)',
  'Bank Transfer (IMPS)',
  'UPI',
  'Cheque Clearance',
  'Cash',
  'Net Banking (Challan)'
];

export default function AccountsModule({ transactions = [], setTransactions, currentUser }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Form State
  const [txForm, setTxForm] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Income',
    voucherType: 'Receipt Voucher',
    category: 'AMC Revenue',
    party: '',
    amount: 10000,
    paymentMode: 'Bank Transfer (NEFT)',
    refNo: '',
    tax: 0,
    narration: ''
  });

  // Calculate Balances
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const netMargin = totalIncome - totalExpense;

  const totalTaxCollected = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, t) => acc + (Number(t.tax) || 0), 0);

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = typeFilter === 'All' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch = 
      (t.party || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.narration || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.refNo || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const handleOpenAdd = (defaultType = 'Income') => {
    const nextId = `VCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    setTxForm({
      id: nextId,
      date: new Date().toISOString().split('T')[0],
      type: defaultType,
      voucherType: defaultType === 'Income' ? 'Receipt Voucher' : defaultType === 'Expense' ? 'Payment Voucher' : 'Contra Voucher',
      category: defaultType === 'Income' ? INCOME_CATEGORIES[0] : defaultType === 'Expense' ? EXPENSE_CATEGORIES[0] : CONTRA_CATEGORIES[0],
      party: '',
      amount: 5000,
      paymentMode: 'Bank Transfer (NEFT)',
      refNo: '',
      tax: 0,
      narration: ''
    });
    setEditingTx(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTx(tx);
    setTxForm({ ...tx });
    setShowAddModal(true);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!txForm.party.trim()) {
      alert('Please specify the Party / Account name.');
      return;
    }
    if (Number(txForm.amount) <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }

    const updatedTx = {
      ...txForm,
      amount: Number(txForm.amount) || 0,
      tax: Number(txForm.tax) || 0
    };

    if (editingTx) {
      setTransactions(transactions.map(t => t.id === editingTx.id ? updatedTx : t));
    } else {
      setTransactions([updatedTx, ...transactions]);
    }
    setShowAddModal(false);
  };

  const handleDeleteTransaction = (id, refParty) => {
    if (confirm(`Are you sure you want to delete transaction "${id}" (${refParty})?`)) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  // Print Official Payment / Receipt Voucher
  const handlePrintVoucher = (tx) => {
    const printWindow = window.open('', '_blank');
    const headerHtml = getCompanyPrintHeaderHtml(tx.voucherType.toUpperCase());

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${tx.voucherType} - ${tx.id}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 25px; color: #1e293b; font-size: 13px; line-height: 1.6; }
          .voucher-box { border: 2px solid #0f172a; border-radius: 8px; padding: 20px; }
          .meta-row { display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 12px; }
          .amount-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 15px; margin: 15px 0; font-size: 16px; font-weight: bold; }
          .words { color: #475569; font-style: italic; font-size: 12px; margin-top: 4px; }
          .footer-sign { margin-top: 60px; display: flex; justify-content: space-between; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="voucher-box">
          ${headerHtml}
          
          <div class="meta-row">
            <div>
              <strong>Voucher No:</strong> <span style="font-family: monospace; font-weight: bold;">${escapeHtml(tx.id)}</span><br>
              <strong>Voucher Type:</strong> ${escapeHtml(tx.voucherType)} (${escapeHtml(tx.type)})
            </div>
            <div style="text-align: right;">
              <strong>Date:</strong> ${escapeHtml(tx.date)}<br>
              <strong>Payment Mode:</strong> ${escapeHtml(tx.paymentMode)}
            </div>
          </div>

          <p><strong>${tx.type === 'Income' ? 'Received with thanks from:' : 'Paid to:'}</strong> <span style="font-size: 15px; font-weight: bold;">${escapeHtml(tx.party)}</span></p>
          <p><strong>Ledger Category:</strong> ${escapeHtml(tx.category)}</p>
          ${tx.refNo ? `<p><strong>Reference / Cheque / UTR No:</strong> <span style="font-family: monospace;">${escapeHtml(tx.refNo)}</span></p>` : ''}

          <div class="amount-box">
            Amount: <span style="color: #059669; font-size: 18px;">₹${Number(tx.amount || 0).toLocaleString('en-IN')}</span>
            <div class="words">In Words: ${numberToIndianWords(Number(tx.amount || 0))}</div>
          </div>

          <p><strong>Narration / Details:</strong><br>${escapeHtml(tx.narration || 'General commercial transaction logged in ERP accounts register.')}</p>

          <div class="footer-sign">
            <div>
              <p style="margin: 0; color: #64748b; font-size: 11px;">Receiver's Signature</p>
              <p style="margin: 35px 0 0 0; font-weight: bold;">Signature & Date</p>
            </div>
            <div>
              <p style="margin: 0; color: #64748b; font-size: 11px;">Prepared By</p>
              <p style="margin: 35px 0 0 0; font-weight: bold;">Accounts Department</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; color: #64748b; font-size: 11px;">Authorised Signatory</p>
              <p style="margin: 35px 0 0 0; font-weight: bold;">For M/S COMPUTER PLANET</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // WhatsApp Payment Advice
  const handleSendWhatsApp = (tx) => {
    const text = `*M/S COMPUTER PLANET - TRANSACTION ADVICE*
---------------------------------------------
*Voucher No:* ${tx.id}
*Date:* ${tx.date}
*Type:* ${tx.type} (${tx.category})
*Party / Account:* ${tx.party}
*Amount:* ₹${Number(tx.amount || 0).toLocaleString('en-IN')}
*Payment Mode:* ${tx.paymentMode}
${tx.refNo ? `*Ref / UTR No:* ${tx.refNo}\n` : ''}---------------------------------------------
*Narration:*
${tx.narration || 'Payment entry registered in ERP.'}
---------------------------------------------
*M/S COMPUTER PLANET*
West Kachudharam, Chincoorie, Silchar
Banking IT AMC, Spares & Solar EPC`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-blue to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Commercial Bookkeeping
            </span>
            <span className="text-xs text-slate-300">
              Double-Entry Day Book & Vouchers
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Accounts & Financial Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Track all business inflows and outflows: 
            <strong> AMC quarterly payments, solar milestone advances, vendor spares purchases, engineer travel DA, office rent, and statutory taxes</strong>.
          </p>
        </div>

        {/* Quick Voucher Add Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenAdd('Income')}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Receipt (Inflow)</span>
          </button>

          <button
            onClick={() => handleOpenAdd('Expense')}
            className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>- Payment (Outflow)</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Inflow / Receipts</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            ₹{totalIncome.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {transactions.filter(t => t.type === 'Income').length} Client Settlements Logged
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Total Outflow / Expenses</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Vendor, Payroll, DA & Rent
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 text-xs font-bold uppercase">Operating Surplus / Balance</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${netMargin >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            ₹{netMargin.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {netMargin >= 0 ? 'Net Operating Cash Margin' : 'Deficit in Current Period'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 text-xs font-bold uppercase">GST Tax Collected</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 font-mono">
            ₹{totalTaxCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Output Tax on B2B & Bank Invoices
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by party name, narration, voucher ID, or UTR/cheque reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['All', 'Income', 'Expense', 'Contra'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-lg transition ${
                    typeFilter === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Categories</option>
              <optgroup label="Income Ledgers">
                {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="Expense Ledgers">
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="Contra Ledgers">
                {CONTRA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Day Book Register */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Day Book & Financial Transactions ({filteredTransactions.length})
            </h2>
            <p className="text-xs text-slate-500">
              Chronological log of verified financial vouchers with print and WhatsApp dispatch.
            </p>
          </div>

          <button
            onClick={() => handleOpenAdd('Income')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-slate-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Voucher</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Voucher & Date</th>
                  <th className="p-3.5">Type & Ledger</th>
                  <th className="p-3.5">Party / Account</th>
                  <th className="p-3.5">Payment Mode & Ref</th>
                  <th className="p-3.5 text-right">Amount (₹)</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'Income';
                  const isExpense = tx.type === 'Expense';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 font-mono text-xs">{tx.id}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{tx.date}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] ${
                            isIncome ? 'bg-emerald-100 text-emerald-800' :
                            isExpense ? 'bg-rose-100 text-rose-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {isIncome ? <ArrowDownLeft className="w-3 h-3" /> : isExpense ? <ArrowUpRight className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                            <span>{tx.voucherType}</span>
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 mt-1">{tx.category}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-xs">{tx.party}</div>
                        {tx.narration && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5" title={tx.narration}>
                            {tx.narration}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-800 text-xs">{tx.paymentMode}</div>
                        {tx.refNo ? (
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-[140px]" title={tx.refNo}>
                            Ref: {tx.refNo}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Direct Entry</div>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className={`text-sm font-black font-mono ${
                          isIncome ? 'text-emerald-700' : isExpense ? 'text-rose-600' : 'text-blue-700'
                        }`}>
                          {isIncome ? '+' : isExpense ? '-' : ''}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                        </div>
                        {tx.tax > 0 && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            GST: ₹{Number(tx.tax).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handlePrintVoucher(tx)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="Print Official Voucher / Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(tx)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Send WhatsApp Advice"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(tx)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id, tx.party)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <div className="text-xs font-bold text-slate-600">No transactions found</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Try changing your filters or log a new voucher above.</div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingTx ? `Edit Transaction Voucher — ${editingTx.id}` : 'Record New Accounts Voucher'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type Select */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Income', label: 'Income (Receipt)', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
                  { id: 'Expense', label: 'Expense (Payment)', color: 'border-rose-500 text-rose-700 bg-rose-50' },
                  { id: 'Contra', label: 'Contra (Transfer)', color: 'border-blue-500 text-blue-700 bg-blue-50' }
                ].map((typeOption) => (
                  <button
                    key={typeOption.id}
                    type="button"
                    onClick={() => {
                      setTxForm({
                        ...txForm,
                        type: typeOption.id,
                        voucherType: typeOption.id === 'Income' ? 'Receipt Voucher' : typeOption.id === 'Expense' ? 'Payment Voucher' : 'Contra Voucher',
                        category: typeOption.id === 'Income' ? INCOME_CATEGORIES[0] : typeOption.id === 'Expense' ? EXPENSE_CATEGORIES[0] : CONTRA_CATEGORIES[0]
                      });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      txForm.type === typeOption.id
                        ? `${typeOption.color} ring-2 ring-slate-900/10`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {typeOption.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Voucher Number</label>
                  <input
                    type="text"
                    required
                    value={txForm.id}
                    onChange={(e) => setTxForm({ ...txForm, id: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={txForm.date}
                    onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ledger Category</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {txForm.type === 'Income' && INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    {txForm.type === 'Expense' && EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    {txForm.type === 'Contra' && CONTRA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={txForm.paymentMode}
                    onChange={(e) => setTxForm({ ...txForm, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {txForm.type === 'Income' ? 'Received From (Client / Entity) *' : 'Paid To (Vendor / Employee / Party) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Punjab National Bank, CompuTech Guwahati, Rahul Barman"
                    value={txForm.party}
                    onChange={(e) => setTxForm({ ...txForm, party: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="0.00"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                  <div className="text-[10px] text-slate-500 mt-1 italic">
                    {numberToIndianWords(Number(txForm.amount || 0))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GST Tax Component (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={txForm.tax}
                    onChange={(e) => setTxForm({ ...txForm, tax: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Included in amount (if applicable)</div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reference / UTR / Cheque No.</label>
                  <input
                    type="text"
                    placeholder="e.g. NEFT/PNB/Q2/88219, CHQ-449102"
                    value={txForm.refNo}
                    onChange={(e) => setTxForm({ ...txForm, refNo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Narration / Remarks</label>
                  <textarea
                    rows="2"
                    placeholder="Purpose, invoice reference, or payment breakdown..."
                    value={txForm.narration}
                    onChange={(e) => setTxForm({ ...txForm, narration: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                >
                  {editingTx ? 'Save Changes' : 'Record Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
