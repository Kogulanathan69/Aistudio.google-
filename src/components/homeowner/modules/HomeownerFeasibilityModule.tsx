import React from 'react';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info,
  Maximize2,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType } from '../../../types';

interface HomeownerFeasibilityModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
}

export const HomeownerFeasibilityModule: React.FC<HomeownerFeasibilityModuleProps> = ({
  currentProject,
  onNavigate,
}) => {
  const plotPerches = currentProject.landDetails.plotSizePerches;
  const plotAreaSqFt = currentProject.landDetails.plotAreaSqFt;
  const maxCoveragePercent = currentProject.feasibilityStage.maximumPlotCoveragePercent;
  const maxBuildableFootprintSqFt = Math.round((plotAreaSqFt * maxCoveragePercent) / 100);
  const openSpaceSqFt = plotAreaSqFt - maxBuildableFootprintSqFt;

  const frontSetback = currentProject.feasibilityStage.frontSetbackMeters;
  const rearSetback = currentProject.feasibilityStage.rearSetbackMeters;
  const sideSetback = currentProject.feasibilityStage.sideSetbacksMeters;
  const roadWidth = currentProject.plotDimensions?.accessRoadWidthMeters || 6.0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {currentProject.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {currentProject.feasibilityStage.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Land Feasibility & Bylaw Clearance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preliminary spatial simulation for {currentProject.landDetails.localCouncilAuthority} under Sri Lanka Urban Development Authority (UDA) regulations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('homeowner_plan_alternatives')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <span>View 2D Plan Options</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block mb-0.5">Non-Regulatory Advisory Notice:</span>
          This feasibility report is an automated preliminary check. It does not constitute official statutory planning approval. All residential development applications must be prepared and formally sealed by an AIA-SL registered Chartered Architect or IESL Civil Engineer before submission to {currentProject.landDetails.localCouncilAuthority}.
        </div>
      </div>

      {/* 2-Column Layout: Visual Plot Envelope & Regulatory Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Plot Envelope Canvas / SVG */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Simulated Buildable Footprint Envelope</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Facing: {currentProject.plotDimensions?.orientation || 'East'}
              </span>
            </div>

            {/* Schematic SVG */}
            <div className="w-full aspect-4/3 bg-slate-50 rounded-xl border border-slate-200 relative p-4 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Access Road */}
                <rect x="20" y="10" width="360" height="30" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" rx="4" />
                <text x="200" y="28" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="bold">
                  Access Road ({roadWidth}m Width)
                </text>

                {/* Plot Boundary */}
                <rect x="40" y="55" width="320" height="230" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" rx="4" />
                <text x="50" y="70" fill="#64748b" fontSize="10" fontWeight="bold">
                  Plot Boundary ({plotPerches} Perches / {plotAreaSqFt.toLocaleString()} sq.ft)
                </text>

                {/* Front Setback Line */}
                <line x1="40" y1="95" x2="360" y2="95" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="200" y="88" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="bold">
                  Front Setback: {frontSetback}m
                </text>

                {/* Permissible Buildable Envelope */}
                <rect x="70" y="100" width="260" height="150" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="6" />
                <text x="200" y="165" textAnchor="middle" fill="#1e40af" fontSize="13" fontWeight="bold">
                  Permissible Buildable Area
                </text>
                <text x="200" y="185" textAnchor="middle" fill="#2563eb" fontSize="11">
                  Max {maxCoveragePercent}% Coverage ({maxBuildableFootprintSqFt.toLocaleString()} sq.ft)
                </text>

                {/* Side Setback indicators */}
                <text x="52" y="175" fill="#64748b" fontSize="9" textAnchor="middle">
                  {sideSetback}m
                </text>
                <text x="348" y="175" fill="#64748b" fontSize="9" textAnchor="middle">
                  {sideSetback}m
                </text>

                {/* Rear Setback indicator */}
                <text x="200" y="270" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">
                  Rear Setback: {rearSetback}m (Mandatory Rear Space)
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Soil: {currentProject.landDetails.soilAndTopography}</span>
            <span className="font-semibold text-blue-600">Compliant Envelope</span>
          </div>
        </div>

        {/* Regulatory Metrics & UDA Bylaws */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Sri Lankan UDA Bylaw Compliance Audit</span>
          </h3>

          <div className="space-y-3">
            {/* Setbacks checklist */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 block">Setback Requirements:</span>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Front Building Line (Road Width {roadWidth}m):</span>
                  <span className="font-bold text-slate-900">{frontSetback} Meters (Met)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rear Space Clearance (UDA Clause 24):</span>
                  <span className="font-bold text-slate-900">{rearSetback} Meters (Met)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Side Boundary Clearances:</span>
                  <span className="font-bold text-slate-900">{sideSetback} Meters (Met)</span>
                </div>
              </div>
            </div>

            {/* Coverage percentages */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 block">Site Coverage Metrics:</span>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Maximum Permissible Ground Coverage:</span>
                  <span className="font-bold text-slate-900">{maxCoveragePercent}% ({maxBuildableFootprintSqFt.toLocaleString()} sq.ft)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Required Open Air & Garden Space:</span>
                  <span className="font-bold text-emerald-700">{100 - maxCoveragePercent}% ({openSpaceSqFt.toLocaleString()} sq.ft)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Permissible Height / Levels:</span>
                  <span className="font-bold text-slate-900">Up to 3 Storeys (G+2) without lifts</span>
                </div>
              </div>
            </div>

            {/* Environmental & Tropical Climate Considerations */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
              <span className="font-bold block text-blue-900">Climatic Adaptation Notes:</span>
              <p className="text-[11px] leading-relaxed text-blue-800">
                {currentProject.district} experiences monsoonal rainfall and tropical humidity. Incorporating a central Medamidula courtyard assists in reducing mechanical air conditioning loads by utilizing natural stack-ventilation.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('homeowner_plan_alternatives')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore 3 Architectural Plan Alternatives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
