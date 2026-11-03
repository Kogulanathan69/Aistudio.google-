import React from 'react';
import {
  Users2,
  Contact,
  UserCheck2,
  HardHat,
  FileCheck2,
  Receipt,
  BarChart3,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  MapPin,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import {
  ModuleType,
  StaffMember,
  HomeownerUser,
  AssignmentRecord,
  ConstructionProject,
  ConstructionRate,
  ApprovalRequest,
} from '../../types';
import { formatLKR, formatShortLKR } from '../../services/storageService';

interface DashboardModuleProps {
  onSelectModule: (module: ModuleType) => void;
  staff: StaffMember[];
  homeowners: HomeownerUser[];
  assignments: AssignmentRecord[];
  projects: ConstructionProject[];
  rates: ConstructionRate[];
  approvals: ApprovalRequest[];
  onReviewApproval: (id: string, status: 'approved' | 'rejected', remarks: string) => void;
  onOpenAssignModal: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onSelectModule,
  staff,
  homeowners,
  assignments,
  projects,
  rates,
  approvals,
  onReviewApproval,
  onOpenAssignModal,
}) => {
  // Computed stats
  const activeStaffCount = staff.filter((s) => s.status === 'active').length;
  const activeAssignments = assignments.filter((a) => a.status === 'active');
  const activeHomeowners = homeowners.filter((h) => h.status === 'active').length;
  const unassignedHomeowners = homeowners.filter((h) => !h.activeStaffId && h.status !== 'suspended').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const totalPortfolioLKR = projects.reduce((acc, p) => acc + p.costEstimateLKR.totalEstimateLKR, 0);

  // 8 Clickable KPI Cards Data (with Sri Lankan details & LKR)
  const kpiCards = [
    {
      id: 'kpi-staff',
      title: 'Architects & Engineers',
      value: `${activeStaffCount} / ${staff.length}`,
      subtext: `${staff.reduce((acc, s) => acc + s.activeAssignmentsCount, 0)} active homeowner allocations`,
      icon: Users2,
      targetModule: 'staff' as ModuleType,
      color: 'border-blue-500/20 text-blue-600 bg-blue-50/50',
      badge: 'Chartered Leads',
    },
    {
      id: 'kpi-homeowners',
      title: 'Registered Homeowners',
      value: homeowners.length.toString(),
      subtext: `${unassignedHomeowners} pending architect allocation`,
      icon: Contact,
      targetModule: 'users' as ModuleType,
      color: 'border-indigo-500/20 text-indigo-600 bg-indigo-50/50',
      badge: `${activeHomeowners} Active Deeds`,
    },
    {
      id: 'kpi-assignments',
      title: 'Staff–User Allocations',
      value: activeAssignments.length.toString(),
      subtext: 'Strict 1:1 active ratio enforced',
      icon: UserCheck2,
      targetModule: 'assignments' as ModuleType,
      color: 'border-emerald-500/20 text-emerald-600 bg-emerald-50/50',
      badge: '1:1 Protected',
    },
    {
      id: 'kpi-projects',
      title: 'Architectural Pipelines',
      value: projects.length.toString(),
      subtext: 'Across Colombo, Jaffna, Kandy & more',
      icon: HardHat,
      targetModule: 'projects' as ModuleType,
      color: 'border-sky-500/20 text-sky-600 bg-sky-50/50',
      badge: 'Active Designs',
    },
    {
      id: 'kpi-approvals',
      title: 'Staff Approval Requests',
      value: pendingApprovals.length.toString(),
      subtext: 'Rate proposals & Bylaw PDFs',
      icon: FileCheck2,
      targetModule: 'approvals' as ModuleType,
      color: 'border-amber-500/20 text-amber-600 bg-amber-50/50',
      badge: pendingApprovals.length > 0 ? 'Urgent' : 'Clear',
      highlight: pendingApprovals.length > 0,
    },
    {
      id: 'kpi-budget',
      title: 'Total Portfolio Estimate',
      value: formatShortLKR(totalPortfolioLKR),
      subtext: `${formatLKR(totalPortfolioLKR)} in active designs`,
      icon: BarChart3,
      targetModule: 'reports' as ModuleType,
      color: 'border-purple-500/20 text-purple-600 bg-purple-50/50',
      badge: 'LKR (Rs.)',
    },
    {
      id: 'kpi-rates',
      title: 'Construction Unit Rates',
      value: `${rates.length} Rates`,
      subtext: 'Cement, steel, sand & labor in LKR',
      icon: Receipt,
      targetModule: 'rates' as ModuleType,
      color: 'border-teal-500/20 text-teal-600 bg-teal-50/50',
      badge: '5 Districts',
    },
    {
      id: 'kpi-notifications',
      title: 'Bylaw & Audit Feeds',
      value: 'Live',
      subtext: 'UDA bylaws & system compliance',
      icon: Bell,
      targetModule: 'notifications' as ModuleType,
      color: 'border-slate-500/20 text-slate-700 bg-slate-50',
      badge: 'Verified',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner / Operational Status Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-lg bg-[#132A48] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                BuildMind Sri Lanka Control Center
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live LKR System
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              AI-assisted residential architectural planning across Colombo, Jaffna, Kandy, Gampaha & Kurunegala.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {unassignedHomeowners > 0 && (
            <button
              onClick={onOpenAssignModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Assign {unassignedHomeowners} Homeowner{unassignedHomeowners > 1 ? 's' : ''}</span>
            </button>
          )}

          <button
            onClick={() => onSelectModule('estimator')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <span>Launch LKR Cost Estimator</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Clickable KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Key Planning Metrics (Click Any Card to Open Module)
          </h3>
          <span className="text-xs text-slate-400">8 Real-time Metrics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onSelectModule(card.targetModule)}
                className={`relative text-left bg-white rounded-xl p-4.5 border transition-all duration-150 group hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 ${
                  card.highlight ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg border ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {card.badge}
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums font-mono">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">{card.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">{card.subtext}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column operational section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Approval Requests + Active Projects Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Approval Queue: Rate proposals & Building-Rule PDFs */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-amber-500" />
                  Staff Approval Queue: Rates & Municipal Bylaws
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Construction rate proposals, building-rule PDF submissions, and publication requests awaiting Admin decision
                </p>
              </div>
              <button
                onClick={() => onSelectModule('approvals')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All ({approvals.length})
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
                All staff submissions and rate proposals are currently reviewed.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingApprovals.slice(0, 3).map((req) => (
                  <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {req.reqNumber}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {req.type}
                        </span>
                        {req.district && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {req.district}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        By {req.submittedByStaffName} · {req.submittedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          onReviewApproval(req.id, 'approved', 'Approved by Admin Director from Dashboard')
                        }
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          onReviewApproval(req.id, 'rejected', 'Declined from Dashboard quick queue')
                        }
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Architectural Planning Pipelines Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HardHat className="h-4 w-4 text-blue-600" />
                  Active Architectural Planning Pipelines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI requirements, 3 2D alternatives, UDA feasibility & homeowner confirmation status
                </p>
              </div>
              <button
                onClick={() => onSelectModule('projects')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Manage All Projects
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {p.code}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{p.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {p.district} ({p.landDetails.plotSizePerches} Perches)
                        </span>
                        <span>·</span>
                        <span>Lead: <strong className="text-slate-700">{p.leadStaffName}</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {formatLKR(p.costEstimateLKR.totalEstimateLKR)}
                      </div>
                      <div className="text-[10px] text-blue-600 font-semibold">{p.currentStage}</div>
                    </div>
                  </div>

                  {/* Stage Progress Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-2 border-t border-slate-200/60">
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">AI Brief</span>
                      <span className="font-semibold text-slate-800">{p.projectBrief.status}</span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">UDA Setbacks</span>
                      <span className={`font-semibold ${p.feasibilityStage.udaSetbacksMet ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {p.feasibilityStage.status}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">2D Options</span>
                      <span className="font-semibold text-slate-800">
                        {p.selectedPlanKey ? `Option ${p.selectedPlanKey} Selected` : '3 Options Under Review'}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">Client Confirmation</span>
                      <span className={`font-semibold ${p.homeownerConfirmation.isConfirmed ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {p.homeownerConfirmation.isConfirmed ? 'Confirmed by Client' : 'Pending Client Action'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Staff Workload Distribution + Recent Assignment Activity */}
        <div className="space-y-6">
          {/* Staff Allocation Meter */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users2 className="h-4 w-4 text-indigo-600" />
                Staff Capacity by District
              </h3>
              <button
                onClick={() => onSelectModule('staff')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Team
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Chartered architects & engineers allocated against max client concurrency limits
            </p>

            <div className="space-y-3">
              {staff.filter((s) => s.status === 'active').map((member) => {
                const ratio = member.activeAssignmentsCount / member.maxAssignments;
                const isFull = ratio >= 1;
                return (
                  <div key={member.id} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {member.name}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">({member.assignedDistrict})</span>
                      </span>
                      <span className="font-mono tabular-nums text-[11px] text-slate-500 shrink-0">
                        {member.activeAssignmentsCount}/{member.maxAssignments} clients
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isFull ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, ratio * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Assignment History */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                Recent Allocations & Tenures
              </h3>
              <button
                onClick={() => onSelectModule('assignments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                History
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Preserved 1:1 architectural lead history
            </p>

            <div className="space-y-3">
              {assignments.slice(0, 4).map((asg) => (
                <div key={asg.id} className="text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">{asg.homeownerName}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        asg.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Lead: <span className="font-medium text-slate-700">{asg.staffName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                    <Calendar className="h-3 w-3" />
                    {asg.assignedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
