import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  FolderKanban,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';
import { HomeownerUser, ConstructionProject, StaffMember } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { formatLKR } from '../../../services/storageService';

interface StaffHomeownersModuleProps {
  currentStaff: StaffMember;
  assignedHomeowners: HomeownerUser[];
  projects: ConstructionProject[];
  onNavigateToProject: (projectId: string) => void;
}

export const StaffHomeownersModule: React.FC<StaffHomeownersModuleProps> = ({
  currentStaff,
  assignedHomeowners,
  projects,
  onNavigateToProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHomeowner, setSelectedHomeowner] = useState<HomeownerUser | null>(null);

  const filteredHomeowners = assignedHomeowners.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.localCouncilAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Assigned Homeowner Clients
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict allocation: Showing only homeowners directly assigned to you by the Admin ({assignedHomeowners.length} total).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            {assignedHomeowners.length} Active Leads
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-medium">Max Limit: {currentStaff.maxAssignments}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assigned client name, address, or municipal council..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          />
        </div>

        <div className="text-slate-500 text-xs hidden sm:block">
          Showing {filteredHomeowners.length} of {assignedHomeowners.length} clients
        </div>
      </div>

      {/* Homeowner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHomeowners.map((homeowner) => {
          const associatedProject = projects.find(
            (p) => p.homeownerId === homeowner.id || p.id === homeowner.activeProjectId
          );

          return (
            <div
              key={homeowner.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{homeowner.name}</h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-blue-500 shrink-0" />
                      <span>{homeowner.propertyAddress}</span>
                    </div>
                  </div>
                  <Badge variant={homeowner.status === 'active' ? 'green' : 'amber'}>
                    {homeowner.status}
                  </Badge>
                </div>

                {/* Plot Specs */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Land Extent</div>
                    <div className="font-bold text-slate-800">{homeowner.plotSizePerches} Perches</div>
                    <div className="text-[10px] text-slate-500">
                      ~{(homeowner.plotSizePerches * 272.25).toLocaleString()} sq.ft
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Local Council</div>
                    <div className="font-bold text-slate-800 truncate" title={homeowner.localCouncilAuthority}>
                      {homeowner.localCouncilAuthority}
                    </div>
                    <div className="text-[10px] text-slate-500">{homeowner.district} District</div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{homeowner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{homeowner.email}</span>
                  </div>
                </div>

                {/* Project association */}
                {associatedProject ? (
                  <div className="p-2.5 rounded-lg border border-blue-100 bg-blue-50/50 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-semibold text-blue-800">
                        Active Project: {associatedProject.code}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600">
                        {associatedProject.currentStage}
                      </span>
                    </div>
                    <div className="text-slate-600 truncate mt-0.5">{associatedProject.title}</div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg border border-dashed border-slate-200 text-slate-400 text-xs mb-3 text-center">
                    No active project dossier initialized yet.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedHomeowner(homeowner)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  View Client Profile
                </button>

                {associatedProject && (
                  <button
                    onClick={() => onNavigateToProject(associatedProject.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <FolderKanban className="h-3.5 w-3.5" />
                    <span>Open Project Dossier</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredHomeowners.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
            {searchTerm
              ? 'No assigned homeowners match your search criteria.'
              : 'You have no assigned homeowners currently. When the Admin assigns a homeowner to your account, they will automatically appear here.'}
          </div>
        )}
      </div>

      {/* Client Profile Modal */}
      {selectedHomeowner && (
        <Modal
          isOpen={!!selectedHomeowner}
          onClose={() => setSelectedHomeowner(null)}
          title={`Client Profile: ${selectedHomeowner.name}`}
          subtitle={`Homeowner record assigned to ${currentStaff.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Full Legal Name</span>
                <div className="font-bold text-slate-900 text-sm">{selectedHomeowner.name}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">KYC Verification</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant={selectedHomeowner.status === 'active' ? 'green' : 'amber'}>
                    {selectedHomeowner.status}
                  </Badge>
                  <span className="text-slate-500 text-[11px]">Title deed verified</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Primary Phone</span>
                <div className="font-semibold text-slate-800">{selectedHomeowner.phone}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Email Address</span>
                <div className="font-semibold text-slate-800">{selectedHomeowner.email}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Land & Site Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <div className="text-[11px] text-slate-500">Site Address</div>
                  <div className="font-semibold text-slate-800">{selectedHomeowner.propertyAddress}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">District & Council</div>
                  <div className="font-semibold text-slate-800">
                    {selectedHomeowner.district} • {selectedHomeowner.localCouncilAuthority}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Plot Extent</div>
                  <div className="font-semibold text-slate-800">
                    {selectedHomeowner.plotSizePerches} Perches ({(selectedHomeowner.plotSizePerches * 272.25).toLocaleString()} sq.ft)
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400">Target Budget Cap</span>
              <div className="font-bold text-slate-900 text-base mt-0.5">
                {formatLKR(selectedHomeowner.budgetCapLKR)}
              </div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">
                Registered on {selectedHomeowner.registeredDate} via Client Self-Registration Portal
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedHomeowner(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
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
