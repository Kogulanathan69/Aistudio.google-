import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MapPin,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import { HomeownerUser, SriLankanDistrict, HomeownerModuleType } from '../../../types';
import { StorageService, formatLKR } from '../../../services/storageService';

interface HomeownerNewProjectWizardProps {
  currentHomeowner: HomeownerUser;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectCreated: (projectId: string) => void;
}

export const HomeownerNewProjectWizard: React.FC<HomeownerNewProjectWizardProps> = ({
  currentHomeowner,
  onNavigate,
  onProjectCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState<SriLankanDistrict>(currentHomeowner.district || 'Jaffna');
  const [location, setLocation] = useState(currentHomeowner.propertyAddress || '');
  const [localCouncilAuthority, setLocalCouncilAuthority] = useState(currentHomeowner.localCouncilAuthority || 'Jaffna Municipal Council');

  // Land Dimensions
  const [plotSizePerches, setPlotSizePerches] = useState<number>(currentHomeowner.plotSizePerches || 12);
  const [frontageMeters, setFrontageMeters] = useState<number>(14);
  const [depthMeters, setDepthMeters] = useState<number>(23);
  const [accessRoadWidthMeters, setAccessRoadWidthMeters] = useState<number>(6);
  const [orientation, setOrientation] = useState<'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West'>('East');

  // Architectural Preferences
  const [storeyCount, setStoreyCount] = useState<number>(2);
  const [bedroomCount, setBedroomCount] = useState<number>(4);
  const [bathroomCount, setBathroomCount] = useState<number>(3);
  const [courtyardPreferred, setCourtyardPreferred] = useState<boolean>(true);
  const [vastuOrientationPreferred, setVastuOrientationPreferred] = useState<boolean>(true);

  // Budget
  const [targetBudgetLKR, setTargetBudgetLKR] = useState<number>(currentHomeowner.budgetCapLKR || 32000000);

  // Calculated Plot Area in sq.ft
  const plotAreaSqFt = Math.round(plotSizePerches * 272.25);
  // Estimated Built footprint at 60% coverage
  const maxFootprintSqFt = Math.round(plotAreaSqFt * 0.65);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || `Residential Villa on ${plotSizePerches} Perches`;

    const newProject = StorageService.createHomeownerProject({
      homeownerId: currentHomeowner.id,
      title: finalTitle,
      district,
      location,
      plotSizePerches,
      frontageMeters,
      depthMeters,
      orientation,
      accessRoadWidthMeters,
      targetBudgetLKR,
      storeyCount,
      bedroomCount,
      bathroomCount,
      courtyardPreferred,
      vastuOrientationPreferred,
      localCouncilAuthority,
    });

    onProjectCreated(newProject.id);
    onNavigate('homeowner_ai_chat');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">New Project Planning Wizard</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Specify your land boundary parameters, municipal council, and living requirements for AI architectural layout generation.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
            Step {step} of 4
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[
            { s: 1, title: 'Location & Council' },
            { s: 2, title: 'Land & Dimensions' },
            { s: 3, title: 'Living Requirements' },
            { s: 4, title: 'Budget & Confirm' },
          ].map((item) => (
            <div key={item.s} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= item.s ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
              <span className={`text-[11px] font-medium block truncate ${
                step === item.s ? 'text-blue-700 font-bold' : 'text-slate-400'
              }`}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Project Identity & Sri Lankan Authority</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Designate your land parcel to load relevant UDA bylaws and regional construction indices.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title / Residence Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Villa Medamidula, Palm Haven Residence, Sigiriya View Villa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sri Lankan District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      const d = e.target.value as SriLankanDistrict;
                      setDistrict(d);
                      if (d === 'Jaffna') setLocalCouncilAuthority('Jaffna Municipal Council');
                      else if (d === 'Colombo') setLocalCouncilAuthority('Colombo Municipal Council');
                      else if (d === 'Kandy') setLocalCouncilAuthority('Kandy Municipal Council');
                      else if (d === 'Gampaha') setLocalCouncilAuthority('Gampaha Municipal Council');
                      else if (d === 'Kurunegala') setLocalCouncilAuthority('Kurunegala Municipal Council');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    <option value="Jaffna">Jaffna District</option>
                    <option value="Colombo">Colombo District</option>
                    <option value="Kandy">Kandy District</option>
                    <option value="Gampaha">Gampaha District</option>
                    <option value="Kurunegala">Kurunegala District</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Local Council / Planning Authority
                  </label>
                  <input
                    type="text"
                    value={localCouncilAuthority}
                    onChange={(e) => setLocalCouncilAuthority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property Address / Street Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. No. 42, Temple Road, Nallur, Jaffna"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Land Geometry & Access Road</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Building setbacks under Sri Lanka UDA rules depend directly on road width and plot perimeter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-blue-900">Plot Extent in Perches:</span>
                  <p className="text-xs text-blue-700">1 Perch = 272.25 sq.ft (Sri Lankan statutory land metric)</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="3"
                    max="100"
                    step="0.5"
                    value={plotSizePerches}
                    onChange={(e) => setPlotSizePerches(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 rounded-lg border border-blue-300 text-base font-bold text-blue-900 bg-white text-right"
                  />
                  <span className="text-sm font-semibold text-blue-900">= {plotAreaSqFt.toLocaleString()} sq.ft</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Road Frontage Width (Meters)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={frontageMeters}
                  onChange={(e) => setFrontageMeters(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Plot Depth (Meters)
                </label>
                <input
                  type="number"
                  min="8"
                  max="150"
                  value={depthMeters}
                  onChange={(e) => setDepthMeters(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Access Road Width (Meters)
                </label>
                <select
                  value={accessRoadWidthMeters}
                  onChange={(e) => setAccessRoadWidthMeters(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value={4.5}>4.5 m (Secondary lane - front setback 4.5m required)</option>
                  <option value={6}>6.0 m (Standard residential road - front setback 3.0m)</option>
                  <option value={9}>9.0 m (Major municipal thoroughfare)</option>
                  <option value={12}>12.0 m+ (Principal highway or boulevard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Plot Orientation (Front Facing)
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="East">East (Morning Sun / Traditional auspicious)</option>
                  <option value="North">North (Even diffused daylight)</option>
                  <option value="North-East">North-East (Eshanya - Sacred Vastu Corner)</option>
                  <option value="South">South (Prevailing monsoon breezes)</option>
                  <option value="South-East">South-East (Agni)</option>
                  <option value="West">West (Afternoon solar exposure)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Residential Lifestyle & Tropical Features</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI uses these functional requirements to formulate 3 distinct architectural alternatives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Storeys / Levels
                </label>
                <select
                  value={storeyCount}
                  onChange={(e) => setStoreyCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value={1}>1 Storey (Single Floor Bungalow)</option>
                  <option value={2}>2 Storeys (Ground + First Floor)</option>
                  <option value={3}>3 Storeys (Ground + 2 Floors)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bedrooms
                </label>
                <select
                  value={bedroomCount}
                  onChange={(e) => setBedroomCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value={2}>2 Bedrooms</option>
                  <option value={3}>3 Bedrooms</option>
                  <option value={4}>4 Bedrooms</option>
                  <option value={5}>5+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bathrooms
                </label>
                <select
                  value={bathroomCount}
                  onChange={(e) => setBathroomCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value={2}>2 Bathrooms</option>
                  <option value={3}>3 Bathrooms (1 Powder + 2 Attached)</option>
                  <option value={4}>4 Bathrooms</option>
                </select>
              </div>
            </div>

            {/* Sri Lankan Cultural Architecture Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={courtyardPreferred}
                  onChange={(e) => setCourtyardPreferred(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Central Courtyard (Medamidula)
                  </span>
                  <span className="text-xs text-slate-500">
                    Open-to-sky interior courtyard providing natural stack-effect cooling and tropical rainfall drainage.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={vastuOrientationPreferred}
                  onChange={(e) => setVastuOrientationPreferred(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Vastu Shastra Alignment
                  </span>
                  <span className="text-xs text-slate-500">
                    Align master suite to South-West (Niruthi) and kitchen to South-East (Agni) per traditional Sri Lankan domestic planning.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Target Budget & Final Review</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All amounts are in Sri Lankan Rupees (LKR). Rates match current BSR material indices.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Construction Budget (LKR)
                </label>
                <span className="text-base font-bold text-blue-600">
                  {formatLKR(targetBudgetLKR)}
                </span>
              </div>
              <input
                type="range"
                min="12000000"
                max="80000000"
                step="500000"
                value={targetBudgetLKR}
                onChange={(e) => setTargetBudgetLKR(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Rs. 12 Million</span>
                <span>Rs. 45 Million</span>
                <span>Rs. 80 Million</span>
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Proposal Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">District:</span>
                  <span className="font-semibold text-slate-800">{district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Plot Size:</span>
                  <span className="font-semibold text-slate-800">{plotSizePerches} Perches ({plotAreaSqFt.toLocaleString()} sq.ft)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Levels & Beds:</span>
                  <span className="font-semibold text-slate-800">{storeyCount} Storeys, {bedroomCount} Bed</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Courtyard / Vastu:</span>
                  <span className="font-semibold text-slate-800">
                    {courtyardPreferred ? 'Medamidula' : 'Standard'} • {vastuOrientationPreferred ? 'Vastu Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Non-Regulatory Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">Non-Regulatory AI Planning Disclaimer:</span>
              BuildMind provides conceptual architectural layouts and preliminary UDA setback checks. Final construction permits require submission of signed drawings by a corporate member of the Sri Lanka Institute of Architects (SLIA) or IESL to your local municipal council.
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate AI Architectural Proposals</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
