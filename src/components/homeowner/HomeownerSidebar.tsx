import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  MessageSquareCode,
  FileCheck2,
  Compass,
  Layers,
  Edit3,
  CheckCircle2,
  Lock,
  Unlock,
  Box,
  Palette,
  Calculator,
  Printer,
  Bell,
  User,
  Shield,
  Briefcase,
  ChevronDown,
  X,
  MapPin,
  Building,
} from 'lucide-react';
import { HomeownerModuleType, HomeownerUser, ConstructionProject, WorkspaceRole } from '../../types';

interface HomeownerSidebarProps {
  currentModule: HomeownerModuleType;
  onSelectModule: (module: HomeownerModuleType) => void;
  currentHomeowner: HomeownerUser;
  allHomeowners: HomeownerUser[];
  onSwitchHomeowner: (homeownerId: string) => void;
  onSwitchRole: (role: WorkspaceRole) => void;
  currentProject: ConstructionProject | null;
  allProjects: ConstructionProject[];
  onSelectProject: (projectId: string) => void;
  unreadNotificationsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const HomeownerSidebar: React.FC<HomeownerSidebarProps> = ({
  currentModule,
  onSelectModule,
  currentHomeowner,
  allHomeowners,
  onSwitchHomeowner,
  onSwitchRole,
  currentProject,
  allProjects,
  onSelectProject,
  unreadNotificationsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const [homeownerDropdownOpen, setHomeownerDropdownOpen] = React.useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = React.useState(false);

  const is3DUnlocked = currentProject?.homeownerConfirmation?.isConfirmed && currentProject?.model3DStatus?.status !== 'Locked - Awaiting Homeowner 2D Confirmation';

  const overviewNav: Array<{
    id: HomeownerModuleType;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'homeowner_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'homeowner_projects', label: 'My Projects', icon: FolderKanban, badge: `${allProjects.length}` },
    { id: 'homeowner_new_project', label: 'New Project Wizard', icon: PlusCircle },
  ];

  const designJourneyNav: Array<{
    id: HomeownerModuleType;
    step: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeClass?: string;
  }> = [
    { id: 'homeowner_ai_chat', step: '01', label: 'AI Requirements Chat', icon: MessageSquareCode },
    { id: 'homeowner_brief', step: '02', label: 'Project Brief', icon: FileCheck2 },
    { id: 'homeowner_feasibility', step: '03', label: 'Land Feasibility', icon: Compass },
    { id: 'homeowner_plan_alternatives', step: '04', label: '2D Plan Alternatives', icon: Layers },
    { id: 'homeowner_2d_editor', step: '05', label: 'Interactive 2D Editor', icon: Edit3 },
    { 
      id: 'homeowner_2d_validation', 
      step: '06', 
      label: '2D Validation', 
      icon: CheckCircle2,
      badge: currentProject?.planRevisionStatus?.structuralGridValidated ? 'Pass' : 'Req',
      badgeClass: currentProject?.planRevisionStatus?.structuralGridValidated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
    },
    { 
      id: 'homeowner_2d_confirmation', 
      step: '07', 
      label: '2D Confirmation', 
      icon: currentProject?.homeownerConfirmation?.isConfirmed ? Unlock : Lock,
      badge: currentProject?.homeownerConfirmation?.isConfirmed ? 'Confirmed' : 'Pending',
      badgeClass: currentProject?.homeownerConfirmation?.isConfirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
    },
    { 
      id: 'homeowner_3d_viewer', 
      step: '08', 
      label: '3D Conceptual Model', 
      icon: Box,
      badge: is3DUnlocked ? 'Unlocked' : 'Locked',
      badgeClass: is3DUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
    },
    { id: 'homeowner_interior_studio', step: '09', label: 'Interior Studio', icon: Palette },
    { id: 'homeowner_cost_estimation', step: '10', label: 'Cost Estimation (LKR)', icon: Calculator },
    { id: 'homeowner_project_report', step: '11', label: 'Dossier & Report', icon: Printer },
  ];

  const handleNavClick = (moduleId: HomeownerModuleType) => {
    onSelectModule(moduleId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#132A48] text-white flex flex-col border-r border-[#1e3e6b] shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1e3e6b]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-900/40">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">BuildMind</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-sm">
                  Client Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Sri Lankan AI Architectural Planning</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Homeowner Switcher Dropdown */}
        <div className="px-3 pt-3 pb-2 border-b border-[#1e3e6b]/60 relative">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-300 px-1 mb-1 flex items-center justify-between">
            <span>Homeowner Account</span>
            <span className="text-blue-300">{allHomeowners.length} registered</span>
          </div>
          <button
            onClick={() => setHomeownerDropdownOpen(!homeownerDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0d1e34] border border-[#20406d] hover:border-blue-400 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-semibold text-xs shrink-0">
                {currentHomeowner.name.charAt(0)}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-slate-100 truncate">{currentHomeowner.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-300 truncate">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                  <span>{currentHomeowner.district} • {currentHomeowner.plotSizePerches} Perches</span>
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${homeownerDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {homeownerDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-[#0b1b30] border border-[#2a4d80] rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-[#1e3e6b]/50 max-h-56 overflow-y-auto">
              {allHomeowners.map((homeowner) => (
                <button
                  key={homeowner.id}
                  onClick={() => {
                    onSwitchHomeowner(homeowner.id);
                    setHomeownerDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 flex items-center justify-between hover:bg-[#152e50] transition-colors ${
                    homeowner.id === currentHomeowner.id ? 'bg-[#18355c]' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{homeowner.name}</p>
                    <p className="text-[10px] text-slate-300">{homeowner.district} • {homeowner.propertyAddress}</p>
                  </div>
                  {homeowner.id === currentHomeowner.id && (
                    <span className="text-[10px] font-semibold text-emerald-400">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Selector */}
        <div className="px-3 py-2 border-b border-[#1e3e6b]/60 relative">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-300 px-1 mb-1 flex items-center justify-between">
            <span>Selected Project</span>
            <span className="text-cyan-300 text-[10px]">{currentProject ? currentProject.code : 'None'}</span>
          </div>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0d1e34] border border-[#20406d] hover:border-cyan-400 text-left transition-colors"
          >
            <div className="min-w-0 truncate">
              <p className="text-xs font-semibold text-cyan-200 truncate">
                {currentProject ? currentProject.title : 'Select a Project...'}
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                {currentProject ? `${currentProject.currentStage}` : 'No active project'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${projectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {projectDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-[#0b1b30] border border-[#2a4d80] rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-[#1e3e6b]/50 max-h-56 overflow-y-auto">
              {allProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id);
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 flex items-center justify-between hover:bg-[#152e50] transition-colors ${
                    currentProject?.id === p.id ? 'bg-[#18355c]' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-300">{p.code} • {p.district}</p>
                  </div>
                  {currentProject?.id === p.id && (
                    <span className="text-[10px] font-semibold text-cyan-400">Current</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {/* Overview */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300 px-2 mb-1 tracking-wider">
              Overview
            </div>
            <div className="space-y-0.5">
              {overviewNav.map((item) => {
                const Icon = item.icon;
                const active = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-700/50'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Architectural Journey */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300 px-2 mb-1 tracking-wider flex items-center justify-between">
              <span>Architectural Journey</span>
              <span className="text-[9px] text-blue-300 font-normal">11 Stages</span>
            </div>
            <div className="space-y-0.5">
              {designJourneyNav.map((item) => {
                const Icon = item.icon;
                const active = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-700/50'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-slate-300 shrink-0">{item.step}</span>
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-slate-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-semibold shrink-0 ${
                        active ? 'bg-white/20 text-white' : (item.badgeClass || 'bg-slate-700 text-slate-300')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account & Settings */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300 px-2 mb-1 tracking-wider">
              Account
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('homeowner_notifications')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentModule === 'homeowner_notifications'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-slate-300" />
                  <span>Notifications</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-rose-500 text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('homeowner_profile')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentModule === 'homeowner_profile'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-300" />
                  <span>Profile & Land Title</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Role Switcher Footer */}
        <div className="p-3 border-t border-[#1e3e6b] bg-[#0c1c30]">
          <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Switch Workspace
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSwitchRole('admin')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-[#162f52] hover:bg-blue-900/60 text-slate-300 hover:text-white text-xs border border-blue-500/30 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => onSwitchRole('staff')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-[#162f52] hover:bg-blue-900/60 text-slate-300 hover:text-white text-xs border border-blue-500/30 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staff</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
