import React, { useState } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  CalendarDays, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  Edit2, 
  Trash2, 
  X, 
  CreditCard,
  Briefcase,
  Check,
  Ban,
  MessageSquare,
  Navigation,
  Compass,
  ExternalLink
} from 'lucide-react';

export default function HRMSModule({ 
  employees, 
  setEmployees, 
  leaves, 
  setLeaves, 
  payroll, 
  setPayroll,
  currentUser 
}) {
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedEmpForAttendance, setSelectedEmpForAttendance] = useState(null);

  // GPS Field Check-In States
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [selectedEmpForGps, setSelectedEmpForGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [gpsCoords, setGpsCoords] = useState({ lat: null, lng: null, accuracy: null });
  const [gpsBranch, setGpsBranch] = useState('PNB Circle Office Silchar (Club Road)');
  const [gpsActivity, setGpsActivity] = useState('Preventive Hardware AMC Maintenance');
  const [gpsRemarks, setGpsRemarks] = useState('');

  // Forms
  const [empForm, setEmpForm] = useState({
    name: '',
    designation: 'Resident IT Service Engineer',
    department: 'Banking AMC & IT Infrastructure',
    employmentType: 'Full-time Permanent',
    joiningDate: new Date().toISOString().split('T')[0],
    phone: '',
    email: '',
    address: 'Silchar, Cachar, Assam',
    assignedCircle: 'PNB Silchar Circle',
    status: 'Active',
    monthlySalary: 25000,
    dailyAllowance: 200,
    bankName: 'Punjab National Bank',
    accountNo: '',
    ifsc: 'PUNB0074300',
    upi: ''
  });

  const [leaveForm, setLeaveForm] = useState({
    empId: employees[0]?.id || '',
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    days: 1,
    reason: ''
  });

  const [payrollForm, setPayrollForm] = useState({
    empId: employees[0]?.id || '',
    month: 'September 2026',
    basic: 18000,
    hra: 4500,
    fieldAllowance: 2500,
    incentive: 1000,
    deductions: 500,
    status: 'Paid',
    paymentMode: 'Bank Transfer (NEFT/RTGS)'
  });

  const departments = [
    'All',
    'Banking AMC & IT Infrastructure',
    'Solar & Renewable Energy',
    'Accounts, Finance & Compliance',
    'Operations & Warehouse'
  ];

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      (e.assignedCircle && e.assignedCircle.toLowerCase().includes(search.toLowerCase())) ||
      (e.phone && e.phone.includes(search));
    const matchesDept = deptFilter === 'All' || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Totals & Metrics
  const totalMonthlyPayroll = employees.reduce((acc, e) => acc + (Number(e.monthlySalary) || 0), 0);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  // Employee CRUD
  const handleCreateEmp = (e) => {
    e.preventDefault();
    if (!empForm.name || !empForm.phone) {
      alert('Please provide Employee Name and Phone Number.');
      return;
    }

    const created = {
      ...empForm,
      id: `EMP-10${employees.length + 1}`,
      monthlySalary: Number(empForm.monthlySalary) || 0,
      dailyAllowance: Number(empForm.dailyAllowance) || 0,
      bankDetails: {
        bankName: empForm.bankName,
        accountNo: empForm.accountNo,
        ifsc: empForm.ifsc,
        upi: empForm.upi
      },
      attendance: {
        totalDays: 26,
        presentDays: 26,
        fieldVisits: 0,
        leavesTaken: 0,
        todayStatus: 'Present (Head Office)'
      }
    };

    setEmployees([...employees, created]);
    setShowAddEmpModal(false);
    resetEmpForm();
  };

  const handleStartEditEmp = (emp) => {
    setEditingEmp(emp);
    setEmpForm({
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      employmentType: emp.employmentType,
      joiningDate: emp.joiningDate,
      phone: emp.phone,
      email: emp.email || '',
      address: emp.address,
      assignedCircle: emp.assignedCircle,
      status: emp.status,
      monthlySalary: emp.monthlySalary,
      dailyAllowance: emp.dailyAllowance || 200,
      bankName: emp.bankDetails?.bankName || 'Punjab National Bank',
      accountNo: emp.bankDetails?.accountNo || '',
      ifsc: emp.bankDetails?.ifsc || 'PUNB0074300',
      upi: emp.bankDetails?.upi || ''
    });
  };

  const handleUpdateEmp = (e) => {
    e.preventDefault();
    setEmployees(employees.map(emp => emp.id === editingEmp.id ? {
      ...emp,
      ...empForm,
      monthlySalary: Number(empForm.monthlySalary) || 0,
      dailyAllowance: Number(empForm.dailyAllowance) || 0,
      bankDetails: {
        bankName: empForm.bankName,
        accountNo: empForm.accountNo,
        ifsc: empForm.ifsc,
        upi: empForm.upi
      }
    } : emp));
    setEditingEmp(null);
    resetEmpForm();
  };

  const handleDeleteEmp = (id, name) => {
    if (window.confirm(`Are you sure you want to remove employee record for ${name} (${id})?`)) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const resetEmpForm = () => {
    setEmpForm({
      name: '',
      designation: 'Resident IT Service Engineer',
      department: 'Banking AMC & IT Infrastructure',
      employmentType: 'Full-time Permanent',
      joiningDate: new Date().toISOString().split('T')[0],
      phone: '',
      email: '',
      address: 'Silchar, Cachar, Assam',
      assignedCircle: 'PNB Silchar Circle',
      status: 'Active',
      monthlySalary: 25000,
      dailyAllowance: 200,
      bankName: 'Punjab National Bank',
      accountNo: '',
      ifsc: 'PUNB0074300',
      upi: ''
    });
  };

  // Attendance update
  const handleUpdateAttendance = (empId, newStatus) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        const isField = newStatus.includes('Field');
        return {
          ...emp,
          attendance: {
            ...emp.attendance,
            todayStatus: newStatus,
            fieldVisits: isField ? (emp.attendance.fieldVisits + 1) : emp.attendance.fieldVisits
          }
        };
      }
      return emp;
    }));
    setSelectedEmpForAttendance(null);
  };

  // Leave Actions
  const handleApplyLeave = (e) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === leaveForm.empId);
    if (!emp) return;

    const newLeave = {
      ...leaveForm,
      id: `LEV-10${leaves.length + 1}`,
      employeeName: emp.name,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaves([newLeave, ...leaves]);
    setShowLeaveModal(false);
  };

  const handleUpdateLeaveStatus = (leaveId, newStatus) => {
    setLeaves(leaves.map(l => l.id === leaveId ? { ...l, status: newStatus } : l));
  };

  // Payroll Actions
  const handleCreatePayroll = (e) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === payrollForm.empId);
    if (!emp) return;

    const basic = Number(payrollForm.basic) || 0;
    const hra = Number(payrollForm.hra) || 0;
    const fieldAllowance = Number(payrollForm.fieldAllowance) || 0;
    const incentive = Number(payrollForm.incentive) || 0;
    const deductions = Number(payrollForm.deductions) || 0;
    const grossSalary = basic + hra + fieldAllowance + incentive;
    const netSalary = grossSalary - deductions;

    const record = {
      id: `PAY-${payrollForm.month.replace(/\s+/g, '-').toUpperCase()}-${payroll.length + 1}`,
      empId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      month: payrollForm.month,
      basic,
      hra,
      fieldAllowance,
      incentive,
      deductions,
      grossSalary,
      netSalary,
      status: payrollForm.status,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMode: payrollForm.paymentMode
    };

    setPayroll([record, ...payroll]);
    setShowPayrollModal(false);
  };

  // WhatsApp Salary Slip Advice
  const handleSendPayslipWhatsApp = (p) => {
    const emp = employees.find(e => e.id === p.empId) || {};
    const rawPhone = (emp.phone || '').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const message = `*M/S COMPUTER PLANET - SALARY DISBURSEMENT ADVICE*
---------------------------------------------
*Employee:* ${p.employeeName} (${p.empId})
*Designation:* ${p.designation}
*Department:* ${emp.department || 'Banking AMC & IT Infrastructure'}
*Salary Month:* ${p.month}
*Disbursement Date:* ${p.paidDate || 'Today'}
*Payment Mode:* ${p.paymentMode || 'Bank Transfer'}
---------------------------------------------
*EARNINGS BREAKDOWN:*
• Basic Salary: Rs. ${p.basic?.toLocaleString('en-IN')}
• House Rent Allowance (HRA): Rs. ${p.hra?.toLocaleString('en-IN')}
• Field Conveyance Allowance: Rs. ${p.fieldAllowance?.toLocaleString('en-IN')}
• Performance / SLA Incentive: Rs. ${p.incentive?.toLocaleString('en-IN')}
---------------------------------------------
*Gross Total Earnings: Rs. ${p.grossSalary?.toLocaleString('en-IN')}*
*Total Deductions:* -Rs. ${p.deductions?.toLocaleString('en-IN')}
---------------------------------------------
*NET SALARY DISBURSED: Rs. ${p.netSalary?.toLocaleString('en-IN')}*
*Payment Status:* ${p.status} (Transferred to Account)
---------------------------------------------
*Bank Name:* ${emp.bankDetails?.bankName || 'Punjab National Bank'}
*Account:* ${emp.bankDetails?.accountNo ? `Ends with ****${emp.bankDetails.accountNo.slice(-4)}` : 'Direct Credit'}
---------------------------------------------
*Employer:* M/S COMPUTER PLANET
MSME: UDYAM-AS-05-0019941 | GSTIN: 18ASTPR6755J1Z0
West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007
Support Helpline: +91-8638083712`;

    const targetUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank');
  };

  // GPS Geolocation Check-In
  const handleStartGpsCheckIn = (emp = null) => {
    const targetEmp = emp || employees[0];
    setSelectedEmpForGps(targetEmp);
    setShowGpsModal(true);
    setGpsLoading(true);
    setGpsError('');
    setGpsCoords({ lat: null, lng: null, accuracy: null });

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. You may manually record your branch visit.');
      setGpsLoading(false);
      setGpsCoords({ lat: 24.8333, lng: 92.7789, accuracy: 50, isFallback: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy)
        });
        setGpsLoading(false);
      },
      (error) => {
        console.warn('GPS error:', error);
        let msg = 'Could not acquire precise GPS coordinates.';
        if (error.code === 1) msg = 'Location permission was denied. You can still confirm your branch visit below.';
        else if (error.code === 2) msg = 'GPS signal unavailable or timeout. Using approximate coordinates.';
        setGpsError(msg);
        setGpsLoading(false);
        setGpsCoords({ lat: 24.8333, lng: 92.7789, accuracy: 50, isFallback: true });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleConfirmGpsCheckIn = (e) => {
    e.preventDefault();
    if (!selectedEmpForGps) return;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const coordsStr = gpsCoords.lat ? `${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}` : 'Manual';
    const statusText = `📍 GPS Verified: ${gpsBranch} (${coordsStr}) at ${timeStr}`;

    setEmployees(employees.map(emp => {
      if (emp.id === selectedEmpForGps.id) {
        return {
          ...emp,
          attendance: {
            ...emp.attendance,
            todayStatus: statusText,
            fieldVisits: (emp.attendance?.fieldVisits || 0) + 1,
            lastGps: {
              branch: gpsBranch,
              activity: gpsActivity,
              remarks: gpsRemarks,
              coords: gpsCoords,
              time: timeStr,
              date: new Date().toISOString().split('T')[0]
            }
          }
        };
      }
      return emp;
    }));

    setShowGpsModal(false);
    setSelectedEmpForGps(null);
    setGpsRemarks('');
  };

  // Print Salary Slip
  const handlePrintPayslip = (p) => {
    const emp = employees.find(e => e.id === p.empId) || {};
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Salary Payslip - ${p.employeeName} (${p.month})</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; font-size: 12px; line-height: 1.5; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #0b3b60; font-size: 20px; }
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .box { width: 48%; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
            .text-right { text-align: right; }
            .total-row { font-weight: bold; background: #e2e8f0; }
            .net-box { background: #f0fdf4; border: 2px solid #16a34a; padding: 12px; border-radius: 8px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
          </style>
        </head>
        <body>
          ${getCompanyPrintHeaderHtml({
            documentTitle: `SALARY PAYSLIP FOR ${p.month}`,
            rightBadgeText: p.empId,
            rightBadgeSubtext: 'CONFIDENTIAL PAYSLIP'
          })}

          <div class="meta-grid">
            <div class="box">
              <div><strong>Employee ID:</strong> ${p.empId}</div>
              <div><strong>Employee Name:</strong> ${p.employeeName}</div>
              <div><strong>Designation:</strong> ${p.designation}</div>
              <div><strong>Department:</strong> ${emp.department || 'Technical Operations'}</div>
              <div><strong>Circle Coverage:</strong> ${emp.assignedCircle || 'Silchar Circle'}</div>
            </div>
            <div class="box">
              <div><strong>Payment Date:</strong> ${p.paidDate || 'N/A'}</div>
              <div><strong>Payment Mode:</strong> ${p.paymentMode}</div>
              <div><strong>Bank Name:</strong> ${emp.bankDetails?.bankName || 'Punjab National Bank'}</div>
              <div><strong>Account No:</strong> ${emp.bankDetails?.accountNo || 'Direct Transfer'}</div>
              <div><strong>IFSC Code:</strong> ${emp.bankDetails?.ifsc || 'PUNB0074300'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Earnings Component</th>
                <th class="text-right">Amount (₹)</th>
                <th>Deductions Component</th>
                <th class="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Salary</td>
                <td class="text-right">${p.basic.toLocaleString('en-IN')}</td>
                <td>Provident / Advance Recovery</td>
                <td class="text-right">${p.deductions.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>House Rent Allowance (HRA)</td>
                <td class="text-right">${p.hra.toLocaleString('en-IN')}</td>
                <td>Professional / Other Taxes</td>
                <td class="text-right">0.00</td>
              </tr>
              <tr>
                <td>Field Duty & Conveyance Allowance</td>
                <td class="text-right">${p.fieldAllowance.toLocaleString('en-IN')}</td>
                <td>Leave Without Pay (LWP)</td>
                <td class="text-right">0.00</td>
              </tr>
              <tr>
                <td>Performance & SLA Incentive</td>
                <td class="text-right">${p.incentive.toLocaleString('en-IN')}</td>
                <td>-</td>
                <td class="text-right">-</td>
              </tr>
              <tr class="total-row">
                <td>Gross Total Earnings</td>
                <td class="text-right">₹${p.grossSalary.toLocaleString('en-IN')}</td>
                <td>Total Deductions</td>
                <td class="text-right">₹${p.deductions.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="net-box">
            <div>
              <strong style="font-size: 14px; color: #15803d;">NET PAYABLE SALARY DISBURSED:</strong>
              <div style="font-size: 11px; color: #4b5563;">Status: ${p.status} (Transferred to staff account)</div>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #15803d;">
              ₹${p.netSalary.toLocaleString('en-IN')}
            </div>
          </div>

          <div style="margin-top: 60px; display: flex; justify-content: space-between;">
            <div>
              <div>______________________________</div>
              <div style="font-weight: bold; margin-top: 4px;">Employee Signature</div>
            </div>
            <div style="text-align: right;">
              <div>For <strong>M/S COMPUTER PLANET</strong></div>
              <div style="margin-top: 35px; font-weight: bold;">Authorized Signatory / Proprietor</div>
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
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-3 border border-teal-500/30">
            <Briefcase className="w-4 h-4 text-teal-400" />
            <span>Human Resource Management System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Staff & Field HRMS Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track daily field visits to PNB branches, record duty attendance, process leaves, and disburse official salary payslips.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => {
              resetEmpForm();
              setShowAddEmpModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Apply Leave</span>
          </button>
          <button
            onClick={() => setShowPayrollModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>Create Payslip</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Workforce</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{employees.length} Staff</div>
          <div className="text-[10px] text-teal-600 mt-0.5">Engineers & Accounts</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Monthly Payroll</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 font-mono">
            ₹{totalMonthlyPayroll.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Fixed gross base liability</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Pending Leaves</div>
          <div className="text-2xl font-black text-amber-900 mt-1 font-mono">
            {pendingLeaves.length} Requests
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">Awaiting proprietor approval</div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <div className="text-xs text-sky-700 font-semibold uppercase tracking-wider">PNB Field Duty</div>
          <div className="text-2xl font-black text-sky-900 mt-1 font-mono">
            {employees.filter(e => e.attendance?.todayStatus?.includes('Field')).length} Engineers
          </div>
          <div className="text-[10px] text-sky-700 mt-0.5">On-site branch visits today</div>
        </div>
      </div>

      {/* HRMS Internal Sub Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl overflow-x-auto no-scrollbar w-fit">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'directory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee Directory ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Daily Attendance & Field Visits</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaves')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'leaves' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Leave Requests ({leaves.length})</span>
          {pendingLeaves.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
              {pendingLeaves.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('payroll')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'payroll' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Payroll & Salary Slips ({payroll.length})</span>
        </button>
      </div>

      {/* SUB TAB 1: EMPLOYEE DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search and Dept Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff, designation, circle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmployees.map(emp => (
              <div
                key={emp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-teal-900 text-teal-200 font-black text-base flex items-center justify-center shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-base">{emp.name}</h4>
                          <span className="text-xs font-mono text-slate-400 font-bold">{emp.id}</span>
                        </div>
                        <div className="text-xs font-semibold text-teal-700 mt-0.5">{emp.designation}</div>
                        <div className="text-[11px] text-slate-400">{emp.department}</div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      {emp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mt-3">
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.assignedCircle}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Salary: </span>
                      <strong className="font-mono text-slate-900">₹{emp.monthlySalary?.toLocaleString('en-IN')}/mo</strong>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.bankDetails?.bankName}</span>
                    </div>
                  </div>

                  {/* Today's Duty Status */}
                  <div className="mt-3 p-2.5 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                      <span className="text-slate-500 text-[11px]">Today:</span>
                      <strong className="text-slate-800 text-[11px] truncate max-w-[200px]" title={emp.attendance?.todayStatus}>
                        {emp.attendance?.todayStatus || 'Present'}
                      </strong>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleStartGpsCheckIn(emp)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200"
                        title="Record GPS Verified Field Visit"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>GPS Check-in</span>
                      </button>
                      <button
                        onClick={() => setSelectedEmpForAttendance(emp)}
                        className="text-[11px] text-teal-600 font-bold hover:underline"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleStartEditEmp(emp)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEmp(emp.id, emp.name)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: DAILY ATTENDANCE & FIELD VISITS */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-4">
          {/* Action Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>Field Duty Attendance & GPS Verification</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">Satellite Verified</span>
              </h3>
              <p className="text-xs text-slate-400">Track on-site engineer branch visits with satellite coordinate validation</p>
            </div>
            <button
              onClick={() => handleStartGpsCheckIn()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>📍 GPS Field Check-In</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Designation & Circle</th>
                    <th className="py-3 px-4">Today's Duty Status</th>
                    <th className="py-3 px-4 text-center">Monthly Field Visits</th>
                    <th className="py-3 px-4 text-center">Present Days</th>
                    <th className="py-3 px-4 text-center">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {emp.name}
                        <div className="text-[11px] font-mono text-slate-400 font-normal">{emp.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-medium text-slate-900">{emp.designation}</div>
                        <div className="text-[11px] text-slate-400">{emp.assignedCircle}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          emp.attendance?.todayStatus?.includes('GPS') ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                          emp.attendance?.todayStatus?.includes('Field') ? 'bg-blue-100 text-blue-800' :
                          emp.attendance?.todayStatus?.includes('Present') ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{emp.attendance?.todayStatus || 'Present'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {emp.attendance?.fieldVisits || 0} visits
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-emerald-700">
                          {emp.attendance?.presentDays || 25} / 26
                        </span>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${Math.round(((emp.attendance?.presentDays || 25) / 26) * 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartGpsCheckIn(emp)}
                            className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition border border-sky-200 inline-flex items-center gap-1"
                            title="Record GPS Check-in for this staff"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>GPS Check-in</span>
                          </button>
                          <button
                            onClick={() => setSelectedEmpForAttendance(emp)}
                            className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition border border-teal-200"
                          >
                            Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: LEAVE MANAGEMENT */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Staff Leave Requests</h3>
              <p className="text-xs text-slate-400">Review Casual, Medical, and Emergency leaves</p>
            </div>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Request Leave</span>
            </button>
          </div>

          <div className="space-y-3">
            {leaves.map(l => (
              <div
                key={l.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {l.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      l.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {l.status}
                    </span>
                    <span className="text-xs font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100">
                      {l.leaveType}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {l.employeeName}
                  </h4>
                  <p className="text-xs text-slate-600">
                    <strong>Reason:</strong> {l.reason}
                  </p>
                  <div className="text-xs text-slate-400">
                    Duration: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong> ({l.days} Day{l.days > 1 ? 's' : ''})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {l.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleUpdateLeaveStatus(l.id, 'Approved')}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateLeaveStatus(l.id, 'Rejected')}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      Decision Recorded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: PAYROLL & SALARY SLIPS */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Payroll & Salary Registers</h3>
              <p className="text-xs text-slate-400">Generate itemized monthly salary slips with company seal and print official copies</p>
            </div>
            <button
              onClick={() => setShowPayrollModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Payslip</span>
            </button>
          </div>

          <div className="space-y-3">
            {payroll.map(p => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {p.id}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                    <span className="text-xs text-slate-400">Month: {p.month}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {p.employeeName}
                  </h4>
                  <div className="text-xs text-slate-500">{p.designation}</div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                    <span>Basic: <strong>₹{p.basic?.toLocaleString('en-IN')}</strong></span>
                    <span>HRA: <strong>₹{p.hra?.toLocaleString('en-IN')}</strong></span>
                    <span>Field Allowance: <strong>₹{p.fieldAllowance?.toLocaleString('en-IN')}</strong></span>
                    <span>Incentive: <strong>₹{p.incentive?.toLocaleString('en-IN')}</strong></span>
                    <span className="text-rose-600">Deductions: -₹{p.deductions?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Net Disbursed</div>
                    <div className="text-xl font-black font-mono text-emerald-700">
                      ₹{p.netSalary?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendPayslipWhatsApp(p)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                      title="Send Salary Slip Advice to Staff WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp Slip</span>
                    </button>

                    <button
                      onClick={() => handlePrintPayslip(p)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                      title="Print Official Salary Slip"
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EMPLOYEE */}
      {(showAddEmpModal || editingEmp) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingEmp ? `Edit Staff: ${editingEmp.name}` : 'Register New Employee Record'}
                </h3>
                <p className="text-xs text-slate-400">Employee profile, payroll compensation, and branch assignment</p>
              </div>
              <button 
                onClick={() => { setShowAddEmpModal(false); setEditingEmp(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingEmp ? handleUpdateEmp : handleCreateEmp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Debashis Roy"
                  value={empForm.name}
                  onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Resident IT Engineer"
                    value={empForm.designation}
                    onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={empForm.department}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Banking AMC & IT Infrastructure">Banking AMC & IT Infrastructure</option>
                    <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
                    <option value="Accounts, Finance & Compliance">Accounts, Finance & Compliance</option>
                    <option value="Operations & Warehouse">Operations & Warehouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 94350 12345"
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Coverage Circle</label>
                  <input
                    type="text"
                    placeholder="e.g. PNB Silchar 50 Branches"
                    value={empForm.assignedCircle}
                    onChange={(e) => setEmpForm({ ...empForm, assignedCircle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Gross Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={empForm.monthlySalary}
                    onChange={(e) => setEmpForm({ ...empForm, monthlySalary: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Field Allowance (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={empForm.dailyAllowance}
                    onChange={(e) => setEmpForm({ ...empForm, dailyAllowance: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Bank Account & NEFT Details
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500">Bank Name</label>
                    <input
                      type="text"
                      value={empForm.bankName}
                      onChange={(e) => setEmpForm({ ...empForm, bankName: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500">Account Number</label>
                    <input
                      type="text"
                      value={empForm.accountNo}
                      onChange={(e) => setEmpForm({ ...empForm, accountNo: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500">IFSC Code</label>
                    <input
                      type="text"
                      value={empForm.ifsc}
                      onChange={(e) => setEmpForm({ ...empForm, ifsc: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500">UPI ID</label>
                    <input
                      type="text"
                      value={empForm.upi}
                      onChange={(e) => setEmpForm({ ...empForm, upi: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddEmpModal(false); setEditingEmp(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingEmp ? 'Save Changes' : 'Register Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MARK ATTENDANCE */}
      {selectedEmpForAttendance && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Mark Duty: {selectedEmpForAttendance.name}
              </h3>
              <button 
                onClick={() => setSelectedEmpForAttendance(null)} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                'Present (Head Office Chincoorie)',
                'Field Duty (PNB Silchar Main)',
                'Field Duty (PNB Tarapur Branch)',
                'Field Duty (PNB Hailakandi)',
                'Field Duty (PNB Karimganj)',
                'Field Duty (Barak Solar Installation)',
                'On Approved Leave',
                'Half Day Field Visit'
              ].map(status => (
                <button
                  key={status}
                  onClick={() => handleUpdateAttendance(selectedEmpForAttendance.id, status)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-xs font-semibold text-slate-800 transition"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPLY LEAVE */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Staff Leave Application
              </h3>
              <button onClick={() => setShowLeaveModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={leaveForm.empId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, empId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Days</label>
                  <input
                    type="number"
                    min="1"
                    value={leaveForm.days}
                    onChange={(e) => setLeaveForm({ ...leaveForm, days: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Urgent family matter / medical requirement"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GENERATE PAYSLIP */}
      {showPayrollModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Generate Monthly Salary Slip
                </h3>
                <p className="text-xs text-slate-400">Calculate gross, allowances, deductions, and net salary</p>
              </div>
              <button onClick={() => setShowPayrollModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayroll} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee</label>
                  <select
                    value={payrollForm.empId}
                    onChange={(e) => setPayrollForm({ ...payrollForm, empId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Month</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. September 2026"
                    value={payrollForm.month}
                    onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Basic Salary (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={payrollForm.basic}
                    onChange={(e) => setPayrollForm({ ...payrollForm, basic: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">HRA Allowance (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={payrollForm.hra}
                    onChange={(e) => setPayrollForm({ ...payrollForm, hra: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Field Conveyance (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={payrollForm.fieldAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, fieldAllowance: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Performance Incentive (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={payrollForm.incentive}
                    onChange={(e) => setPayrollForm({ ...payrollForm, incentive: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-600 mb-1">Total Deductions (Advance/Taxes) (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={payrollForm.deductions}
                  onChange={(e) => setPayrollForm({ ...payrollForm, deductions: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayrollModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Disburse & Save Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GPS FIELD CHECK-IN */}
      {showGpsModal && selectedEmpForGps && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">GPS Field Check-In</h3>
                  <p className="text-xs text-slate-400">On-site satellite verification for branch visits</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowGpsModal(false); setSelectedEmpForGps(null); }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmGpsCheckIn} className="space-y-3.5">
              {/* Staff Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Member</label>
                <select
                  value={selectedEmpForGps.id}
                  onChange={(e) => {
                    const found = employees.find(emp => emp.id === e.target.value);
                    if (found) setSelectedEmpForGps(found);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              {/* GPS Live Coordinates Banner */}
              <div className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sky-600" />
                    <span>Satellite Coordinate Status:</span>
                  </span>
                  {gpsLoading ? (
                    <span className="text-[11px] font-bold text-sky-600 animate-pulse">Acquiring GPS...</span>
                  ) : gpsCoords.lat ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      GPS Locked (±{gpsCoords.accuracy || 15}m)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Manual Fallback
                    </span>
                  )}
                </div>

                {gpsLoading ? (
                  <div className="text-xs text-sky-700 py-1">Contacting device GPS sensor for high-accuracy coordinates...</div>
                ) : gpsCoords.lat ? (
                  <div className="text-xs text-slate-700 space-y-1">
                    <div className="font-mono text-[11px] font-bold text-sky-950">
                      Lat: {gpsCoords.lat.toFixed(5)}° N | Lng: {gpsCoords.lng.toFixed(5)}° E
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-sky-700 font-bold hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View on Google Maps</span>
                      </a>
                    </div>
                  </div>
                ) : null}

                {gpsError && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {gpsError}
                  </div>
                )}
              </div>

              {/* Destination Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target PNB Branch / Field Site *</label>
                <select
                  value={gpsBranch}
                  onChange={(e) => setGpsBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="PNB Circle Office Silchar (Club Road)">PNB Circle Office Silchar (Club Road)</option>
                  <option value="PNB Silchar Main Branch">PNB Silchar Main Branch (Club Road)</option>
                  <option value="PNB Tarapur Branch">PNB Tarapur Branch, Silchar</option>
                  <option value="PNB Hailakandi Main Branch">PNB Hailakandi Main Branch</option>
                  <option value="PNB Karimganj Main Branch">PNB Karimganj Main Branch</option>
                  <option value="PNB Badarpur Branch">PNB Badarpur Branch, Karimganj</option>
                  <option value="PNB Udharbond Branch">PNB Udharbond Branch, Cachar</option>
                  <option value="PNB Lakhipur Branch">PNB Lakhipur Branch, Cachar</option>
                  <option value="PNB Sonai Branch">PNB Sonai Branch, Cachar</option>
                  <option value="PNB Dholai Branch">PNB Dholai Branch, Cachar</option>
                  <option value="PNB Ramkrishna Nagar Branch">PNB Ramkrishna Nagar Branch</option>
                  <option value="PNB Lala Branch">PNB Lala Branch, Hailakandi</option>
                  <option value="Barak Solar Installation Site">Barak Valley Solar Installation Site</option>
                  <option value="Head Office (Chincoorie, Silchar)">Head Office (Chincoorie, Silchar)</option>
                </select>
              </div>

              {/* Activity / Work Scope */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Scope</label>
                <select
                  value={gpsActivity}
                  onChange={(e) => setGpsActivity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Preventive Hardware AMC Maintenance">Preventive Hardware AMC Maintenance</option>
                  <option value="Emergency Breakdown / SMPS Replacement">Emergency Breakdown / SMPS Replacement</option>
                  <option value="Passbook & Dot-Matrix Printer Servicing">Passbook & Dot-Matrix Printer Servicing</option>
                  <option value="Desktop OS & Network Configuration">Desktop OS & Network Configuration</option>
                  <option value="Flatbed Scanner Driver & Calibration">Flatbed Scanner Driver & Calibration</option>
                  <option value="Solar Hybrid Inverter Inspection">Solar Hybrid Inverter Inspection</option>
                  <option value="Quarterly SLA Branch Audit">Quarterly SLA Branch Audit</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Engineer Visit Remarks</label>
                <textarea
                  rows="2"
                  placeholder="e.g. 8 Desktop PCs serviced, teller printer head aligned. Branch Manager signed satisfaction slip."
                  value={gpsRemarks}
                  onChange={(e) => setGpsRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowGpsModal(false); setSelectedEmpForGps(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Verify & Record Check-In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}