import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  Save,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
} from 'lucide-react';
import { ConstructionProject, RoomInteriorSelection, HomeownerModuleType } from '../../../types';
import { StorageService, formatLKR } from '../../../services/storageService';

interface HomeownerInteriorStudioModuleProps {
  currentProject: ConstructionProject;
  onNavigate: (module: HomeownerModuleType) => void;
  onProjectUpdated: (project: ConstructionProject) => void;
}

const DEFAULT_INTERIORS: RoomInteriorSelection[] = [
  {
    roomId: 'room-1',
    roomName: 'Living Pavilion',
    style: 'Tropical Modernism (Geoffrey Bawa inspired)',
    flooring: 'Polished Cut-Cement Titanium (Grey)',
    wallFinish: 'Textured Off-White Lime Plaster',
    ceilingFinish: 'Exposed Kumbuk Timber Rafters',
    estimatedCostLKR: 1850000,
  },
  {
    roomId: 'room-2',
    roomName: 'Medamidula Courtyard',
    style: 'Natural Open-Sky Zen Courtyard',
    flooring: 'Granite Cobblestone & River Pebble Gravel',
    wallFinish: 'Rough Rubble Wall with Climbing Creeper Trough',
    ceilingFinish: 'Open to Sky with Copper Rain Chains',
    estimatedCostLKR: 920000,
  },
  {
    roomId: 'room-3',
    roomName: 'Master Suite',
    style: 'Contemporary Minimalist with Teak Millwork',
    flooring: 'Ceylon Teak Engineered Hardwood',
    wallFinish: 'Matt Emulsion with Teak Accent Headboard',
    ceilingFinish: 'Concealed LED Cove Lighting in Gypsum',
    estimatedCostLKR: 2400000,
  },
  {
    roomId: 'room-4',
    roomName: 'Dining & Show Pantry',
    style: 'Open-Concept Scandinavian-Tropical Fusion',
    flooring: 'Imported Large-Format Matte Porcelain Tiles (60×120cm)',
    wallFinish: 'Anti-Bacterial Washable Paint',
    ceilingFinish: 'Recessed Downlights & Suspended Timber Slat Feature',
    estimatedCostLKR: 3100000,
  },
];

export const HomeownerInteriorStudioModule: React.FC<HomeownerInteriorStudioModuleProps> = ({
  currentProject,
  onNavigate,
  onProjectUpdated,
}) => {
  const [selections, setSelections] = useState<RoomInteriorSelection[]>(
    currentProject.interiorSelections && currentProject.interiorSelections.length > 0
      ? currentProject.interiorSelections
      : DEFAULT_INTERIORS
  );
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeSelection = selections[activeRoomIdx] || selections[0];

  const totalInteriorBudget = selections.reduce((acc, s) => acc + s.estimatedCostLKR, 0);

  const handleUpdateActive = (field: keyof RoomInteriorSelection, value: any) => {
    const updated = selections.map((s, idx) => {
      if (idx === activeRoomIdx) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setSelections(updated);
  };

  const handleSave = () => {
    const updated = StorageService.updateInteriorSelections(currentProject.id, selections);
    if (updated) {
      onProjectUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
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
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interior Palette & Materials
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interior Finishes & Material Studio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate tropical Sri Lankan material finishes including Kumbuk timber, polished titanium cut-cement, and acoustic ceilings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Finishes</span>
          </button>
          <button
            onClick={() => onNavigate('homeowner_cost_estimation')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Proceed to Cost Estimator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Interior finishes saved and incorporated into project dossier.</span>
        </div>
      )}

      {/* Main Studio: Left Room List, Right Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Rooms Palette */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rooms to Style</h3>
            <span className="text-xs font-bold text-blue-600">{formatLKR(totalInteriorBudget)}</span>
          </div>

          <div className="space-y-1.5">
            {selections.map((sel, idx) => (
              <button
                key={sel.roomId}
                onClick={() => setActiveRoomIdx(idx)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  activeRoomIdx === idx
                    ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-slate-900 block truncate">{sel.roomName}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{sel.style}</span>
                </div>
                <span className="text-xs font-semibold text-slate-800 shrink-0">
                  {formatLKR(sel.estimatedCostLKR)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Room Material Customizer */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customizing</span>
              <h3 className="text-base font-bold text-slate-900">{activeSelection.roomName}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Fitout</span>
              <span className="text-base font-bold text-blue-600">{formatLKR(activeSelection.estimatedCostLKR)}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Architectural Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Design Theme / Spatial Character
              </label>
              <select
                value={activeSelection.style}
                onChange={(e) => handleUpdateActive('style', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 bg-white"
              >
                <option value="Tropical Modernism (Geoffrey Bawa inspired)">Tropical Modernism (Geoffrey Bawa inspired)</option>
                <option value="Natural Open-Sky Zen Courtyard">Natural Open-Sky Zen Courtyard</option>
                <option value="Contemporary Minimalist with Teak Millwork">Contemporary Minimalist with Teak Millwork</option>
                <option value="Traditional Jaffna / Kandy Heritage Vernacular">Traditional Jaffna / Kandy Heritage Vernacular</option>
                <option value="Open-Concept Scandinavian-Tropical Fusion">Open-Concept Scandinavian-Tropical Fusion</option>
              </select>
            </div>

            {/* Flooring */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Floor Finish Specification
              </label>
              <select
                value={activeSelection.flooring}
                onChange={(e) => handleUpdateActive('flooring', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 bg-white"
              >
                <option value="Polished Cut-Cement Titanium (Grey)">Polished Cut-Cement Titanium (Grey - Rs. 450/sq.ft)</option>
                <option value="Granite Cobblestone & River Pebble Gravel">Granite Cobblestone & River Pebble Gravel (Rs. 680/sq.ft)</option>
                <option value="Ceylon Teak Engineered Hardwood">Ceylon Teak Engineered Hardwood (Rs. 1,600/sq.ft)</option>
                <option value="Imported Large-Format Matte Porcelain Tiles (60×120cm)">Imported Large-Format Matte Porcelain Tiles (Rs. 950/sq.ft)</option>
                <option value="Rustic Terracotta Clay Floor Tiles (8×8 in)">Rustic Terracotta Clay Floor Tiles (Rs. 380/sq.ft)</option>
              </select>
            </div>

            {/* Wall Finish */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Wall Surface & Texture
              </label>
              <select
                value={activeSelection.wallFinish}
                onChange={(e) => handleUpdateActive('wallFinish', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 bg-white"
              >
                <option value="Textured Off-White Lime Plaster">Textured Off-White Lime Plaster (Breathable tropical finish)</option>
                <option value="Rough Rubble Wall with Climbing Creeper Trough">Rough Rubble Wall with Climbing Creeper Trough</option>
                <option value="Matt Emulsion with Teak Accent Headboard">Matt Emulsion with Teak Accent Headboard</option>
                <option value="Anti-Bacterial Washable Paint">Anti-Bacterial Washable Paint (Ideal for kitchens & dining)</option>
                <option value="Exposed Fair-Faced Brickwork (Wire-cut)">Exposed Fair-Faced Brickwork (Wire-cut)</option>
              </select>
            </div>

            {/* Ceiling */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ceiling & Soffit Detail
              </label>
              <select
                value={activeSelection.ceilingFinish}
                onChange={(e) => handleUpdateActive('ceilingFinish', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 bg-white"
              >
                <option value="Exposed Kumbuk Timber Rafters">Exposed Kumbuk Timber Rafters (Traditional Sri Lankan warmth)</option>
                <option value="Open to Sky with Copper Rain Chains">Open to Sky with Copper Rain Chains (Medamidula)</option>
                <option value="Concealed LED Cove Lighting in Gypsum">Concealed LED Cove Lighting in Gypsum</option>
                <option value="Recessed Downlights & Suspended Timber Slat Feature">Recessed Downlights & Suspended Timber Slat Feature</option>
                <option value="Off-Shutter Exposed Concrete Soffit">Off-Shutter Exposed Concrete Soffit</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
