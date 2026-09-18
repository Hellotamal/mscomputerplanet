import React, { useState } from 'react';
import {
  UserCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Download,
  Printer,
  Wrench,
  Clock,
  Briefcase,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function EmployeePortalModule({
  employees = [],
  leaves = [],
  setLeaves,
  payroll = [],
  tickets = [],
  setTickets,
  currentUser
}) {
  // Determine current active employee
  const matchedEmp = employees.find(e => 
    currentUser && (
      e.name.toLowerCase().includes(currentUser.name?.toLowerCase() || '') ||
      currentUser.username?.toLowerCase() === e.role?.toLowerCase()
    )
  ) || employees[0];

  const [activeEmpId, setActiveEmpId] = useState(matchedEmp?.id || 'EMP-001');
  const [activeSubTab, setActiveSubTab] = useState('desk'); // 'desk' | 'field' | 'leaves' | 'payslips'
  const [printPayslip, setPrintPayslip] = useState(null);

  // Attendance Punch State
  const [punchStatus, setPunchStatus] = useState({
    punchedIn: true,
    punchInTime: '09:15 AM',
    location: 'PNB Silchar Circle Office (Branch Duty)',
    punchOutTime: null
  });

  // New Field Duty Claim Form
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldForm, setFieldForm] = useState({
    site: 'PNB Karimganj Main Branch',
    purpose: 'Emergency SMPS & Network Switch Replacement',
    travelDistanceKm: 55,
    daAmount: 650,
    transportMode: 'Two-Wheeler / Bike'
  });

  // New Leave Form
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    days: 1,
    reason: 'Personal family obligation'
  });

  const activeEmp = employees.find(e => e.id === activeEmpId) || employees[0];

  // Employee's assigned tickets
  const myAssignedTickets = tickets.filter(t => 
    activeEmp && t.assignedTo?.toLowerCase().includes(activeEmp.name.split(' ')[0].toLowerCase())
  );

  // Employee's leaves
  const myLeaves = leaves.filter(l => 
    activeEmp && (l.employeeId === activeEmp.id || l.employeeName?.toLowerCase().includes(activeEmp.name.toLowerCase()))
  );

  // Employee's payroll
  const myPayroll = payroll.filter(p => 
    activeEmp && (p.employeeId === activeEmp.id || p.name?.toLowerCase().includes(activeEmp.name.toLowerCase()))
  );

  const handlePunchToggle = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (punchStatus.punchedIn) {
      setPunchStatus({
        ...punchStatus,
        punchedIn: false,
        punchOutTime: timeStr
      });
      alert(`Duty Punch-Out recorded at ${timeStr}. Field log finalized.`);
    } else {
      setPunchStatus({
        punchedIn: true,
        punchInTime: timeStr,
        location: 'Silchar Central Support Depot (Active Geo-Stamp)',
        punchOutTime: null
      });
      alert(`Duty Punch-In recorded at ${timeStr}. You are marked ON DUTY.`);
    }
  };

  const handleCreateLeave = (e) => {
    e.preventDefault();
    const created = {
      id: `LEV-2026-${String(leaves.length + 101)}`,
      employeeId: activeEmp.id,
      employeeName: activeEmp.name,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      days: Number(leaveForm.days),
      reason: leaveForm.reason,
      status: 'Pending Approval'
    };

    setLeaves([created, ...leaves]);
    setShowLeaveModal(false);
    alert(`Leave application ${created.id} submitted for supervisor review.`);
  };

  const handleMarkTicketResolved = (ticketId) => {
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, status: 'Resolved', resolution: 'Hardware inspected & tested on-site by resident engineer.' } : t
    ));
    alert(`Ticket ${ticketId} marked as Resolved!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Pillar 14 • Employee Self-Service Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Staff Portal & Field Operations Hub
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Resident Service Engineers & Technical Staff Self-Service: Geo-attendance punch-in, Field Duty & Daily Allowance (DA) claims, leaves, and salary slips.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePunchToggle}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition ${
                punchStatus.punchedIn 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{punchStatus.punchedIn ? 'Punch Out (End Duty)' : 'Punch In (Start Duty)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Staff Switcher & Quick Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Logged in Employee View:</div>
            <select
              value={activeEmpId}
              onChange={(e) => setActiveEmpId(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.role || 'Staff'}) - {e.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveSubTab('desk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'desk' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Duty Desk</span>
          </button>
          <button
            onClick={() => setActiveSubTab('field')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'field' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Field DA Claims</span>
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'leaves' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leave Balance</span>
          </button>
          <button
            onClick={() => setActiveSubTab('payslips')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'payslips' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Salary Payslips</span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Duty Desk */}
      {activeSubTab === 'desk' && (
        <div className="space-y-6">
          {/* Duty & Attendance Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 text-xs uppercase">Today's Attendance</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  punchStatus.punchedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {punchStatus.punchedIn ? 'ON DUTY' : 'PUNCHED OUT'}
                </span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {punchStatus.punchedIn ? punchStatus.punchInTime : 'Completed'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{punchStatus.location}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 text-xs uppercase">Assigned Service Calls</span>
                <span className="font-mono font-bold text-amber-600 text-xs">SLA Priority</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {myAssignedTickets.filter(t => t.status !== 'Resolved').length} Active
              </div>
              <div className="text-xs text-slate-500">
                {myAssignedTickets.filter(t => t.status === 'Resolved').length} tickets successfully resolved this month.
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="text-xs text-teal-300 font-bold uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Field Travel Reimbursement</span>
              </div>
              <div className="text-sm font-bold">Fast DA & Travel Log</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traveling to Karimganj, Hailakandi, or Badarpur for banking hardware repairs? Submit daily DA claim.
              </p>
              <button
                onClick={() => setShowFieldModal(true)}
                className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                File Field DA Claim
              </button>
            </div>
          </div>

          {/* Assigned Incident Tickets */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>My Assigned Hardware & Service Tickets ({myAssignedTickets.length})</span>
                </h3>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {myAssignedTickets.map(ticket => (
                <div key={ticket.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      <strong className="text-slate-800">{ticket.clientName}</strong>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        ticket.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium">{ticket.description}</div>
                    <div className="text-slate-400 text-[11px]">Reported: {ticket.reportedDate}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {ticket.status === 'Resolved' ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkTicketResolved(ticket.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Field DA Claims */}
      {activeSubTab === 'field' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daily Field Allowance (DA) & Outstation Register</h3>
              <p className="text-xs text-slate-500">Log branch visits across Cachar, Karimganj, and Hailakandi districts.</p>
            </div>
            <button
              onClick={() => setShowFieldModal(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
            >
              + File New Claim
            </button>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    EXP-2026-089
                  </span>
                  <span className="font-mono text-slate-400">2026-09-16</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Under Review
                  </span>
                </div>
                <div className="font-bold text-slate-900">PNB Karimganj Main Branch (55 Km)</div>
                <div className="text-slate-600">Replaced 2 SMPS units and tested WAN backup link. Two-wheeler travel.</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Claimed DA</div>
                <div className="text-base font-black text-slate-900 font-mono">₹2,450</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leaves */}
      {activeSubTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Annual Leave Balances & Requests</h3>
              <p className="text-xs text-slate-500">Casual Leave (CL: 8 remaining), Sick Leave (SL: 6 remaining), Earned Leave (EL: 12 remaining).</p>
            </div>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
            >
              + Apply for Leave
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myLeaves.map(l => (
              <div key={l.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{l.leaveType} ({l.days} Day{l.days > 1 ? 's' : ''})</div>
                  <div className="text-slate-500">Starts: {l.startDate} • Reason: {l.reason}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Salary Payslips */}
      {activeSubTab === 'payslips' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Salary Payslips (PDF Format)</h3>
              <p className="text-xs text-slate-500">Official Computer Planet salary slips with PF, ESI, and statutory deductions.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {myPayroll.map((p, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{p.month || 'August 2026'} Salary Slip</div>
                  <div className="text-slate-500">
                    Basic: ₹{p.basic?.toLocaleString('en-IN')} • HRA: ₹{p.hra?.toLocaleString('en-IN')} • Net: <strong className="text-emerald-700">₹{p.netSalary?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintPayslip(p)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Payslip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {printPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-2xl my-8 text-slate-900 print:m-0 print:p-4 text-xs">
            <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-black uppercase">M/S COMPUTER PLANET</h2>
                <p className="text-slate-500 text-[11px]">Silchar, Assam • Payslip for {printPayslip.month || 'Current Month'}</p>
              </div>
              <div className="text-right">
                <span className="font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                  CONFIDENTIAL
                </span>
                <div className="font-mono text-slate-500 mt-1">Emp ID: {activeEmp.id}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl mb-4">
              <div><strong>Employee Name:</strong> {activeEmp.name}</div>
              <div><strong>Designation:</strong> {activeEmp.role}</div>
              <div><strong>Bank Account:</strong> <span className="font-mono">{activeEmp.bankAccount || 'XXXX-3892'}</span></div>
              <div><strong>PAN:</strong> <span className="font-mono">ABCDE1234F</span></div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Basic Pay:</span>
                <strong className="font-mono">₹{printPayslip.basic?.toLocaleString('en-IN') || '22,000'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>House Rent Allowance (HRA):</span>
                <strong className="font-mono">₹{printPayslip.hra?.toLocaleString('en-IN') || '6,600'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Field Travel & DA Allowance:</span>
                <strong className="font-mono">₹3,400</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 text-rose-700">
                <span>Provident Fund (EPF 12%):</span>
                <strong className="font-mono">-₹2,640</strong>
              </div>
              <div className="flex justify-between py-1.5 bg-slate-100 px-2 rounded-lg font-bold text-sm">
                <span>Net Disbursed Take-Home:</span>
                <strong className="font-mono text-emerald-700">
                  ₹{printPayslip.netSalary?.toLocaleString('en-IN') || '29,360'}
                </strong>
              </div>
            </div>

            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-[11px]">
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">Employee Signature</div>
              </div>
              <div>
                <div className="border-t border-slate-400 pt-1 font-bold">Authorized Signatory</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setPrintPayslip(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Duty Claim Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-300" />
                <span>Submit Field Duty & Travel Claim (DA)</span>
              </h3>
              <button onClick={() => setShowFieldModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Field claim for ${fieldForm.site} (₹${fieldForm.daAmount}) submitted successfully.`);
              setShowFieldModal(false);
            }} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Branch / Site *</label>
                <input
                  type="text"
                  required
                  value={fieldForm.site}
                  onChange={(e) => setFieldForm({ ...fieldForm, site: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  value={fieldForm.purpose}
                  onChange={(e) => setFieldForm({ ...fieldForm, purpose: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Travel Distance (Km)</label>
                  <input
                    type="number"
                    value={fieldForm.travelDistanceKm}
                    onChange={(e) => setFieldForm({ ...fieldForm, travelDistanceKm: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily Allowance / Fuel (₹)</label>
                  <input
                    type="number"
                    value={fieldForm.daAmount}
                    onChange={(e) => setFieldForm({ ...fieldForm, daAmount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFieldModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                  >
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Sick Leave">Sick Leave (SL)</option>
                    <option value="Earned Leave">Earned Leave (EL)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    value={leaveForm.days}
                    onChange={(e) => setLeaveForm({ ...leaveForm, days: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  rows="2"
                  required
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
