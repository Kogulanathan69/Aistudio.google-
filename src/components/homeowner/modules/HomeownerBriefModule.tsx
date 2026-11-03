import React, { useState } from 'react';
import {
  FileCheck2,
  Edit3,
  Save,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  User,
  Layers,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType } from '../../../types';
import { StorageService, formatLKR } from '../../../services/storageService';

interface HomeownerBriefModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

export const HomeownerBriefModule: React.FC<HomeownerBriefModuleProps> = ({
  currentProject,
  onNavigate,
  onProjectUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [briefSummary, setBriefSummary] = useState(
    currentProject.projectBrief.briefSummary ||
      `Residential architectural planning brief for ${currentProject.title} located on ${currentProject.landDetails.plotSizePerches} perches in ${currentProject.district}. Designed for tropical passive cooling, central courtyard (Medamidula) air flow, dual wet/dry culinary workflow, and strict compliance with ${currentProject.landDetails.localCouncilAuthority} bylaws.`
  );
  const [status, setStatus] = useState(currentProject.projectBrief.status);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBrief = () => {
    const updated = StorageService.updateProjectBrief(currentProject.id, briefSummary, status);
    if (updated) {
      onProjectUpdated(updated);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleConfirmAndApprove = () => {
    const updated = StorageService.updateProjectBrief(
      currentProject.id,
      briefSummary,
      'Approved by Client'
    );
    if (updated) {
      setStatus('Approved by Client');
      onProjectUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {currentProject.code}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                status === 'Approved by Client'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Architectural Project Brief</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal architectural synthesis defining functional scope, room allocation, and climatic performance criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveBrief}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Brief</span>
            </button>
          )}

          {status !== 'Approved by Client' && (
            <button
              onClick={handleConfirmAndApprove}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Approve Brief</span>
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Project brief updated and recorded in project audit history.</span>
        </div>
      )}

      {/* Brief Document Content */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Section 1: Executive Summary */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            1. Executive Scope & Living Vision
          </h3>
          {isEditing ? (
            <textarea
              rows={4}
              value={briefSummary}
              onChange={(e) => setBriefSummary(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-blue-300 text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm leading-relaxed text-slate-800">
              {briefSummary}
            </div>
          )}
        </div>

        {/* Section 2: Site & Regulatory Parameters */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            2. Site Dimensions & Statutory Bylaws
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Land Area</span>
              <span className="font-bold text-slate-900">{currentProject.landDetails.plotSizePerches} Perches</span>
              <span className="text-[10px] text-slate-500 block">({currentProject.landDetails.plotAreaSqFt.toLocaleString()} sq.ft)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Authority</span>
              <span className="font-bold text-slate-900 truncate block">{currentProject.landDetails.localCouncilAuthority}</span>
              <span className="text-[10px] text-slate-500 block">UDA Western/Northern</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Zoning</span>
              <span className="font-bold text-slate-900 truncate block">Residential (R1/R2)</span>
              <span className="text-[10px] text-slate-500 block">Max 65% Ground Coverage</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Access Road</span>
              <span className="font-bold text-slate-900">
                {currentProject.plotDimensions?.accessRoadWidthMeters || 6.0} Meters
              </span>
              <span className="text-[10px] text-slate-500 block">3.0m Setback Line</span>
            </div>
          </div>
        </div>

        {/* Section 3: Room Schedule & Spatial Program */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            3. Functional Room Program
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Ground Floor Living & Hospitality</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>Spacious entrance Verandah (Pil-potha) with timber columns</li>
                <li>High-volume Living Pavilion opening towards garden</li>
                <li>Central open-to-sky Medamidula Courtyard with rain drain</li>
                <li>Formal 8-person Dining Area adjoining courtyard</li>
                <li>Dry show pantry with island breakfast bar</li>
                <li>Wet kitchen with service entry and store</li>
                <li>Guest washroom / powder room</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Private Accommodations & Levels</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>Master Bedroom Suite ({currentProject.aiRequirementsStage.vastuOrientationPreferred ? 'South-West / Niruthi' : 'Private Wing'})</li>
                <li>Ensuite master bathroom with walk-in closet</li>
                <li>{currentProject.aiRequirementsStage.bedroomCount - 1} Additional family bedrooms with built-in robes</li>
                <li>{currentProject.aiRequirementsStage.bathroomCount - 1} Common & attached bathrooms</li>
                <li>Upper-level family entertainment lounge & study</li>
                <li>Double vehicle covered car porch</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Budget & Financial Cap */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Financial Allocation</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
              {formatLKR(currentProject.costEstimateLKR.totalEstimateLKR)}
            </p>
            <p className="text-xs text-slate-500">
              Benchmark rate ~ Rs. {currentProject.costEstimateLKR.costPerSqFtLKR.toLocaleString()}/sq.ft based on published {currentProject.district} indices.
            </p>
          </div>

          <button
            onClick={() => onNavigate('homeowner_feasibility')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 shrink-0 transition-colors"
          >
            <span>Proceed to Land Feasibility Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
