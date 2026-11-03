import React from 'react';
import {
  LayoutDashboard,
  Users2,
  UserCheck2,
  Contact,
  HardHat,
  Calculator,
  Receipt,
  FileCheck2,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ModuleType } from '../../types';

interface SidebarProps {
  currentModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  pendingApprovalsCount: number;
  unreadNotificationsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  pendingApprovalsCount,
  unreadNotificationsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: {
    id: ModuleType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff Management', icon: Users2 },
    { id: 'assignments', label: 'Staff–User Assignment', icon: UserCheck2 },
    { id: 'users', label: 'User Management', icon: Contact },
    { id: 'projects', label: 'Project Management', icon: HardHat },
    { id: 'rates', label: 'Construction Rates', icon: Receipt },
    { id: 'estimator', label: 'Cost Estimator', icon: Calculator },
    {
      id: 'approvals',
      label: 'Staff Approval Requests',
      icon: FileCheck2,
      badge: pendingApprovalsCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'content', label: 'Content & Approvals', icon: FileText },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: ModuleType) => {
    onSelectModule(id);
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

      {/* Deep Navy Sidebar (#132A48) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#132A48' }}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                BuildMind
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Sri Lanka
                </span>
              </span>
              <p className="text-[11px] text-slate-300 font-medium">AI Architectural Planning Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Control Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors group text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-blue-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom System Identity Banner */}
        <div className="p-4 border-t border-white/10 bg-black/15 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center text-white font-semibold text-xs">
                AD
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#132A48]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                Admin Director
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-300 truncate">BuildMind Lanka (Pvt) Ltd</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
