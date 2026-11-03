import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Filter,
  FileCheck2,
  UserCheck2,
  HardHat,
  Receipt,
  Clock,
  Layers,
} from 'lucide-react';
import {
  NotificationItem,
  NotificationCategory,
  StaffModuleType,
  StaffMember,
} from '../../../types';

interface StaffNotificationsModuleProps {
  currentStaff: StaffMember;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigateToStaffModule: (module: StaffModuleType) => void;
}

export const StaffNotificationsModule: React.FC<StaffNotificationsModuleProps> = ({
  currentStaff,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onNavigateToStaffModule,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);

  const filteredNotifications = notifications.filter((notif) => {
    const matchesCategory = filterCategory === 'all' || notif.category === filterCategory;
    const matchesUnread = !filterUnreadOnly || !notif.read;
    return matchesCategory && matchesUnread;
  });

  const unreadTotal = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'approval':
        return <FileCheck2 className="h-4 w-4 text-amber-500" />;
      case 'assignment':
        return <UserCheck2 className="h-4 w-4 text-emerald-500" />;
      case 'project':
        return <HardHat className="h-4 w-4 text-blue-500" />;
      case 'rate':
        return <Receipt className="h-4 w-4 text-teal-500" />;
      case 'system':
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStaffDestinationModule = (category: NotificationCategory): StaffModuleType => {
    switch (category) {
      case 'assignment':
        return 'staff_homeowners';
      case 'approval':
        return 'staff_approvals';
      case 'rate':
        return 'staff_rate_suggestions';
      case 'project':
        return 'staff_projects';
      case 'system':
      default:
        return 'staff_dashboard';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Staff Operational Signals & Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated notifications for Admin lead assignments, proposal decisions, and planning advisories for {currentStaff.name}.
          </p>
        </div>

        {unreadTotal > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Signals ({notifications.length})
          </button>
          <button
            onClick={() => setFilterCategory('assignment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'assignment'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Allocations
          </button>
          <button
            onClick={() => setFilterCategory('approval')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'approval'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Decisions
          </button>
          <button
            onClick={() => setFilterCategory('rate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'rate'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rate Changes
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700">
          <input
            type="checkbox"
            checked={filterUnreadOnly}
            onChange={(e) => setFilterUnreadOnly(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <span>Show Unread Only ({unreadTotal})</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
              !notif.read ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="min-w-0 flex-1 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm truncate">{notif.title}</span>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                  )}
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{notif.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0 text-xs">
              <button
                onClick={() => {
                  onMarkRead(notif.id);
                  onNavigateToStaffModule(getStaffDestinationModule(notif.category));
                }}
                className="px-2.5 py-1 font-semibold rounded text-blue-600 hover:bg-blue-50 transition-colors"
              >
                View Section
              </button>

              {!notif.read && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => onDeleteNotification(notif.id)}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                title="Delete notification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications in this filter view.
          </div>
        )}
      </div>
    </div>
  );
};
