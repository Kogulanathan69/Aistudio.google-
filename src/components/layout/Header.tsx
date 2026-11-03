import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  RotateCcw,
  Plus,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Layers,
  UserCheck,
} from 'lucide-react';
import { ModuleType, NotificationItem } from '../../types';

interface HeaderProps {
  currentModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  onOpenMobileSidebar: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onResetData: () => void;
  onQuickAction: (action: 'provision_staff' | 'new_assignment' | 'new_project' | 'run_estimator') => void;
  onSwitchToStaff?: () => void;
  onSwitchToHomeowner?: () => void;
}

const moduleLabels: Record<ModuleType, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Planning Dashboard', subtitle: 'AI-assisted architectural pipelines, land parcels & provincial operations across Sri Lanka' },
  staff: { title: 'Architect & Engineer Staffing', subtitle: 'Provision chartered architects (AIA SL), civil structural leads (IESL), and UDA officers' },
  assignments: { title: 'Staff–Homeowner Allocation', subtitle: 'Strict single active architect/engineer assignment per homeowner with preserved history' },
  users: { title: 'Homeowner Directory', subtitle: 'Client registry, land deed validation, local municipal councils & project associations' },
  projects: { title: 'Architectural Project Pipelines', subtitle: 'Land assessment, AI briefs, UDA feasibility, 3 2D alternatives, client sign-offs & 3D models' },
  rates: { title: 'Sri Lankan Construction Rates', subtitle: 'Market rates across Colombo, Jaffna, Kandy, Gampaha & Kurunegala (Demonstration Data)' },
  estimator: { title: 'LKR Cost Estimator', subtitle: 'Parametric Sri Lankan residential cost simulator powered by active material & trade rates' },
  approvals: { title: 'Staff Approval Requests', subtitle: 'Review rate proposals, municipal building-rule PDF submissions, and content publication requests' },
  content: { title: 'Content & Bylaw Approvals', subtitle: 'UDA planning regulations, municipal bylaws, tropical design principles & homeowner guides' },
  reports: { title: 'Portfolio & Stage Analytics', subtitle: 'Stage completion velocity, district distribution, and residential cost metrics in LKR' },
  notifications: { title: 'Operational Signals', subtitle: 'Automated alerts for rate changes, bylaw uploads, and client 2D confirmations' },
  settings: { title: 'Control Center Settings', subtitle: 'Corporate identity (Sri Lanka), operational invariants, database backup & reset' },
};

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  onOpenMobileSidebar,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onResetData,
  onQuickAction,
  onSwitchToStaff,
  onSwitchToHomeowner,
}) => {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentMeta = moduleLabels[currentModule] || { title: 'Admin Console', subtitle: '' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
        setQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Title/Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>BuildMind Admin</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">{currentMeta.title}</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 leading-tight hidden sm:block">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Actions, Notifications, Reset Demo Data & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <div className="relative" ref={quickActionRef}>
          <button
            onClick={() => setQuickActionOpen(!quickActionOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Quick Action</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {quickActionOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 text-xs z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onQuickAction('provision_staff');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <span>Provision Architect / Engineer</span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Staff</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('new_assignment');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <span>Assign Homeowner to Staff</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Assign</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('new_project');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <span>Initiate Architectural Pipeline</span>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Project</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('run_estimator');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <span>Launch LKR Cost Estimator</span>
                <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded">Estimator</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onMarkNotificationRead(n.id);
                      if (n.linkModule) {
                        onSelectModule(n.linkModule);
                        setNotifDropdownOpen(false);
                      }
                    }}
                    className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900 truncate pr-2">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No notifications
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    onSelectModule('notifications');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 w-full py-1"
                >
                  View All Notifications
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
          title="Reset demonstration state to original defaults"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">Reset Demo</span>
        </button>

        {/* Demo Role Switcher: Staff & Client */}
        <div className="flex items-center gap-1.5">
          {onSwitchToStaff && (
            <button
              onClick={onSwitchToStaff}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
              title="Demo Role Switch: Open Staff Workspace"
            >
              <UserCheck className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">Staff Portal</span>
            </button>
          )}

          {onSwitchToHomeowner && (
            <button
              onClick={onSwitchToHomeowner}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
              title="Demo Role Switch: Open Homeowner Client Workspace"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Client Portal</span>
            </button>
          )}
        </div>

        {/* Mode indicator */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 leading-tight">Admin Console</div>
            <div className="text-[10px] text-emerald-600 font-medium">Local Storage Active</div>
          </div>
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
            <Layers className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
