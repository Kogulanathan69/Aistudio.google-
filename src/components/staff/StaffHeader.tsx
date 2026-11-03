import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Plus,
  ShieldCheck,
  ChevronDown,
  Receipt,
  FileText,
  ClipboardCheck,
  CheckSquare,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { StaffModuleType, StaffMember, NotificationItem } from '../../types';

interface StaffHeaderProps {
  currentModule: StaffModuleType;
  onSelectModule: (module: StaffModuleType) => void;
  currentStaff: StaffMember;
  onSwitchToAdmin: () => void;
  onOpenMobileSidebar: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onQuickAction: (action: 'rate_proposal' | 'pdf_upload' | 'log_review' | 'add_task') => void;
  onSwitchToHomeowner?: () => void;
}

const staffModuleLabels: Record<StaffModuleType, { title: string; subtitle: string }> = {
  staff_dashboard: {
    title: 'Architect & Engineer Dashboard',
    subtitle: 'Assigned homeowner clients, active planning pipelines, pending reviews, and tasks',
  },
  staff_homeowners: {
    title: 'Assigned Homeowners',
    subtitle: 'Directly assigned homeowner clients, land perches, local council authorities & KYC status',
  },
  staff_projects: {
    title: 'Assigned Architectural Projects',
    subtitle: 'Land details, AI requirements, UDA feasibility, 3 2D alternatives & design progress',
  },
  staff_reviews: {
    title: 'Project Review Queue',
    subtitle: 'Review architectural planning dossiers, check UDA compliance & request client corrections',
  },
  staff_pdf_library: {
    title: 'Planning PDF Library',
    subtitle: 'Browse municipal council bylaws & upload official zoning / setback PDF documentation for Admin sign-off',
  },
  staff_building_rules: {
    title: 'Building Rules & Bylaws',
    subtitle: 'Search UDA regulations & submit suggested amendments or corrections for Admin approval',
  },
  staff_rate_suggestions: {
    title: 'Construction Rate Suggestions',
    subtitle: 'Propose updated material & skilled labor unit rates in LKR for Admin review',
  },
  staff_approvals: {
    title: 'My Approval Requests Status',
    subtitle: 'Track Admin decisions, approvals, remarks, and requested corrections on submitted proposals',
  },
  staff_tasks: {
    title: 'My Architectural Tasks',
    subtitle: 'Review deliverables, feasibility inspections, boundary clearance & milestone action items',
  },
  staff_notifications: {
    title: 'Staff Notifications & Alerts',
    subtitle: 'Admin allocation alerts, approval decisions, and regulatory advisories',
  },
  staff_profile: {
    title: 'Staff Credentials & Settings',
    subtitle: 'Professional registration (AIA SL / IESL), contact details, assigned district & workload metrics',
  },
};

export const StaffHeader: React.FC<StaffHeaderProps> = ({
  currentModule,
  onSelectModule,
  currentStaff,
  onSwitchToAdmin,
  onOpenMobileSidebar,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onQuickAction,
  onSwitchToHomeowner,
}) => {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentMeta = staffModuleLabels[currentModule] || {
    title: 'Staff Workspace',
    subtitle: '',
  };

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
      {/* Left: Mobile Toggle & Title */}
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
            <span>Staff Portal</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">{currentMeta.title}</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 leading-tight hidden sm:block">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Action, Notifications, Switch to Admin & Identity Pill */}
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
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 text-xs z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onQuickAction('add_task');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-rose-500" />
                  <span>Create My Task</span>
                </div>
                <span className="text-[10px] text-slate-400">Task</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('rate_proposal');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-500" />
                  <span>Propose Construction Rate (LKR)</span>
                </div>
                <span className="text-[10px] text-slate-400">Rate</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('pdf_upload');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Submit Planning PDF</span>
                </div>
                <span className="text-[10px] text-slate-400">PDF</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('log_review');
                  setQuickActionOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-amber-500" />
                  <span>Log Project Review</span>
                </div>
                <span className="text-[10px] text-slate-400">Review</span>
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
                  <span className="font-semibold text-sm text-slate-900">Staff Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 6).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      onMarkNotificationRead(notif.id);
                      onSelectModule('staff_notifications');
                      setNotifDropdownOpen(false);
                    }}
                    className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 line-clamp-1">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 mt-1">{notif.message}</p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No notifications at this time.
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    onSelectModule('staff_notifications');
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

        {/* Demo Switcher: Return to Admin Center & Client Portal */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSwitchToAdmin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shadow-xs"
            title="Switch to Admin Control Center view"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline">Admin Center</span>
          </button>

          {onSwitchToHomeowner && (
            <button
              onClick={onSwitchToHomeowner}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
              title="Demo Role Switch: Open Homeowner Client Workspace"
            >
              <span className="hidden sm:inline">Client Portal</span>
            </button>
          )}
        </div>

        {/* Staff Identity Pill */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {currentStaff.name}
            </div>
            <div className="text-[10px] text-blue-600 font-medium flex items-center justify-end gap-1">
              <MapPin className="h-2.5 w-2.5" />
              <span>{currentStaff.assignedDistrict}</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentStaff.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
};
