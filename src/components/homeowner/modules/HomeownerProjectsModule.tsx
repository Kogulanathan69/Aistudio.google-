import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Building,
  Layers,
  Box,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType } from '../../../types';
import { formatLKR } from '../../../services/storageService';

interface HomeownerProjectsModuleProps {
  projects: ConstructionProject[];
  currentProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onNavigate: (module: HomeownerModuleType) => void;
}

export const HomeownerProjectsModule: React.FC<HomeownerProjectsModuleProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || p.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Residential Projects</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your Sri Lankan residential architectural proposals, floor plan revisions, and municipal feasibility checks.
          </p>
        </div>
        <button
          onClick={() => onNavigate('homeowner_new_project')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Wizard</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, code, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:border-blue-500"
          >
            <option value="All">All Planning Stages</option>
            <option value="Land Assessment & AI Requirements">AI Requirements</option>
            <option value="2D Plan Alternatives Review">2D Alternatives</option>
            <option value="Awaiting Homeowner 2D Confirmation">Awaiting 2D Confirmation</option>
            <option value="Confirmed & 3D Modeling">Confirmed & 3D</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProjects.map((p) => {
          const isSelected = currentProjectId === p.id;
          const is3DUnlocked = p.homeownerConfirmation?.isConfirmed && p.model3DStatus?.status !== 'Locked - Awaiting Homeowner 2D Confirmation';

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-400 ring-2 ring-blue-500/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Top Row: Title, Code, District Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {p.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{p.location}, {p.district}</span>
                    </p>
                  </div>

                  {isSelected ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      Select
                    </button>
                  )}
                </div>

                {/* Stage Badge & Authority */}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {p.currentStage}
                  </span>
                  <span className="text-xs text-slate-500">
                    {p.landDetails.localCouncilAuthority}
                  </span>
                </div>

                {/* Land & Budget Stats Table */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Land Area</span>
                    <span className="font-bold text-slate-800">{p.landDetails.plotSizePerches} Perches</span>
                    <span className="text-[10px] text-slate-400 block">{p.landDetails.plotAreaSqFt.toLocaleString()} sq.ft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">2D Revision</span>
                    <span className="font-bold text-slate-800">Rev v{p.planRevisionStatus.currentRevision}</span>
                    <span className="text-[10px] block text-emerald-600 font-semibold">
                      {p.planRevisionStatus.structuralGridValidated ? 'Validated' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Est. Cost (LKR)</span>
                    <span className="font-bold text-slate-800">{formatLKR(p.costEstimateLKR.totalEstimateLKR)}</span>
                    <span className="text-[10px] text-slate-400 block">Option {p.selectedPlanKey || 'A'}</span>
                  </div>
                </div>

                {/* 3D Status Banner */}
                <div className={`mt-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                  is3DUnlocked
                    ? 'bg-emerald-50/70 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50/60 text-rose-800 border-rose-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {is3DUnlocked ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span className="font-semibold">
                      {is3DUnlocked ? 'Conceptual 3D Visualizer: Ready' : '3D Model: Locked'}
                    </span>
                  </div>
                  <span className="text-[10px]">
                    {is3DUnlocked ? 'Confirmed' : 'Requires explicit 2D sign-off'}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Lead: {p.leadStaffName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectProject(p.id);
                      onNavigate('homeowner_brief');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    Brief
                  </button>
                  <button
                    onClick={() => {
                      onSelectProject(p.id);
                      onNavigate('homeowner_2d_editor');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Open 2D Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
