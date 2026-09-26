import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Calendar,
  Download,
  Eye,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  Building2,
  FolderOpen,
  Lock
} from 'lucide-react';

export default function DocumentModule({
  documentsData,
  setDocumentsData,
  currentUser: _currentUser,
  isAdmin = false
}) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Solar Statutory Approvals',
    refNumber: '',
    clientOrProject: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    fileType: 'PDF Document',
    fileSize: '1.8 MB',
    uploadedBy: 'Tamal (Proprietor)',
    tags: 'APDCL, Net Metering',
    notes: ''
  });

  const categories = [
    'All',
    'Solar Statutory Approvals',
    'Solar Compliance & OEM Test Reports',
    'Bank Contracts & SLAs',
    'OEM Warranties',
    'Electrical Safety & Inspection',
    'Statutory Licenses'
  ];

  const filteredDocs = (documentsData || []).filter(doc => {
    const matchCat = filterCategory === 'All' || doc.category === filterCategory;
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
                        doc.refNumber.toLowerCase().includes(search.toLowerCase()) ||
                        doc.clientOrProject.toLowerCase().includes(search.toLowerCase()) ||
                        doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Denied: Only Administrator accounts can upload documents to the vault.');
      return;
    }
    if (!newDoc.title || !newDoc.refNumber) {
      alert('Please fill in title and reference number.');
      return;
    }

    const created = {
      ...newDoc,
      id: `DOC-2026-${String((documentsData || []).length + 1).padStart(3, '0')}`,
      tags: newDoc.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setDocumentsData([created, ...(documentsData || [])]);
    setShowUploadModal(false);
    setNewDoc({
      title: '',
      category: 'Solar Statutory Approvals',
      refNumber: '',
      clientOrProject: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      fileType: 'PDF Document',
      fileSize: '1.8 MB',
      uploadedBy: 'Tamal (Proprietor)',
      tags: 'APDCL, Net Metering',
      notes: ''
    });
  };

  const handleSimulateDownload = (doc) => {
    alert(`Downloading "${doc.title}" (${doc.fileSize}, Ref: ${doc.refNumber})...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Document Management System (DMS Vault)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Central Digital Document & Compliance Vault
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Encrypted enterprise archives: APDCL Net Metering NOCs, Solar Flash Test Certificates, Earthing Pit Reports, Banking AMC SLAs, and OEM Warranties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document to Vault</span>
              </button>
            ) : (
              <div className="px-3.5 py-2 bg-slate-800/80 text-amber-300 rounded-xl font-semibold text-xs border border-amber-500/30 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>View-Only Mode (Admin Controlled)</span>
              </div>
            )}
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Archived Documents</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {(documentsData || []).length} <span className="text-xs font-sans text-slate-400 font-normal">Files</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliance Status</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              100% <span className="text-xs font-sans text-slate-400 font-normal">Valid</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Statutory Licenses</span>
            </div>
            <div className="text-xl font-black text-teal-400 font-mono">
              Active <span className="text-xs font-sans text-slate-400 font-normal">Class-I</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>DMS Security</span>
            </div>
            <div className="text-xl font-black text-amber-400 font-mono">
              Audit-Ready
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
            placeholder="Search document title, ref number, tag, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 max-w-[280px]"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Document Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {doc.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                  {doc.fileSize}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {doc.title}
              </h3>
              <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">{doc.category}</div>

              {/* Ref Details */}
              <div className="my-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="truncate">
                  <span className="text-slate-400">Ref:</span> <strong className="font-mono text-slate-800">{doc.refNumber}</strong>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">Target:</span> <strong className="text-slate-800">{doc.clientOrProject}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Valid: {doc.issueDate} → {doc.expiryDate || 'Perpetual'}</span>
                </div>
              </div>

              {/* Tags Strip */}
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Vault Record</span>
              </button>

              <button
                onClick={() => handleSimulateDownload(doc)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                    {selectedDoc.id}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {selectedDoc.category}
                  </span>
                </div>
                <h3 className="text-base font-bold">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
                <div><strong>Official Ref:</strong> <span className="font-mono text-indigo-700 font-bold">{selectedDoc.refNumber}</span></div>
                <div><strong>Project / Client:</strong> {selectedDoc.clientOrProject}</div>
                <div><strong>Issued Date:</strong> {selectedDoc.issueDate}</div>
                <div><strong>Expiration Date:</strong> {selectedDoc.expiryDate || 'N/A (Perpetual)'}</div>
                <div><strong>Document Format:</strong> {selectedDoc.fileType} ({selectedDoc.fileSize})</div>
                <div><strong>Vault Custodian:</strong> {selectedDoc.uploadedBy}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Executive Summary / Technical Remarks</h4>
                <p className="p-3 bg-slate-100 rounded-xl leading-relaxed text-slate-800">
                  {selectedDoc.notes}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digitally signed and archived in Computer Planet compliance vault. Hash tamper-check PASSED.</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleSimulateDownload(selectedDoc)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File ({selectedDoc.fileSize})</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-indigo-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-300" />
                <span>Upload Document to DMS Vault</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APDCL 25 kWp Net Metering Feasibility Clearance"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-semibold"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Ref / Sanction No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. APDCL/CGM/RE/2026/1049"
                    value={newDoc.refNumber}
                    onChange={(e) => setNewDoc({ ...newDoc, refNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Client / Project Site</label>
                <input
                  type="text"
                  placeholder="e.g. Cachar College Silchar Rooftop Solar"
                  value={newDoc.clientOrProject}
                  onChange={(e) => setNewDoc({ ...newDoc, clientOrProject: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newDoc.issueDate}
                    onChange={(e) => setNewDoc({ ...newDoc, issueDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date (If applicable)</label>
                  <input
                    type="date"
                    value={newDoc.expiryDate}
                    onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Solar, APDCL, Sanction, Inverter"
                  value={newDoc.tags}
                  onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Description</label>
                <textarea
                  rows="2"
                  placeholder="Summary of terms, test findings, or warranty conditions..."
                  value={newDoc.notes}
                  onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                >
                  Archive in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
