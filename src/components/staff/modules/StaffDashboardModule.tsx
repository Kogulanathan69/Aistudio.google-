import React from 'react';
import {
  Users,
  FolderKanban,
  ClipboardCheck,
  CheckSquare,
  Receipt,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  StaffMember,
  HomeownerUser,
  ConstructionProject,
  StaffTask,
  ProjectReviewRecord,
  ApprovalRequest,
  PlanningPdfDocument,
  StaffModuleType,
} from '../../../types';
import { Badge } from '../../common/Badge';
import { formatLKR, formatShortLKR } from '../../../services/storageService';

interface StaffDashboardModuleProps {
  currentStaff: StaffMember;
  assignedHomeowners: HomeownerUser[];
  assignedProjects: ConstructionProject[];
  tasks: StaffTask[];
  reviews: ProjectReviewRecord[];
  myApprovals: ApprovalRequest[];
  myPdfs: PlanningPdfDocument[];
  onNavigate: (module: StaffModuleType) => void;
  onToggleTask: (taskId: string) => void;
  onQuickAction: (action: 'rate_proposal' | 'pdf_upload' | 'log_review' | 'add_task') => void;
}

export const StaffDashboardModule: React.FC<StaffDashboardModuleProps> = ({
  currentStaff,
  assignedHomeowners,
  assignedProjects,
  tasks,
  reviews,
  myApprovals,
  myPdfs,
  onNavigate,
  onToggleTask,
  onQuickAction,
}) => {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const pendingApprovalsCount = myApprovals.filter((a) => a.status === 'pending').length;
  const approvedProposalsCount = myApprovals.filter((a) => a.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#132A48] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                Staff Workspace
              </span>
              <span className="text-xs text-blue-200 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentStaff.assignedDistrict} District
              </span>
              <span className="text-xs text-blue-200">•</span>
              <span className="text-xs font-mono text-blue-200">
                {currentStaff.registrationNumber}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ayubowan, {currentStaff.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              {currentStaff.role} in {currentStaff.department}. You have{' '}
              <strong className="text-white font-semibold">
                {assignedHomeowners.length} active homeowner client{assignedHomeowners.length === 1 ? '' : 's'}
              </strong>{' '}
              and <strong className="text-white font-semibold">{pendingTasks.length} pending task{pendingTasks.length === 1 ? '' : 's'}</strong> today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onQuickAction('add_task')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => onQuickAction('rate_proposal')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white text-slate-800 hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Receipt className="h-4 w-4 text-emerald-600" />
              <span>Propose Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Homeowners */}
        <div
          onClick={() => onNavigate('staff_homeowners')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Users className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{assignedHomeowners.length}</div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Assigned Clients</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Admin assigned • {currentStaff.assignedDistrict}
            </div>
          </div>
        </div>

        {/* Card 2: Assigned Projects */}
        <div
          onClick={() => onNavigate('staff_projects')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <FolderKanban className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{assignedProjects.length}</div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Active 2D Pipelines</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {assignedProjects.filter((p) => p.selectedPlanKey).length} selected plans
            </div>
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div
          onClick={() => onNavigate('staff_tasks')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <CheckSquare className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{pendingTasks.length}</div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">My Pending Tasks</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {tasks.filter((t) => t.status === 'completed').length} completed
            </div>
          </div>
        </div>

        {/* Card 4: Proposals & Decisions */}
        <div
          onClick={() => onNavigate('staff_approvals')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">
              {myApprovals.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Submitted Proposals</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {pendingApprovalsCount} awaiting Admin • {approvedProposalsCount} approved
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tasks & Right Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Assigned Projects & Review Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assigned Projects Showcase */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-blue-600" />
                  Assigned Architectural Projects
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct project pipelines allocated to you by Admin
                </p>
              </div>
              <button
                onClick={() => onNavigate('staff_projects')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {assignedProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{project.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {project.code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Client: <strong className="text-slate-800">{project.homeownerName}</strong> • {project.landDetails.plotSizePerches} Perches ({project.landDetails.localCouncilAuthority})
                      </div>
                    </div>
                    <Badge variant="blue">{project.currentStage}</Badge>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      Cost Est: <strong className="text-slate-900 font-semibold">{formatLKR(project.costEstimateLKR.totalEstimateLKR)}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {project.planAlternatives.length} 2D Options
                      </span>
                      {project.homeownerConfirmation.isConfirmed ? (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          2D Confirmed
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">
                          Awaiting Client Confirmation
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {assignedProjects.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No active architectural projects assigned to your account.
                </div>
              )}
            </div>
          </div>

          {/* Quick Tasks Checklist */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-rose-500" />
                  My Architectural Deliverables & Tasks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Action items and client review milestones
                </p>
              </div>
              <button
                onClick={() => onNavigate('staff_tasks')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Task Board</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="py-2.5 flex items-start gap-3 text-xs group"
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => onToggleTask(task.id)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          task.status === 'completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`text-[9.5px] px-1.5 py-0.2 rounded font-semibold ${
                          task.priority === 'urgent'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : task.priority === 'high'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Due: {task.dueDate} • {task.category}
                      {task.projectCode && ` • ${task.projectCode}`}
                    </div>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No tasks assigned. Click "New Task" above to add one.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Homeowners Directory & Submitted Proposals (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assigned Homeowners Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  My Homeowner Clients
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned by Admin ({assignedHomeowners.length} total)
                </p>
              </div>
              <button
                onClick={() => onNavigate('staff_homeowners')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Directory
              </button>
            </div>

            <div className="space-y-3">
              {assignedHomeowners.slice(0, 3).map((client) => (
                <div
                  key={client.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{client.name}</div>
                    <div className="text-slate-500 text-[11px] truncate mt-0.5">
                      {client.plotSizePerches} Perches • {client.district}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {client.localCouncilAuthority}
                    </div>
                  </div>
                  <Badge variant={client.status === 'active' ? 'green' : 'amber'}>
                    {client.status}
                  </Badge>
                </div>
              ))}

              {assignedHomeowners.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No homeowners assigned yet. The Admin must assign a homeowner to your account.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Staff Submission Actions
            </h3>
            <p className="text-xs text-slate-500">
              Submit proposals, planning documents, or review records for Admin sign-off:
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                onClick={() => onQuickAction('rate_proposal')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Propose Construction Rate (LKR)</div>
                    <div className="text-[10px] text-slate-400">Suggest regional material or labor price</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onQuickAction('pdf_upload')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Upload Planning Rule PDF</div>
                    <div className="text-[10px] text-slate-400">Submit municipal council bylaw document</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onQuickAction('log_review')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardCheck className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Log Project Review Record</div>
                    <div className="text-[10px] text-slate-400">Check UDA setbacks and structural grid</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
