import React from 'react';
import {
  Printer,
  Download,
  Building,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Box,
  Palette,
  Calculator,
  ShieldCheck,
  User,
  ArrowLeft,
} from 'lucide-react';
import { ConstructionProject, HomeownerUser, HomeownerModuleType } from '../../../types';
import { formatLKR } from '../../../services/storageService';

interface HomeownerReportModuleProps {
  currentProject: ConstructionProject;
  currentHomeowner: HomeownerUser;
  onNavigate: (module: HomeownerModuleType) => void;
}

export const HomeownerReportModule: React.FC<HomeownerReportModuleProps> = ({
  currentProject,
  currentHomeowner,
  onNavigate,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const currentRevision = currentProject.planRevisionStatus.currentRevision || 1;
  const isConfirmed = currentProject.homeownerConfirmation?.isConfirmed;
  const is3DUnlocked = isConfirmed && currentProject.model3DStatus?.status !== 'Locked - Awaiting Homeowner 2D Confirmation';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="print:hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('homeowner_dashboard')}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Architectural Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/90 shadow-md space-y-8 text-slate-800 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xl tracking-tight text-[#132A48]">BuildMind</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Architectural Planning Dossier
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sri Lankan AI-Assisted Residential Planning & Municipal Feasibility Platform
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="font-mono font-bold text-slate-900 text-sm block">{currentProject.code}</span>
            <span className="text-slate-500 block">Date: {new Date().toLocaleDateString('en-GB')}</span>
            <span className="text-emerald-700 font-semibold block">Revision v{currentRevision}</span>
          </div>
        </div>

        {/* Section 1: Project & Client Overview */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            01. Client & Site Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Homeowner Client</span>
              <span className="font-bold text-slate-900">{currentHomeowner.name}</span>
              <span className="text-[10px] text-slate-500 block">{currentHomeowner.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location & District</span>
              <span className="font-bold text-slate-900">{currentProject.district}</span>
              <span className="text-[10px] text-slate-500 block">{currentProject.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Land Area</span>
              <span className="font-bold text-slate-900">{currentProject.landDetails.plotSizePerches} Perches</span>
              <span className="text-[10px] text-slate-500 block">({currentProject.landDetails.plotAreaSqFt.toLocaleString()} sq.ft)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Planning Authority</span>
              <span className="font-bold text-slate-900 truncate block">{currentProject.landDetails.localCouncilAuthority}</span>
              <span className="text-[10px] text-slate-500 block">UDA Western/Northern</span>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory UDA Feasibility */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            02. Statutory UDA Feasibility Audit
          </h3>
          <div className="p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-400 block">Front Setback:</span>
                <span className="font-bold text-slate-900">{currentProject.feasibilityStage.frontSetbackMeters}m (Road: {currentProject.plotDimensions?.accessRoadWidthMeters || 6}m)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Rear Setback:</span>
                <span className="font-bold text-slate-900">{currentProject.feasibilityStage.rearSetbackMeters}m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Side Setbacks:</span>
                <span className="font-bold text-slate-900">{currentProject.feasibilityStage.sideSetbacksMeters}m</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              {currentProject.feasibilityStage.notes}
            </p>
          </div>
        </div>

        {/* Section 3: Confirmed 2D Layout Geometry */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            03. Confirmed 2D Architectural Layout (Revision v{currentRevision})
          </h3>
          <div className="p-5 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {currentProject.planAlternatives.find((a) => a.optionKey === currentProject.selectedPlanKey)?.title || `Option ${currentProject.selectedPlanKey || 'A'}`}
                </h4>
                <p className="text-xs text-slate-500">
                  Total Built Footprint: {currentProject.costEstimateLKR.costPerSqFtLKR ? Math.round(currentProject.costEstimateLKR.totalEstimateLKR / currentProject.costEstimateLKR.costPerSqFtLKR) : 2150} sq.ft
                </p>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isConfirmed ? 'Client Digitally Confirmed' : 'Pending Client Confirmation'}
                </span>
                {currentProject.homeownerConfirmation?.clientDigitalStamp && (
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                    Stamp: {currentProject.homeownerConfirmation.clientDigitalStamp}
                  </span>
                )}
              </div>
            </div>

            {/* Room List Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {(currentProject.interactiveFloorPlan?.rooms || []).map((r) => (
                <div key={r.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-800 block truncate">{r.name}</span>
                  <span className="text-[10px] text-slate-500">{r.width}' × {r.length}' ({r.width * r.length} sq.ft)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: 3D Visualization & Interior Material Selections */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            04. Conceptual 3D Model & Material Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 block">3D Volumetric Status</span>
              <p className="text-slate-600">
                Status: <strong className={is3DUnlocked ? 'text-emerald-700' : 'text-slate-700'}>
                  {is3DUnlocked ? 'Ready for Spatial Review' : 'Locked (Awaiting 2D Confirmation)'}
                </strong>
              </p>
              <p className="text-[11px] text-slate-500">
                PBR clay terracotta pitched roof, open-to-sky Medamidula stack-cooling chimney, and perimeter timber verandah pillars.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 block">Interior Finishes Selected</span>
              <p className="text-slate-600">
                Cut-cement grey titanium, granite cobblestone Medamidula court, Kumbuk timber rafters, and Ceylon teak millwork.
              </p>
              <p className="text-[11px] text-slate-500">
                All selected materials conform to tropical humidity resilience standards.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Estimated Bill of Quantities & LKR Budget */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            05. Construction Rate Estimate (LKR)
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Projected Investment</span>
              <span className="text-xl font-extrabold text-blue-700">
                {formatLKR(currentProject.costEstimateLKR.totalEstimateLKR)}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Derived from {currentProject.district} BSR indices (~ Rs. {currentProject.costEstimateLKR.costPerSqFtLKR.toLocaleString()}/sq.ft)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700 block">Includes 10% Contingency</span>
              <span className="text-[11px] text-slate-500">Excludes luxury landscape features</span>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer & Professional Sign-off */}
        <div className="pt-6 border-t-2 border-slate-200 text-[11px] text-slate-500 space-y-3">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <strong>Statutory Disclaimer:</strong> This document is generated by BuildMind as an architectural conceptual planning dossier. Formal municipal council clearance requires official drawings certified by a corporate member of the Sri Lanka Institute of Architects (SLIA) or Institution of Engineers Sri Lanka (IESL).
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-bold text-slate-900">Assigned Architectural Lead:</p>
              <p>{currentProject.leadStaffName} (Chartered Architect)</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">Homeowner Authorizing Signature:</p>
              <p className="font-mono text-emerald-800 font-semibold">{currentHomeowner.name} (Signed Digitally)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
