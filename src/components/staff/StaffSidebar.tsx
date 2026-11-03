import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardCheck,
  FileText,
  BookOpen,
  Receipt,
  Clock,
  CheckSquare,
  Bell,
  UserCheck,
  ShieldCheck,
  Compass,
  ChevronDown,
  X,
  ExternalLink,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { StaffModuleType, StaffMember } from '../../types';

interface StaffSidebarProps {
  currentModule: StaffModuleType;
  onSelectModule: (module: StaffModuleType) => void;
  currentStaff: StaffMember;
  allStaff: StaffMember[];
  onSwitchStaff: (staffId: string) => void;
  onSwitchToAdmin: () => void;
  onSwitchToHomeowner?: () => void;
  assignedHomeownersCount: number;
  assignedProjectsCount: number;
  pendingReviewsCount: number;
  pendingTasksCount: number;
  pendingApprovalsCount: number;
  unreadNotificationsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({
  currentModule,
  onSelectModule,
  currentStaff,
  allStaff,
  onSwitchStaff,
  onSwitchToAdmin,
  onSwitchToHomeowner,
  assignedHomeownersCount,
  assignedProjectsCount,
  pendingReviewsCount,
  pendingTasksCount,
  pendingApprovalsCount,
  unreadNotificationsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const [staffDropdownOpen, setStaffDropdownOpen] = React.useState(false);

  const navItems: Array<{
    id: StaffModuleType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'staff_dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
    {
      id: 'staff_homeowners',
      label: 'Assigned Homeowners',
      icon: Users,
      badge: assignedHomeownersCount > 0 ? assignedHomeownersCount : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'staff_projects',
      label: 'Assigned Projects',
      icon: FolderKanban,
      badge: assignedProjectsCount > 0 ? assignedProjectsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      id: 'staff_reviews',
      label: 'Project Review Queue',
      icon: ClipboardCheck,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    { id: 'staff_pdf_library', label: 'Planning PDF Library', icon: FileText },
    { id: 'staff_building_rules', label: 'Building Rules', icon: BookOpen },
    { id: 'staff_rate_suggestions', label: 'Rate Suggestions', icon: Receipt },
    {
      id: 'staff_approvals',
      label: 'Approval Status',
      icon: Clock,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      id: 'staff_tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300',
    },
    {
      id: 'staff_notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'staff_profile', label: 'Staff Profile', icon: UserCheck },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#132A48] text-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wider">
            BM
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>BuildMind</span>
              <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded font-mono font-semibold uppercase">
                Staff
              </span>
            </div>
            <div className="text-[10.5px] text-slate-400 font-medium">Architect Workspace</div>
          </div>
        </div>

        <button
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Active Staff Identity Card with Switcher Dropdown */}
      <div className="p-3 border-b border-slate-700/60 bg-[#0E2038]">
        <div className="relative">
          <button
            onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
            className="w-full p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors flex items-center justify-between group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white truncate">{currentStaff.name}</span>
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    currentStaff.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                  title={currentStaff.status}
                />
              </div>
              <div className="text-[10.5px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="h-2.5 w-2.5 text-blue-400 shrink-0" />
                <span>{currentStaff.assignedDistrict}</span>
                <span>•</span>
                <span className="font-mono text-[9.5px] text-slate-300">
                  {currentStaff.registrationNumber}
                </span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1.5 transition-transform" />
          </button>

          {/* Switch Active Staff dropdown for demo testing */}
          {staffDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#173357] border border-slate-600 rounded-lg shadow-2xl z-50 p-1 space-y-1 text-xs">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Active Staff (Demo Test)
              </div>
              {allStaff.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSwitchStaff(s.id);
                    setStaffDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-md transition-colors flex items-center justify-between ${
                    s.id === currentStaff.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'hover:bg-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="truncate text-xs font-medium">{s.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {s.role} • {s.assignedDistrict}
                    </div>
                  </div>
                  {s.status === 'inactive' && (
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded shrink-0">
                      Inactive
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentStaff.status === 'inactive' && (
          <div className="mt-2 p-2 rounded bg-rose-950/60 border border-rose-800 text-[10.5px] text-rose-200 flex items-start gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>Account deactivated by Admin. Actions are locked until reactivated.</span>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Staff Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Switcher: Jump to Admin or Client Workspace */}
      <div className="p-3 border-t border-slate-700/60 bg-[#0E2038] shrink-0 space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onSwitchToAdmin}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>Admin</span>
          </button>
          {onSwitchToHomeowner && (
            <button
              onClick={onSwitchToHomeowner}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
            >
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              <span>Client</span>
            </button>
          )}
        </div>

        <div className="text-center text-[10px] text-slate-500 font-mono">
          BuildMind LK • Architectural Platform
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Navy Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:flex lg:flex-col shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
