import React, { useState } from 'react';
import {
  Contact,
  Plus,
  Search,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { HomeownerUser, HomeownerStatus, StaffMember, ConstructionProject, SriLankanDistrict } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { formatLKR } from '../../services/storageService';

interface UserManagementModuleProps {
  homeowners: HomeownerUser[];
  staff: StaffMember[];
  projects: ConstructionProject[];
  onAddHomeowner: (data: Omit<HomeownerUser, 'id' | 'registeredDate' | 'activeStaffId' | 'activeProjectId'>) => void;
  onUpdateStatus: (homeownerId: string, status: HomeownerStatus) => void;
  onNavigateToAssign: (homeownerId: string) => void;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({
  homeowners,
  staff,
  projects,
  onAddHomeowner,
  onUpdateStatus,
  onNavigateToAssign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedHomeowner, setSelectedHomeowner] = useState<HomeownerUser | null>(null);

  // Sri Lankan self-registration simulation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    district: 'Jaffna' as SriLankanDistrict,
    plotSizePerches: 15.0,
    localCouncilAuthority: 'Jaffna Municipal Council',
    budgetCapLKR: 25000000,
    status: 'pending_verification' as HomeownerStatus,
    notes: '',
  });

  const availableDistricts: SriLankanDistrict[] = [
    'Colombo',
    'Jaffna',
    'Kandy',
    'Gampaha',
    'Kurunegala',
  ];

  const councilOptions: Record<SriLankanDistrict, string[]> = {
    Colombo: ['Colombo Municipal Council', 'Sri Jayawardenepura Kotte MC', 'Dehiwala-Mount Lavinia MC', 'Maharagama Urban Council'],
    Jaffna: ['Jaffna Municipal Council', 'Valikamam South Pradeshiya Sabha', 'Chavakachcheri Urban Council', 'Point Pedro Urban Council'],
    Kandy: ['Kandy Municipal Council', 'Kundasale Pradeshiya Sabha', 'Gampola Urban Council'],
    Gampaha: ['Gampaha Municipal Council', 'Negombo Municipal Council', 'Kelaniya Pradeshiya Sabha', 'Ja-Ela Urban Council'],
    Kurunegala: ['Kurunegala Municipal Council', 'Kuliyapitiya Urban Council', 'Narammala Pradeshiya Sabha'],
  };

  const filteredHomeowners = homeowners.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.localCouncilAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || h.district === districtFilter;
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    onAddHomeowner(formData);
    setIsRegisterModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyAddress: '',
      district: 'Jaffna',
      plotSizePerches: 15.0,
      localCouncilAuthority: 'Jaffna Municipal Council',
      budgetCapLKR: 25000000,
      status: 'pending_verification',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Contact className="h-5 w-5 text-blue-600" />
            Homeowner Client Directory (Sri Lanka)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered land-owners across Jaffna, Colombo, Kandy, Gampaha & Kurunegala. Homeowners register themselves; Admin provisions staff leads.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Simulate Client Self-Registration</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search homeowners by name, email, street address, or local council authority..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
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
              All ({homeowners.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Verified ({homeowners.filter((h) => h.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_verification')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'pending_verification'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              KYC Pending ({homeowners.filter((h) => h.status === 'pending_verification').length})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Homeowner Client</th>
                <th className="py-3 px-4">Land Parcel & District</th>
                <th className="py-3 px-4">Local Council Authority</th>
                <th className="py-3 px-4">Assigned Lead Architect</th>
                <th className="py-3 px-4">Target Budget (LKR)</th>
                <th className="py-3 px-4">Deed KYC</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHomeowners.map((homeowner) => {
                const assignedStaff = staff.find((s) => s.id === homeowner.activeStaffId);
                const activeProject = projects.find((p) => p.id === homeowner.activeProjectId);

                return (
                  <tr key={homeowner.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Client info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{homeowner.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {homeowner.email}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {homeowner.phone}
                        </span>
                      </div>
                    </td>

                    {/* Land Parcel & District */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{homeowner.propertyAddress}</span>
                      </div>
                      <div className="text-[11px] text-blue-600 font-semibold pl-4">
                        {homeowner.district} · {homeowner.plotSizePerches} Perches ({Math.round(homeowner.plotSizePerches * 272.25)} sq.ft)
                      </div>
                    </td>

                    {/* Local Council */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <span className="truncate max-w-[170px] block" title={homeowner.localCouncilAuthority}>
                        {homeowner.localCouncilAuthority}
                      </span>
                    </td>

                    {/* Assigned Lead */}
                    <td className="py-3.5 px-4">
                      {assignedStaff ? (
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {assignedStaff.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{assignedStaff.role}</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onNavigateToAssign(homeowner.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Assign Lead
                        </button>
                      )}
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {formatLKR(homeowner.budgetCapLKR)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {activeProject ? (
                          <span className="text-blue-600 font-medium">{activeProject.currentStage}</span>
                        ) : (
                          'Pre-Planning'
                        )}
                      </div>
                    </td>

                    {/* Deed KYC */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          homeowner.status === 'active'
                            ? 'success'
                            : homeowner.status === 'pending_verification'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {homeowner.status === 'active'
                          ? 'Title Cleared'
                          : homeowner.status === 'pending_verification'
                          ? 'KYC Pending'
                          : 'Suspended'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedHomeowner(homeowner)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                          Profile
                        </button>

                        {homeowner.status === 'pending_verification' && (
                          <button
                            onClick={() => onUpdateStatus(homeowner.id, 'active')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Verify
                          </button>
                        )}

                        {homeowner.status === 'active' && (
                          <button
                            onClick={() => onUpdateStatus(homeowner.id, 'suspended')}
                            className="px-2 py-1 text-xs font-semibold rounded-md text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                          >
                            Suspend
                          </button>
                        )}

                        {homeowner.status === 'suspended' && (
                          <button
                            onClick={() => onUpdateStatus(homeowner.id, 'active')}
                            className="px-2 py-1 text-xs font-semibold rounded-md text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredHomeowners.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No homeowners match the current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulate Self-Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Simulate Homeowner Self-Registration"
        subtitle="Simulates a Sri Lankan homeowner registering their land parcel on the public BuildMind portal."
        maxWidth="lg"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Client Name(s) *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sivakumar & Meera Thavanesan or Duminda Perera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="client@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+94 77 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Property Site Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 142 Temple Road, Nallur or 48 Flower Road"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => {
                  const dist = e.target.value as SriLankanDistrict;
                  setFormData({
                    ...formData,
                    district: dist,
                    localCouncilAuthority: councilOptions[dist][0],
                  });
                }}
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
              <label className="block font-semibold text-slate-700 mb-1">Plot Size (Perches)</label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="100"
                value={formData.plotSizePerches}
                onChange={(e) => setFormData({ ...formData, plotSizePerches: parseFloat(e.target.value) || 10 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 font-mono">
                ≈ {Math.round((formData.plotSizePerches || 0) * 272.25)} sq.ft
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Budget (LKR)</label>
              <input
                type="number"
                step="500000"
                value={formData.budgetCapLKR}
                onChange={(e) => setFormData({ ...formData, budgetCapLKR: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Local Council Authority</label>
            <select
              value={formData.localCouncilAuthority}
              onChange={(e) => setFormData({ ...formData, localCouncilAuthority: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {councilOptions[formData.district].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Architectural Preferences / Lifestyle Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. 4-bedroom tropical house with central courtyard (Medamidula) and cross-ventilation against Jaffna heat."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Register Landowner
            </button>
          </div>
        </form>
      </Modal>

      {/* View Homeowner Profile Modal */}
      {selectedHomeowner && (
        <Modal
          isOpen={!!selectedHomeowner}
          onClose={() => setSelectedHomeowner(null)}
          title={selectedHomeowner.name}
          subtitle={`Land Parcel in ${selectedHomeowner.district} · Registered ${selectedHomeowner.registeredDate}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Title Clearance</span>
                <Badge
                  variant={
                    selectedHomeowner.status === 'active'
                      ? 'success'
                      : selectedHomeowner.status === 'pending_verification'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {selectedHomeowner.status === 'active'
                    ? 'Title Cleared'
                    : selectedHomeowner.status === 'pending_verification'
                    ? 'Deed KYC Pending'
                    : 'Suspended'}
                </Badge>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Budget</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatLKR(selectedHomeowner.budgetCapLKR)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Plot Size</span>
                <span className="font-semibold text-slate-800">
                  {selectedHomeowner.plotSizePerches} Perches ({Math.round(selectedHomeowner.plotSizePerches * 272.25)} sq.ft)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Local Council</span>
                <span className="font-medium text-slate-800">{selectedHomeowner.localCouncilAuthority}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                Property Site Address
              </span>
              <div className="font-medium text-slate-800 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                {selectedHomeowner.propertyAddress}, {selectedHomeowner.district}
              </div>
              {selectedHomeowner.notes && (
                <div className="mt-2 text-slate-600 bg-slate-50 p-2 rounded text-[11px]">
                  {selectedHomeowner.notes}
                </div>
              )}
            </div>

            {/* Active Staff Lead */}
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Active Lead Architect / Engineer
                </span>
                <button
                  onClick={() => {
                    onNavigateToAssign(selectedHomeowner.id);
                    setSelectedHomeowner(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] flex items-center gap-1"
                >
                  Manage Allocation
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              {(() => {
                const s = staff.find((stf) => stf.id === selectedHomeowner.activeStaffId);
                if (!s) {
                  return (
                    <div className="text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
                      <span>No active lead architect assigned yet.</span>
                      <button
                        onClick={() => {
                          onNavigateToAssign(selectedHomeowner.id);
                          setSelectedHomeowner(null);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700"
                      >
                        Assign Now
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.role} · {s.assignedDistrict}</div>
                    </div>
                    <Badge variant="success">Active Lead</Badge>
                  </div>
                );
              })()}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHomeowner(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
