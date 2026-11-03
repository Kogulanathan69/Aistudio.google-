import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Database,
  RotateCcw,
  Download,
  Building,
  CheckCircle2,
  FileText,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { AppSettings, AuditLogEntry } from '../../types';

interface SettingsModuleProps {
  settings: AppSettings;
  auditLogs: AuditLogEntry[];
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onExportBackup: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  auditLogs,
  onUpdateSettings,
  onResetData,
  onExportBackup,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Control Center Configuration & Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company enterprise identity, operational staff assignment constraints, and database backup persistence.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Enterprise Company Profile */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-slate-400" />
                Enterprise Company Profile
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Legal Entity</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admin Escalation Email</label>
                  <input
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Registration / Tax ID</label>
                  <input
                    type="text"
                    required
                    value={formData.taxRegistrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, taxRegistrationNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Operational Assignment Constraints */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-slate-400" />
                Operational & Architectural Invariants
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Staff Assignment Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxStaffAssignmentLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxStaffAssignmentLimit: parseInt(e.target.value) || 4,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">Maximum active homeowners per Lead Architect</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Display Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currency: 'LKR',
                        currencySymbol: 'Rs.',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LKR">LKR (Rs.) - Sri Lankan Rupee (Platform Standard)</option>
                  </select>
                  <span className="text-[10px] text-slate-400">Fixed to Sri Lankan Rupee (Rs.)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit System</label>
                  <input
                    type="text"
                    disabled
                    value="Perches & Sq. Ft"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">1 Perch = 272.25 sq.ft</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Contingency %</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    step={0.5}
                    value={formData.contingencyDefaultPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contingencyDefaultPercent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">Material escalation buffer</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Architectural Fee %</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={formData.architecturalFeePercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        architecturalFeePercent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">Standard AIA SL fee guideline</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">
                      Auto-Notify Lead Architect On Assignment
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Dispatches immediate notification when homeowner project lead changes
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoNotifyStaffOnAssign}
                    onChange={(e) =>
                      setFormData({ ...formData, autoNotifyStaffOnAssign: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">
                      Enforce Admin Review For Material Rate Proposals
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Requires dual admin approval before updated district BSR rates take effect
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.requireApprovalForRateUpdate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requireApprovalForRateUpdate: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs"
                >
                  Save Settings & Invariants
                </button>
              </div>
            </div>
          </form>

          {/* Database Backup & Reset Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-slate-400" />
              LocalStorage State & Sri Lankan Demo Persistence
            </h3>

            <p className="text-slate-600 leading-relaxed">
              All staff profiles, active homeowner assignments, Sri Lankan district construction rate updates (LKR), UDA building bylaws, and architectural planning project pipelines are dynamically persisted to your browser's <strong className="text-slate-800">localStorage</strong> under schema key <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">buildmind_lk_v2_*</code>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onExportBackup}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Database JSON Backup</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Seed Demo Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Audit Trail (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-slate-400" />
                Immutable System Audit Logs
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {auditLogs.length} events recorded
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Real-time audit records of all administrative actions, staff provisions, rate adjustments, and reassignments.
            </p>

            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-slate-600 leading-snug">{log.details}</div>
                  <div className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
                    <span>Actor: {log.actor}</span>
                    <span className="uppercase font-semibold tracking-wider text-blue-600">
                      {log.module}
                    </span>
                  </div>
                </div>
              ))}

              {auditLogs.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No audit log entries recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Reset Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reset Demo Database?</h3>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">
              This will reset all staff assignments, newly provisioned staff, project milestones, approval statuses, and custom construction rates back to their initial demonstration seed state.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold shadow-xs"
              >
                Confirm Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
