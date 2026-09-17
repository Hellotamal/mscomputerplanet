import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml } from './erpSecurity';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  IndianRupee, 
  Building2, 
  SunMedium, 
  Wrench, 
  Users, 
  Package, 
  FileSpreadsheet, 
  Layers,
  ArrowDownToLine,
  HelpCircle
} from 'lucide-react';

export default function ReportsModule({
  invoices = [],
  quotations = [],
  amcContracts = [],
  inventory = [],
  solarProjects = [],
  tickets = [],
  employees = [],
  payroll = [],
  leaves = [],
  clients = [],
  transactions = []
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedReportId, setSelectedReportId] = useState('invoices_master');
  const [search, setSearch] = useState('');

  // Report Definitions
  const reportDefinitions = [
    // Sales & Billing
    {
      id: 'invoices_master',
      title: 'GST Tax Invoices Master Register',
      category: 'sales',
      categoryName: 'Sales & Billing',
      icon: FileText,
      description: 'Comprehensive record of all issued GST tax invoices, taxable amounts, and CGST/SGST/IGST tax breakdowns.',
      getData: () => invoices.map(i => {
        const subtotal = (i.items || []).reduce((acc, it) => acc + (Number(it.qty || 1) * Number(it.rate || 0)), 0);
        const taxRate = Number(i.gstRate || 18);
        const taxAmount = Math.round(subtotal * (taxRate / 100));
        const grandTotal = subtotal + taxAmount;
        return {
          'Invoice No': i.id,
          'Date': i.invoiceDate || 'N/A',
          'Client Name': i.clientName || 'N/A',
          'Place of Supply': i.placeOfSupply || 'Assam (18)',
          'Tax Type': i.taxType === 'intra' ? 'Intra-State (CGST+SGST)' : 'Inter-State (IGST)',
          'Taxable Subtotal (₹)': subtotal,
          'GST Rate': `${taxRate}%`,
          'GST Tax (₹)': taxAmount,
          'Grand Total (₹)': grandTotal,
          'Payment Status': i.status || 'Sent'
        };
      })
    },
    {
      id: 'quotations_pipeline',
      title: 'Commercial Quotations & Estimates',
      category: 'sales',
      categoryName: 'Sales & Billing',
      icon: FileSpreadsheet,
      description: 'Pipeline of drafted, sent, and accepted commercial quotations across IT, Solar, and Security categories.',
      getData: () => quotations.map(q => {
        const subtotal = (q.items || []).reduce((acc, it) => acc + (Number(it.qty || 1) * Number(it.rate || 0)), 0);
        const taxRate = Number(q.gstRate || 18);
        const taxAmount = Math.round(subtotal * (taxRate / 100));
        const grandTotal = subtotal + taxAmount;
        return {
          'Quote ID': q.id,
          'Date': q.date || 'N/A',
          'Client Name': q.clientName || 'N/A',
          'Category': q.category || 'General',
          'Subtotal (₹)': subtotal,
          'Grand Total (₹)': grandTotal,
          'Validity': q.validity || '30 Days',
          'Status': q.status || 'Sent'
        };
      })
    },

    // AMC & Contracts
    {
      id: 'amc_register',
      title: 'Active AMC Contracts Master Sheet',
      category: 'amc',
      categoryName: 'Banking & AMC',
      icon: Building2,
      description: 'All institutional banking and postal computer AMC contracts, branch networks, device counts, and annual values.',
      getData: () => amcContracts.map(a => ({
        'Contract ID': a.id,
        'Client Organization': a.clientName || 'N/A',
        'Managed Branches': a.branchCount || 1,
        'Hardware Device Count': a.deviceCount || 0,
        'Annual AMC Value (₹)': a.annualValue || 0,
        'Start Date': a.startDate || 'N/A',
        'Expiry Date': a.expiryDate || 'N/A',
        'Contract Status': a.status || 'Active',
        'Work Order Reference': a.workOrderRef || 'N/A'
      }))
    },
    {
      id: 'clients_assets',
      title: 'Multi-Client Directory & Hardware Assets Audit',
      category: 'amc',
      categoryName: 'Banking & AMC',
      icon: Layers,
      description: 'Central registry of all enrolled clients categorized by Sales, AMC, Solar, and Service with asset counts.',
      getData: () => clients.map(c => ({
        'Client ID': c.id,
        'Organization Name': c.name || 'N/A',
        'Category': c.category || 'General',
        'Contact Person': c.contactPerson || 'N/A',
        'Phone Number': c.phone || 'N/A',
        'Branches / Sites': c.branchesCount || 1,
        'Hardware Assets': c.assetsCount || 0,
        'Agreement Value (₹)': c.contractValue || 0,
        'Valid Until': c.expiryDate || 'N/A',
        'Status': c.status || 'Active'
      }))
    },

    // Solar Projects
    {
      id: 'solar_master',
      title: 'Solar Rooftop EPC Deployments Master Report',
      category: 'solar',
      categoryName: 'Solar Projects',
      icon: SunMedium,
      description: 'Complete record of installed and commissioning solar projects, capacity (kWp), and net-metering status.',
      getData: () => solarProjects.map(s => ({
        'Project ID': s.id,
        'Client / Site': s.clientName || 'N/A',
        'Capacity (kWp)': s.capacityKw || 0,
        'Plant Type': s.systemType || 'On-Grid',
        'Location': s.location || 'Silchar, Assam',
        'Total Contract Value (₹)': s.totalCost || 0,
        'Project Status': s.status || 'Active',
        'Target Commission Date': s.targetDate || 'N/A'
      }))
    },

    // Service & Incidents
    {
      id: 'tickets_sla',
      title: 'Service Tickets & SLA Turnaround Incident Log',
      category: 'service',
      categoryName: 'Service & Maintenance',
      icon: Wrench,
      description: 'Incident ticket logs, priority SLA response times, assigned resident engineers, and resolution statuses.',
      getData: () => tickets.map(t => ({
        'Ticket ID': t.id,
        'Reported Date': t.reportedDate || 'N/A',
        'Client / Branch': t.clientName || 'N/A',
        'Incident Type': t.type || 'Breakdown',
        'Priority SLA': t.priority || 'Normal',
        'Assigned Engineer': t.assignedTo || 'Unassigned',
        'Current Status': t.status || 'Open',
        'Issue Summary': t.description || 'N/A'
      }))
    },

    // HRMS & Staff
    {
      id: 'payroll_sheet',
      title: 'Staff Payroll & Salary Disbursement Sheet',
      category: 'hrms',
      categoryName: 'Human Resources (HRMS)',
      icon: Users,
      description: 'Staff payroll disbursement records with basic pay, HRA, field allowances, deductions, and payment status.',
      getData: () => payroll.map(p => ({
        'Payslip ID': p.id,
        'Month': p.month || 'N/A',
        'Employee Name': p.employeeName || 'N/A',
        'Designation': p.designation || 'N/A',
        'Basic Salary (₹)': p.basic || 0,
        'HRA Allowance (₹)': p.hra || 0,
        'Field Allowance (₹)': p.allowance || 0,
        'Incentives (₹)': p.incentive || 0,
        'Deductions / PF (₹)': p.deductions || 0,
        'Net Salary Payable (₹)': p.netSalary || 0,
        'Disbursement Status': p.status || 'Pending'
      }))
    },

    // Accounts & Finance
    {
      id: 'transactions_daybook',
      title: 'Accounts Day Book & Business Transaction Register',
      category: 'accounts',
      categoryName: 'Accounts & Finance',
      icon: IndianRupee,
      description: 'Complete double-entry financial day book recording client income receipts, vendor payments, and expense vouchers.',
      getData: () => transactions.map(t => ({
        'Voucher No': t.id,
        'Date': t.date || 'N/A',
        'Type': t.type || 'Expense',
        'Voucher Category': t.category || 'General',
        'Party / Account': t.party || 'N/A',
        'Payment Mode': t.paymentMode || 'Bank Transfer',
        'Ref / UTR No': t.refNo || 'N/A',
        'Amount (₹)': t.amount || 0,
        'GST Tax Component (₹)': t.tax || 0,
        'Narration': t.narration || ''
      }))
    },
    {
      id: 'inventory_valuation',
      title: 'Spares Inventory & Stock Valuation Audit',
      category: 'inventory',
      categoryName: 'Inventory & Spares',
      icon: Package,
      description: 'Computer and solar spare parts stock availability, minimum reorder thresholds, and current stock valuation.',
      getData: () => inventory.map(i => ({
        'Item SKU': i.id,
        'Spare Part Name': i.name || 'N/A',
        'Category': i.category || 'General',
        'Units in Stock': i.stock || 0,
        'Min Buffer Stock': i.minStock || 0,
        'Cost Price (₹)': i.costPrice || 0,
        'Selling Rate (₹)': i.sellPrice || 0,
        'Total Valuation (₹)': (Number(i.stock || 0) * Number(i.sellPrice || 0)),
        'Storage Shelf': i.location || 'Shelf A'
      }))
    }
  ];

  const categories = [
    { id: 'all', name: 'All Report Categories' },
    { id: 'sales', name: 'Sales & Billing' },
    { id: 'amc', name: 'Banking & AMC' },
    { id: 'solar', name: 'Solar Projects' },
    { id: 'service', name: 'Service & Maintenance' },
    { id: 'hrms', name: 'Human Resources (HRMS)' },
    { id: 'accounts', name: 'Accounts & Finance' },
    { id: 'inventory', name: 'Inventory & Spares' }
  ];

  const filteredReports = reportDefinitions.filter(r => {
    return activeCategory === 'all' || r.category === activeCategory;
  });

  const selectedReport = reportDefinitions.find(r => r.id === selectedReportId) || reportDefinitions[0];
  const reportData = selectedReport ? selectedReport.getData() : [];

  // Filter report data based on search input
  const filteredReportData = reportData.filter(row => {
    if (!search.trim()) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  // Download CSV Handler
  const handleDownloadCsv = () => {
    if (filteredReportData.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = Object.keys(filteredReportData[0]);
    const csvRows = [];
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

    filteredReportData.forEach(row => {
      const values = headers.map(h => {
        const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvString);
    downloadAnchor.setAttribute("download", `MCP_${selectedReport.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download JSON Handler
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredReportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MCP_${selectedReport.id}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Print Official PDF Report Handler
  const handlePrintReport = () => {
    if (filteredReportData.length === 0) {
      alert('No data available to print.');
      return;
    }

    const printWindow = window.open('', '_blank');
    const headerHtml = getCompanyPrintHeaderHtml(selectedReport.title.toUpperCase());
    const headers = Object.keys(filteredReportData[0]);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedReport.title} - M/S COMPUTER PLANET</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; font-size: 11px; }
          .report-meta { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin: 15px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
          th { background: #f1f5f9; font-weight: bold; color: #0f172a; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer-sign { margin-top: 40px; display: flex; justify-content: space-between; padding-top: 15px; font-size: 11px; }
        </style>
      </head>
      <body>
        ${headerHtml}
        
        <div class="report-meta">
          <div>
            <strong>Report:</strong> ${escapeHtml(selectedReport.title)} (${escapeHtml(selectedReport.categoryName)})<br>
            <span style="color: #64748b;">Generated from ERP Operations System</span>
          </div>
          <div style="text-align: right;">
            <strong>Generated Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}<br>
            <strong>Total Records:</strong> ${filteredReportData.length} Entries
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredReportData.map((row, idx) => `
              <tr>
                <td>${idx + 1}</td>
                ${headers.map(h => `<td>${escapeHtml(row[h])}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer-sign">
          <div>
            <p style="margin: 0; color: #64748b;">Report Generated by System</p>
            <p style="margin: 30px 0 0 0; font-weight: bold;">Verified by ERP Administrator</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; color: #64748b;">Authorised Signatory</p>
            <p style="margin: 30px 0 0 0; font-weight: bold;">For M/S COMPUTER PLANET</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-blue to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Unified Reports Centre
            </span>
            <span className="text-xs text-slate-300">
              Audit & Spreadsheet Downloads
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            ERP Reports & Downloads Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Access, view, print, and download spreadsheet-ready files across all business categories: 
            <strong> Sales Invoices, AMC Contracts, Solar Deployments, Service Tickets, HRMS Payroll, and Accounts Daybook</strong>.
          </p>
        </div>

        {/* Global Quick Export Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition"
            title="Download Excel Spreadsheet (CSV)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
            title="Print Official PDF with Company Logo"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
            title="Download Raw JSON"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredReports.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReportId === report.id;
          const dataCount = report.getData().length;

          return (
            <div
              key={report.id}
              onClick={() => setSelectedReportId(report.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-2 ring-blue-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {dataCount} Records
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {report.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-400 uppercase text-[10px]">
                  {report.categoryName}
                </span>
                <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                  {isSelected ? 'Active View' : 'Select →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Report Viewer & Interactive Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {selectedReport.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {filteredReportData.length} Rows
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedReport.description}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 flex items-center gap-1 transition"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 transition"
              title="Print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Interactive Responsive Table */}
        <div className="overflow-x-auto max-h-[500px]">
          {filteredReportData.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">#</th>
                  {Object.keys(filteredReportData[0]).map((col) => (
                    <th key={col} className="p-3 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredReportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    {Object.keys(row).map((col) => {
                      const val = row[col];
                      const isMoney = col.includes('₹') || col.includes('Total') || col.includes('Value');
                      return (
                        <td key={col} className={`p-3 whitespace-nowrap ${isMoney ? 'font-mono font-bold text-slate-900' : ''}`}>
                          {val !== undefined && val !== null ? String(val) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs">
              No matching records found for this report filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
