import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  MapPin,
  Calendar,
  Layers,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Compass,
  Box,
  Save,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ConstructionProject, StaffMember, HomeownerUser } from '../../../types';
import { Badge } from '../../common/Badge';
import { formatLKR } from '../../../services/storageService';

interface StaffProjectsModuleProps {
  currentStaff: StaffMember;
  assignedProjects: ConstructionProject[];
  homeowners: HomeownerUser[];
  onUpdateProjectNotes: (projectId: string, notes: string) => void;
  onNavigateToReviews: (projectId: string) => void;
}

export const StaffProjectsModule: React.FC<StaffProjectsModuleProps> = ({
  currentStaff,
  assignedProjects,
  homeowners,
  onUpdateProjectNotes,
  onNavigateToReviews,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    assignedProjects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'land' | 'ai_req' | 'feasibility' | '2d_plans' | '3d_status'>('2d_plans');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [notesSaveMsg, setNotesSaveMsg] = useState(false);

  const filteredProjects = assignedProjects.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const activeProject =
    assignedProjects.find((p) => p.id === selectedProjectId) || filteredProjects[0] || null;

  // Initialize editing notes when project changes
  React.useEffect(() => {
    if (activeProject) {
      setEditingNotes(activeProject.planRevisionStatus.notes || '');
    }
  }, [activeProject?.id]);

  const handleSaveNotes = () => {
    if (!activeProject) return;
    onUpdateProjectNotes(activeProject.id, editingNotes);
    setNotesSaveMsg(true);
    setTimeout(() => setNotesSaveMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue-600" />
            Assigned Architectural Planning Pipelines
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossiers allocated to {currentStaff.name}: AI requirements, UDA feasibility, 3 2D alternatives & spatial revisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            {assignedProjects.length} Assigned Project Pipelines
          </span>
        </div>
      </div>

      {assignedProjects.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-xs text-slate-400 text-xs">
          No architectural projects currently assigned to your account.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Project Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search assigned projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredProjects.map((p) => {
                const isSelected = p.id === activeProject?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">{p.code}</span>
                      <span className="text-[10px] text-blue-600 font-bold">{p.district}</span>
                    </div>
                    <div className="font-bold text-slate-900 truncate">{p.title}</div>
                    <div className="text-slate-500 text-[11px] truncate mt-0.5">
                      Client: {p.homeownerName}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-600">
                        {p.landDetails.plotSizePerches} Perches
                      </span>
                      <span className="text-[10px] font-semibold text-slate-800">
                        {formatLKR(p.costEstimateLKR.totalEstimateLKR)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Project Dossier (8 cols) */}
          {activeProject && (
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              {/* Dossier Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {activeProject.code}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {activeProject.district} District
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{activeProject.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client: <strong className="text-slate-800">{activeProject.homeownerName}</strong> • Site: {activeProject.location}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge variant="blue">{activeProject.currentStage}</Badge>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {formatLKR(activeProject.costEstimateLKR.totalEstimateLKR)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Rs. {activeProject.costEstimateLKR.costPerSqFtLKR.toLocaleString()}/sq.ft
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => setActiveTab('2d_plans')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === '2d_plans'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    3 2D Alternatives & Sign-off
                  </button>
                  <button
                    onClick={() => setActiveTab('land')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'land'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Land & Plot Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('ai_req')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'ai_req'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    AI Requirements & Lifestyle
                  </button>
                  <button
                    onClick={() => setActiveTab('feasibility')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === 'feasibility'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    UDA Feasibility Setbacks
                  </button>
                  <button
                    onClick={() => setActiveTab('3d_status')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === '3d_status'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    3D Model Status
                  </button>
                </div>
              </div>

              {/* Dossier Content Body */}
              <div className="p-5 text-xs space-y-4">
                {/* TAB 1: 3 2D Plan Alternatives & Sign-off */}
                {activeTab === '2d_plans' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-600" />
                        Three AI Architectural 2D Alternatives
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Selected Concept:{' '}
                        <strong className="text-blue-600 font-bold">
                          Option {activeProject.selectedPlanKey || 'None'}
                        </strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeProject.planAlternatives.map((plan) => {
                        const isSelected = activeProject.selectedPlanKey === plan.optionKey;
                        return (
                          <div
                            key={plan.id}
                            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                                : 'bg-slate-50 border-slate-200/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    isSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  Option {plan.optionKey}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500 font-semibold">
                                  {plan.builtUpAreaSqFt} sq.ft
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 text-xs mb-1">
                                {plan.title}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                                {plan.concept}
                              </p>

                              <div className="space-y-1 mb-3">
                                {plan.features.map((f, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1.5 text-[10.5px] text-slate-700"
                                  >
                                    <span className="h-1 w-1 rounded-full bg-blue-500" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900">
                                {formatLKR(plan.estimatedCostLKR)}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] text-blue-700 font-bold uppercase">
                                  Client Pick
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Strict Governance Invariant Guard */}
                    <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <Lock className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Platform Governance Rule: Client Portal Exclusivity</span>
                      </div>
                      <p className="text-amber-800 leading-relaxed text-[11px]">
                        <strong>Strict Invariant:</strong> Neither Staff nor Admin may confirm a homeowner's final 2D plan or unlock 3D generation. Plan approval and 3D unlocking must be performed solely by the homeowner ({activeProject.homeownerName}) through their secure client credentials.
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <span className="text-slate-600">Confirmation State:</span>
                        {activeProject.homeownerConfirmation.isConfirmed ? (
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Confirmed by Homeowner on {activeProject.homeownerConfirmation.confirmedAt}
                          </span>
                        ) : (
                          <span className="font-semibold text-amber-700">
                            Pending Homeowner Digital Sign-off in Client Portal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Land Details */}
                {activeTab === 'land' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Land Assessment & Site Specifications</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Plot Extent</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {activeProject.landDetails.plotSizePerches} Perches
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {activeProject.landDetails.plotAreaSqFt.toLocaleString()} sq.ft
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Survey Plan No</div>
                        <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                          {activeProject.landDetails.surveyPlanNumber}
                        </div>
                        <div className="text-[10px] text-slate-500">Licensed Cadastral Plan</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Local Council</div>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {activeProject.landDetails.localCouncilAuthority}
                        </div>
                        <div className="text-[10px] text-slate-500">{activeProject.district}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Zoning Classification</div>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProject.landDetails.zoningCategory}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Soil & Topography</div>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          {activeProject.landDetails.soilAndTopography}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: AI Requirements */}
                {activeTab === 'ai_req' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">AI Requirements & Lifestyle Brief</h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Prompt Brief Summary</span>
                        <p className="text-slate-800 leading-relaxed mt-1 text-xs">
                          {activeProject.aiRequirementsStage.lifestylePromptSummary}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400">Bedrooms</span>
                          <div className="font-bold text-slate-800">{activeProject.aiRequirementsStage.bedroomCount} Beds</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Bathrooms</span>
                          <div className="font-bold text-slate-800">{activeProject.aiRequirementsStage.bathroomCount} Baths</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Storeys</span>
                          <div className="font-bold text-slate-800">{activeProject.aiRequirementsStage.storeyCount} Levels</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Medamidula Courtyard</span>
                          <div className="font-bold text-emerald-700">
                            {activeProject.aiRequirementsStage.courtyardPreferred ? 'Requested' : 'No'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: UDA Feasibility */}
                {activeTab === 'feasibility' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Urban Development Authority (UDA) Feasibility</h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Feasibility Status</span>
                        <Badge variant={activeProject.feasibilityStage.status === 'Compliant' ? 'green' : 'amber'}>
                          {activeProject.feasibilityStage.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400">Front Setback</span>
                          <div className="font-bold text-slate-800">{activeProject.feasibilityStage.frontSetbackMeters}m</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Rear Setback</span>
                          <div className="font-bold text-slate-800">{activeProject.feasibilityStage.rearSetbackMeters}m</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Side Setbacks</span>
                          <div className="font-bold text-slate-800">{activeProject.feasibilityStage.sideSetbacksMeters}m</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Max Plot Coverage</span>
                          <div className="font-bold text-slate-800">{activeProject.feasibilityStage.maximumPlotCoveragePercent}%</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                        <strong>UDA Officer Notes:</strong> {activeProject.feasibilityStage.notes}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: 3D Model Status */}
                {activeTab === '3d_status' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">3D Photorealistic Model Generation Status</h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Generation Pipeline State:</span>
                        <Badge variant="purple">{activeProject.model3DStatus.status}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        3D rendering and walkthrough models are automatically unlocked upon client digital signature on Option {activeProject.selectedPlanKey || 'A'}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Staff Architectural Notes Section */}
                <div className="pt-4 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-slate-400" />
                      Lead Architect Notes & Review Observations
                    </label>
                    {notesSaveMsg && (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Notes Saved to LocalStorage
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Enter architectural planning notes, column adjustments, or council submission remarks..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onNavigateToReviews(activeProject.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Open Project in Review Queue →
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
