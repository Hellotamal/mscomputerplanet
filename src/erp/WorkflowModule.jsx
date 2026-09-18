import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function WorkflowModule({
  workflowApprovals = [],
  setWorkflowApprovals,
  currentUser: _currentUser
}) {
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [actionModalItem, setActionModalItem] = useState(null);
  const [actionDecision, setActionDecision] = useState('Approved');
  const [decisionNotes, setDecisionNotes] = useState('');

  const types = ['All', 'Purchase Order', 'Commercial Discount', 'Field Travel Expense Claim', 'Project Handover Sign-Off'];
  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const filteredApprovals = (workflowApprovals || []).filter(item => {
    const matchType = filterType === 'All' || item.type === filterType;
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.id.toLowerCase().includes(search.toLowerCase()) ||
                        item.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
                        item.refId.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const pendingCount = (workflowApprovals || []).filter(a => a.status === 'Pending').length;
  const approvedCount = (workflowApprovals || []).filter(a => a.status === 'Approved').length;

  const handleExecuteDecision = (e) => {
    e.preventDefault();
    if (!actionModalItem) return;

    const updated = workflowApprovals.map(item => {
      if (item.id === actionModalItem.id) {
        return {
          ...item,
          status: actionDecision,
          approvalDate: new Date().toISOString().split('T')[0],
          approver: 'Tamal (Proprietor)',
          comments: decisionNotes || (actionDecision === 'Approved' ? 'Authorized by management.' : 'Revision requested.')
        };
      }
      return item;
    });

    setWorkflowApprovals(updated);
    setActionModalItem(null);
    setDecisionNotes('');
    alert(`Workflow request ${actionModalItem.id} marked as ${actionDecision}. Notification sent to initiator.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Pillar 15 • Multi-Level Workflow & Governance Approvals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Executive Workflow & Company Approval Center
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Internal governance controls: Purchase Order sign-offs, quotation discount overrides, field expense DA claims, and project handover acceptance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-300">
                {pendingCount} Pending Approvals
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Pending Action</span>
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              {pendingCount} <span className="text-xs font-sans text-slate-400 font-normal">Requests</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approved YTD</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {approvedCount} <span className="text-xs font-sans text-slate-400 font-normal">Signed Off</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Governance Rules</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              Strict Dual-Check
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-teal-400" />
              <span>PO Threshold</span>
            </div>
            <div className="text-xl font-black text-teal-400 font-mono">
              &gt; ₹50,000
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request title, ref ID, employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            {types.map(t => (
              <option key={t} value={t}>{t === 'All' ? 'All Approval Types' : t}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Approvals Feed */}
      <div className="space-y-4">
        {filteredApprovals.map(item => {
          const isPending = item.status === 'Pending';
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPending ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {item.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {item.type}
                  </span>
                  <span className="font-mono text-slate-400 text-xs">Ref: {item.refId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Pending' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <div className="text-xs text-slate-500">
                  Initiator: <strong className="text-slate-700">{item.requestedBy}</strong> • Date: {item.requestDate}
                </div>

                {item.comments && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-1">
                    <strong>Approver Notes:</strong> {item.comments}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Transaction Value</div>
                  <div className="font-mono font-black text-slate-900 text-base">
                    ₹{item.amount?.toLocaleString('en-IN') || 'N/A'}
                  </div>
                </div>

                {isPending ? (
                  <button
                    onClick={() => {
                      setActionModalItem(item);
                      setActionDecision('Approved');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Review & Decide</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-400 font-mono">
                    Signed by {item.approver} ({item.approvalDate})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Modal */}
      {actionModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">{actionModalItem.type} Approval</span>
                <h3 className="font-bold text-base">{actionModalItem.title}</h3>
              </div>
              <button onClick={() => setActionModalItem(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDecision} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-700">
                <div><strong>Ref Number:</strong> <span className="font-mono">{actionModalItem.refId}</span></div>
                <div><strong>Initiated By:</strong> {actionModalItem.requestedBy}</div>
                <div><strong>Amount:</strong> <span className="font-mono font-bold text-slate-900">₹{actionModalItem.amount?.toLocaleString('en-IN')}</span></div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Decision *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActionDecision('Approved')}
                    className={`p-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                      actionDecision === 'Approved'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approve & Authorize</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionDecision('Rejected')}
                    className={`p-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                      actionDecision === 'Rejected'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Reject / Request Revision</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Trail & Approval Notes</label>
                <textarea
                  rows="2"
                  placeholder="Enter remarks or reasoning..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActionModalItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold text-white rounded-xl shadow-md ${
                    actionDecision === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Commit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
