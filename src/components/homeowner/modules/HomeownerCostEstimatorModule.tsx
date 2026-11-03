import React, { useState } from 'react';
import {
  Calculator,
  Download,
  Printer,
  DollarSign,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ConstructionProject, HomeownerModuleType } from '../../../types';
import { formatLKR, formatShortLKR } from '../../../services/storageService';

interface HomeownerCostEstimatorModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
}

export const HomeownerCostEstimatorModule: React.FC<HomeownerCostEstimatorModuleProps> = ({
  currentProject,
  onNavigate,
}) => {
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [architecturalFeePercent, setArchitecturalFeePercent] = useState<number>(4);

  const baseCost = currentProject.costEstimateLKR.totalEstimateLKR || 32000000;
  const areaSqFt =
    currentProject.planAlternatives.find((a) => a.optionKey === currentProject.selectedPlanKey)
      ?.builtUpAreaSqFt || 2150;

  // Breakdown items with realistic Sri Lankan percentages
  const substructure = Math.round(baseCost * 0.18);
  const superstructure = Math.round(baseCost * 0.32);
  const roofing = Math.round(baseCost * 0.16);
  const finishes = Math.round(baseCost * 0.18);
  const mep = Math.round(baseCost * 0.16);

  const subtotal = substructure + superstructure + roofing + finishes + mep;
  const contingency = Math.round(subtotal * (contingencyPercent / 100));
  const architecturalFee = Math.round(subtotal * (architecturalFeePercent / 100));
  const grandTotalLKR = subtotal + contingency + architecturalFee;

  const costPerSqFt = Math.round(grandTotalLKR / areaSqFt);

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
              Option {currentProject.selectedPlanKey || 'A'} • {currentProject.district} BSR
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Construction Cost Estimation (LKR)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bill of Quantities (BOQ) model derived from approved Sri Lankan Building Schedule of Rates (BSR 2024).
          </p>
        </div>

        <button
          onClick={() => onNavigate('homeowner_project_report')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <span>Generate Final Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Estimated Cost</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatLKR(grandTotalLKR)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Incl. {contingencyPercent}% contingency & fees</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cost per Square Foot</span>
          <p className="text-xl font-bold text-blue-600 mt-1">Rs. {costPerSqFt.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{areaSqFt.toLocaleString()} sq.ft built-up area</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Regional Factor ({currentProject.district})</span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {currentProject.district === 'Colombo' ? '1.08x' : currentProject.district === 'Jaffna' ? '1.14x' : '1.02x'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Includes transport & sand delivery index</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contingency Reserve</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatLKR(contingency)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Guards against material price spikes</p>
        </div>
      </div>

      {/* Itemized BOQ Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Bill of Quantities Trade Summary</span>
          </h3>
          <span className="text-xs text-slate-500">All prices formatted in Sri Lankan Rupees (Rs.)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Trade / Work Item</th>
                <th className="pb-3">Description & Material Basis</th>
                <th className="pb-3 text-right">Allocation</th>
                <th className="pb-3 text-right">Subtotal (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-bold text-slate-900">01. Substructure & Foundation</td>
                <td className="py-3 text-slate-600">Site clearance, random rubble masonry, DPC, Grade 25 concrete footings</td>
                <td className="py-3 text-right font-mono text-slate-500">18%</td>
                <td className="py-3 text-right font-bold text-slate-900">{formatLKR(substructure)}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">02. Superstructure & Walls</td>
                <td className="py-3 text-slate-600">Wire-cut brickwork, RCC columns, tie-beams, lintels and lintel bands</td>
                <td className="py-3 text-right font-mono text-slate-500">32%</td>
                <td className="py-3 text-right font-bold text-slate-900">{formatLKR(superstructure)}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">03. Roof & Verandah Framework</td>
                <td className="py-3 text-slate-600">Treated timber rafters, purlins, Sinhala terracotta clay tiles & thermal foil</td>
                <td className="py-3 text-right font-mono text-slate-500">16%</td>
                <td className="py-3 text-right font-bold text-slate-900">{formatLKR(roofing)}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">04. Surface Finishes & Joinery</td>
                <td className="py-3 text-slate-600">Titanium flooring, matte porcelain tiles, Kumbuk sash doors & windows</td>
                <td className="py-3 text-right font-mono text-slate-500">18%</td>
                <td className="py-3 text-right font-bold text-slate-900">{formatLKR(finishes)}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">05. MEP & Environmental</td>
                <td className="py-3 text-slate-600">Three-phase concealed wiring, sanitary plumbing, rainwater harvesting tank</td>
                <td className="py-3 text-right font-mono text-slate-500">16%</td>
                <td className="py-3 text-right font-bold text-slate-900">{formatLKR(mep)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 text-slate-700 font-semibold">
                <td colSpan={3} className="pt-3 text-right">Direct Construction Subtotal:</td>
                <td className="pt-3 text-right font-bold text-slate-900">{formatLKR(subtotal)}</td>
              </tr>
              <tr className="text-slate-600">
                <td colSpan={3} className="pt-1.5 text-right">Physical Contingency ({contingencyPercent}%):</td>
                <td className="pt-1.5 text-right font-bold text-slate-800">{formatLKR(contingency)}</td>
              </tr>
              <tr className="text-slate-600">
                <td colSpan={3} className="pt-1.5 text-right">Architectural & Engineering Fees ({architecturalFeePercent}%):</td>
                <td className="pt-1.5 text-right font-bold text-slate-800">{formatLKR(architecturalFee)}</td>
              </tr>
              <tr className="border-t-2 border-slate-900 text-slate-900 font-bold text-sm">
                <td colSpan={3} className="pt-3 text-right">Grand Total Estimated Cost:</td>
                <td className="pt-3 text-right text-blue-700 font-extrabold">{formatLKR(grandTotalLKR)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
