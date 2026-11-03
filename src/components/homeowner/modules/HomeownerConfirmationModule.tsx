import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  FileCheck2,
  Box,
  ArrowRight,
  Stamp,
  User,
  Calendar,
} from 'lucide-react';
import { ConstructionProject, HomeownerUser, HomeownerModuleType } from '../../../types';
import { StorageService } from '../../../services/storageService';

interface HomeownerConfirmationModuleProps {
  currentProject: ConstructionProject;
  currentHomeowner: HomeownerUser;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

export const HomeownerConfirmationModule: React.FC<HomeownerConfirmationModuleProps> = ({
  currentProject,
  currentHomeowner,
  onNavigate,
  onProjectUpdated,
}) => {
  const isConfirmed = currentProject.homeownerConfirmation?.isConfirmed;
  const currentRevision = currentProject.planRevisionStatus.currentRevision || 1;
  const isValidationPassed = currentProject.planRevisionStatus.structuralGridValidated;

  const [agreementChecked, setAgreementChecked] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!agreementChecked || !disclaimerChecked) {
      setErrorMsg('Please review and check both explicit acknowledgement statements below.');
      return;
    }

    const res = StorageService.confirmProject2DPlan(currentProject.id, currentHomeowner.name);
    if (res.success && res.updatedProject) {
      onProjectUpdated(res.updatedProject);
      setSuccessMsg(res.message);
      setErrorMsg(null);
    } else {
      setErrorMsg(res.message);
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
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Revision v{currentRevision}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isConfirmed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isConfirmed ? 'Explicitly Confirmed' : 'Confirmation Required'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Final 2D Floor Plan Confirmation</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict Governance Rule: The conceptual 3D massing model is locked until the homeowner explicitly signs off on this validated plan revision.
          </p>
        </div>

        {isConfirmed && (
          <button
            onClick={() => onNavigate('homeowner_3d_viewer')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Box className="w-4 h-4 text-emerald-200" />
            <span>Launch 3D Conceptual Model</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Plan Confirmation Success:</span>
            {successMsg}
          </div>
        </div>
      )}

      {/* Main Confirmation Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Invariant Rule Banner */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block mb-0.5">Client-Only Confirmation Rule:</span>
            To protect architectural integrity, neither BuildMind Admin nor assigned Chartered Architects have authority to confirm your floor plans or force 3D model generation. This step is reserved solely for you as the homeowner. Any subsequent edit in the 2D Studio will invalidate this stamp and re-lock 3D visualization.
          </div>
        </div>

        {isConfirmed ? (
          /* Stamped Digital Confirmation Certificate */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border-2 border-emerald-500/40 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-200/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20">
                  <Unlock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    2D Floor Plan Officially Confirmed & Validated
                  </h3>
                  <p className="text-xs text-slate-500">
                    Digital stamp active on Revision v{currentRevision}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                {currentProject.homeownerConfirmation?.clientDigitalStamp || 'BM-CONFIRMED-STAMP'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Signatory</span>
                <span className="font-bold text-slate-900">{currentHomeowner.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Confirmed Option</span>
                <span className="font-bold text-slate-900">Alternative {currentProject.selectedPlanKey || 'A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Confirmed Revision</span>
                <span className="font-bold text-slate-900">Rev v{currentRevision}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp</span>
                <span className="font-bold text-slate-900">{currentProject.homeownerConfirmation?.confirmedAt || 'Just now'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-200/60 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                3D Conceptual Model is fully unlocked and ready for spatial inspection.
              </span>
              <button
                onClick={() => onNavigate('homeowner_3d_viewer')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-colors flex items-center gap-2"
              >
                <span>Launch 3D Conceptual Model</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Checklist & Signing Action */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Plan Specifications Under Review:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Project:</span>
                  <span className="font-semibold text-slate-900">{currentProject.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">District & Authority:</span>
                  <span className="font-semibold text-slate-900">{currentProject.district} • {currentProject.landDetails.localCouncilAuthority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Plan Alternative:</span>
                  <span className="font-semibold text-slate-900">Option {currentProject.selectedPlanKey || 'A'} (Rev v{currentRevision})</span>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Explicit Homeowner Approval of 2D Geometry
                  </span>
                  <span className="text-slate-500 leading-relaxed">
                    I confirm that I have reviewed the room schedule, room dimensions, courtyard placement, and door/window orientations for Revision v{currentRevision}, and authorize this layout as the basis for 3D massing.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={disclaimerChecked}
                  onChange={(e) => setDisclaimerChecked(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Non-Regulatory Advisory Acknowledgment
                  </span>
                  <span className="text-slate-500 leading-relaxed">
                    I understand that BuildMind provides preliminary AI-assisted spatial guidance and that construction approval requires physical submission of certified architectural working drawings to {currentProject.landDetails.localCouncilAuthority}.
                  </span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('homeowner_2d_editor')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                ← Back to 2D Editor
              </button>

              <button
                onClick={handleConfirm}
                disabled={!agreementChecked || !disclaimerChecked || !isValidationPassed}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm Plan & Unlock 3D Visualization</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
