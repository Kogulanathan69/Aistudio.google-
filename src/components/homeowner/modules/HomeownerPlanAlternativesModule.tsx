import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Maximize2,
  DollarSign,
  Compass,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType, PlanAlternative } from '../../../types';
import { StorageService, formatLKR } from '../../../services/storageService';

interface HomeownerPlanAlternativesModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

export const HomeownerPlanAlternativesModule: React.FC<HomeownerPlanAlternativesModuleProps> = ({
  currentProject,
  onNavigate,
  onProjectUpdated,
}) => {
  const [selectedKey, setSelectedKey] = useState<'A' | 'B' | 'C'>(
    currentProject.selectedPlanKey || 'A'
  );
  const [previewOption, setPreviewOption] = useState<PlanAlternative>(
    currentProject.planAlternatives.find((a) => a.optionKey === selectedKey) ||
      currentProject.planAlternatives[0]
  );
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleSelectAlternative = (optionKey: 'A' | 'B' | 'C') => {
    setSelectedKey(optionKey);
    const updated = StorageService.selectPlanAlternative(currentProject.id, optionKey);
    if (updated) {
      onProjectUpdated(updated);
      setNotificationMsg(`Option ${optionKey} selected and loaded into 2D Studio. 3D visualization locked pending final 2D confirmation.`);
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {currentProject.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Selected: Option {selectedKey}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Three 2D Plan Alternatives</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Three genuinely different architectural floor layouts generated specifically for your {currentProject.landDetails.plotSizePerches}-perch site in {currentProject.district}.
          </p>
        </div>

        <button
          onClick={() => onNavigate('homeowner_2d_editor')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <span>Open Interactive 2D Editor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 3 Alternatives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {currentProject.planAlternatives.map((alt) => {
          const isSelected = selectedKey === alt.optionKey;
          const isPreview = previewOption.optionKey === alt.optionKey;

          return (
            <div
              key={alt.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {alt.optionKey}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Alternative {alt.optionKey}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-2">{alt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{alt.concept}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Built-Up Area</span>
                    <span className="font-bold text-slate-900">{alt.builtUpAreaSqFt.toLocaleString()} sq.ft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Estimated Cost</span>
                    <span className="font-bold text-blue-700">{formatLKR(alt.estimatedCostLKR)}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Architectural Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {alt.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isSelected ? (
                  <button
                    onClick={() => onNavigate('homeowner_2d_editor')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Edit in 2D Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectAlternative(alt.optionKey)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    Select Option {alt.optionKey}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
