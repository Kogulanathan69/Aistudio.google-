import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Briefcase,
  Mail,
  Phone,
  Building,
  UserCheck2,
  MapPin,
  Award,
} from 'lucide-react';
import { StaffMember, StaffRole, StaffDepartment, HomeownerUser, SriLankanDistrict } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface StaffManagementModuleProps {
  staff: StaffMember[];
  homeowners: HomeownerUser[];
  onProvisionStaff: (data: Omit<StaffMember, 'id' | 'activeAssignmentsCount' | 'assignedHomeownerIds' | 'joinedDate'>) => void;
  onToggleStatus: (staffId: string) => void;
  onNavigateToAssignments: (staffId?: string) => void;
}

export const StaffManagementModule: React.FC<StaffManagementModuleProps> = ({
  staff,
  homeowners,
  onProvisionStaff,
  onToggleStatus,
  onNavigateToAssignments,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Form State for Provisioning
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Chartered Architect (AIA SL)' as StaffRole,
    department: 'Architectural Planning' as StaffDepartment,
    assignedDistrict: 'Colombo' as SriLankanDistrict,
    registrationNumber: '',
    maxAssignments: 4,
    experienceYears: 8,
    status: 'active' as const,
  });

  const availableRoles: StaffRole[] = [
    'Chartered Architect (AIA SL)',
    'Structural Civil Engineer (IESL)',
    'Senior Architectural Drafter',
    'MEP & Environmental Consultant',
    'Building Code & UDA Compliance Officer',
    'Quantity Surveyor & Cost Planner',
  ];

  const availableDepartments: StaffDepartment[] = [
    'Architectural Planning',
    'Structural & Civil Engineering',
    'Municipal Approvals & Feasibility',
    'MEP & Environmental Design',
    'Cost Planning & Estimation',
  ];

  const availableDistricts: SriLankanDistrict[] = [
    'Colombo',
    'Jaffna',
    'Kandy',
    'Gampaha',
    'Kurunegala',
  ];

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesDistrict = districtFilter === 'all' || member.assignedDistrict === districtFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesDept && matchesDistrict && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    onProvisionStaff(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Chartered Architect (AIA SL)',
      department: 'Architectural Planning',
      assignedDistrict: 'Colombo',
      registrationNumber: '',
      maxAssignments: 4,
      experienceYears: 8,
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="h-5 w-5 text-blue-600" />
            Architect & Structural Engineer Provisioning
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer AIA SL Chartered Architects, IESL Civil Engineers, and UDA compliance officers across Sri Lanka. Only Admin can provision staff accounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Provision Professional Staff</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, email, registration # (AIA/IESL), or role..."
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

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {availableDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({staff.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({staff.filter((s) => s.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'inactive' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inactive ({staff.filter((s) => s.status === 'inactive').length})
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Staff Professional</th>
                <th className="py-3 px-4">Role & Registration</th>
                <th className="py-3 px-4">District & Dept</th>
                <th className="py-3 px-4">Client Allocation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member) => {
                const isFull = member.activeAssignmentsCount >= member.maxAssignments;
                return (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {member.name.replace(/^(Arch\.|Eng\.)\s*/, '').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{member.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="flex items-center gap-0.5">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {member.email}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Registration */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{member.role}</div>
                      <div className="text-[11px] text-blue-600 font-mono font-medium flex items-center gap-1 mt-0.5">
                        <Award className="h-3 w-3" />
                        {member.registrationNumber || 'Pending Reg'}
                      </div>
                    </td>

                    {/* District & Department */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {member.assignedDistrict}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{member.department}</div>
                    </td>

                    {/* Workload Capacity */}
                    <td className="py-3.5 px-4">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-700 font-mono tabular-nums">
                            {member.activeAssignmentsCount} / {member.maxAssignments} Clients
                          </span>
                          {isFull && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                              At Limit
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              member.status === 'inactive'
                                ? 'bg-slate-300'
                                : isFull
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (member.activeAssignmentsCount / member.maxAssignments) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={member.status === 'active' ? 'success' : 'danger'}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStaff(member)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => onToggleStatus(member.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                            member.status === 'active'
                              ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                              : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          {member.status === 'active' ? (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No staff members match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Professional Architect or Engineer"
        subtitle="Only Admin can provision staff accounts for BuildMind Sri Lanka."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Professional Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Arch. Nilshan Jayawardena or Eng. S. Thavakumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                placeholder="name@buildmind.lk"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Technical Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value as StaffDepartment })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Sri Lankan District</label>
              <select
                value={formData.assignedDistrict}
                onChange={(e) =>
                  setFormData({ ...formData, assignedDistrict: e.target.value as SriLankanDistrict })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Professional Reg # (AIA/IESL/UDA)</label>
              <input
                type="text"
                placeholder="e.g. AIA/SL-1042 or IESL/C-5890"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Homeowner Limit</label>
              <input
                type="number"
                min={1}
                max={8}
                value={formData.maxAssignments}
                onChange={(e) => setFormData({ ...formData, maxAssignments: parseInt(e.target.value) || 4 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">Max concurrent active client design pipelines</span>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                min={0}
                max={40}
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Provision Account
            </button>
          </div>
        </form>
      </Modal>

      {/* View Staff Details Drawer/Modal */}
      {selectedStaff && (
        <Modal
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          title={selectedStaff.name}
          subtitle={`${selectedStaff.role} · ${selectedStaff.assignedDistrict} District`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
                <Badge variant={selectedStaff.status === 'active' ? 'success' : 'danger'}>
                  {selectedStaff.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Registration #</span>
                <span className="font-semibold text-blue-700 font-mono">{selectedStaff.registrationNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                <span className="font-medium text-slate-800">{selectedStaff.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-medium text-slate-800">{selectedStaff.phone}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck2 className="h-4 w-4 text-blue-600" />
                  Currently Assigned Homeowners ({selectedStaff.assignedHomeownerIds.length})
                </span>
                <button
                  onClick={() => {
                    onNavigateToAssignments(selectedStaff.id);
                    setSelectedStaff(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]"
                >
                  Manage in Allocations
                </button>
              </div>

              {selectedStaff.assignedHomeownerIds.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-lg text-slate-400 border border-dashed border-slate-200">
                  No homeowners currently assigned to this architect/engineer.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedStaff.assignedHomeownerIds.map((hId) => {
                    const homeowner = homeowners.find((h) => h.id === hId);
                    return (
                      <div
                        key={hId}
                        className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{homeowner?.name || hId}</div>
                          <div className="text-[11px] text-slate-500">{homeowner?.propertyAddress} ({homeowner?.district})</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                          Active Architectural Pipeline
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
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
