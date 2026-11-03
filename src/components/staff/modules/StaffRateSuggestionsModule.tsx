import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  FileText,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  ConstructionRate,
  StaffMember,
  ApprovalRequest,
  SriLankanDistrict,
} from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { formatLKR } from '../../../services/storageService';

interface StaffRateSuggestionsModuleProps {
  currentStaff: StaffMember;
  rates: ConstructionRate[];
  myApprovals: ApprovalRequest[];
  onSubmitRateProposal: (params: {
    materialName: string;
    proposedRateLKR: number;
    currentRateLKR: number;
    unit: string;
    district: SriLankanDistrict;
    sourceDoc: string;
    reason: string;
  }) => void;
}

export const StaffRateSuggestionsModule: React.FC<StaffRateSuggestionsModuleProps> = ({
  currentStaff,
  rates,
  myApprovals,
  onSubmitRateProposal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(rates[0]?.name || '');
  const [district, setDistrict] = useState<SriLankanDistrict>(currentStaff.assignedDistrict);
  const [unit, setUnit] = useState<string>(rates[0]?.unit || '50kg bag');
  const [currentRateLKR, setCurrentRateLKR] = useState<number>(rates[0]?.baseRateLKR || 2350);
  const [proposedRateLKR, setProposedRateLKR] = useState<number>(2450);
  const [sourceDoc, setSourceDoc] = useState('');
  const [reason, setReason] = useState('');

  // When selected material changes, update default unit and current rate
  const handleMaterialChange = (materialName: string) => {
    setSelectedMaterial(materialName);
    const existing = rates.find((r) => r.name === materialName && r.district === district);
    if (existing) {
      setCurrentRateLKR(existing.baseRateLKR);
      setUnit(existing.unit);
      setProposedRateLKR(Math.round(existing.baseRateLKR * 1.05));
    }
  };

  const handleDistrictChange = (newDistrict: SriLankanDistrict) => {
    setDistrict(newDistrict);
    const existing = rates.find((r) => r.name === selectedMaterial && r.district === newDistrict);
    if (existing) {
      setCurrentRateLKR(existing.baseRateLKR);
      setUnit(existing.unit);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !proposedRateLKR || !sourceDoc || !reason) return;

    onSubmitRateProposal({
      materialName: selectedMaterial,
      proposedRateLKR: Number(proposedRateLKR),
      currentRateLKR: Number(currentRateLKR),
      unit,
      district,
      sourceDoc,
      reason,
    });

    setIsModalOpen(false);
    setSourceDoc('');
    setReason('');
  };

  const myRateProposals = myApprovals.filter(
    (a) => a.type === 'Construction Rate Proposal' && a.submittedByStaffId === currentStaff.id
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            Construction Rate Proposals (LKR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suggest updated material or skilled trade rates reflecting field market price shifts in your assigned district.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Propose New Rate</span>
        </button>
      </div>

      {/* Governance Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Review Workflow Invariant:</strong> Staff cannot approve their own rates or publish rates directly. All submitted proposals are queued for Admin Director review in the Admin Staff Approvals console. Once approved, the platform rate schedule automatically updates.
        </div>
      </div>

      {/* My Submitted Proposals List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          My Submitted Rate Proposals ({myRateProposals.length})
        </h3>

        {myRateProposals.map((proposal) => {
          const rateData = proposal.rateProposalData;
          return (
            <div
              key={proposal.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {proposal.reqNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{proposal.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    District: <strong>{proposal.district}</strong> • Submitted: {proposal.submittedAt}
                  </div>
                </div>

                <Badge
                  variant={
                    proposal.status === 'approved'
                      ? 'green'
                      : proposal.status === 'rejected'
                      ? 'red'
                      : 'amber'
                  }
                >
                  {proposal.status === 'approved' ? 'Approved & Published' : proposal.status}
                </Badge>
              </div>

              {rateData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Item Name</span>
                    <div className="font-bold text-slate-800">{rateData.materialName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Current Rate</span>
                    <div className="font-semibold text-slate-600 line-through">
                      Rs. {rateData.currentRateLKR.toLocaleString()}/{rateData.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Proposed Rate</span>
                    <div className="font-bold text-emerald-700">
                      Rs. {rateData.proposedRateLKR.toLocaleString()}/{rateData.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Price Shift</span>
                    <div className="font-bold text-blue-600">
                      {rateData.proposedRateLKR > rateData.currentRateLKR ? '+' : ''}
                      {(
                        ((rateData.proposedRateLKR - rateData.currentRateLKR) /
                          rateData.currentRateLKR) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-600">
                <strong>Justification & Details:</strong> {proposal.details}
              </div>

              {proposal.adminRemarks && (
                <div className="text-xs p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <strong>Admin Feedback:</strong> {proposal.adminRemarks}{' '}
                  {proposal.reviewedAt && `(Reviewed on ${proposal.reviewedAt})`}
                </div>
              )}
            </div>
          );
        })}

        {myRateProposals.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            You haven't submitted any rate proposals yet. Click "Propose New Rate" to submit a regional adjustment.
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Submit Construction Rate Proposal (LKR)"
          subtitle={`Submitted by ${currentStaff.name} for Admin Director sign-off`}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Material / Service *</label>
                <select
                  required
                  value={selectedMaterial}
                  onChange={(e) => handleMaterialChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from(new Set(rates.map((r) => r.name))).map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target District *</label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value as SriLankanDistrict)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kurunegala">Kurunegala</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit of Measurement</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Base Rate (LKR)</label>
                <input
                  type="number"
                  value={currentRateLKR}
                  onChange={(e) => setCurrentRateLKR(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-mono text-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposed New Rate (LKR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={proposedRateLKR}
                  onChange={(e) => setProposedRateLKR(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-400 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Source Documentation / Market Survey *</label>
              <input
                type="text"
                required
                placeholder="e.g. Hardware retail quote survey in Nallur / Chunnakam, Jaffna (July 2024)"
                value={sourceDoc}
                onChange={(e) => setSourceDoc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Escalation / Price Shift Justification *</label>
              <textarea
                rows={3}
                required
                placeholder="Detail transport freight changes, monsoon fuel surcharges, or quarry licensing impacts..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                Submit Proposal to Admin
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
