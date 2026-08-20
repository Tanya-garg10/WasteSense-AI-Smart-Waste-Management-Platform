import React from 'react';
import { MunicipalityAnalytics, SmartBin, CitizenReport } from '../types';
import {
  BarChart3,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Leaf,
  CheckCircle2,
  Clock,
  MapPin,
  PieChart,
  Activity,
  Download,
  FileSpreadsheet,
  FileText,
  ThumbsUp
} from 'lucide-react';

interface MunicipalityDashboardViewProps {
  analytics: MunicipalityAnalytics;
  bins: SmartBin[];
  reports: CitizenReport[];
  onNavigate: (tab: string) => void;
}

export const MunicipalityDashboardView: React.FC<MunicipalityDashboardViewProps> = ({
  analytics,
  bins,
  reports,
  onNavigate
}) => {
  const criticalCount = bins.filter(b => b.status === 'Critical').length;
  const pendingCount = reports.filter(r => r.status === 'Pending').length;

  const handleExportCSV = () => {
    if (!reports || reports.length === 0) {
      alert('No citizen report data available to export.');
      return;
    }

    const headers = [
      'Report ID',
      'Category',
      'Status',
      'Location Name',
      'Latitude',
      'Longitude',
      'Description',
      'Reporter Name',
      'Community Upvotes',
      'Timestamp',
      'Associated Bin Code'
    ];

    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = reports.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.category),
      escapeCsv(r.status),
      escapeCsv(r.locationName),
      escapeCsv(r.lat),
      escapeCsv(r.lng),
      escapeCsv(r.description),
      escapeCsv(r.reporterName),
      escapeCsv(r.upvotes),
      escapeCsv(r.timestamp),
      escapeCsv(r.binCode || 'N/A')
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wastesense_citizen_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="municipality-dashboard-container" className="space-y-6 pb-8">
      
      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/30 text-purple-300 font-bold text-[10px] uppercase border border-purple-400/30">
                  Municipal Command Center
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Citywide IoT Telematics Active</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Municipality Intelligence Dashboard
              </h2>
              <p className="text-xs text-slate-300">
                Real-time monitoring of 148 IoT smart bins, citizen dumping reports, and predictive collection efficiency.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              id="export-reports-csv-btn-header"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Download Citizen Reports as CSV file"
            >
              <Download className="w-4 h-4" />
              <span>Export Report Data</span>
            </button>
            <button
              onClick={() => onNavigate('bin_monitoring')}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Smart Bin Fleet</span>
            </button>
            <button
              onClick={() => onNavigate('prediction_analytics')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20"
            >
              Overflow Predictions
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Monitored Fleet</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.totalBinsCount}</p>
          <p className="text-[10px] text-emerald-600 font-bold">100% Online IoT Sensors</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Critical Bins (&gt;90%)</p>
          <p className="text-3xl font-black text-red-600 dark:text-red-400">{criticalCount}</p>
          <p className="text-[10px] text-red-500 font-bold">Requires Collection</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Citizen Reports</p>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</p>
          <p className="text-[10px] text-amber-600 font-bold">Dumping / Overflows</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Collection Efficiency</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{analytics.collectionEfficiencyPct}%</p>
          <p className="text-[10px] text-emerald-600 font-bold">+18.4% Route Optimized</p>
        </div>
      </div>

      {/* Grid: Charts & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Waste Category Breakdown & Overflow Trends */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Waste Categories Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Waste Streams Breakdown</h3>
              </div>
              <span className="text-xs text-slate-400">Total City Volume: 128.4 Tons</span>
            </div>

            <div className="space-y-3">
              {analytics.wasteCategoryBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{item.percentage}% ({item.tons} Tons)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Overflow Trends Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Overflow Prevention Rate</h3>
              </div>
              <span className="text-xs text-emerald-600 font-bold">85% Reduction in Public Overflows</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-36">
              {analytics.overflowTrends.map((t, i) => (
                <div key={i} className="flex flex-col items-center space-y-1 text-center h-full justify-end">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg p-1 relative h-full flex flex-col justify-end items-center">
                    {/* Predicted bar */}
                    <div
                      className="w-full bg-red-400/40 rounded-t-md transition-all"
                      style={{ height: `${(t.predictedOverflows / 25) * 100}%` }}
                    />
                    {/* Actual prevented bar */}
                    <div
                      className="w-full bg-emerald-500 rounded-t-md absolute bottom-0 transition-all"
                      style={{ height: `${(t.actualOverflows / 25) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{t.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-6 text-[11px] font-bold text-slate-500 pt-2">
              <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded bg-red-400/40 inline-block" /><span>Predicted Overflows</span></span>
              <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /><span>Actual Uncollected Overflows</span></span>
            </div>
          </div>

        </div>

        {/* Right Col: Illegal Dumping Hotspots */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Illegal Dumping Hotspots</h3>
            </div>

            <div className="space-y-3">
              {analytics.dumpingHotspots.map((hs, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{hs.zoneName}</p>
                    <p className="text-[10px] text-slate-500">{hs.reportsCount} Citizen Reports</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    hs.riskLevel === 'High' ? 'bg-red-500 text-white' : hs.riskLevel === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {hs.riskLevel} Risk
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('report_issue')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Inspect Citizen Reports
            </button>
          </div>

          {/* Environmental CO2 Impact Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white space-y-3">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold">Total Environmental Carbon Impact</h4>
            </div>
            <p className="text-3xl font-black text-emerald-400">{analytics.totalCo2SavedTons} Tons CO₂</p>
            <p className="text-xs text-slate-300">
              Equivalent to planting 5,820 mature trees and eliminating 280,000 km of garbage truck driving.
            </p>
          </div>
        </div>

      </div>

      {/* Full Citizen Reports Data & Export Audit Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Citizen Incident Reports Registry</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live database of citizen-submitted dumping, damage, and overflow logs. Total: {reports.length} records.
            </p>
          </div>

          <button
            id="export-reports-csv-btn-table"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Report Data (.CSV)</span>
          </button>
        </div>

        {/* Table of Reports */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Location & Bin</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">Upvotes</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{r.category}</span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{r.locationName}</p>
                    {r.binCode && <span className="text-[10px] text-emerald-600 font-bold">{r.binCode}</span>}
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    <img src={r.reporterAvatar} alt={r.reporterName} className="w-5 h-5 rounded-full object-cover" />
                    <span>{r.reporterName}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-600">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[10px]">
                      <ThumbsUp className="w-3 h-3 text-emerald-500" />
                      <span>{r.upvotes}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                      r.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : r.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">{r.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
