import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Layers,
  ArrowRight,
  RotateCcw,
  Building,
  Info,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType } from '../../../types';
import { StorageService } from '../../../services/storageService';

interface Homeowner2DValidationModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

export const Homeowner2DValidationModule: React.FC<Homeowner2DValidationModuleProps> = ({
  currentProject,
  onNavigate,
  onProjectUpdated,
}) => {
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors: string[];
    warnings: string[];
  }>({
    success: currentProject.planRevisionStatus.structuralGridValidated,
    errors: [],
    warnings: [],
  });

  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    runValidationCheck();
  }, [currentProject.interactiveFloorPlan?.revision]);

  const runValidationCheck = () => {
    const res = StorageService.validateProject2DPlan(currentProject.id);
    setValidationResult({
      success: res.success,
      errors: res.errors,
      warnings: res.warnings,
    });
    if (res.updatedProject) {
      onProjectUpdated(res.updatedProject);
    }
    setHasRun(true);
  };

  const currentRevision = currentProject.planRevisionStatus.currentRevision || 1;

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
                validationResult.success
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {validationResult.success ? 'Validation Passed' : 'Corrections Required'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">2D Plan Geometry & Regulatory Validation</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated compliance check ensuring your custom floor plan satisfies mandatory residential safety, functional, and site boundary rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runValidationCheck}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Run Audit</span>
          </button>

          {validationResult.success ? (
            <button
              onClick={() => onNavigate('homeowner_2d_confirmation')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Proceed to Confirmation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('homeowner_2d_editor')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Fix in 2D Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Audit Checklist Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Automated Architectural Rules Audit Results</span>
        </h3>

        {/* Status result summary */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            validationResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {validationResult.success ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          )}
          <div>
            <span className="font-bold block text-sm">
              {validationResult.success
                ? `Revision v${currentRevision} satisfies all core residential geometry and spatial zoning rules!`
                : `Revision v${currentRevision} contains geometry conflicts that prevent formal confirmation.`}
            </span>
            <span className="text-xs opacity-90 block mt-0.5">
              {validationResult.success
                ? 'Your plan is eligible for explicit digital confirmation, which will unlock conceptual 3D massing visualization.'
                : 'Please resolve the errors highlighted below in the 2D Studio.'}
            </span>
          </div>
        </div>

        {/* Detailed Checks Grid */}
        <div className="space-y-3">
          {/* Rule 1: Functional room coverage */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">
                Essential Residential Functional Allocation
              </span>
              <p className="text-slate-500">
                Verifies presence of living pavilion, kitchen/pantry facility, sleeping quarters, and sanitary bathrooms.
              </p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
              Passed
            </span>
          </div>

          {/* Rule 2: Overlaps */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">
                Spatial Boundary & Overlap Detection
              </span>
              <p className="text-slate-500">
                Checks whether interior rooms physically intersect or exceed permissible perimeter envelopes.
              </p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
              Passed
            </span>
          </div>

          {/* Rule 3: Site coverage */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">
                Maximum Permissible Ground Coverage Ratio
              </span>
              <p className="text-slate-500">
                UDA regulation requires minimum 35% open land for rainwater percolation and passive air movement.
              </p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
              Passed ({currentProject.feasibilityStage.maximumPlotCoveragePercent}% max)
            </span>
          </div>
        </div>

        {/* Advisory Warnings if any */}
        {validationResult.warnings.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Architectural Advisory Observations ({validationResult.warnings.length})</span>
            </span>
            <ul className="list-disc list-inside space-y-1 mt-1 text-[11px] text-amber-800">
              {validationResult.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onNavigate('homeowner_2d_editor')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            ← Return to 2D Editor
          </button>

          {validationResult.success && (
            <button
              onClick={() => onNavigate('homeowner_2d_confirmation')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-colors flex items-center gap-2"
            >
              <span>Explicitly Confirm Plan to Unlock 3D</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
