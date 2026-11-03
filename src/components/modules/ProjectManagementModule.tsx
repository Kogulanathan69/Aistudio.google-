import React, { useState } from 'react';
import {
  HardHat,
  Plus,
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  FileText,
  Lock,
  Unlock,
  Box,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import {
  ConstructionProject,
  ProjectPlanningStage,
  HomeownerUser,
  StaffMember,
  SriLankanDistrict,
} from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { formatLKR } from '../../services/storageService';

interface ProjectManagementModuleProps {
  projects: ConstructionProject[];
  homeowners: HomeownerUser[];
  staff: StaffMember[];
  onAddProject: (project: Omit<ConstructionProject, 'id' | 'code'>) => void;
  onUpdateProject: (project: ConstructionProject) => void;
}

export const ProjectManagementModule: React.FC<ProjectManagementModuleProps> = ({
  projects,
  homeowners,
  staff,
  onAddProject,
  onUpdateProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Project Form
  const [formData, setFormData] = useState({
    title: '',
    homeownerId: homeowners[0]?.id || '',
    leadStaffId: staff[0]?.id || '',
    district: 'Jaffna' as SriLankanDistrict,
    location: '',
    currentStage: 'Land Assessment & AI Requirements' as ProjectPlanningStage,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: '2024-12-31',
    plotSizePerches: 15.0,
    surveyPlanNumber: 'SUR/2024/099',
    localCouncilAuthority: 'Jaffna Municipal Council',
    zoningCategory: 'Low-Rise Residential (R1)',
    lifestylePrompt: 'Modern tropical family dwelling with central open courtyard (Medamidula), passive cooling, and shaded perimeter veranda.',
    bedroomCount: 4,
    bathroomCount: 3,
    storeyCount: 2,
    courtyardPreferred: true,
    vastuOrientationPreferred: true,
    targetBudgetLKR: 28000000,
  });

  const availableDistricts: SriLankanDistrict[] = ['Colombo', 'Jaffna', 'Kandy', 'Gampaha', 'Kurunegala'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leadStaffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || p.district === districtFilter;
    const matchesStage = stageFilter === 'all' || p.currentStage === stageFilter;
    return matchesSearch && matchesDistrict && matchesStage;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const homeowner = homeowners.find((h) => h.id === formData.homeownerId);
    const staffMember = staff.find((s) => s.id === formData.leadStaffId);

    const builtUpArea = Math.round(formData.plotSizePerches * 272.25 * 0.55);

    onAddProject({
      title: formData.title,
      homeownerId: formData.homeownerId,
      homeownerName: homeowner?.name || 'Client',
      leadStaffId: formData.leadStaffId,
      leadStaffName: staffMember?.name || 'Lead Architect',
      district: formData.district,
      location: formData.location,
      startDate: formData.startDate,
      targetCompletionDate: formData.targetCompletionDate,
      currentStage: formData.currentStage,

      landDetails: {
        plotSizePerches: formData.plotSizePerches,
        plotAreaSqFt: Math.round(formData.plotSizePerches * 272.25),
        surveyPlanNumber: formData.surveyPlanNumber,
        localCouncilAuthority: formData.localCouncilAuthority,
        zoningCategory: formData.zoningCategory,
        soilAndTopography: 'Verified soil bearing capacity. Flat alluvial parcel with street drainage.',
      },

      aiRequirementsStage: {
        status: 'In Progress',
        lifestylePromptSummary: formData.lifestylePrompt,
        bedroomCount: formData.bedroomCount,
        bathroomCount: formData.bathroomCount,
        storeyCount: formData.storeyCount,
        courtyardPreferred: formData.courtyardPreferred,
        vastuOrientationPreferred: formData.vastuOrientationPreferred,
        targetBudgetLKR: formData.targetBudgetLKR,
      },

      projectBrief: {
        status: 'Draft Under Review',
        briefSummary: 'AI lifestyle preferences ingested. Synthesizing spatial massing parameters.',
        lastUpdated: new Date().toISOString().split('T')[0],
      },

      feasibilityStage: {
        status: 'Compliant',
        udaSetbacksMet: true,
        frontSetbackMeters: 3.0,
        rearSetbackMeters: 2.5,
        sideSetbacksMeters: 1.5,
        maximumPlotCoveragePercent: 60,
        notes: 'Compliant with UDA planning regulations for residential zones.',
      },

      planAlternatives: [
        {
          id: `alt-${Date.now()}-a`,
          optionKey: 'A',
          title: 'Courtyard Modernism Scheme',
          concept: 'Central Medamidula courtyard providing natural stack thermal cooling.',
          builtUpAreaSqFt: builtUpArea,
          estimatedCostLKR: formData.targetBudgetLKR * 0.98,
          features: ['Central rain courtyard', 'Covered north veranda', 'Separate wet kitchen', 'High thermal ceiling'],
        },
        {
          id: `alt-${Date.now()}-b`,
          optionKey: 'B',
          title: 'Linear Garden Pavilion',
          concept: 'Linear footprint capturing prevailing breeze directions with extended roof overhangs.',
          builtUpAreaSqFt: builtUpArea - 150,
          estimatedCostLKR: formData.targetBudgetLKR * 0.94,
          features: ['Deep roof eaves', 'Integrated double carport', 'Large living-dining pavilion', 'Solar orientation'],
        },
        {
          id: `alt-${Date.now()}-c`,
          optionKey: 'C',
          title: 'Compact Two-Tier Atrium',
          concept: 'Vertical volume with double-height central void and rooftop terrace.',
          builtUpAreaSqFt: builtUpArea + 150,
          estimatedCostLKR: formData.targetBudgetLKR * 1.02,
          features: ['Double-height atrium', 'Rooftop garden terrace', 'Ensuite bedrooms', 'Home office mezzanine'],
        },
      ],
      selectedPlanKey: null,

      planRevisionStatus: {
        currentRevision: 1,
        structuralGridValidated: false,
        councilClearanceValidated: false,
        architectSignedOff: false,
        notes: 'Initial 2D drafting underway by lead architect.',
      },

      // Critical Governance Invariant: Admin & Staff cannot confirm homeowner 2D plan
      homeownerConfirmation: {
        isConfirmed: false,
        disclaimer: 'Governance Invariant: Final 2D plan selection and sign-off can ONLY be confirmed by the registered homeowner via their secure client portal. Admin and Staff cannot confirm on their behalf.',
      },

      model3DStatus: {
        status: 'Locked - Awaiting Homeowner 2D Confirmation',
        renderCount: 0,
      },

      costEstimateLKR: {
        totalEstimateLKR: formData.targetBudgetLKR,
        costPerSqFtLKR: Math.round(formData.targetBudgetLKR / (builtUpArea || 1)),
        breakdownDate: new Date().toISOString().split('T')[0],
      },
    });

    setIsAddModalOpen(false);
  };

  const getStageBadgeVariant = (stage: ProjectPlanningStage) => {
    switch (stage) {
      case 'Confirmed & 3D Modeling':
      case 'Planning Documentation Ready':
        return 'success';
      case '2D Plan Alternatives Review':
      case 'Awaiting Homeowner 2D Confirmation':
        return 'info';
      case 'Feasibility & Bylaw Clearance':
        return 'warning';
      case 'Land Assessment & AI Requirements':
      case 'Project Brief Drafted':
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardHat className="h-5 w-5 text-blue-600" />
            AI-Assisted Architectural Planning Pipelines
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Land assessment, lifestyle AI requirements, municipal UDA feasibility, 3 2D alternatives, client validation, and 3D modeling stages.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Initiate Architectural Pipeline</span>
        </button>
      </div>

      {/* Governance Invariant Callout */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3 text-xs">
        <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-blue-900 leading-relaxed">
          <strong className="font-bold">Architectural Governance Invariant:</strong> In the BuildMind platform, <span className="underline font-semibold">Admin and Staff must not confirm homeowner 2D plans or unlock 3D generation</span>. The final 2D plan selection and 3D generation lock are strictly controlled by the registered homeowner through their client portal.
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by code, title, homeowner, architect lead, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Planning Stages</option>
            <option value="Land Assessment & AI Requirements">Land & AI Requirements</option>
            <option value="Project Brief Drafted">Brief Drafted</option>
            <option value="Feasibility & Bylaw Clearance">Feasibility & Bylaws</option>
            <option value="2D Plan Alternatives Review">2D Alternatives</option>
            <option value="Awaiting Homeowner 2D Confirmation">Awaiting Client Confirmation</option>
            <option value="Confirmed & 3D Modeling">Confirmed & 3D Modeling</option>
          </select>
        </div>
      </div>

      {/* Projects Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {project.code}
                  </span>
                  <Badge variant={getStageBadgeVariant(project.currentStage)}>
                    {project.currentStage}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{project.location}</span>
                </div>

                {/* Land and Client Info */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Homeowner</span>
                    <span className="font-semibold text-slate-800 truncate block">{project.homeownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lead Architect</span>
                    <span className="font-semibold text-blue-600 truncate block">{project.leadStaffName}</span>
                  </div>
                </div>

                {/* Land & Council Badge */}
                <div className="mt-2 text-[10px] bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">
                    {project.landDetails.plotSizePerches} Perches ({project.landDetails.plotAreaSqFt} sq.ft)
                  </span>
                  <span className="text-slate-500 truncate max-w-[130px] font-mono">
                    {project.landDetails.localCouncilAuthority}
                  </span>
                </div>

                {/* 2D Alternatives & Confirmation Status */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">2D Alternatives:</span>
                    <span className="font-semibold text-slate-800">
                      {project.planAlternatives.length} Options Generated
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Selected 2D Plan:</span>
                    <span className="font-bold text-blue-700">
                      {project.selectedPlanKey ? `Option ${project.selectedPlanKey}` : 'Pending Client Choice'}
                    </span>
                  </div>

                  {/* 3D Model Status */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Box className="h-3 w-3 text-slate-400" />
                      3D Generation:
                    </span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        project.homeownerConfirmation.isConfirmed
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {project.homeownerConfirmation.isConfirmed ? (
                        <>
                          <Unlock className="h-3 w-3" />
                          Unlocked by Client
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          Locked (Client only)
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Budget metrics */}
                <div className="mt-3.5 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-blue-600 block uppercase font-medium">Estimated Cost</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatLKR(project.costEstimateLKR.totalEstimateLKR)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-600 block uppercase font-medium">Benchmark</span>
                    <span className="font-mono text-slate-700 tabular-nums font-semibold">
                      Rs. {project.costEstimateLKR.costPerSqFtLKR.toLocaleString()}/sq.ft
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="h-3 w-3" />
                  Target: {project.targetCompletionDate}
                </span>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View Architectural Dossier
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No architectural projects found matching the filter criteria.
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Initiate Architectural Planning Pipeline"
        subtitle="Initialize land assessment, lifestyle prompts, and 2D alternatives generation."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Nallur Courtyard Tropical Residence or Colombo 07 Townhouse"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Homeowner Client *</label>
              <select
                value={formData.homeownerId}
                onChange={(e) => setFormData({ ...formData, homeownerId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {homeowners.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.district} - {h.propertyAddress})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Architect / Civil Engineer *</label>
              <select
                value={formData.leadStaffId}
                onChange={(e) => setFormData({ ...formData, leadStaffId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {staff
                  .filter((s) => s.status === 'active')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} - {s.assignedDistrict})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value as SriLankanDistrict })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Local Council Authority</label>
              <input
                type="text"
                required
                value={formData.localCouncilAuthority}
                onChange={(e) => setFormData({ ...formData, localCouncilAuthority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Site Street Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 142 Temple Road, Nallur, Jaffna"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plot Size (Perches)</label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="100"
                value={formData.plotSizePerches}
                onChange={(e) =>
                  setFormData({ ...formData, plotSizePerches: parseFloat(e.target.value) || 10 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Survey Plan Number</label>
              <input
                type="text"
                value={formData.surveyPlanNumber}
                onChange={(e) => setFormData({ ...formData, surveyPlanNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Budget (LKR)</label>
              <input
                type="number"
                step="1000000"
                value={formData.targetBudgetLKR}
                onChange={(e) =>
                  setFormData({ ...formData, targetBudgetLKR: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">AI Lifestyle & Spatial Prompt</label>
            <textarea
              rows={2}
              value={formData.lifestylePrompt}
              onChange={(e) => setFormData({ ...formData, lifestylePrompt: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Initialize Pipeline & 3 Alternatives
            </button>
          </div>
        </form>
      </Modal>

      {/* Comprehensive Architectural Dossier Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={`Architectural Dossier: ${selectedProject.title}`}
          subtitle={`Code: ${selectedProject.code} · ${selectedProject.district} District (${selectedProject.landDetails.plotSizePerches} Perches)`}
          maxWidth="3xl"
        >
          <div className="space-y-5 text-xs">
            {/* Top Stage Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Stage</span>
                <Badge variant={getStageBadgeVariant(selectedProject.currentStage)}>
                  {selectedProject.currentStage}
                </Badge>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estimated Budget</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatLKR(selectedProject.costEstimateLKR.totalEstimateLKR)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Selected 2D Plan</span>
                <span className="font-bold text-blue-700 font-mono">
                  {selectedProject.selectedPlanKey ? `Option ${selectedProject.selectedPlanKey}` : 'Pending Selection'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">3D Generation</span>
                <span className={`font-bold flex items-center gap-1 ${selectedProject.homeownerConfirmation.isConfirmed ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {selectedProject.homeownerConfirmation.isConfirmed ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  {selectedProject.model3DStatus.status.split('-')[0]}
                </span>
              </div>
            </div>

            {/* 1. Land Details & Feasibility */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600" />
                1. Land Parcel & UDA Feasibility Stage
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Survey & Parcel</span>
                  <div className="font-semibold text-slate-800">{selectedProject.landDetails.surveyPlanNumber}</div>
                  <div className="text-slate-500">{selectedProject.landDetails.plotSizePerches} Perches ({selectedProject.landDetails.plotAreaSqFt} sq.ft)</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Local Council</span>
                  <div className="font-semibold text-slate-800">{selectedProject.landDetails.localCouncilAuthority}</div>
                  <div className="text-slate-500">{selectedProject.landDetails.zoningCategory}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">UDA Setbacks Status</span>
                  <div className={`font-semibold ${selectedProject.feasibilityStage.udaSetbacksMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                    Front: {selectedProject.feasibilityStage.frontSetbackMeters}m · Rear: {selectedProject.feasibilityStage.rearSetbackMeters}m · Side: {selectedProject.feasibilityStage.sideSetbacksMeters}m
                  </div>
                  <div className="text-slate-500">Max Plot Coverage: {selectedProject.feasibilityStage.maximumPlotCoveragePercent}%</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded">
                <strong>Soil / Topography:</strong> {selectedProject.landDetails.soilAndTopography}
              </div>
            </div>

            {/* 2. AI Requirements & Project Brief */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-purple-600" />
                2. AI Requirements & Project Brief
              </h4>
              <p className="text-slate-700 leading-relaxed text-xs">
                {selectedProject.aiRequirementsStage.lifestylePromptSummary}
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] pt-1">
                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  {selectedProject.aiRequirementsStage.bedroomCount} Bedrooms / {selectedProject.aiRequirementsStage.bathroomCount} Baths
                </span>
                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  {selectedProject.aiRequirementsStage.storeyCount} Storeys
                </span>
                {selectedProject.aiRequirementsStage.courtyardPreferred && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                    Medamidula Courtyard Included
                  </span>
                )}
                {selectedProject.aiRequirementsStage.vastuOrientationPreferred && (
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold">
                    Vastu Directional Alignment
                  </span>
                )}
              </div>
            </div>

            {/* 3. Three 2D Plan Alternatives */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-600" />
                  3. Three 2D Plan Alternatives
                </h4>
                <span className="text-[10px] text-slate-400">Architectural Schematics</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedProject.planAlternatives.map((alt) => {
                  const isSelected = selectedProject.selectedPlanKey === alt.optionKey;
                  return (
                    <div
                      key={alt.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          Option {alt.optionKey}: {alt.title}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase bg-blue-600 text-white px-1.5 py-0.2 rounded">
                            Client Choice
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                        {alt.concept}
                      </p>

                      <div className="mt-2 text-[10px] font-mono text-slate-700 flex justify-between">
                        <span>{alt.builtUpAreaSqFt} sq.ft</span>
                        <span className="font-bold">{formatLKR(alt.estimatedCostLKR)}</span>
                      </div>

                      <ul className="mt-2 space-y-0.5 border-t border-slate-200/60 pt-1.5">
                        {alt.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[10px] text-slate-500 flex items-center gap-1">
                            <span className="text-blue-500">·</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. 2D Revision & Validation Status */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                4. 2D Revision & Validation Status
              </h4>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Structural Grid</span>
                  <span className={`font-semibold ${selectedProject.planRevisionStatus.structuralGridValidated ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {selectedProject.planRevisionStatus.structuralGridValidated ? 'Validated (IESL)' : 'Pending'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Council Clearance</span>
                  <span className={`font-semibold ${selectedProject.planRevisionStatus.councilClearanceValidated ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {selectedProject.planRevisionStatus.councilClearanceValidated ? 'Cleared (UDA)' : 'In Review'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Architect Sign-off</span>
                  <span className={`font-semibold ${selectedProject.planRevisionStatus.architectSignedOff ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {selectedProject.planRevisionStatus.architectSignedOff ? 'Signed (AIA SL)' : 'Drafting'}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                <strong>Architectural Notes:</strong> {selectedProject.planRevisionStatus.notes}
              </div>
            </div>

            {/* 5. Homeowner Confirmation & 3D Model Status (Governance Guarded!) */}
            <div className={`p-4 rounded-xl border ${selectedProject.homeownerConfirmation.isConfirmed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>
              <div className="flex items-start gap-2.5">
                {selectedProject.homeownerConfirmation.isConfirmed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">
                    {selectedProject.homeownerConfirmation.isConfirmed
                      ? `Final Homeowner Confirmation Verified (${selectedProject.homeownerConfirmation.confirmedAt})`
                      : 'Final Homeowner Confirmation: Pending Client Sign-off in Portal'}
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {selectedProject.homeownerConfirmation.disclaimer}
                  </p>
                  {selectedProject.homeownerConfirmation.clientDigitalStamp && (
                    <div className="mt-1.5 font-mono text-[10px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded inline-block">
                      Client Digital Certificate: {selectedProject.homeownerConfirmation.clientDigitalStamp}
                    </div>
                  )}
                  <div className="mt-2 text-[11px] font-semibold text-slate-800">
                    3D Model Status: <span className="font-mono text-blue-700">{selectedProject.model3DStatus.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
