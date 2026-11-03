import React from 'react';
import {
  Menu,
  Bell,
  Box,
  Lock,
  Unlock,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Shield,
  Briefcase,
  User,
  Plus,
} from 'lucide-react';
import { HomeownerUser, ConstructionProject, WorkspaceRole, HomeownerModuleType } from '../../types';

interface HomeownerHeaderProps {
  currentHomeowner: HomeownerUser;
  currentProject: ConstructionProject | null;
  onOpenMobileMenu: () => void;
  onSelectModule: (module: HomeownerModuleType) => void;
  onSwitchRole: (role: WorkspaceRole) => void;
  unreadNotificationsCount: number;
}

export const HomeownerHeader: React.FC<HomeownerHeaderProps> = ({
  currentHomeowner,
  currentProject,
  onOpenMobileMenu,
  onSelectModule,
  onSwitchRole,
  unreadNotificationsCount,
}) => {
  const is3DUnlocked = currentProject?.homeownerConfirmation?.isConfirmed && currentProject?.model3DStatus?.status !== 'Locked - Awaiting Homeowner 2D Confirmation';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Project Context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {currentProject ? currentProject.title : 'Residential Planning Center'}
              </h1>
              {currentProject && (
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                  {currentProject.code}
                </span>
              )}
              {currentProject && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {currentProject.currentStage}
                </span>
              )}
            </div>

            {currentProject && (
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 hidden sm:flex">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {currentProject.district} • {currentProject.landDetails.plotSizePerches} Perches ({currentProject.landDetails.plotAreaSqFt.toLocaleString()} sq.ft)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  {currentProject.landDetails.localCouncilAuthority}
                </span>
                <span>•</span>
                <span>Lead: {currentProject.leadStaffName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: 3D Invariant Pill, Role Switcher, Quick Actions & User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 3D Conceptual Model Status Indicator */}
          {currentProject && (
            <button
              onClick={() => onSelectModule('homeowner_3d_viewer')}
              title={is3DUnlocked ? '3D Conceptual Model is Unlocked' : '3D Model Locked: Requires explicit 2D confirmation'}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                is3DUnlocked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Model:</span>
              {is3DUnlocked ? (
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <Unlock className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-700 font-bold">
                  <Lock className="w-3 h-3" /> Locked (Req 2D)
                </span>
              )}
            </button>
          )}

          {/* Quick Action: New Project */}
          <button
            onClick={() => onSelectModule('homeowner_new_project')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onSelectModule('homeowner_notifications')}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Role Switcher Pill Container */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onSwitchRole('homeowner')}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-white text-blue-700 shadow-xs"
              title="Homeowner Workspace (Current)"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Client</span>
            </button>
            <button
              onClick={() => onSwitchRole('staff')}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              title="Switch to Staff Workspace"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Staff</span>
            </button>
            <button
              onClick={() => onSwitchRole('admin')}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              title="Switch to Admin Control Center"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Active Homeowner Avatar Pill */}
          <button
            onClick={() => onSelectModule('homeowner_profile')}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
              {currentHomeowner.name.charAt(0)}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">{currentHomeowner.name.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">{currentHomeowner.district}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
