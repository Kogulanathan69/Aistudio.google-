import React, { useState } from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Receipt,
  FileText,
  Filter,
  Calendar,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { ApprovalRequest, StaffMember, ApprovalStatus } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

interface StaffApprovalStatusModuleProps {
  currentStaff: StaffMember;
  myApprovals: ApprovalRequest[];
}

export const StaffApprovalStatusModule: React.FC<StaffApprovalStatusModuleProps> = ({
  currentStaff,
  myApprovals,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);

  const filteredApprovals = myApprovals.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.adminRemarks && req.adminRemarks.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="green">Approved & Integrated</Badge>;
      case 'rejected':
        return <Badge variant="red">Rejected</Badge>;
      case 'changes_requested':
        return <Badge variant="amber">Changes Requested</Badge>;
      case 'pending':
      default:
        return <Badge variant="blue">Pending Admin Review</Badge>;
    }
  };

  const getTypeIcon = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'Construction Rate Proposal':
        return <Receipt className="h-4 w-4 text-emerald-600" />;
      case 'Building-Rule PDF Submission':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'Content Publication Request':
      default:
        return <FileCheck2 className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            My Submitted Proposals & Approval Decisions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking for rate updates, municipal rule PDFs, and content suggestions submitted by {currentStaff.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
            {myApprovals.length} Total Submissions
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-semibold">
            {myApprovals.filter((a) => a.status === 'approved').length} Approved
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals by reference number, title, or feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Decisions ({myApprovals.length})</option>
            <option value="pending">Pending Admin Review</option>
            <option value="approved">Approved & Published</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Request Types</option>
            <option value="Construction Rate Proposal">Construction Rate Proposal</option>
            <option value="Building-Rule PDF Submission">Building-Rule PDF Submission</option>
            <option value="Content Publication Request">Content Publication Request</option>
          </select>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredApprovals.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                  {getTypeIcon(req.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {req.reqNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{req.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Type: <strong className="text-slate-700">{req.type}</strong> • Submitted on {req.submittedAt}
                    {req.district && ` • District: ${req.district}`}
                  </div>
                </div>
              </div>

              <div>{getStatusBadge(req.status)}</div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {req.details}
            </p>

            {/* Admin Decision Feedback Banner */}
            {req.adminRemarks && (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  req.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : req.status === 'changes_requested'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Admin Feedback & Decision:</span>
                  <span className="text-[10px] font-mono opacity-80">
                    Reviewed by {req.reviewedBy || 'Admin Director'} on {req.reviewedAt}
                  </span>
                </div>
                <p className="leading-relaxed">{req.adminRemarks}</p>
              </div>
            )}

            {!req.adminRemarks && req.status === 'pending' && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 italic">
                <Clock className="h-3.5 w-3.5" />
                <span>Currently in Admin review queue. You will receive an operational signal once decided.</span>
              </div>
            )}
          </div>
        ))}

        {filteredApprovals.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            No approval requests found matching your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
