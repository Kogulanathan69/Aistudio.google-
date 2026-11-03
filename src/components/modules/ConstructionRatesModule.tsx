import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  MapPin,
  Clock,
  Info,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { ConstructionRate, RateCategory, SriLankanDistrict, RateStatus } from '../../types';
import { districtFactors } from '../../data/mockData';
import { Modal } from '../common/Modal';
import { formatLKR } from '../../services/storageService';

interface ConstructionRatesModuleProps {
  rates: ConstructionRate[];
  onUpdateRate: (
    rateId: string,
    newRateLKR: number,
    supplierNotes?: string,
    newSource?: string,
    effectiveDate?: string
  ) => void;
  onAddRate: (rate: Omit<ConstructionRate, 'id' | 'previousRateLKR' | 'lastUpdated' | 'updatedBy' | 'version'>) => void;
}

export const ConstructionRatesModule: React.FC<ConstructionRatesModuleProps> = ({
  rates,
  onUpdateRate,
  onAddRate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [editingRate, setEditingRate] = useState<ConstructionRate | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(0);
  const [editSource, setEditSource] = useState<string>('');
  const [editEffectiveDate, setEditEffectiveDate] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const [isAddRateModalOpen, setIsAddRateModalOpen] = useState(false);
  const [newRateData, setNewRateData] = useState({
    name: '',
    category: 'Raw Materials' as RateCategory,
    unit: '50kg bag',
    baseRateLKR: 2500,
    district: 'Colombo' as SriLankanDistrict,
    source: 'BSR Schedule 2024',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'Active' as RateStatus,
    supplierNotes: '',
  });

  const categories: RateCategory[] = [
    'Raw Materials',
    'Structural & Steel',
    'Finishing & Surfaces',
    'Skilled Labor & Trades',
    'MEP & Environmental',
  ];

  const availableDistricts: SriLankanDistrict[] = [
    'Colombo',
    'Jaffna',
    'Kandy',
    'Gampaha',
    'Kurunegala',
  ];

  const filteredRates = rates.filter((rate) => {
    const matchesSearch =
      rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rate.supplierNotes && rate.supplierNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || rate.category === activeCategory;
    const matchesDistrict = selectedDistrict === 'all' || rate.district === selectedDistrict;
    const matchesStatus = statusFilter === 'all' || rate.status === statusFilter;
    return matchesSearch && matchesCategory && matchesDistrict && matchesStatus;
  });

  const handleOpenEdit = (rate: ConstructionRate) => {
    setEditingRate(rate);
    setEditRateValue(rate.baseRateLKR);
    setEditSource(rate.source);
    setEditEffectiveDate(rate.effectiveDate);
    setEditNotes(rate.supplierNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate) return;
    onUpdateRate(editingRate.id, editRateValue, editNotes, editSource, editEffectiveDate);
    setEditingRate(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRateData.name) return;
    onAddRate(newRateData);
    setIsAddRateModalOpen(false);
    setNewRateData({
      name: '',
      category: 'Raw Materials',
      unit: '50kg bag',
      baseRateLKR: 2500,
      district: 'Colombo',
      source: 'BSR Schedule 2024',
      effectiveDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      supplierNotes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Sri Lankan Construction Rates & District Pricing Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Material and labor price benchmarks for Colombo, Jaffna, Kandy, Gampaha & Kurunegala. All figures are clearly labeled demonstration data.
          </p>
        </div>

        <button
          onClick={() => setIsAddRateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom District Rate</span>
        </button>
      </div>

      {/* Demonstration Data Watermark / Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
        <Info className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          <strong className="font-bold">Fictional Demonstration Data Notice:</strong> All construction rates, material indices, and labor wages in this table are demonstration benchmark figures simulating active Sri Lankan market conditions (LKR Rs.).
        </span>
      </div>

      {/* District Logistics Multipliers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {districtFactors.map((df) => (
          <button
            key={df.district}
            onClick={() => setSelectedDistrict(selectedDistrict === df.district ? 'all' : df.district)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedDistrict === df.district
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>{df.district}</span>
              <span className="font-mono text-blue-600">{df.multiplier}x</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
              {df.materialTransportNote}
            </div>
          </button>
        ))}
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search material, trade labor, source citation (NCASL/BSR), or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Material / Labor Trade</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Source & Citation</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Ver / Status</th>
                <th className="py-3 px-4 text-right">Unit Rate (LKR)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRates.map((rate) => {
                const delta = rate.baseRateLKR - rate.previousRateLKR;
                const deltaPercent = rate.previousRateLKR
                  ? ((delta / rate.previousRateLKR) * 100).toFixed(1)
                  : '0.0';

                return (
                  <tr key={rate.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & Notes */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rate.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        per {rate.unit} · {rate.category}
                      </div>
                      {rate.supplierNotes && (
                        <div className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate" title={rate.supplierNotes}>
                          {rate.supplierNotes}
                        </div>
                      )}
                    </td>

                    {/* District */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {rate.district}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-700 truncate" title={rate.source}>
                        {rate.source}
                      </div>
                    </td>

                    {/* Effective Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {rate.effectiveDate}
                    </td>

                    {/* Version & Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-500">v{rate.version}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            rate.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {rate.status}
                        </span>
                      </div>
                    </td>

                    {/* Base Rate in LKR */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatLKR(rate.baseRateLKR)}
                      </div>
                      {delta !== 0 && (
                        <div
                          className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                            delta > 0 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {delta > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          <span>{Math.abs(Number(deltaPercent))}%</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(rate)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-slate-200 inline-flex items-center gap-1 shadow-xs"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Rate
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredRates.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No construction rates found in this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rate Modal */}
      {editingRate && (
        <Modal
          isOpen={!!editingRate}
          onClose={() => setEditingRate(null)}
          title={`Edit Construction Rate: ${editingRate.name}`}
          subtitle={`District: ${editingRate.district} · Current Version: v${editingRate.version} (Demonstration Data)`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Unit Rate</span>
                <span className="font-bold text-slate-800 text-base font-mono">
                  {formatLKR(editingRate.baseRateLKR)} / {editingRate.unit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Previous Rate</span>
                <span className="font-mono text-slate-500">{formatLKR(editingRate.previousRateLKR)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Unit Rate (LKR Rs. per {editingRate.unit}) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={editRateValue}
                  onChange={(e) => setEditRateValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Effective Date *</label>
                <input
                  type="date"
                  required
                  value={editEffectiveDate}
                  onChange={(e) => setEditEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Verified Source Documentation *</label>
              <input
                type="text"
                required
                value={editSource}
                onChange={(e) => setEditSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supplier Specification Notes</label>
              <textarea
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRate(null)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Update Rate & Increment Version
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Custom Rate Modal */}
      <Modal
        isOpen={isAddRateModalOpen}
        onClose={() => setIsAddRateModalOpen(false)}
        title="Add Construction Unit Rate Item"
        subtitle="Introduce a verified material line item or labor trade schedule for Sri Lanka."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Item Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Wire Cut Red Clay Bricks (9x4.5x3)"
              value={newRateData.name}
              onChange={(e) => setNewRateData({ ...newRateData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={newRateData.category}
                onChange={(e) =>
                  setNewRateData({ ...newRateData, category: e.target.value as RateCategory })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">District *</label>
              <select
                value={newRateData.district}
                onChange={(e) =>
                  setNewRateData({ ...newRateData, district: e.target.value as SriLankanDistrict })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit of Measure *</label>
              <input
                type="text"
                required
                placeholder="50kg bag, cube, sq.ft, day"
                value={newRateData.unit}
                onChange={(e) => setNewRateData({ ...newRateData, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Unit Rate (LKR Rs.) *</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={newRateData.baseRateLKR}
                onChange={(e) =>
                  setNewRateData({ ...newRateData, baseRateLKR: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Effective Date *</label>
              <input
                type="date"
                required
                value={newRateData.effectiveDate}
                onChange={(e) => setNewRateData({ ...newRateData, effectiveDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verified Source Documentation *</label>
            <input
              type="text"
              required
              placeholder="e.g. National Construction Association Sri Lanka (NCASL) Index"
              value={newRateData.source}
              onChange={(e) => setNewRateData({ ...newRateData, source: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddRateModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Save District Rate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
