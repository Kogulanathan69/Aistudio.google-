import React, { useState } from 'react';
import {
  UserCheck2,
  Plus,
  Search,
  History,
  ShieldCheck,
  AlertTriangle,
  UserX,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  AssignmentRecord,
  HomeownerUser,
  StaffMember,
} from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface StaffAssignmentModuleProps {
  assignments: AssignmentRecord[];
  homeowners: HomeownerUser[];
  staff: StaffMember[];
  onAssignOrReassign: (homeownerId: string, staffId: string, reason: string, notes: string) => { success: boolean; message: string };
  onUnassign: (homeownerId: string, reason: string) => boolean;
  preSelectedStaffId?: string;
  isAssignModalOpen: boolean;
  setIsAssignModalOpen: (open: boolean) => void;
}

export const StaffAssignmentModule: React.FC<StaffAssignmentModuleProps> = ({
  assignments,
  homeowners,
  staff,
  onAssignOrReassign,
  onUnassign,
  preSelectedStaffId,
  isAssignModalOpen,
  setIsAssignModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'reassigned'>('all');
  const [staffFilter, setStaffFilter] = useState<string>(preSelectedStaffId || 'all');
  const [selectedHomeownerForHistory, setSelectedHomeownerForHistory] = useState<HomeownerUser | null>(null);

  // Reassignment Modal Form State
  const [selectedHomeownerId, setSelectedHomeownerId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [reassignReason, setReassignReason] = useState<string>('Transferred to Chartered Architect for 2D Alternatives generation');
  const [reassignNotes, setReassignNotes] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');
  const [modalSuccess, setModalSuccess] = useState<string>('');

  const activeAssignments = assignments.filter((a) => a.status === 'active');
  const reassignedHistory = assignments.filter((a) => a.status === 'reassigned' || a.status === 'completed');

  const filteredAssignments = assignments.filter((asg) => {
    const matchesSearch =
      asg.homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asg.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asg.notes && asg.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusTab === 'all' ||
      (statusTab === 'active' && asg.status === 'active') ||
      (statusTab === 'reassigned' && (asg.status === 'reassigned' || asg.status === 'completed'));
    const matchesStaff = staffFilter === 'all' || asg.staffId === staffFilter;
    return matchesSearch && matchesStatus && matchesStaff;
  });

  const handleOpenAssignModal = (homeownerId?: string) => {
    setSelectedHomeownerId(homeownerId || (homeowners[0]?.id ?? ''));
    setSelectedStaffId(staff.find((s) => s.status === 'active')?.id || '');
    setModalError('');
    setModalSuccess('');
    setIsAssignModalOpen(true);
  };

  const handleExecuteAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!selectedHomeownerId || !selectedStaffId) {
      setModalError('Please select both a homeowner and a staff professional.');
      return;
    }

    const res = onAssignOrReassign(
      selectedHomeownerId,
      selectedStaffId,
      reassignReason,
      reassignNotes
    );

    if (!res.success) {
      setModalError(res.message);
    } else {
      setModalSuccess(res.message);
      setTimeout(() => {
        setIsAssignModalOpen(false);
        setModalSuccess('');
      }, 1000);
    }
  };

  const targetHomeowner = homeowners.find((h) => h.id === selectedHomeownerId);
  const currentAssignedStaff = targetHomeowner?.activeStaffId
    ? staff.find((s) => s.id === targetHomeowner.activeStaffId)
    : null;
  const isReassignment = !!currentAssignedStaff;

  return (
    <div className="space-y-6">
      {/* Policy Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck2 className="h-5 w-5 text-blue-600" />
              Staff–Homeowner Allocation Engine
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Strict 1:1 Invariant
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Each homeowner is allocated <strong className="text-slate-800">at most one active Chartered Architect or Civil Engineer lead</strong> at any time. When reassigning between planning stages, the previous lead relationship is preserved in immutable audit history.
          </p>
        </div>

        <button
          onClick={() => handleOpenAssignModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Assign / Reassign Lead</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Allocations
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {activeAssignments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Currently active architectural leads</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Preserved Historical Tenures
          </div>
          <div className="text-2xl font-bold text-slate-800 font-mono tabular-nums mt-1">
            {reassignedHistory.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Stage transitions & archived leads</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Client Allocation Rate
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums mt-1">
            {Math.round((activeAssignments.length / (homeowners.length || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {homeowners.length - activeAssignments.length} homeowners pending lead architect
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search allocations by homeowner, architect/engineer, district or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Staff Leads</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.assignedDistrict} - {s.activeAssignmentsCount}/{s.maxAssignments})
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Records ({assignments.length})
            </button>
            <button
              onClick={() => setStatusTab('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({activeAssignments.length})
            </button>
            <button
              onClick={() => setStatusTab('reassigned')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'reassigned' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Archived History ({reassignedHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Assignments Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Homeowner Client</th>
                <th className="py-3 px-4">Assigned Staff Lead</th>
                <th className="py-3 px-4">Tenure Period</th>
                <th className="py-3 px-4">Status & Reason</th>
                <th className="py-3 px-4">Notes / Audit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((asg) => {
                const homeowner = homeowners.find((h) => h.id === asg.homeownerId);
                const isCurrentlyActive = asg.status === 'active';

                return (
                  <tr
                    key={asg.id}
                    className={`transition-colors ${
                      isCurrentlyActive ? 'hover:bg-blue-50/30' : 'bg-slate-50/30 text-slate-600 hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Homeowner */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{asg.homeownerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{homeowner?.propertyAddress || 'Address on file'}</span>
                        {homeowner?.district && (
                          <span className="font-semibold text-slate-700">({homeowner.district})</span>
                        )}
                      </div>
                    </td>

                    {/* Staff */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        {asg.staffName}
                      </div>
                      <div className="text-[11px] text-slate-500">{asg.staffRole}</div>
                    </td>

                    {/* Tenure Dates */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-slate-800">From: {asg.assignedAt}</div>
                      {asg.endedAt && (
                        <div className="text-slate-500 text-[10px]">Ended: {asg.endedAt}</div>
                      )}
                    </td>

                    {/* Status & Reason */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <Badge
                          variant={
                            asg.status === 'active'
                              ? 'success'
                              : asg.status === 'reassigned'
                              ? 'purple'
                              : 'neutral'
                          }
                        >
                          {asg.status === 'active'
                            ? 'Active Lead'
                            : asg.status === 'reassigned'
                            ? 'Reassigned'
                            : 'Completed'}
                        </Badge>
                        {asg.reasonForChange && (
                          <div className="text-[11px] text-slate-500 max-w-xs truncate" title={asg.reasonForChange}>
                            {asg.reasonForChange}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-600 max-w-xs truncate" title={asg.notes}>
                        {asg.notes || '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">By {asg.assignedByAdmin}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            if (homeowner) setSelectedHomeownerForHistory(homeowner);
                          }}
                          className="px-2 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center gap-1"
                        >
                          <History className="h-3 w-3" />
                          <span>History</span>
                        </button>

                        {isCurrentlyActive && (
                          <button
                            onClick={() => handleOpenAssignModal(asg.homeownerId)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                          >
                            Reassign Lead
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No allocation records match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign / Reassign Staff Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={isReassignment ? 'Reassign Homeowner to Different Professional' : 'Assign Lead Architect / Engineer'}
        subtitle="Preserves full historical lineage while enforcing at most one active lead."
        maxWidth="lg"
      >
        <form onSubmit={handleExecuteAssignment} className="space-y-4 text-xs">
          {modalError && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          {modalSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{modalSuccess}</span>
            </div>
          )}

          {/* Select Homeowner */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Homeowner Client *</label>
            <select
              value={selectedHomeownerId}
              onChange={(e) => setSelectedHomeownerId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {homeowners.map((h) => {
                const assigned = staff.find((s) => s.id === h.activeStaffId);
                return (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.propertyAddress} ({h.district}) {assigned ? `[Current: ${assigned.name}]` : '[Unassigned]'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reassignment Warning */}
          {isReassignment && currentAssignedStaff && (
            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">Active Lead Detected:</span> {targetHomeowner?.name} is currently assigned to <strong className="font-bold">{currentAssignedStaff.name}</strong> ({currentAssignedStaff.role}).
                <br />
                Reassigning will automatically archive this relationship to <span className="underline font-semibold">reassigned history</span> and transfer architectural lead responsibility.
              </div>
            </div>
          )}

          {/* Select New Staff */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign to Staff Professional *</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">-- Choose Technical Professional --</option>
              {staff.map((s) => {
                const isFull = s.activeAssignmentsCount >= s.maxAssignments;
                const isCurrent = s.id === currentAssignedStaff?.id;
                return (
                  <option
                    key={s.id}
                    value={s.id}
                    disabled={s.status === 'inactive' || isFull}
                  >
                    {s.name} ({s.role} - {s.assignedDistrict}) — {s.activeAssignmentsCount}/{s.maxAssignments} Clients {s.status === 'inactive' ? '[Inactive]' : isFull ? '[At Capacity]' : ''} {isCurrent ? '(Current Lead)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reason for Reassignment */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for Assignment / Stage Handover *
            </label>
            <select
              value={reassignReason}
              onChange={(e) => setReassignReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Initial architectural lead allocation">Initial architectural lead allocation</option>
              <option value="Transferred to Chartered Architect for 2D Alternatives generation">
                Transferred to Chartered Architect for 2D Alternatives generation
              </option>
              <option value="Transferred to Structural Civil Engineer for foundation & grid validation">
                Transferred to Structural Civil Engineer for foundation & grid validation
              </option>
              <option value="Municipal Council / UDA setback clearance specialization required">
                Municipal Council / UDA setback clearance specialization required
              </option>
              <option value="Staff regional workload rebalance & district consolidation">
                Staff regional workload rebalance & district consolidation
              </option>
              <option value="Client requested specialized tropical courtyard architect lead">
                Client requested specialized tropical courtyard architect lead
              </option>
              <option value="Previous staff member on scheduled leave">Previous staff member on scheduled leave</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Administrative Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Handover briefing notes on Jaffna limestone soil and solar orientation."
              value={reassignNotes}
              onChange={(e) => setReassignNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isReassignment && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Unassign staff lead from ${targetHomeowner?.name}?`)) {
                    onUnassign(selectedHomeownerId, 'Administrative lead unassignment');
                    setIsAssignModalOpen(false);
                  }
                }}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <UserX className="h-3.5 w-3.5" />
                Unassign Lead Only
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Historical Assignment Timeline Modal */}
      {selectedHomeownerForHistory && (
        <Modal
          isOpen={!!selectedHomeownerForHistory}
          onClose={() => setSelectedHomeownerForHistory(null)}
          title={`Staff Allocation History: ${selectedHomeownerForHistory.name}`}
          subtitle={`Land: ${selectedHomeownerForHistory.propertyAddress} (${selectedHomeownerForHistory.district} - ${selectedHomeownerForHistory.plotSizePerches} Perches)`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Audit timeline of all architectural and engineering leads assigned to this homeowner parcel.
            </p>

            {(() => {
              const clientAssignments = assignments.filter(
                (a) => a.homeownerId === selectedHomeownerForHistory.id
              );

              if (clientAssignments.length === 0) {
                return (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-lg">
                    No historical assignments on record for this homeowner.
                  </div>
                );
              }

              return (
                <div className="relative border-l-2 border-slate-200 ml-4 pl-4 space-y-6 my-2">
                  {clientAssignments.map((record) => {
                    const isActive = record.status === 'active';
                    return (
                      <div key={record.id} className="relative">
                        <div
                          className={`absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                            isActive ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-400'
                          }`}
                        />

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900 text-sm">
                              {record.staffName}
                            </span>
                            <Badge variant={isActive ? 'success' : 'neutral'}>
                              {isActive ? 'Current Active Lead' : 'Historical Lead'}
                            </Badge>
                          </div>

                          <div className="text-slate-600 font-medium mb-1.5">{record.staffRole}</div>

                          <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                            <div>Assigned: {record.assignedAt}</div>
                            {record.endedAt && <div>Reassigned on: {record.endedAt}</div>}
                          </div>

                          {record.reasonForChange && (
                            <div className="mt-2 text-[11px] text-purple-700 bg-purple-50 p-2 rounded border border-purple-100">
                              <span className="font-bold">Reason:</span> {record.reasonForChange}
                            </div>
                          )}

                          {record.notes && (
                            <div className="mt-1 text-[11px] text-slate-500 italic">
                              "{record.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHomeownerForHistory(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
              >
                Close History
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
