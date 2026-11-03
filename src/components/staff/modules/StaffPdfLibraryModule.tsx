import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  MapPin,
  Building,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  PlanningPdfDocument,
  StaffMember,
  SriLankanDistrict,
} from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

interface StaffPdfLibraryModuleProps {
  currentStaff: StaffMember;
  pdfDocuments: PlanningPdfDocument[];
  onSubmitPdf: (
    data: Omit<PlanningPdfDocument, 'id' | 'uploadedAt' | 'approvalStatus' | 'approvalRequestId'>
  ) => void;
}

export const StaffPdfLibraryModule: React.FC<StaffPdfLibraryModuleProps> = ({
  currentStaff,
  pdfDocuments,
  onSubmitPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PlanningPdfDocument | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    district: currentStaff.assignedDistrict as SriLankanDistrict,
    authority: 'Urban Development Authority (UDA Sri Lanka)',
    effectiveYear: new Date().getFullYear(),
    documentType: 'Zoning Bylaw' as PlanningPdfDocument['documentType'],
    version: 'v1.0',
    fileSummary: '',
    fileName: '',
    fileSizeMb: 3.5,
  });

  const filteredPdfs = pdfDocuments.filter((pdf) => {
    const matchesSearch =
      pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.fileSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || pdf.district === districtFilter;
    const matchesType = typeFilter === 'all' || pdf.documentType === typeFilter;
    return matchesSearch && matchesDistrict && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.fileSummary) return;

    const generatedFileName =
      formData.fileName.trim() ||
      `${formData.authority.split(' ')[0]}_${formData.documentType.replace(/\s+/g, '_')}_${formData.effectiveYear}.pdf`;

    onSubmitPdf({
      title: formData.title,
      district: formData.district,
      authority: formData.authority,
      effectiveYear: Number(formData.effectiveYear),
      documentType: formData.documentType,
      version: formData.version,
      fileName: generatedFileName,
      fileSizeMb: formData.fileSizeMb || 3.5,
      fileSummary: formData.fileSummary,
      submittedByStaffId: currentStaff.id,
      submittedByStaffName: currentStaff.name,
    });

    setIsUploadModalOpen(false);
    setFormData({
      title: '',
      district: currentStaff.assignedDistrict,
      authority: 'Urban Development Authority (UDA Sri Lanka)',
      effectiveYear: new Date().getFullYear(),
      documentType: 'Zoning Bylaw',
      version: 'v1.0',
      fileSummary: '',
      fileName: '',
      fileSizeMb: 3.5,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Sri Lankan Planning PDF Library & Submissions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse gazetted municipal council bylaws, setback schedules, and submit official PDF regulatory metadata for Admin sign-off.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Upload className="h-4 w-4" />
          <span>Submit Planning PDF</span>
        </button>
      </div>

      {/* Governance Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Review Workflow Invariant:</strong> Uploaded planning PDFs are submitted directly into the Admin Staff Approvals queue. Documents require Admin Director validation before integration into the live regulatory dataset.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search planning PDFs by title, authority, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            <option value="Colombo">Colombo</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kandy">Kandy</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kurunegala">Kurunegala</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Document Types</option>
            <option value="Zoning Bylaw">Zoning Bylaw</option>
            <option value="Setback Schedule">Setback Schedule</option>
            <option value="Fire Safety Rule">Fire Safety Rule</option>
            <option value="Environmental Clearance">Environmental Clearance</option>
            <option value="Subdivision Regulation">Subdivision Regulation</option>
          </select>
        </div>
      </div>

      {/* PDF Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPdfs.map((pdf) => {
          const isMySubmission = pdf.submittedByStaffId === currentStaff.id;
          return (
            <div
              key={pdf.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {pdf.documentType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pdf.version}
                    </span>
                  </div>

                  <Badge
                    variant={
                      pdf.approvalStatus === 'approved'
                        ? 'green'
                        : pdf.approvalStatus === 'rejected'
                        ? 'red'
                        : 'amber'
                    }
                  >
                    {pdf.approvalStatus === 'approved' ? 'Active / Approved' : pdf.approvalStatus}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                  {pdf.title}
                </h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                  <Building className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{pdf.authority}</span>
                  <span>•</span>
                  <span>{pdf.district} ({pdf.effectiveYear})</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                  {pdf.fileSummary}
                </p>

                {/* File Pill */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-700 truncate">{pdf.fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{pdf.fileSizeMb} MB</span>
                </div>

                {pdf.adminRemarks && (
                  <div className="text-[11px] p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                    <strong>Admin Sign-off:</strong> {pdf.adminRemarks}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  By {pdf.submittedByStaffName} {isMySubmission && '(You)'}
                </span>

                <button
                  onClick={() => setSelectedPdf(pdf)}
                  className="px-3 py-1 font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}

        {filteredPdfs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            No planning PDF documents found matching your filter criteria.
          </div>
        )}
      </div>

      {/* PDF Details Modal */}
      {selectedPdf && (
        <Modal
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
          title={selectedPdf.title}
          subtitle={`${selectedPdf.authority} • ${selectedPdf.district} District`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Document Type:</span>
                <span className="font-bold text-slate-900">{selectedPdf.documentType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Effective Year:</span>
                <span className="font-bold text-slate-900">{selectedPdf.effectiveYear}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Version:</span>
                <span className="font-mono text-slate-800">{selectedPdf.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Approval State:</span>
                <Badge variant={selectedPdf.approvalStatus === 'approved' ? 'green' : 'amber'}>
                  {selectedPdf.approvalStatus}
                </Badge>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">Regulatory Summary:</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedPdf.fileSummary}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-rose-500" />
                <div>
                  <div className="font-bold text-slate-800">{selectedPdf.fileName}</div>
                  <div className="text-[10px] text-slate-500">
                    PDF Document • {selectedPdf.fileSizeMb} MB • Demo Asset
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert(`Simulated Download: ${selectedPdf.fileName}`)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 flex items-center gap-1 shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedPdf(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload/Submit Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Submit Planning Rule PDF Metadata"
          subtitle="Submit official municipal council or UDA regulatory PDF for Admin approval"
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jaffna Municipal Council Residential Boundary Clearance Guidelines"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">District *</label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value as SriLankanDistrict })
                  }
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
                <label className="block font-semibold text-slate-700 mb-1">Document Type *</label>
                <select
                  value={formData.documentType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      documentType: e.target.value as PlanningPdfDocument['documentType'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Zoning Bylaw">Zoning Bylaw</option>
                  <option value="Setback Schedule">Setback Schedule</option>
                  <option value="Fire Safety Rule">Fire Safety Rule</option>
                  <option value="Environmental Clearance">Environmental Clearance</option>
                  <option value="Subdivision Regulation">Subdivision Regulation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Local Planning Authority *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaffna Municipal Council / UDA"
                  value={formData.authority}
                  onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Effective Year</label>
                <input
                  type="number"
                  min={2000}
                  max={2030}
                  value={formData.effectiveYear}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveYear: parseInt(e.target.value) || 2024 })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Version</label>
                <input
                  type="text"
                  placeholder="e.g. v1.0 or Gazette 2381/44"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Simulated File Name</label>
                <input
                  type="text"
                  placeholder="e.g. JMC_Boundary_Clearance_2024.pdf"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Summary & Regulatory Highlights *</label>
              <textarea
                rows={3}
                required
                placeholder="Explain the gazetted setback concessions, boundary wall maximum heights, or slope stability mandates contained in this document..."
                value={formData.fileSummary}
                onChange={(e) => setFormData({ ...formData, fileSummary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
              >
                Submit for Admin Approval
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
