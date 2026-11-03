import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users2,
  HardHat,
  Receipt,
  FileSpreadsheet,
  MapPin,
  Compass,
} from 'lucide-react';
import {
  ConstructionProject,
  StaffMember,
  ConstructionRate,
  AssignmentRecord,
  SriLankanDistrict,
} from '../../types';
import { formatLKR, formatShortLKR } from '../../services/storageService';

interface ReportsAnalyticsModuleProps {
  projects: ConstructionProject[];
  staff: StaffMember[];
  rates: ConstructionRate[];
  assignments: AssignmentRecord[];
}

export const ReportsAnalyticsModule: React.FC<ReportsAnalyticsModuleProps> = ({
  projects,
  staff,
  rates,
  assignments,
}) => {
  const [reportTimeframe, setReportTimeframe] = useState<'Q2-2024' | 'Q3-2024' | 'YTD'>('YTD');

  // Computed Portfolio Stats in LKR
  const totalPortfolioLKR = projects.reduce((acc, p) => acc + p.costEstimateLKR.totalEstimateLKR, 0);
  const avgCostPerSqFtLKR = Math.round(
    projects.reduce((acc, p) => acc + p.costEstimateLKR.costPerSqFtLKR, 0) / (projects.length || 1)
  );

  // CSV Exporter for Sri Lankan Portfolio Data
  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Title',
      'Client',
      'District',
      'Local Council',
      'Plot Size (Perches)',
      'Lead Architect / Engineer',
      'Stage',
      'Selected 2D Plan',
      'Client Confirmed',
      '3D Status',
      'Estimated Budget (LKR)',
    ];

    const rows = projects.map((p) => [
      p.code,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.homeownerName.replace(/"/g, '""')}"`,
      p.district,
      `"${p.landDetails.localCouncilAuthority.replace(/"/g, '""')}"`,
      p.landDetails.plotSizePerches,
      `"${p.leadStaffName.replace(/"/g, '""')}"`,
      `"${p.currentStage.replace(/"/g, '""')}"`,
      p.selectedPlanKey || 'None',
      p.homeownerConfirmation.isConfirmed ? 'Yes' : 'No',
      `"${p.model3DStatus.status.replace(/"/g, '""')}"`,
      p.costEstimateLKR.totalEstimateLKR,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BuildMind_SriLanka_Architectural_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // District distribution
  const districtCounts: Record<SriLankanDistrict, number> = {
    Colombo: 0,
    Jaffna: 0,
    Kandy: 0,
    Gampaha: 0,
    Kurunegala: 0,
  };
  projects.forEach((p) => {
    if (districtCounts[p.district] !== undefined) {
      districtCounts[p.district]++;
    }
  });

  // Stage distribution
  const stageCounts: Record<string, number> = {};
  projects.forEach((p) => {
    stageCounts[p.currentStage] = (stageCounts[p.currentStage] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Architectural Planning & Portfolio Analytics (Sri Lanka)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage velocity, district distribution across Jaffna, Colombo, Kandy, Gampaha, Kurunegala, and LKR cost benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            {(['Q2-2024', 'Q3-2024', 'YTD'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setReportTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  reportTimeframe === tf ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 3 High Precision Metrics in LKR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Total Portfolio Design Estimate
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {formatShortLKR(totalPortfolioLKR)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {formatLKR(totalPortfolioLKR)} in active architectural designs
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-blue-600" />
            Average Unit Cost Benchmark
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums mt-1">
            Rs. {avgCostPerSqFtLKR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Weighted average per built-up square foot</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users2 className="h-4 w-4 text-indigo-600" />
            Architect / Staff Workload
          </div>
          <div className="text-2xl font-bold text-indigo-600 font-mono tabular-nums mt-1">
            {Math.round(
              (staff.reduce((acc, s) => acc + s.activeAssignmentsCount, 0) /
                (staff.reduce((acc, s) => acc + s.maxAssignments, 0) || 1)) *
                100
            )}
            %
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active leads vs chartered staff capacity</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Architectural Pipelines by Sri Lankan District
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of land parcels undergoing active AI design synthesis
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              5 Districts
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { district: 'Jaffna', color: 'bg-emerald-600', count: districtCounts.Jaffna },
              { district: 'Colombo', color: 'bg-blue-600', count: districtCounts.Colombo },
              { district: 'Kandy', color: 'bg-indigo-600', count: districtCounts.Kandy },
              { district: 'Gampaha', color: 'bg-amber-600', count: districtCounts.Gampaha },
              { district: 'Kurunegala', color: 'bg-teal-600', count: districtCounts.Kurunegala },
            ].map((item) => {
              const pct = Math.round((item.count / (projects.length || 1)) * 100);
              return (
                <div key={item.district} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{item.district} District</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {item.count} Projects ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Planning Stage Funnel */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Architectural Stage Funnel Velocity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pipelines moving from AI Lifestyle Briefs to Client 2D Confirmation and 3D Modeling
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
              Funnel
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { stage: 'Land & AI Requirements', count: 1, color: 'bg-slate-500' },
              { stage: 'Project Brief Drafted', count: 1, color: 'bg-amber-500' },
              { stage: 'Feasibility & Bylaw Clearance', count: 1, color: 'bg-indigo-500' },
              { stage: '2D Plan Alternatives Review', count: 2, color: 'bg-blue-600' },
              { stage: 'Confirmed & 3D Modeling', count: 1, color: 'bg-emerald-600' },
            ].map((s) => {
              const count = s.count;
              const pct = Math.round((count / (projects.length || 1)) * 100);
              return (
                <div key={s.stage} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{s.stage}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {count} Pipelines ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${s.color} transition-all duration-300`}
                      style={{ width: `${Math.max(15, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
