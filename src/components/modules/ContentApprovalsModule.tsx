import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  Layers,
  MapPin,
} from 'lucide-react';
import { ContentArticle, ContentStatus, SriLankanDistrict } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ContentApprovalsModuleProps {
  articles: ContentArticle[];
  onAddArticle: (article: Omit<ContentArticle, 'id' | 'lastModified'>) => void;
  onUpdateArticleStatus: (articleId: string, status: ContentStatus) => void;
}

export const ContentApprovalsModule: React.FC<ContentApprovalsModuleProps> = ({
  articles,
  onAddArticle,
  onUpdateArticleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'UDA Building Regulations' as ContentArticle['category'],
    author: 'Admin Director',
    status: 'draft' as ContentStatus,
    version: '1.0',
    targetAudience: 'All' as ContentArticle['targetAudience'],
    districtRelevance: 'National' as SriLankanDistrict | 'National',
    summary: '',
    content: '',
  });

  const categories = [
    'UDA Building Regulations',
    'Architectural Guidelines',
    'Homeowner Planning Guide',
    'Sri Lankan Site Specifications',
  ] as const;

  const districts: (SriLankanDistrict | 'National')[] = [
    'National',
    'Colombo',
    'Jaffna',
    'Kandy',
    'Gampaha',
    'Kurunegala',
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    onAddArticle(formData);
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      category: 'UDA Building Regulations',
      author: 'Admin Director',
      status: 'draft',
      version: '1.0',
      targetAudience: 'All',
      districtRelevance: 'National',
      summary: '',
      content: '',
    });
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'in_review':
        return <Badge variant="warning">In Review</Badge>;
      case 'draft':
      default:
        return <Badge variant="neutral">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Content, UDA Regulations & Architectural Standards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer Urban Development Authority (UDA) regulations, municipal bylaws, tropical climate guidelines, and homeowner approval manuals.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Specification / Guideline</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search regulations, UDA setbacks, tropical architecture guides, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Published ({articles.filter((a) => a.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('in_review')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'in_review' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              In Review ({articles.filter((a) => a.status === 'in_review').length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {article.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">v{article.version}</span>
                  {getStatusBadge(article.status)}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                District: <strong className="text-slate-700">{article.districtRelevance || 'National'}</strong> · {article.lastModified}
              </div>

              <div className="flex items-center gap-1.5">
                {article.status !== 'published' ? (
                  <button
                    onClick={() => onUpdateArticleStatus(article.id, 'published')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateArticleStatus(article.id, 'in_review')}
                    className="px-2 py-1 text-xs font-semibold rounded text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    Unpublish
                  </button>
                )}

                <button
                  onClick={() => setSelectedArticle(article)}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Article Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Sri Lankan Architectural Specification"
        subtitle="Publish engineering procedures, UDA guidelines, or homeowner manuals."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. UDA High-Density Setback Guidelines for Urban Perches"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ContentArticle['category'] })
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
              <label className="block font-semibold text-slate-700 mb-1">District Relevance</label>
              <select
                value={formData.districtRelevance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    districtRelevance: e.target.value as SriLankanDistrict | 'National',
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Version</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Executive Summary *</label>
            <input
              type="text"
              required
              placeholder="1-2 sentence overview of the regulation or standard..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Document Text *</label>
            <textarea
              rows={5}
              required
              placeholder="Detailed guidelines, municipal legal clauses, or architectural procedure..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Save Draft Specification
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Document Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          subtitle={`v${selectedArticle.version} · Category: ${selectedArticle.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Author</span>
                <span className="font-semibold text-slate-800">{selectedArticle.author}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">District</span>
                <span className="font-semibold text-slate-800">{selectedArticle.districtRelevance || 'National'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                {getStatusBadge(selectedArticle.status)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 text-slate-700 font-medium leading-relaxed">
              {selectedArticle.summary}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider text-slate-400">
                Specification Clauses & Bylaw Text
              </h4>
              <p className="text-slate-800 text-xs whitespace-pre-wrap leading-relaxed font-sans">
                {selectedArticle.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
