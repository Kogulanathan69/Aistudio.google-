import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  MapPin,
  FileCheck2,
  Send,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import {
  ContentArticle,
  StaffMember,
  SriLankanDistrict,
} from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

interface StaffBuildingRulesModuleProps {
  currentStaff: StaffMember;
  articles: ContentArticle[];
  onSubmitCorrection: (ruleTitle: string, correctionNotes: string, district?: SriLankanDistrict) => void;
}

export const StaffBuildingRulesModule: React.FC<StaffBuildingRulesModuleProps> = ({
  currentStaff,
  articles,
  onSubmitCorrection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);

  // Correction suggestion modal
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestTargetRule, setSuggestTargetRule] = useState<ContentArticle | null>(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [suggestDistrict, setSuggestDistrict] = useState<SriLankanDistrict>(
    currentStaff.assignedDistrict
  );

  const publishedRules = articles.filter((a) => a.status === 'published');

  const filteredRules = publishedRules.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesDistrict =
      districtFilter === 'all' ||
      a.districtRelevance === districtFilter ||
      a.districtRelevance === 'National';
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const handleOpenSuggest = (article?: ContentArticle) => {
    setSuggestTargetRule(article || publishedRules[0] || null);
    setCorrectionNotes('');
    setIsSuggestModalOpen(true);
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestTargetRule || !correctionNotes.trim()) return;

    onSubmitCorrection(suggestTargetRule.title, correctionNotes.trim(), suggestDistrict);
    setIsSuggestModalOpen(false);
    setCorrectionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Planning Rules & UDA Guidelines
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse published Sri Lankan municipal regulations, courtyard standards, and suggest technical amendments for Admin approval.
          </p>
        </div>

        <button
          onClick={() => handleOpenSuggest()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Edit3 className="h-4 w-4" />
          <span>Suggest Rule Correction</span>
        </button>
      </div>

      {/* Governance Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Governance Notice:</strong> Staff cannot publish planning rules directly. All suggested corrections or amendments are routed to the Admin Content & Approvals panel for verification before being committed.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search planning rules, setback requirements, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories ({publishedRules.length})</option>
            <option value="UDA Building Regulations">UDA Building Regulations</option>
            <option value="Architectural Guidelines">Architectural Guidelines</option>
            <option value="Homeowner Planning Guide">Homeowner Planning Guide</option>
            <option value="Sri Lankan Site Specifications">Sri Lankan Site Specifications</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All District Relevance</option>
            <option value="Colombo">Colombo</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kandy">Kandy</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kurunegala">Kurunegala</option>
          </select>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {article.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Ver {article.version}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                {article.title}
              </h3>

              <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-3">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span>Scope: {article.districtRelevance || 'National'}</span>
                <span>•</span>
                <span>Author: {article.author}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedArticle(article)}
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Read Guideline →
              </button>

              <button
                onClick={() => handleOpenSuggest(article)}
                className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded border border-slate-200 font-medium transition-colors flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3 text-slate-500" />
                <span>Suggest Correction</span>
              </button>
            </div>
          </div>
        ))}

        {filteredRules.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            No published building rules match your search or filter criteria.
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          subtitle={`${selectedArticle.category} • Scope: ${selectedArticle.districtRelevance || 'National'}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Executive Summary:</span>
              <p className="text-slate-600 leading-relaxed">{selectedArticle.summary}</p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1.5">Full Guideline Text:</span>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
                {selectedArticle.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const target = selectedArticle;
                  setSelectedArticle(null);
                  handleOpenSuggest(target);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Suggest Correction on this Rule</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Suggest Correction Modal */}
      {isSuggestModalOpen && (
        <Modal
          isOpen={isSuggestModalOpen}
          onClose={() => setIsSuggestModalOpen(false)}
          title="Suggest Planning Rule Correction"
          subtitle={`Submitted by ${currentStaff.name} for Admin verification`}
          maxWidth="md"
        >
          <form onSubmit={handleSuggestSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Planning Rule *</label>
              <select
                required
                value={suggestTargetRule?.id || ''}
                onChange={(e) => {
                  const found = publishedRules.find((a) => a.id === e.target.value);
                  if (found) setSuggestTargetRule(found);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {publishedRules.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">District Relevance</label>
              <select
                value={suggestDistrict}
                onChange={(e) => setSuggestDistrict(e.target.value as SriLankanDistrict)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Colombo">Colombo</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kandy">Kandy</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kurunegala">Kurunegala</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Suggested Technical Correction & Reference *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Explain the required correction, cited gazette clause, or setback amendment..."
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSuggestModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Submit Correction Proposal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
