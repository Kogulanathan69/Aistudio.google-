import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  ProjectReviewRecord,
  ConstructionProject,
  StaffMember,
  ProjectPlanningStage,
} from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

interface StaffProjectReviewModuleProps {
  currentStaff: StaffMember;
  reviews: ProjectReviewRecord[];
  assignedProjects: ConstructionProject[];
  onAddReview: (reviewData: Omit<ProjectReviewRecord, 'id' | 'reviewDate'>) => void;
  preSelectedProjectId?: string;
}

export const StaffProjectReviewModule: React.FC<StaffProjectReviewModuleProps> = ({
  currentStaff,
  reviews,
  assignedProjects,
  onAddReview,
  preSelectedProjectId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form
  const [targetProjectId, setTargetProjectId] = useState<string>(
    preSelectedProjectId || assignedProjects[0]?.id || ''
  );
  const [stageReviewed, setStageReviewed] = useState<ProjectPlanningStage>(
    '2D Plan Alternatives Review'
  );
  const [reviewStatus, setReviewStatus] = useState<ProjectReviewRecord['reviewStatus']>(
    'Approved'
  );
  const [comments, setComments] = useState('');
  const [udaComplianceChecked, setUdaComplianceChecked] = useState(true);
  const [structuralCheckPassed, setStructuralCheckPassed] = useState(true);
  const [gridAlignmentPassed, setGridAlignmentPassed] = useState(true);
  const [actionItemInput, setActionItemInput] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);

  // Open modal if preSelectedProjectId was passed
  React.useEffect(() => {
    if (preSelectedProjectId) {
      setTargetProjectId(preSelectedProjectId);
    }
  }, [preSelectedProjectId]);

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comments.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.reviewStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddActionItem = () => {
    if (!actionItemInput.trim()) return;
    setActionItems([...actionItems, actionItemInput.trim()]);
    setActionItemInput('');
  };

  const handleRemoveActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = assignedProjects.find((p) => p.id === targetProjectId);
    if (!proj) return;

    onAddReview({
      projectId: proj.id,
      projectCode: proj.code,
      projectTitle: proj.title,
      homeownerId: proj.homeownerId,
      homeownerName: proj.homeownerName,
      reviewerStaffId: currentStaff.id,
      reviewerStaffName: currentStaff.name,
      stageReviewed,
      reviewStatus,
      comments,
      udaComplianceChecked,
      structuralCheckPassed,
      gridAlignmentPassed,
      actionItems,
    });

    setIsModalOpen(false);
    setComments('');
    setActionItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-amber-600" />
            Architectural Project Review Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log milestone reviews, verify UDA building setbacks, column alignments, and issue homeowner action items.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Log Project Review</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search review records by project code, client, or comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses ({reviews.length})</option>
            <option value="Approved">Approved</option>
            <option value="Corrections Requested">Corrections Requested</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Client Input">Awaiting Client Input</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {rev.projectCode}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{rev.projectTitle}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Client: <strong className="text-slate-800">{rev.homeownerName}</strong> • Stage: {rev.stageReviewed}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    rev.reviewStatus === 'Approved'
                      ? 'green'
                      : rev.reviewStatus === 'Corrections Requested'
                      ? 'red'
                      : 'amber'
                  }
                >
                  {rev.reviewStatus}
                </Badge>
                <span className="text-[11px] text-slate-400 font-mono">{rev.reviewDate}</span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
              <div className="flex items-center gap-1.5">
                {rev.udaComplianceChecked ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                )}
                <span>UDA Setback Clearance</span>
              </div>
              <div className="flex items-center gap-1.5">
                {rev.structuralCheckPassed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                )}
                <span>Structural Column Grid</span>
              </div>
              <div className="flex items-center gap-1.5">
                {rev.gridAlignmentPassed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                )}
                <span>Cross-Ventilation & Medamidula</span>
              </div>
            </div>

            {/* Review Comments */}
            <div className="text-xs text-slate-700 bg-blue-50/30 p-3 rounded-lg border border-blue-100/70">
              <span className="font-semibold text-slate-900">Architectural Observations: </span>
              {rev.comments}
            </div>

            {/* Action Items List */}
            {rev.actionItems && rev.actionItems.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400">Required Action Items:</span>
                <div className="flex flex-wrap gap-1.5">
                  {rev.actionItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-400 text-right">
              Reviewed by {rev.reviewerStaffName}
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            No review records found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Log Review Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Log Architectural Project Review"
          subtitle={`Record technical checks & issued corrections for ${currentStaff.name}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Assigned Project *</label>
              <select
                required
                value={targetProjectId}
                onChange={(e) => setTargetProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {assignedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.title} ({p.homeownerName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Planning Stage Reviewed</label>
                <select
                  value={stageReviewed}
                  onChange={(e) => setStageReviewed(e.target.value as ProjectPlanningStage)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Land Assessment & AI Requirements">Land Assessment & AI Requirements</option>
                  <option value="Project Brief Drafted">Project Brief Drafted</option>
                  <option value="Feasibility & Bylaw Clearance">Feasibility & Bylaw Clearance</option>
                  <option value="2D Plan Alternatives Review">2D Plan Alternatives Review</option>
                  <option value="Awaiting Homeowner 2D Confirmation">Awaiting Homeowner 2D Confirmation</option>
                  <option value="Planning Documentation Ready">Planning Documentation Ready</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Outcome Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Approved">Approved (Clear for Next Stage)</option>
                  <option value="Corrections Requested">Corrections Requested</option>
                  <option value="In Progress">In Progress (Technical Audit Ongoing)</option>
                  <option value="Awaiting Client Input">Awaiting Client Input</option>
                </select>
              </div>
            </div>

            {/* Compliance Toggles */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Compliance Verification Checklist</span>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={udaComplianceChecked}
                    onChange={(e) => setUdaComplianceChecked(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>UDA Boundary Setbacks and Maximum Plot Coverage Met</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={structuralCheckPassed}
                    onChange={(e) => setStructuralCheckPassed(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Structural Column Grid Span Feasibility (AIA SL / IESL Standard)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gridAlignmentPassed}
                    onChange={(e) => setGridAlignmentPassed(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Cross-Ventilation and Central Medamidula Airflow Verified</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Review Comments & Architectural Feedback *</label>
              <textarea
                rows={3}
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter technical comments, column dimension notes, or council clearance remarks..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action items */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required Action Items (Optional)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={actionItemInput}
                  onChange={(e) => setActionItemInput(e.target.value)}
                  placeholder="e.g. Adjust Option B living room cantilever by 300mm"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddActionItem();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Add
                </button>
              </div>

              {actionItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {actionItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-200 flex items-center gap-1"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActionItem(idx)}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Log Review
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
