import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Box,
  FileText,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { NotificationItem, HomeownerModuleType } from '../../../types';
import { StorageService } from '../../../services/storageService';

interface HomeownerNotificationsModuleProps {
  notifications: NotificationItem[];
  onNotificationsUpdated: (items: NotificationItem[]) => void;
  onNavigate: (module: HomeownerModuleType) => void;
}

export const HomeownerNotificationsModule: React.FC<HomeownerNotificationsModuleProps> = ({
  notifications,
  onNotificationsUpdated,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    StorageService.saveNotifications(updated);
    onNotificationsUpdated(updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    StorageService.saveNotifications(updated);
    onNotificationsUpdated(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Notifications & Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding staff reviews, UDA clearance observations, and 2D/3D project stage transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'unread' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleToggleRead(notif.id)}
              className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read ? 'bg-blue-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    notif.category === 'project'
                      ? 'bg-blue-600'
                      : notif.category === 'approval'
                      ? 'bg-emerald-600'
                      : notif.category === 'rate'
                      ? 'bg-amber-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('homeowner_dashboard');
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                  title="View details"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No Notifications</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All updates have been marked as read.</p>
          </div>
        )}
      </div>
    </div>
  );
};
