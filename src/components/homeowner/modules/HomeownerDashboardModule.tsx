import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Layers,
  Box,
  Compass,
  FileText,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Building,
  Phone,
  Mail,
  Award,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { HomeownerUser, ConstructionProject, HomeownerModuleType, StaffMember } from '../../../types';
import { formatLKR } from '../../../services/storageService';

interface HomeownerDashboardModuleProps {
  currentHomeowner: HomeownerUser;
  currentProject: ConstructionProject | null;
  allProjects: ConstructionProject[];
  assignedStaff: StaffMember | null;
  onNavigate: (module: HomeownerModuleType) => void;
  onSelectProject: (projectId: string) => void;
}

export const HomeownerDashboardModule: React.FC<HomeownerDashboardModuleProps> = ({
  currentHomeowner,
  currentProject,
  allProjects,
  assignedStaff,
  onNavigate,
  onSelectProject,
}) => {
  const is3DUnlocked = currentProject?.homeownerConfirmation?.isConfirmed && currentProject?.model3DStatus?.status !== 'Locked - Awaiting Homeowner 2D Confirmation';

  // Architectural workflow stages
  const workflowStages = [
    { id: 'homeowner_ai_chat' as HomeownerModuleType, title: 'AI Requirements', status: currentProject?.aiRequirementsStage?.status === 'Completed' ? 'done' : 'current' },
    { id: 'homeowner_brief' as HomeownerModuleType, title: 'Project Brief', status: currentProject?.projectBrief?.status === 'Approved by Client' ? 'done' : 'pending' },
    { id: 'homeowner_feasibility' as HomeownerModuleType, title: 'Land Feasibility', status: currentProject?.feasibilityStage?.status === 'Compliant' ? 'done' : 'pending' },
    { id: 'homeowner_plan_alternatives' as HomeownerModuleType, title: '3 Plan Options', status: currentProject?.selectedPlanKey ? 'done' : 'pending' },
    { id: 'homeowner_2d_editor' as HomeownerModuleType, title: '2D Floor Plan', status: currentProject?.interactiveFloorPlan ? 'done' : 'pending' },
    { id: 'homeowner_2d_validation' as HomeownerModuleType, title: 'Validation', status: currentProject?.planRevisionStatus?.structuralGridValidated ? 'done' : 'pending' },
    { id: 'homeowner_2d_confirmation' as HomeownerModuleType, title: 'Confirmation', status: currentProject?.homeownerConfirmation?.isConfirmed ? 'done' : 'pending' },
    { id: 'homeowner_3d_viewer' as HomeownerModuleType, title: '3D Model', status: is3DUnlocked ? 'done' : 'locked' },
    { id: 'homeowner_cost_estimation' as HomeownerModuleType, title: 'Cost & Quantities', status: 'ready' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#132A48] via-[#1a3860] to-[#1e4577] text-white p-6 rounded-2xl shadow-md border border-[#234b80] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Residential Planning Platform
              </span>
              <span className="text-xs text-slate-300">
                {currentHomeowner.district} District • {currentHomeowner.localCouncilAuthority}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ayubowan, {currentHomeowner.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Manage your residential architectural journey. Co-design floor plans with AI assistance, verify UDA building setbacks, validate room layouts, and unlock conceptual 3D visualizations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('homeowner_new_project')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 transition-all flex items-center gap-2"
            >
              <span>+ New Project</span>
            </button>
            <button
              onClick={() => onNavigate('homeowner_ai_chat')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Requirements</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Project Card if available */}
      {currentProject ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{currentProject.title}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  {currentProject.code}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  {currentProject.currentStage}
                </span>
                {currentProject.selectedPlanKey && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                    Selected Option {currentProject.selectedPlanKey}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentProject.location} • {currentProject.landDetails.plotSizePerches} Perches ({currentProject.landDetails.plotAreaSqFt.toLocaleString()} sq.ft) • {currentProject.landDetails.localCouncilAuthority}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('homeowner_2d_editor')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Open 2D Studio</span>
              </button>
              <button
                onClick={() => onNavigate('homeowner_3d_viewer')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  is3DUnlocked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{is3DUnlocked ? 'View 3D Model' : '3D Locked'}</span>
              </button>
            </div>
          </div>

          {/* 4 Status KPI Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Land Details</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{currentProject.landDetails.plotSizePerches} Perches</p>
              <p className="text-[11px] text-slate-500 mt-0.5">UDA Coverage: {currentProject.feasibilityStage.maximumPlotCoveragePercent}% max</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">2D Plan Revision</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-slate-900">v{currentProject.planRevisionStatus.currentRevision}</span>
                {currentProject.planRevisionStatus.structuralGridValidated ? (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Validated</span>
                ) : (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Pending Check</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Option {currentProject.selectedPlanKey || 'A'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">3D Conceptual Model</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {is3DUnlocked ? (
                  <>
                    <Unlock className="w-4 h-4 text-emerald-600" />
                    <span className="text-base font-bold text-emerald-700">Unlocked</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-rose-500" />
                    <span className="text-base font-bold text-rose-600">Locked</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {is3DUnlocked ? 'Confirmed by Homeowner' : 'Awaiting 2D Confirmation'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Estimated Budget</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{formatLKR(currentProject.costEstimateLKR.totalEstimateLKR)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">~ Rs. {currentProject.costEstimateLKR.costPerSqFtLKR.toLocaleString()}/sq.ft</p>
            </div>
          </div>

          {/* Visual Step Tracker */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Architectural Planning Steps</h3>
              <span className="text-xs text-blue-600 font-medium">Stage-by-Stage Flow</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
              {workflowStages.map((stage, idx) => {
                const isCurrent = stage.id === 'homeowner_2d_editor';
                return (
                  <button
                    key={stage.id}
                    onClick={() => onNavigate(stage.id)}
                    className={`p-2 rounded-lg text-left transition-all border ${
                      stage.status === 'done'
                        ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100'
                        : stage.status === 'locked'
                        ? 'bg-slate-50 border-slate-200/60 opacity-60 hover:opacity-100'
                        : 'bg-white border-blue-200 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                      {stage.status === 'done' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {stage.status === 'locked' && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">{stage.title}</p>
                    <p className="text-[9px] text-slate-400 capitalize mt-0.5">{stage.status}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800">No Residential Projects Created Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Start by entering your land dimensions, district, and target budget to generate customized Sri Lankan floor plan alternatives.
          </p>
          <button
            onClick={() => onNavigate('homeowner_new_project')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            Start New Project Wizard
          </button>
        </div>
      )}

      {/* Lower Row: Assigned Architect Lead Card & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Chartered Architect Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Assigned Architectural Lead</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Admin Assigned
            </span>
          </div>

          {assignedStaff ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                  {assignedStaff.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{assignedStaff.name}</h4>
                  <p className="text-xs text-blue-600 font-medium">{assignedStaff.role}</p>
                  <p className="text-[11px] text-slate-500">{assignedStaff.department} • {assignedStaff.assignedDistrict}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Registration:</span>
                  <span className="font-mono font-semibold text-slate-800">{assignedStaff.registrationNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Experience:</span>
                  <span className="font-semibold text-slate-800">{assignedStaff.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-[11px] text-slate-500">Contact:</span>
                  <span className="text-slate-800 truncate">{assignedStaff.phone}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
                <span className="font-semibold block mb-0.5">Professional Role Scope:</span>
                Your architectural lead reviews feasibility, structural grid alignment, and municipal bylaws. Final plan approval and 3D unlocking remain under homeowner control.
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-medium text-slate-700">No Staff Assigned Yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Admin Control Center will assign a licensed Chartered Architect or Drafter from your district shortly.
              </p>
            </div>
          )}
        </div>

        {/* All Residential Projects list */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-emerald-600" />
                <span>My Residential Projects</span>
              </h3>
              <p className="text-xs text-slate-500">Total {allProjects.length} projects linked to your account</p>
            </div>
            <button
              onClick={() => onNavigate('homeowner_projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {allProjects.map((proj) => {
              const isSelected = currentProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">{proj.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {proj.code}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-600 text-white">
                          Active Selection
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                      <span>{proj.district}</span>
                      <span>•</span>
                      <span>{proj.landDetails.plotSizePerches} Perches</span>
                      <span>•</span>
                      <span>Budget: {formatLKR(proj.costEstimateLKR.totalEstimateLKR)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isSelected && (
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onSelectProject(proj.id);
                        onNavigate('homeowner_2d_editor');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span>Open Plan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
