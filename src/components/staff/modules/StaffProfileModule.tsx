import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Award,
  CheckCircle2,
  Calendar,
  Save,
  ShieldCheck,
  FolderKanban,
  Receipt,
  FileText,
  ClipboardCheck,
} from 'lucide-react';
import { StaffMember } from '../../../types';
import { Badge } from '../../common/Badge';

interface StaffProfileModuleProps {
  currentStaff: StaffMember;
  onUpdateProfile: (updated: StaffMember) => void;
  assignedHomeownersCount: number;
  assignedProjectsCount: number;
  myReviewsCount: number;
  myProposalsCount: number;
}

export const StaffProfileModule: React.FC<StaffProfileModuleProps> = ({
  currentStaff,
  onUpdateProfile,
  assignedHomeownersCount,
  assignedProjectsCount,
  myReviewsCount,
  myProposalsCount,
}) => {
  const [phone, setPhone] = useState(currentStaff.phone);
  const [email, setEmail] = useState(currentStaff.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentStaff,
      phone,
      email,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const capacityPercent = Math.min(
    100,
    Math.round((assignedHomeownersCount / (currentStaff.maxAssignments || 4)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Staff Professional Credentials & Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified institutional council credentials, contact settings, and platform allocation capacity for {currentStaff.name}.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile Updated Successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Institutional Credentials & Capacity Meter (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Official Verification Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-blue-600" />
              Institutional Council Registration (Sri Lanka)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10.5px] font-semibold text-slate-400 uppercase">Professional Role</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{currentStaff.role}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{currentStaff.department}</div>
              </div>

              <div>
                <span className="text-[10.5px] font-semibold text-slate-400 uppercase">Chartered Reg No</span>
                <div className="font-mono font-bold text-blue-700 text-sm mt-0.5">
                  {currentStaff.registrationNumber}
                </div>
                <div className="text-[10.5px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Licensed Sri Lankan Practitioner</span>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] font-semibold text-slate-400 uppercase">Assigned Region</span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  <span>{currentStaff.assignedDistrict} District</span>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] font-semibold text-slate-400 uppercase">Practice Experience</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {currentStaff.experienceYears} Years Professional Standing
                </div>
                <div className="text-[10.5px] text-slate-400">Joined BuildMind: {currentStaff.joinedDate}</div>
              </div>
            </div>
          </div>

          {/* Allocation Capacity Meter */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Homeowner Lead Workload Capacity
              </h3>
              <span className="text-xs font-bold text-slate-900">
                {assignedHomeownersCount} / {currentStaff.maxAssignments} Clients ({capacityPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  capacityPercent >= 100
                    ? 'bg-rose-500'
                    : capacityPercent >= 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Platform invariant: Each lead architect or engineer has an Admin-enforced ceiling of{' '}
              {currentStaff.maxAssignments} simultaneous homeowner clients to guarantee meticulous UDA setback and column grid reviews.
            </p>
          </div>

          {/* Edit Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personal Contact Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct Contact Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Lifetime Deliverable Stats & Governance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Staff Architectural Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Assigned Clients</span>
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">{assignedHomeownersCount}</div>
                <div className="text-[10px] text-slate-500">Active leads</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>2D Pipelines</span>
                  <FolderKanban className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">{assignedProjectsCount}</div>
                <div className="text-[10px] text-slate-500">Active designs</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Reviews Logged</span>
                  <ClipboardCheck className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">{myReviewsCount}</div>
                <div className="text-[10px] text-slate-500">Technical checks</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Proposals</span>
                  <Receipt className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">{myProposalsCount}</div>
                <div className="text-[10px] text-slate-500">Submitted to Admin</div>
              </div>
            </div>
          </div>

          {/* System Governance Reminder */}
          <div className="p-4 rounded-xl bg-[#132A48] text-white shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Role Permissions & Invariants</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>• Staff accounts can only be provisioned and activated by the Admin Director.</li>
              <li>• You only have visibility over homeowners currently allocated to you.</li>
              <li>• Staff cannot approve their own rate proposals or publish planning bylaws directly.</li>
              <li>• Final 2D plan confirmation and 3D generation remain strictly homeowner-authorized in the Client Portal.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
