import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building,
  Save,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  MapPin,
  Info,
} from 'lucide-react';
import { ConstructionRate, HomeownerUser, ConstructionProject, SriLankanDistrict } from '../../types';
import { districtFactors } from '../../data/mockData';
import { Modal } from '../common/Modal';
import { formatLKR, formatShortLKR } from '../../services/storageService';

interface CostEstimatorModuleProps {
  rates: ConstructionRate[];
  homeowners: HomeownerUser[];
  projects: ConstructionProject[];
  onApplyEstimateToProject?: (projectId: string, budgetLKR: number) => void;
}

export const CostEstimatorModule: React.FC<CostEstimatorModuleProps> = ({
  rates,
  homeowners,
  projects,
  onApplyEstimateToProject,
}) => {
  // Parameters
  const [plotPerches, setPlotPerches] = useState<number>(15.0);
  const [builtUpArea, setBuiltUpArea] = useState<number>(3150);
  const [qualityGrade, setQualityGrade] = useState<'standard' | 'premium' | 'luxury'>('premium');
  const [floorLevels, setFloorLevels] = useState<number>(2); // 1 = Single Storey, 2 = G+1, 3 = G+2, 4 = G+3
  const [selectedDistrict, setSelectedDistrict] = useState<SriLankanDistrict>('Jaffna');
  const [includeCourtyard, setIncludeCourtyard] = useState<boolean>(true);
  const [includeSolar, setIncludeSolar] = useState<boolean>(true);
  const [includeRainwaterHarvesting, setIncludeRainwaterHarvesting] = useState<boolean>(true);
  const [contingencyPercent, setContingencyPercent] = useState<number>(8);
  const [architecturalFeePercent, setArchitecturalFeePercent] = useState<number>(4.5);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || '');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string>('');

  // Look up current district rates from schedule
  const cementRate = rates.find((r) => r.name.includes('Cement'))?.baseRateLKR || 2350;
  const steelRate = rates.find((r) => r.name.includes('Steel'))?.baseRateLKR || 365000;
  const sandRate = rates.find((r) => r.name.includes('Sand'))?.baseRateLKR || 24500;
  const rmcRate = rates.find((r) => r.name.includes('Ready Mix'))?.baseRateLKR || 32000;
  const masonRate = rates.find((r) => r.name.includes('Mason'))?.baseRateLKR || 4500;
  const electricianRate = rates.find((r) => r.name.includes('Electrician'))?.baseRateLKR || 4200;

  const currentDistrictFactor =
    districtFactors.find((d) => d.district === selectedDistrict) || districtFactors[0];

  const qualityMultipliers = {
    standard: 1.0,
    premium: 1.25,
    luxury: 1.6,
  };

  const floorMultipliers: Record<number, number> = {
    1: 1.0,
    2: 1.08,
    3: 1.18,
    4: 1.28,
  };

  // Calculation in LKR
  const estimation = useMemo(() => {
    const qMult = qualityMultipliers[qualityGrade];
    const fMult = floorMultipliers[floorLevels] || 1.0;
    const dMult = currentDistrictFactor.multiplier;

    // 1. RCC Substructure & Frame (Steel rebars, PCC cement, aggregates, RMC pours)
    // In Sri Lanka, structural framing typically consumes ~0.0032 tons of steel and 0.45 bags cement per sq.ft
    const steelCost = builtUpArea * 0.0034 * steelRate * dMult;
    const cementCost = builtUpArea * 0.44 * cementRate * dMult;
    const concreteRmcCost = builtUpArea * 0.08 * rmcRate * dMult;
    const structuralTotal = (steelCost + cementCost + concreteRmcCost) * fMult;

    // 2. Masonry, Brickwork & Plaster (Wire-cut clay bricks, sand-cement plaster)
    const masonryTotal = builtUpArea * 1850 * qMult * dMult;

    // 3. MEP (Electrical distribution, solar hot water, smart piping, rainwater harvesting)
    const baseMep = builtUpArea * 1450 * qMult * dMult;
    const solarSystemCost = includeSolar ? 1850000 : 0;
    const rainwaterCost = includeRainwaterHarvesting ? 480000 : 0;
    const mepTotal = baseMep + solarSystemCost + rainwaterCost;

    // 4. Finishes, Floorings & Fenestrations
    const baseFinishingPerSqFt = qualityGrade === 'luxury' ? 4200 : qualityGrade === 'premium' ? 2600 : 1600;
    const finishingTotal = builtUpArea * baseFinishingPerSqFt * dMult;

    // 5. Direct Trade Labor (Master masons, carpenters, bar benders)
    // Avg 1.35 man-days per 10 sq.ft
    const laborDays = (builtUpArea / 10) * 1.35 * fMult;
    const avgTradeWage = (masonRate + electricianRate) / 2;
    const laborTotal = laborDays * avgTradeWage * dMult;

    // 6. Courtyard (Medamidula) & Landscape civil works
    const courtyardCost = includeCourtyard ? 850000 * dMult : 0;

    // Subtotal
    const directCost = structuralTotal + masonryTotal + mepTotal + finishingTotal + laborTotal + courtyardCost;

    // Contingency & Architectural Fee
    const contingencyCost = directCost * (contingencyPercent / 100);
    const architecturalFee = (directCost + contingencyCost) * (architecturalFeePercent / 100);

    const grandTotalLKR = directCost + contingencyCost + architecturalFee;
    const costPerSqFtLKR = grandTotalLKR / (builtUpArea || 1);

    return {
      structuralTotal,
      masonryTotal,
      mepTotal,
      finishingTotal,
      laborTotal,
      courtyardCost,
      directCost,
      contingencyCost,
      architecturalFee,
      grandTotalLKR,
      costPerSqFtLKR,
    };
  }, [
    builtUpArea,
    qualityGrade,
    floorLevels,
    selectedDistrict,
    includeCourtyard,
    includeSolar,
    includeRainwaterHarvesting,
    contingencyPercent,
    architecturalFeePercent,
    cementRate,
    steelRate,
    sandRate,
    rmcRate,
    masonRate,
    electricianRate,
    currentDistrictFactor,
  ]);

  const handleSaveToProject = () => {
    if (!targetProjectId) return;
    if (onApplyEstimateToProject) {
      onApplyEstimateToProject(targetProjectId, Math.round(estimation.grandTotalLKR));
    }
    setSavedSuccessMsg(`Project architectural estimate updated to ${formatLKR(estimation.grandTotalLKR)}!`);
    setTimeout(() => {
      setIsSaveModalOpen(false);
      setSavedSuccessMsg('');
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Parametric Architectural Cost Estimator (Sri Lanka)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimate residential project budgets in Sri Lankan Rupees (LKR Rs.) driven by active district rates and architectural parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save to Project</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Output Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Land, Area & Quality */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Land Perches, Area & Quality Grade
            </h3>

            {/* District Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target District & Regional Delivery Factor
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value as SriLankanDistrict)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {districtFactors.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.label} ({d.multiplier}x factor)
                  </option>
                ))}
              </select>
            </div>

            {/* Built-up area slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-slate-700">Built-Up Area (sq.ft)</label>
                <span className="font-mono font-bold text-blue-600 tabular-nums">
                  {builtUpArea.toLocaleString()} sq.ft
                </span>
              </div>
              <input
                type="range"
                min="1200"
                max="8000"
                step="50"
                value={builtUpArea}
                onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>1,200 sq.ft</span>
                <span>4,000 sq.ft</span>
                <span>8,000 sq.ft</span>
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Architectural Finishes Specification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['standard', 'premium', 'luxury'] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setQualityGrade(grade)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize transition-all border text-center ${
                      qualityGrade === grade
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {qualityGrade === 'standard' && 'Local ceramic tiles, UPVC glazed windows, standard PCC concrete.'}
                {qualityGrade === 'premium' && 'Large format vitrified tiles, teak entrance joinery, powder-coated aluminum.'}
                {qualityGrade === 'luxury' && 'Italian marble accents, imported sanitaryware, custom Kumbuk timber decks.'}
              </p>
            </div>

            {/* Storeys */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Building Height / Storeys
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { level: 1, label: 'Single Storey' },
                  { level: 2, label: 'G + 1 Floor' },
                  { level: 3, label: 'G + 2 Floors' },
                  { level: 4, label: 'G + 3 Floors' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setFloorLevels(item.level)}
                    className={`py-2 rounded-lg font-semibold transition-all border text-center ${
                      floorLevels === item.level
                        ? 'bg-[#132A48] text-white border-[#132A48]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Tropical Architectural Elements */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Tropical Modernist Systems & Contingencies
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Open-to-Sky Courtyard (Medamidula)</div>
                  <div className="text-[11px] text-slate-500">Natural stack cooling, internal garden & drainage</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeCourtyard}
                  onChange={(e) => setIncludeCourtyard(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Rooftop Solar PV Array (5kW Hybrid)</div>
                  <div className="text-[11px] text-slate-500">Tier-1 monocrystalline panels with CEB net-metering</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeSolar}
                  onChange={(e) => setIncludeSolar(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Rainwater Harvesting Sump & Filters</div>
                  <div className="text-[11px] text-slate-500">5,000L underground concrete storage tank</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeRainwaterHarvesting}
                  onChange={(e) => setIncludeRainwaterHarvesting(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contingency (%)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={contingencyPercent}
                  onChange={(e) => setContingencyPercent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Architectural Fee (%)</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  step="0.5"
                  value={architecturalFeePercent}
                  onChange={(e) => setArchitecturalFeePercent(Number(e.target.value) || 4.5)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: LKR Output Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Banner Card */}
          <div className="bg-[#132A48] text-white rounded-xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Estimated Total Residential Build (LKR)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight mt-1">
                  {formatLKR(estimation.grandTotalLKR)}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Comprehensive Sri Lankan architectural estimate in {selectedDistrict} District
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-xs text-slate-300">Unit Construction Benchmark</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  Rs. {Math.round(estimation.costPerSqFtLKR).toLocaleString()}
                  <span className="text-xs text-slate-300 font-normal"> / sq.ft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Parametric Category Breakdown ({selectedDistrict} Pricing)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Index: Schedule 2024
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Structural */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    RCC Substructure, Foundation & Structural Frame
                  </div>
                  <div className="text-[11px] text-slate-500">
                    TMT 500 steel, PCC cement ({cementRate}/bag), and RMC concrete pours
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="font-bold text-slate-900 text-sm">
                    {formatLKR(estimation.structuralTotal)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((estimation.structuralTotal / estimation.grandTotalLKR) * 100)}% of total
                  </div>
                </div>
              </div>

              {/* Masonry */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Masonry, Clay Bricks & Plastering</div>
                  <div className="text-[11px] text-slate-500">
                    Kiln-fired clay bricks, river sand mortar, internal smooth lime plaster
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="font-bold text-slate-900 text-sm">
                    {formatLKR(estimation.masonryTotal)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((estimation.masonryTotal / estimation.grandTotalLKR) * 100)}% of total
                  </div>
                </div>
              </div>

              {/* MEP */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">MEP, Solar, Electrical & Drainage</div>
                  <div className="text-[11px] text-slate-500">
                    Three-phase wiring, solar net metering, rainwater sump, soakage pit
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="font-bold text-slate-900 text-sm">
                    {formatLKR(estimation.mepTotal)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((estimation.mepTotal / estimation.grandTotalLKR) * 100)}% of total
                  </div>
                </div>
              </div>

              {/* Finishing */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Finishes, Vitrified Tiles & Timber Fenestration</div>
                  <div className="text-[11px] text-slate-500">
                    Porcelain tiles, teak doors, aluminum windows, weatherproof exterior paint
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="font-bold text-slate-900 text-sm">
                    {formatLKR(estimation.finishingTotal)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((estimation.finishingTotal / estimation.grandTotalLKR) * 100)}% of total
                  </div>
                </div>
              </div>

              {/* Labor */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Direct Skilled Trade Labor (Sri Lankan Wages)</div>
                  <div className="text-[11px] text-slate-500">
                    Master masons, bar benders, licensed CEB wiremen, carpenters
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="font-bold text-slate-900 text-sm">
                    {formatLKR(estimation.laborTotal)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((estimation.laborTotal / estimation.grandTotalLKR) * 100)}% of total
                  </div>
                </div>
              </div>

              {/* Contingency & Architect fee */}
              <div className="p-3 rounded-lg bg-blue-50/40 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    Contingency ({contingencyPercent}%) & Architectural Fee ({architecturalFeePercent}%)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Price escalation reserve + complete AIA SL architectural drawings package
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="font-bold text-blue-800 text-sm">
                    {formatLKR(estimation.contingencyCost + estimation.architecturalFee)}
                  </div>
                  <div className="text-[10px] text-slate-400">Governance & Design</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save to Project Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Apply Calculated Estimate to Project Pipeline"
        subtitle="Saves parametric estimate into an active Sri Lankan architectural pipeline."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {savedSuccessMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{savedSuccessMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Target Project</label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code}: {p.title} ({p.district} - {formatShortLKR(p.costEstimateLKR.totalEstimateLKR)})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between mb-1">
              <span className="text-slate-500">New Estimate Value:</span>
              <span className="font-mono font-bold text-slate-900">
                {formatLKR(estimation.grandTotalLKR)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Design Area:</span>
              <span className="font-mono text-slate-700">{builtUpArea.toLocaleString()} sq.ft</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-500">Benchmark:</span>
              <span className="font-mono text-blue-700 font-semibold">
                Rs. {Math.round(estimation.costPerSqFtLKR).toLocaleString()}/sq.ft
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveToProject}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Commit Estimate Revision
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
