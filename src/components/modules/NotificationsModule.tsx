import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Send,
  Plus,
  Filter,
  AlertCircle,
  FileCheck2,
  UserCheck2,
  HardHat,
  Receipt,
  Layers,
} from 'lucide-react';
import { NotificationItem, NotificationCategory, ModuleType } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface NotificationsModuleProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  onDispatchBroadcast: (title: string, message: string, category: NotificationCategory) => void;
  onNavigateToModule: (module: ModuleType) => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onDispatchBroadcast,
  onNavigateToModule,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);

  // Broadcast form state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<NotificationCategory>('system');

  const filteredNotifications = notifications.filter((notif) => {
    const matchesCategory = filterCategory === 'all' || notif.category === filterCategory;
    const matchesUnread = !filterUnreadOnly || !notif.read;
    return matchesCategory && matchesUnread;
  });

  const unreadTotal = notifications.filter((n) => !n.read).length;

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    onDispatchBroadcast(broadcastTitle, broadcastMessage, broadcastCategory);
    setIsBroadcastModalOpen(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

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

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            System Notifications & Architectural Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated signals for rate proposals, building-rule submissions, client 2D plan events, and staff allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadTotal > 0 && (
            <button
              onClick={onMarkAllRead}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Send className="h-4 w-4" />
            <span>Send Broadcast Signal</span>
          </button>
        </div>
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
            onClick={() => setFilterCategory('approval')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'approval'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Approvals & Bylaws
          </button>
          <button
            onClick={() => setFilterCategory('assignment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'assignment'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lead Assignments
          </button>
          <button
            onClick={() => setFilterCategory('rate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'rate'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rate Changes (LKR)
          </button>
          <button
            onClick={() => setFilterCategory('project')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterCategory === 'project'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Architectural Pipelines
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
              {notif.linkModule && (
                <button
                  onClick={() => {
                    onMarkRead(notif.id);
                    onNavigateToModule(notif.linkModule!);
                  }}
                  className="px-2.5 py-1 font-semibold rounded text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View Module
                </button>
              )}

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

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Dispatch Architectural Broadcast Announcement"
        subtitle="Broadcast an immediate operational or regulatory advisory across the Admin console."
        maxWidth="md"
      >
        <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Broadcast Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. UDA High-Density Zone Setback Gazette Update (Colombo/Gampaha)"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Category</label>
            <select
              value={broadcastCategory}
              onChange={(e) => setBroadcastCategory(e.target.value as NotificationCategory)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="system">System Advisory</option>
              <option value="approval">Urgent Proposal Review (Rate / Bylaw)</option>
              <option value="rate">Material Escalation Alert (LKR)</option>
              <option value="assignment">Lead Architect Allocation Directive</option>
              <option value="project">Planning Deliverable & 2D Plan Milestone</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Body / Directive *</label>
            <textarea
              rows={3}
              required
              placeholder="Write broadcast notification text for architectural staff and compliance officers..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBroadcastModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
            >
              Send Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
