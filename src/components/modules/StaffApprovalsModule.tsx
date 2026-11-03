import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  User,
  ShieldCheck,
  FileDown,
  ExternalLink,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { ApprovalRequest, ApprovalStatus, ApprovalType, SriLankanDistrict } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { formatLKR } from '../../services/storageService';

interface StaffApprovalsModuleProps {
  approvals: ApprovalRequest[];
  onReviewApproval: (
    approvalId: string,
    status: 'approved' | 'rejected' | 'changes_requested',
    remarks: string
  ) => void;
}

export const StaffApprovalsModule: React.FC<StaffApprovalsModuleProps> = ({
  approvals,
  onReviewApproval,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState<string>('');

  const filteredApprovals = approvals.filter((req) => {
    const matchesSearch =
      req.reqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.submittedByStaffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.district && req.district.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || req.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenReview = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setReviewRemarks(approval.adminRemarks || '');
  };

  const handleAction = (status: 'approved' | 'rejected' | 'changes_requested') => {
    if (!selectedApproval) return;
    onReviewApproval(
      selectedApproval.id,
      status,
      reviewRemarks || (status === 'approved' ? 'Approved as verified' : 'Declined per standard review')
    );
    setSelectedApproval(null);
  };

  const getUrgencyBadge = (urgency: ApprovalRequest['urgency']) => {
    switch (urgency) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High Priority</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      case 'low':
      default:
        return <Badge variant="neutral">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'changes_requested':
        return <Badge variant="warning">Changes Needed</Badge>;
      case 'pending':
      default:
        return <Badge variant="neutral">Pending Admin Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-blue-600" />
            Staff Proposal & Compliance Approvals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and authorize Construction Rate Proposals, Municipal Building-Rule PDF Submissions, and Content Corrections from staff professionals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            {approvals.filter((a) => a.status === 'pending').length} Submissions Awaiting Decision
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by proposal #, title, staff professional, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Submission Types</option>
            <option value="Construction Rate Proposal">Rate Proposals</option>
            <option value="Building-Rule PDF Submission">Building-Rule PDFs</option>
            <option value="Content Publication Request">Content Publications</option>
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({approvals.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pending ({approvals.filter((a) => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'approved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Approved ({approvals.filter((a) => a.status === 'approved').length})
            </button>
          </div>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Proposal # & Category</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4">Payload Summary</th>
                <th className="py-3 px-4">Status & Urgency</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Proposal # & Type */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block text-xs">
                      {req.reqNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {req.type}
                    </span>
                  </td>

                  {/* Title & snippet */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 truncate" title={req.title}>
                      {req.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5" title={req.details}>
                      {req.details}
                    </div>
                  </td>

                  {/* District */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {req.district || 'National'}
                    </span>
                  </td>

                  {/* Staff */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{req.submittedByStaffName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{req.submittedAt}</div>
                  </td>

                  {/* Specific Payload info */}
                  <td className="py-3.5 px-4 text-[11px]">
                    {req.type === 'Construction Rate Proposal' && req.rateProposalData && (
                      <div>
                        <span className="font-bold text-slate-900 font-mono">
                          Rs. {req.rateProposalData.proposedRateLKR.toLocaleString()}
                        </span>{' '}
                        <span className="text-slate-500">
                          (was Rs. {req.rateProposalData.currentRateLKR.toLocaleString()})
                        </span>
                      </div>
                    )}

                    {req.type === 'Building-Rule PDF Submission' && req.buildingRulePdfData && (
                      <div className="flex items-center gap-1 font-mono text-slate-700">
                        <FileDown className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[140px]">{req.buildingRulePdfData.fileName}</span>
                      </div>
                    )}

                    {req.type === 'Content Publication Request' && (
                      <span className="text-slate-600">Educational Guideline</span>
                    )}
                  </td>

                  {/* Status & Urgency */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(req.status)}
                      {getUrgencyBadge(req.urgency)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenReview(req)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors shadow-xs ${
                        req.status === 'pending'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {req.status === 'pending' ? 'Take Decision' : 'View Audit'}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredApprovals.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No approval requests found matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title={`Review Submission: ${selectedApproval.reqNumber}`}
          subtitle={`${selectedApproval.type} · ${selectedApproval.district || 'National'} District`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {/* Context Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{selectedApproval.title}</span>
                {getStatusBadge(selectedApproval.status)}
              </div>

              <p className="text-slate-700 leading-relaxed text-xs pt-1 border-t border-slate-200/60">
                {selectedApproval.details}
              </p>

              {/* Rate Proposal Payload Card */}
              {selectedApproval.type === 'Construction Rate Proposal' && selectedApproval.rateProposalData && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 mt-2 space-y-1">
                  <div className="font-semibold text-slate-800">
                    Proposed Rate Adjustment for {selectedApproval.rateProposalData.materialName} ({selectedApproval.rateProposalData.unit}):
                  </div>
                  <div className="flex items-baseline gap-3 text-sm font-mono pt-1">
                    <span className="line-through text-slate-400">
                      Rs. {selectedApproval.rateProposalData.currentRateLKR.toLocaleString()}
                    </span>
                    <span className="font-bold text-emerald-700 text-base">
                      Rs. {selectedApproval.rateProposalData.proposedRateLKR.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <strong>Source Documentation:</strong> {selectedApproval.rateProposalData.sourceDocumentation}
                  </div>
                </div>
              )}

              {/* Building-Rule PDF Payload Card */}
              {selectedApproval.type === 'Building-Rule PDF Submission' && selectedApproval.buildingRulePdfData && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 mt-2 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileDown className="h-4 w-4 text-blue-600" />
                    Attached PDF: {selectedApproval.buildingRulePdfData.fileName}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Authority: <strong>{selectedApproval.buildingRulePdfData.authorityName}</strong> · Reference / Gazette: <strong className="font-mono">{selectedApproval.buildingRulePdfData.gazetteOrRefNumber}</strong>
                  </div>
                  <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block font-semibold">
                    Document Type: {selectedApproval.buildingRulePdfData.documentType}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Submitted By</span>
                  <span className="font-semibold">{selectedApproval.submittedByStaffName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Submission Date</span>
                  <span className="font-mono">{selectedApproval.submittedAt}</span>
                </div>
              </div>
            </div>

            {/* Admin Remarks Input */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin Evaluation Remarks / Regulatory Directives *
              </label>
              <textarea
                rows={3}
                placeholder="Enter remarks, regulatory gazette confirmation, or instructions..."
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Previous Review Log */}
            {selectedApproval.reviewedAt && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-[11px] text-blue-900">
                <div className="font-semibold">Audit Record:</div>
                <div>Reviewed by: {selectedApproval.reviewedBy} at {selectedApproval.reviewedAt}</div>
                {selectedApproval.adminRemarks && (
                  <div className="mt-1 italic">"{selectedApproval.adminRemarks}"</div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction('changes_requested')}
                  className="px-3.5 py-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-semibold"
                >
                  Request Clarification
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('rejected')}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold shadow-xs flex items-center gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Proposal
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('approved')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-xs flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve & Enforce
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
