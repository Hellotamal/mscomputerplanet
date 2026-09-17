import React, { useState, useEffect } from 'react';
import { getCompanyPrintHeaderHtml } from '../data/companyLogo';
import { escapeHtml } from './erpSecurity';
import { loadErpData, saveErpData, INITIAL_FIELD_VISITS } from './erpStorage';
import { 
  Users, 
  Calendar, 
  CalendarDays, 
  Plus, 
  Search, 
  Printer, 
  Building2, 
  Phone, 
  MapPin, 
  IndianRupee, 
  Edit2, 
  Trash2, 
  X, 
  Briefcase, 
  Check, 
  Ban, 
  MessageSquare, 
  Navigation, 
  Compass, 
  ExternalLink, 
  RotateCcw
} from 'lucide-react';

export default function HRMSModule({ 
  employees, 
  setEmployees, 
  leaves, 
  setLeaves, 
  payroll, 
  setPayroll,
  currentUser: _currentUser,
  activeSubTab: externalSubTab,
  onSubTabChange
}) {
  const [internalSubTab, setInternalSubTab] = useState('directory');
  const activeSubTab = externalSubTab !== undefined ? externalSubTab : internalSubTab;
  const setActiveSubTab = (tab) => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Search & Filters for Employee Directory
  const [empSearch, setEmpSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [empStatusFilter, setEmpStatusFilter] = useState('All');

  // Search & Filters for Attendance
  const [attendanceSearch, setAttendanceSearch] = useState('');

  // Search & Filters for Field Visits
  const [visitSearch, setVisitSearch] = useState('');
  const [fieldVisits, setFieldVisits] = useState(() => loadErpData("field_visits", INITIAL_FIELD_VISITS));
  useEffect(() => { saveErpData("field_visits", fieldVisits); }, [fieldVisits]);

  // Search & Filters for Leaves
  const [leaveSearch, setLeaveSearch] = useState('');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('All');

  // Search & Filters for Payroll
  const [payrollSearch, setPayrollSearch] = useState('');
  const [payrollStatusFilter, setPayrollStatusFilter] = useState('All');

  // Modals for CRUD
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingAttendanceEmp, setEditingAttendanceEmp] = useState(null);

  const [showVisitModal, setShowVisitModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);

  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);

  const [selectedEmpForQuickStatus, setSelectedEmpForQuickStatus] = useState(null);

  // GPS Field Check-In States
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [selectedEmpForGps, setSelectedEmpForGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [gpsCoords, setGpsCoords] = useState({ lat: null, lng: null, accuracy: null });
  const [gpsBranch, setGpsBranch] = useState('PNB Circle Office Silchar (Club Road)');
  const [gpsActivity, setGpsActivity] = useState('Preventive Hardware AMC Maintenance');
  const [gpsRemarks, setGpsRemarks] = useState('');

  // Form States
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

  const [attendanceForm, setAttendanceForm] = useState({
    todayStatus: 'Present (Head Office)',
    presentDays: 26,
    totalDays: 26,
    fieldVisits: 0,
    leavesTaken: 0,
    remarks: ''
  });

  const [visitForm, setVisitForm] = useState({
    empId: employees[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    branch: 'PNB Circle Office Silchar (Club Road)',
    activity: 'Preventive Hardware AMC Maintenance & SMPS Check',
    coords: '24.8333, 92.7789',
    status: 'Verified On-Site',
    remarks: ''
  });

  const [leaveForm, setLeaveForm] = useState({
    empId: employees[0]?.id || '',
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    days: 1,
    reason: '',
    status: 'Pending'
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

  // -------------------------
  // 1. EMPLOYEE CRUD HANDLERS
  // -------------------------
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

  // -------------------------
  // 2. ATTENDANCE CRUD HANDLERS
  // -------------------------
  const handleStartEditAttendance = (emp) => {
    setEditingAttendanceEmp(emp);
    setAttendanceForm({
      todayStatus: emp.attendance?.todayStatus || 'Present (Head Office)',
      presentDays: emp.attendance?.presentDays || 25,
      totalDays: emp.attendance?.totalDays || 26,
      fieldVisits: emp.attendance?.fieldVisits || 0,
      leavesTaken: emp.attendance?.leavesTaken || 0,
      remarks: ''
    });
    setShowAttendanceModal(true);
  };

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    if (!editingAttendanceEmp) return;

    setEmployees(employees.map(emp => {
      if (emp.id === editingAttendanceEmp.id) {
        return {
          ...emp,
          attendance: {
            ...emp.attendance,
            todayStatus: attendanceForm.todayStatus,
            presentDays: Number(attendanceForm.presentDays) || 0,
            totalDays: Number(attendanceForm.totalDays) || 26,
            fieldVisits: Number(attendanceForm.fieldVisits) || 0,
            leavesTaken: Number(attendanceForm.leavesTaken) || 0
          }
        };
      }
      return emp;
    }));

    setShowAttendanceModal(false);
    setEditingAttendanceEmp(null);
  };

  const handleQuickUpdateStatus = (empId, newStatus) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        const isField = newStatus.includes('Field');
        return {
          ...emp,
          attendance: {
            ...emp.attendance,
            todayStatus: newStatus,
            fieldVisits: isField ? ((emp.attendance?.fieldVisits || 0) + 1) : (emp.attendance?.fieldVisits || 0)
          }
        };
      }
      return emp;
    }));
    setSelectedEmpForQuickStatus(null);
  };

  const handleResetAttendance = (empId, empName) => {
    if (window.confirm(`Reset today's duty status for ${empName} back to "Present (Head Office)"?`)) {
      setEmployees(employees.map(emp => {
        if (emp.id === empId) {
          return {
            ...emp,
            attendance: {
              ...emp.attendance,
              todayStatus: 'Present (Head Office)'
            }
          };
        }
        return emp;
      }));
    }
  };

  // -------------------------
  // 3. FIELD VISITS CRUD HANDLERS
  // -------------------------
  const handleOpenAddVisitModal = () => {
    setEditingVisit(null);
    setVisitForm({
      empId: employees[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      branch: 'PNB Circle Office Silchar (Club Road)',
      activity: 'Preventive Hardware AMC Maintenance & SMPS Check',
      coords: '24.8333, 92.7789',
      status: 'Verified On-Site',
      remarks: ''
    });
    setShowVisitModal(true);
  };

  const handleStartEditVisit = (visit) => {
    setEditingVisit(visit);
    setVisitForm({ ...visit });
    setShowVisitModal(true);
  };

  const handleSaveVisit = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === visitForm.empId);

    if (editingVisit) {
      setFieldVisits(fieldVisits.map(v => v.id === editingVisit.id ? {
        ...visitForm,
        id: editingVisit.id,
        employeeName: emp ? emp.name : editingVisit.employeeName
      } : v));
    } else {
      const newVisit = {
        ...visitForm,
        id: `VST-2026-${Math.floor(100 + Math.random() * 900)}`,
        employeeName: emp ? emp.name : 'Service Staff'
      };
      setFieldVisits([newVisit, ...fieldVisits]);

      // Increment employee's field visit count
      if (emp) {
        setEmployees(employees.map(e => e.id === emp.id ? {
          ...e,
          attendance: {
            ...e.attendance,
            fieldVisits: (e.attendance?.fieldVisits || 0) + 1,
            todayStatus: `Field Duty (${visitForm.branch})`
          }
        } : e));
      }
    }

    setShowVisitModal(false);
    setEditingVisit(null);
  };

  const handleDeleteVisit = (id, branch) => {
    if (window.confirm(`Delete field visit record ${id} for "${branch}"?`)) {
      setFieldVisits(fieldVisits.filter(v => v.id !== id));
    }
  };

  const handlePrintVisitSlip = (visit) => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Field Visit Slip - ${visit.id}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #0f172a; font-size: 12px; line-height: 1.5; }
            .box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin: 15px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; width: 30%; }
          </style>
        </head>
        <body>
          ${getCompanyPrintHeaderHtml({
            documentTitle: `FIELD DUTY & BRANCH VISIT CONFIRMATION: ${escapeHtml(visit.id)}`,
            rightBadgeText: escapeHtml(visit.id),
            rightBadgeSubtext: 'ON-SITE VERIFICATION'
          })}

          <table>
            <tr><th>Visit Reference No</th><td><strong>${escapeHtml(visit.id)}</strong></td></tr>
            <tr><th>Service Engineer</th><td>${escapeHtml(visit.employeeName)} (${escapeHtml(visit.empId)})</td></tr>
            <tr><th>Visit Date & Time</th><td>${escapeHtml(visit.date)} at ${escapeHtml(visit.time)}</td></tr>
            <tr><th>Client / Branch Location</th><td><strong>${escapeHtml(visit.branch)}</strong></td></tr>
            <tr><th>Activity / Work Carried Out</th><td>${escapeHtml(visit.activity)}</td></tr>
            <tr><th>GPS Satellite Coordinates</th><td><span style="font-family: monospace;">${escapeHtml(visit.coords || 'Verified On-Site')}</span></td></tr>
            <tr><th>Duty Status</th><td><span style="font-weight: bold; color: #059669;">${escapeHtml(visit.status)}</span></td></tr>
            <tr><th>Engineer Remarks</th><td>${escapeHtml(visit.remarks || 'Standard on-site preventive checkup and customer verification completed.')}</td></tr>
          </table>

          <div style="margin-top: 50px; display: flex; justify-content: space-between;">
            <div>
              <div>__________________________________</div>
              <div style="font-weight: bold; margin-top: 4px;">Branch In-Charge / Customer Signature</div>
            </div>
            <div style="text-align: right;">
              <div>__________________________________</div>
              <div style="font-weight: bold; margin-top: 4px;">Service Engineer Signature</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  // -------------------------
  // 4. LEAVE CRUD HANDLERS
  // -------------------------
  const handleOpenAddLeaveModal = () => {
    setEditingLeave(null);
    setLeaveForm({
      empId: employees[0]?.id || '',
      leaveType: 'Casual Leave',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      days: 1,
      reason: '',
      status: 'Pending'
    });
    setShowLeaveModal(true);
  };

  const handleStartEditLeave = (leave) => {
    setEditingLeave(leave);
    setLeaveForm({ ...leave });
    setShowLeaveModal(true);
  };

  const handleSaveLeave = (e) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === leaveForm.empId);

    if (editingLeave) {
      setLeaves(leaves.map(l => l.id === editingLeave.id ? {
        ...leaveForm,
        id: editingLeave.id,
        employeeName: emp ? emp.name : editingLeave.employeeName
      } : l));
    } else {
      const newLeave = {
        ...leaveForm,
        id: `LEV-10${leaves.length + 1}`,
        employeeName: emp ? emp.name : 'Staff Member',
        status: leaveForm.status || 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };
      setLeaves([newLeave, ...leaves]);
    }

    setShowLeaveModal(false);
    setEditingLeave(null);
  };

  const handleDeleteLeave = (id, empName) => {
    if (window.confirm(`Are you sure you want to remove leave request ${id} for ${empName}?`)) {
      setLeaves(leaves.filter(l => l.id !== id));
    }
  };

  const handleUpdateLeaveStatus = (leaveId, newStatus) => {
    const leave = leaves.find(l => l.id === leaveId);
    setLeaves(leaves.map(l => l.id === leaveId ? { ...l, status: newStatus } : l));

    // If Approved, update employee's attendance status & leavesTaken
    if (newStatus === 'Approved' && leave) {
      setEmployees(employees.map(emp => {
        if (emp.id === leave.empId) {
          return {
            ...emp,
            attendance: {
              ...emp.attendance,
              todayStatus: 'On Approved Leave',
              leavesTaken: (emp.attendance?.leavesTaken || 0) + (Number(leave.days) || 1),
              presentDays: Math.max(0, (emp.attendance?.presentDays || 26) - (Number(leave.days) || 1))
            }
          };
        }
        return emp;
      }));
    }
  };

  // -------------------------
  // 5. PAYROLL CRUD HANDLERS
  // -------------------------
  const handleOpenAddPayrollModal = () => {
    setEditingPayroll(null);
    setPayrollForm({
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
    setShowPayrollModal(true);
  };

  const handleStartEditPayroll = (p) => {
    setEditingPayroll(p);
    setPayrollForm({ ...p });
    setShowPayrollModal(true);
  };

  const handleSavePayroll = (e) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === payrollForm.empId);

    const basic = Number(payrollForm.basic) || 0;
    const hra = Number(payrollForm.hra) || 0;
    const fieldAllowance = Number(payrollForm.fieldAllowance) || 0;
    const incentive = Number(payrollForm.incentive) || 0;
    const deductions = Number(payrollForm.deductions) || 0;
    const grossSalary = basic + hra + fieldAllowance + incentive;
    const netSalary = grossSalary - deductions;

    if (editingPayroll) {
      setPayroll(payroll.map(p => p.id === editingPayroll.id ? {
        ...payrollForm,
        id: editingPayroll.id,
        employeeName: emp ? emp.name : editingPayroll.employeeName,
        designation: emp ? emp.designation : editingPayroll.designation,
        basic,
        hra,
        fieldAllowance,
        incentive,
        deductions,
        grossSalary,
        netSalary
      } : p));
    } else {
      const record = {
        id: `PAY-${payrollForm.month.replace(/\s+/g, '-').toUpperCase()}-${payroll.length + 1}`,
        empId: payrollForm.empId,
        employeeName: emp ? emp.name : 'Staff Member',
        designation: emp ? emp.designation : 'Staff',
        month: payrollForm.month,
        basic,
        hra,
        fieldAllowance,
        incentive,
        deductions,
        grossSalary,
        netSalary,
        status: payrollForm.status || 'Paid',
        paidDate: new Date().toISOString().split('T')[0],
        paymentMode: payrollForm.paymentMode
      };
      setPayroll([record, ...payroll]);
    }

    setShowPayrollModal(false);
    setEditingPayroll(null);
  };

  const handleDeletePayroll = (id, empName, month) => {
    if (window.confirm(`Delete salary payslip ${id} for ${empName} (${month})?`)) {
      setPayroll(payroll.filter(p => p.id !== id));
    }
  };

  // WhatsApp Salary Slip Advice
  const handleSendPayslipWhatsApp = (p) => {
    const emp = employees.find(e => e.id === p.empId) || {};
    const rawPhone = (emp.phone || '').replace(/[^0-9]/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const message = `*M/S COMPUTER PLANET - SALARY DISBURSEMENT ADVICE*
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Employee:* ${p.employeeName} (${p.empId})
*Designation:* ${p.designation}
*Department:* ${emp.department || 'Banking AMC & IT Infrastructure'}
*Salary Month:* ${p.month}
*Disbursement Date:* ${p.paidDate || 'Today'}
*Payment Mode:* ${p.paymentMode || 'Bank Transfer'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*EARNINGS BREAKDOWN:*
• Basic Salary: Rs. ${p.basic?.toLocaleString('en-IN')}
• House Rent Allowance (HRA): Rs. ${p.hra?.toLocaleString('en-IN')}
• Field Conveyance Allowance: Rs. ${p.fieldAllowance?.toLocaleString('en-IN')}
• Performance / SLA Incentive: Rs. ${p.incentive?.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Gross Total Earnings: Rs. ${p.grossSalary?.toLocaleString('en-IN')}*
*Total Deductions:* -Rs. ${p.deductions?.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*NET SALARY DISBURSED: Rs. ${p.netSalary?.toLocaleString('en-IN')}*
*Payment Status:* ${p.status} (Transferred to Account)
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Bank Name:* ${emp.bankDetails?.bankName || 'Punjab National Bank'}
*Account:* ${emp.bankDetails?.accountNo ? `Ends with ****${emp.bankDetails.accountNo.slice(-4)}` : 'Direct Credit'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    const coordsStr = gpsCoords.lat ? `${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}` : 'Verified On-Site';
    const statusText = `📍 GPS: ${gpsBranch} (${coordsStr}) at ${timeStr}`;

    // 1. Update Employee Attendance
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
              coords: coordsStr,
              time: timeStr,
              date: new Date().toISOString().split('T')[0]
            }
          }
        };
      }
      return emp;
    }));

    // 2. Add to Field Visits Register
    const newVisit = {
      id: `VST-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      empId: selectedEmpForGps.id,
      employeeName: selectedEmpForGps.name,
      branch: gpsBranch,
      activity: gpsActivity,
      coords: coordsStr,
      time: timeStr,
      status: 'GPS Verified On-Site',
      remarks: gpsRemarks || 'On-site branch inspection verified via satellite coordinates.'
    };
    setFieldVisits([newVisit, ...fieldVisits]);

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
            documentTitle: `SALARY PAYSLIP FOR ${escapeHtml(p.month)}`,
            rightBadgeText: escapeHtml(p.empId),
            rightBadgeSubtext: 'CONFIDENTIAL PAYSLIP'
          })}

          <div class="meta-grid">
            <div class="box">
              <div><strong>Employee ID:</strong> ${escapeHtml(p.empId)}</div>
              <div><strong>Employee Name:</strong> ${escapeHtml(p.employeeName)}</div>
              <div><strong>Designation:</strong> ${escapeHtml(p.designation)}</div>
              <div><strong>Department:</strong> ${escapeHtml(emp.department || 'Technical Operations')}</div>
              <div><strong>Circle Coverage:</strong> ${escapeHtml(emp.assignedCircle || 'Silchar Circle')}</div>
            </div>
            <div class="box">
              <div><strong>Payment Date:</strong> ${escapeHtml(p.paidDate || 'N/A')}</div>
              <div><strong>Payment Mode:</strong> ${escapeHtml(p.paymentMode)}</div>
              <div><strong>Bank Name:</strong> ${escapeHtml(emp.bankDetails?.bankName || 'Punjab National Bank')}</div>
              <div><strong>Account No:</strong> ${escapeHtml(emp.bankDetails?.accountNo || 'Direct Transfer')}</div>
              <div><strong>IFSC Code:</strong> ${escapeHtml(emp.bankDetails?.ifsc || 'PUNB0074300')}</div>
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
                <td class="text-right">${Number(p.basic || 0).toLocaleString('en-IN')}</td>
                <td>Provident / Advance Recovery</td>
                <td class="text-right">${Number(p.deductions || 0).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>House Rent Allowance (HRA)</td>
                <td class="text-right">${Number(p.hra || 0).toLocaleString('en-IN')}</td>
                <td>Professional Tax (PT)</td>
                <td class="text-right">₹0</td>
              </tr>
              <tr>
                <td>Field Duty & Conveyance Allowance</td>
                <td class="text-right">${Number(p.fieldAllowance || 0).toLocaleString('en-IN')}</td>
                <td>-</td>
                <td class="text-right">-</td>
              </tr>
              <tr>
                <td>Performance & SLA Incentive</td>
                <td class="text-right">${Number(p.incentive || 0).toLocaleString('en-IN')}</td>
                <td>-</td>
                <td class="text-right">-</td>
              </tr>
              <tr class="total-row">
                <td>Gross Total Earnings</td>
                <td class="text-right">₹${Number(p.grossSalary || 0).toLocaleString('en-IN')}</td>
                <td>Total Deductions</td>
                <td class="text-right">₹${Number(p.deductions || 0).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="net-box">
            <div>
              <strong style="font-size: 14px; color: #15803d;">NET PAYABLE SALARY DISBURSED:</strong>
              <div style="font-size: 11px; color: #4b5563;">Status: ${escapeHtml(p.status)} (Transferred to staff account)</div>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #15803d;">
              ₹${Number(p.netSalary || 0).toLocaleString('en-IN')}
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

  // Filtered lists
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
      e.designation.toLowerCase().includes(empSearch.toLowerCase()) ||
      e.id.toLowerCase().includes(empSearch.toLowerCase()) ||
      (e.assignedCircle && e.assignedCircle.toLowerCase().includes(empSearch.toLowerCase())) ||
      (e.phone && e.phone.includes(empSearch));
    const matchesDept = deptFilter === 'All' || e.department === deptFilter;
    const matchesStatus = empStatusFilter === 'All' || e.status === empStatusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const filteredAttendance = employees.filter(e => {
    return e.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      e.id.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      e.designation.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      (e.attendance?.todayStatus && e.attendance.todayStatus.toLowerCase().includes(attendanceSearch.toLowerCase()));
  });

  const filteredVisits = fieldVisits.filter(v => {
    return v.branch.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.employeeName.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.activity.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.id.toLowerCase().includes(visitSearch.toLowerCase());
  });

  const filteredLeaves = leaves.filter(l => {
    const matchesSearch = l.employeeName.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.reason.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.id.toLowerCase().includes(leaveSearch.toLowerCase());
    const matchesStatus = leaveStatusFilter === 'All' || l.status === leaveStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayroll = payroll.filter(p => {
    const matchesSearch = p.employeeName.toLowerCase().includes(payrollSearch.toLowerCase()) ||
      p.month.toLowerCase().includes(payrollSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(payrollSearch.toLowerCase());
    const matchesStatus = payrollStatusFilter === 'All' || p.status === payrollStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Totals & Metrics
  const totalMonthlyPayroll = employees.reduce((acc, e) => acc + (Number(e.monthlySalary) || 0), 0);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

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
            Staff, Field & HRMS Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Complete management of Employee Profiles, Daily Attendance & Field Duty, Leaves, and Itemized Payroll.
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
            onClick={handleOpenAddLeaveModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Apply Leave</span>
          </button>
          <button
            onClick={handleOpenAddPayrollModal}
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
          <div className="text-xs text-sky-700 font-semibold uppercase tracking-wider">Field Duty Register</div>
          <div className="text-2xl font-black text-sky-900 mt-1 font-mono">
            {fieldVisits.length} Logged
          </div>
          <div className="text-[10px] text-sky-700 mt-0.5">Recorded branch site visits</div>
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
          <span>Daily Attendance ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('field_visits')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'field_visits' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Navigation className="w-4 h-4 text-sky-600" />
          <span>Field Duty Register ({fieldVisits.length})</span>
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

      {/* ======================================================== */}
      {/* SUB TAB 1: EMPLOYEE DIRECTORY (Full Add / Edit / Remove) */}
      {/* ======================================================== */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Search, Dept & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff, designation, circle..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={empStatusFilter}
                onChange={(e) => setEmpStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Probation">Probation</option>
                <option value="Resigned">Resigned</option>
              </select>

              <button
                onClick={() => {
                  resetEmpForm();
                  setShowAddEmpModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
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

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mt-3">
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.assignedCircle || 'Silchar Circle'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Gross: ₹{emp.monthlySalary?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.bankDetails?.bankName || 'Punjab National Bank'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Edit & Remove */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400">
                    Joined: {emp.joiningDate || '2024'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEditEmp(emp)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Employee Profile & Compensation"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmp(emp.id, emp.name)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Remove Employee Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB TAB 2: DAILY ATTENDANCE & DUTY STATUS                */}
      {/* ======================================================== */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff attendance status..."
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartGpsCheckIn()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>📍 GPS Field Check-In</span>
              </button>
            </div>
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
                    <th className="py-3 px-4 text-center">Present / Total Days</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendance.map(emp => (
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
                          emp.attendance?.todayStatus?.includes('Leave') ? 'bg-amber-100 text-amber-800' :
                          emp.attendance?.todayStatus?.includes('Present') ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{emp.attendance?.todayStatus || 'Present (Head Office)'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {emp.attendance?.fieldVisits || 0} visits
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-emerald-700">
                          {emp.attendance?.presentDays ?? 26} / {emp.attendance?.totalDays ?? 26}
                        </span>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${Math.round(((emp.attendance?.presentDays ?? 25) / (emp.attendance?.totalDays ?? 26)) * 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Attendance */}
                          <button
                            onClick={() => handleStartEditAttendance(emp)}
                            className="p-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition border border-teal-200"
                            title="Edit Attendance & Duty Days"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* GPS Check-In for this staff */}
                          <button
                            onClick={() => handleStartGpsCheckIn(emp)}
                            className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition border border-sky-200"
                            title="Satellite GPS Check-in"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Status Toggle */}
                          <button
                            onClick={() => setSelectedEmpForQuickStatus(emp)}
                            className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                            title="Quick Status Preset"
                          >
                            Status
                          </button>

                          {/* Reset Attendance */}
                          <button
                            onClick={() => handleResetAttendance(emp.id, emp.name)}
                            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-500 transition"
                            title="Reset to Present"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
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

      {/* ======================================================== */}
      {/* SUB TAB 3: FIELD DUTY REGISTER (Full Add / Edit / Remove) */}
      {/* ======================================================== */}
      {activeSubTab === 'field_visits' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search branch, engineer, visit ID..."
                value={visitSearch}
                onChange={(e) => setVisitSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddVisitModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Log Field Visit</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Visit ID & Date</th>
                    <th className="py-3 px-4">Engineer</th>
                    <th className="py-3 px-4">Target Branch / Location</th>
                    <th className="py-3 px-4">Work Scope & Activity</th>
                    <th className="py-3 px-4">GPS Coordinates</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                        No field visits found. Click "Log Field Visit" to record on-site engineering.
                      </td>
                    </tr>
                  ) : (
                    filteredVisits.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {v.id}
                          <div className="text-[11px] text-slate-400 font-sans font-normal">
                            {v.date} at {v.time}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{v.employeeName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{v.empId}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sky-900">{v.branch}</div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                          <div>{v.activity}</div>
                          {v.remarks && <div className="text-[11px] text-slate-400 italic mt-0.5">{v.remarks}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {v.coords || 'On-Site Verified'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handlePrintVisitSlip(v)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Print Visit Confirmation Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartEditVisit(v)}
                              className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition"
                              title="Edit Field Visit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVisit(v.id, v.branch)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              title="Delete Field Visit Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB TAB 4: LEAVE MANAGEMENT (Full Add / Edit / Remove)    */}
      {/* ======================================================== */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff, reason, leave ID..."
                value={leaveSearch}
                onChange={(e) => setLeaveSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={leaveStatusFilter}
                onChange={(e) => setLeaveStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Leave Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={handleOpenAddLeaveModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Request Leave</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLeaves.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No leave requests found</p>
                <p className="text-xs text-slate-400 mt-1">Submit a leave request using the button above.</p>
              </div>
            ) : (
              filteredLeaves.map(l => (
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

                  {/* Actions: Approve / Reject / Edit / Delete */}
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
                      <button
                        onClick={() => handleUpdateLeaveStatus(l.id, 'Pending')}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl transition"
                        title="Reset to Pending"
                      >
                        Reset Status
                      </button>
                    )}

                    <button
                      onClick={() => handleStartEditLeave(l)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Leave Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteLeave(l.id, l.employeeName)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Delete Leave Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB TAB 5: PAYROLL & SALARY (Full Add / Edit / Remove)    */}
      {/* ======================================================== */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search staff, month, slip ID..."
                value={payrollSearch}
                onChange={(e) => setPayrollSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={payrollStatusFilter}
                onChange={(e) => setPayrollStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Payroll Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Hold">Hold</option>
              </select>

              <button
                onClick={handleOpenAddPayrollModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Payslip</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPayroll.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <IndianRupee className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No salary payslips found</p>
                <p className="text-xs text-slate-400 mt-1">Generate a monthly payslip using the button above.</p>
              </div>
            ) : (
              filteredPayroll.map(p => (
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

                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp Button */}
                      <button
                        onClick={() => handleSendPayslipWhatsApp(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                        title="Send Salary Slip Advice to Staff WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      {/* Print Button */}
                      <button
                        onClick={() => handlePrintPayslip(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                        title="Print Official Salary Slip with Logo"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Print</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEditPayroll(p)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Edit Salary Slip Figures"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeletePayroll(p.id, p.employeeName, p.month)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        title="Delete Payslip Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT EMPLOYEE                               */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* MODAL: EDIT ATTENDANCE & WORKING DAYS                     */}
      {/* ======================================================== */}
      {showAttendanceModal && editingAttendanceEmp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Attendance: {editingAttendanceEmp.name}
                </h3>
                <p className="text-xs text-slate-400">Update duty status, present days, and field duty counters</p>
              </div>
              <button 
                onClick={() => { setShowAttendanceModal(false); setEditingAttendanceEmp(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Today's Duty Status *</label>
                <select
                  value={attendanceForm.todayStatus}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, todayStatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="Present (Head Office)">Present (Head Office Chincoorie)</option>
                  <option value="Field Duty (PNB Silchar Main)">Field Duty (PNB Silchar Main)</option>
                  <option value="Field Duty (PNB Tarapur Branch)">Field Duty (PNB Tarapur Branch)</option>
                  <option value="Field Duty (PNB Hailakandi Main)">Field Duty (PNB Hailakandi Main)</option>
                  <option value="Field Duty (PNB Karimganj Main)">Field Duty (PNB Karimganj Main)</option>
                  <option value="Field Duty (Barak Solar Installation)">Field Duty (Barak Solar Installation)</option>
                  <option value="On Approved Leave">On Approved Leave</option>
                  <option value="Half Day Field Visit">Half Day Field Visit</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Present Days</label>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    value={attendanceForm.presentDays}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, presentDays: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Working Days</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={attendanceForm.totalDays}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, totalDays: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Field Visits Count</label>
                  <input
                    type="number"
                    min="0"
                    value={attendanceForm.fieldVisits}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, fieldVisits: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leaves Taken</label>
                  <input
                    type="number"
                    min="0"
                    value={attendanceForm.leavesTaken}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, leavesTaken: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAttendanceModal(false); setEditingAttendanceEmp(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: QUICK DUTY STATUS PRESET                           */}
      {/* ======================================================== */}
      {selectedEmpForQuickStatus && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Mark Duty: {selectedEmpForQuickStatus.name}
              </h3>
              <button 
                onClick={() => setSelectedEmpForQuickStatus(null)} 
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
                'Field Duty (PNB Hailakandi Main)',
                'Field Duty (PNB Karimganj Main)',
                'Field Duty (Barak Solar Installation)',
                'On Approved Leave',
                'Half Day Field Visit'
              ].map(status => (
                <button
                  key={status}
                  onClick={() => handleQuickUpdateStatus(selectedEmpForQuickStatus.id, status)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-xs font-semibold text-slate-800 transition"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT FIELD VISIT                            */}
      {/* ======================================================== */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingVisit ? `Edit Field Visit: ${editingVisit.id}` : 'Log New Field Visit Record'}
                </h3>
                <p className="text-xs text-slate-400">Record on-site engineering maintenance at client branches</p>
              </div>
              <button 
                onClick={() => { setShowVisitModal(false); setEditingVisit(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Engineer *</label>
                  <select
                    value={visitForm.empId}
                    onChange={(e) => setVisitForm({ ...visitForm, empId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={visitForm.date}
                    onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time of Visit</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:30 AM"
                    value={visitForm.time}
                    onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Status</label>
                  <select
                    value={visitForm.status}
                    onChange={(e) => setVisitForm({ ...visitForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Verified On-Site">Verified On-Site</option>
                    <option value="GPS Verified On-Site">GPS Verified On-Site</option>
                    <option value="Pending Sign-Off">Pending Sign-Off</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Branch / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PNB Silchar Main Branch"
                  value={visitForm.branch}
                  onChange={(e) => setVisitForm({ ...visitForm, branch: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Scope *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preventive Hardware AMC & Passbook Printer Servicing"
                  value={visitForm.activity}
                  onChange={(e) => setVisitForm({ ...visitForm, activity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Coordinates / Location Reference</label>
                <input
                  type="text"
                  placeholder="e.g. 24.8333, 92.7789"
                  value={visitForm.coords}
                  onChange={(e) => setVisitForm({ ...visitForm, coords: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks & Observations</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Cleaned 6 desktops, replaced ribbon cartridge on printer #2."
                  value={visitForm.remarks}
                  onChange={(e) => setVisitForm({ ...visitForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowVisitModal(false); setEditingVisit(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingVisit ? 'Update Visit' : 'Record Field Visit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT LEAVE                                  */}
      {/* ======================================================== */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingLeave ? `Edit Leave: ${editingLeave.id}` : 'Staff Leave Application'}
                </h3>
                <p className="text-xs text-slate-400">Configure duration, leave type, and justification</p>
              </div>
              <button 
                onClick={() => { setShowLeaveModal(false); setEditingLeave(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeave} className="space-y-3">
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
                    <option value="Earned Leave">Earned Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Days</label>
                  <input
                    type="number"
                    min="1"
                    required
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
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
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
                  placeholder="e.g. Urgent family matter / medical checkup"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                ></textarea>
              </div>

              {editingLeave && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Status</label>
                  <select
                    value={leaveForm.status}
                    onChange={(e) => setLeaveForm({ ...leaveForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowLeaveModal(false); setEditingLeave(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingLeave ? 'Update Leave' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PAYROLL                                */}
      {/* ======================================================== */}
      {showPayrollModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingPayroll ? `Edit Payslip: ${editingPayroll.id}` : 'Generate Monthly Salary Slip'}
                </h3>
                <p className="text-xs text-slate-400">Calculate gross, allowances, deductions, and net salary</p>
              </div>
              <button 
                onClick={() => { setShowPayrollModal(false); setEditingPayroll(null); }} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayroll} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee</label>
                  <select
                    value={payrollForm.empId}
                    onChange={(e) => setPayrollForm({ ...payrollForm, empId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-rose-600 mb-1">Deductions (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={payrollForm.deductions}
                    onChange={(e) => setPayrollForm({ ...payrollForm, deductions: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={payrollForm.status}
                    onChange={(e) => setPayrollForm({ ...payrollForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Hold">Hold</option>
                  </select>
                </div>
              </div>

              {/* Net preview */}
              {(() => {
                const basic = Number(payrollForm.basic) || 0;
                const hra = Number(payrollForm.hra) || 0;
                const field = Number(payrollForm.fieldAllowance) || 0;
                const inc = Number(payrollForm.incentive) || 0;
                const ded = Number(payrollForm.deductions) || 0;
                const net = (basic + hra + field + inc) - ded;
                return (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-emerald-900">Estimated Net Salary:</span>
                      <div className="text-[11px] text-emerald-700">Gross: ₹{(basic + hra + field + inc).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="font-mono font-black text-emerald-800 text-lg">
                      ₹{net.toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPayrollModal(false); setEditingPayroll(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  {editingPayroll ? 'Update Payslip' : 'Disburse & Save Slip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: GPS FIELD CHECK-IN                                */}
      {/* ======================================================== */}
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