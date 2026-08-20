import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Leaf,
  TrendingUp,
  Award,
  TreePine,
  CloudRain,
  Zap,
  BarChart2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';

interface UserImpactVisualizationProps {
  user: UserProfile;
}

export const UserImpactVisualization: React.FC<UserImpactVisualizationProps> = ({ user }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'lifetime'>('monthly');

  // Derive dynamic scan metrics based on user's scansCompleted
  const totalScans = user.scansCompleted || 24;
  const estCo2SavedKg = Number((totalScans * 1.85).toFixed(1)); // ~1.85 kg CO2 per scan
  const estWasteDivertedKg = Number((totalScans * 2.4).toFixed(1)); // ~2.4 kg waste per scan
  const treesEquivalent = (estCo2SavedKg / 21.8).toFixed(1); // 1 tree absorbs ~21.8kg CO2/yr
  const waterSavedLiters = Math.round(totalScans * 35); // ~35L water saved per recycled item

  // Time-series data sets
  const monthlyData = [
    { period: 'Mar 2026', co2Saved: 4.2, wasteDiverted: 5.8, scans: 3 },
    { period: 'Apr 2026', co2Saved: 7.5, wasteDiverted: 9.6, scans: 5 },
    { period: 'May 2026', co2Saved: 11.1, wasteDiverted: 14.2, scans: 7 },
    { period: 'Jun 2026', co2Saved: 16.8, wasteDiverted: 21.5, scans: 10 },
    { period: 'Jul 2026', co2Saved: 28.4, wasteDiverted: 36.2, scans: 16 },
    { period: 'Aug 2026', co2Saved: estCo2SavedKg, wasteDiverted: estWasteDivertedKg, scans: totalScans }
  ];

  const weeklyData = [
    { period: 'Week 1', co2Saved: 2.1, wasteDiverted: 2.8, scans: 2 },
    { period: 'Week 2', co2Saved: 4.5, wasteDiverted: 6.0, scans: 4 },
    { period: 'Week 3', co2Saved: 8.2, wasteDiverted: 10.5, scans: 6 },
    { period: 'Week 4', co2Saved: 13.6, wasteDiverted: 17.2, scans: 9 },
    { period: 'Week 5', co2Saved: 21.0, wasteDiverted: 27.0, scans: 14 },
    { period: 'Week 6', co2Saved: estCo2SavedKg, wasteDiverted: estWasteDivertedKg, scans: totalScans }
  ];

  const chartData = timeframe === 'weekly' ? weeklyData : monthlyData;

  // Waste category diversion breakdown
  const categoryBreakdown = [
    { name: 'Organic', value: 35, color: '#10b981', weightKg: (estWasteDivertedKg * 0.35).toFixed(1) },
    { name: 'Plastic', value: 25, color: '#3b82f6', weightKg: (estWasteDivertedKg * 0.25).toFixed(1) },
    { name: 'Paper', value: 18, color: '#f59e0b', weightKg: (estWasteDivertedKg * 0.18).toFixed(1) },
    { name: 'Glass', value: 12, color: '#14b8a6', weightKg: (estWasteDivertedKg * 0.12).toFixed(1) },
    { name: 'E-Waste', value: 6, color: '#a855f7', weightKg: (estWasteDivertedKg * 0.06).toFixed(1) },
    { name: 'Metal', value: 4, color: '#64748b', weightKg: (estWasteDivertedKg * 0.04).toFixed(1) }
  ];

  return (
    <div id="user-impact-visualization" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black shadow-md">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Personal Environmental Telemetry
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                CO₂ Savings & Waste Diverted Impact
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical environmental impact generated from your {totalScans} AI waste scans and diversion actions.
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 self-start sm:self-center">
          {(['weekly', 'monthly', 'lifetime'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTimeframe(mode)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs capitalize transition-all cursor-pointer ${
                timeframe === mode
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Top Highlight Impact Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* CO2 Saved */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
              CO₂ Avoided
            </span>
            <CloudRain className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {estCo2SavedKg} <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">kg</span>
          </p>
          <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 font-medium">
            ↑ 18.4% vs last month
          </p>
        </div>

        {/* Waste Diverted */}
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-teal-800 dark:text-teal-300">
              Waste Diverted
            </span>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400">
            {estWasteDivertedKg} <span className="text-xs font-bold text-teal-700 dark:text-teal-300">kg</span>
          </p>
          <p className="text-[10px] text-teal-700/80 dark:text-teal-300/80 font-medium">
            Prevented from landfill
          </p>
        </div>

        {/* Trees Equivalent */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300">
              Trees Saved Eq.
            </span>
            <TreePine className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {treesEquivalent} <span className="text-xs font-bold text-amber-700 dark:text-amber-300">trees</span>
          </p>
          <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 font-medium">
            Annual CO₂ absorption
          </p>
        </div>

        {/* Water Saved */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-blue-800 dark:text-blue-300">
              Water Conserved
            </span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {waterSavedLiters} <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Liters</span>
          </p>
          <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 font-medium">
            Manufacturing water saved
          </p>
        </div>

      </div>

      {/* Main Impact Over Time Area Chart */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cumulative Carbon & Waste Reduction Timeline</span>
          </h4>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Unit: Kilograms (kg)
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="co2Saved"
                name="CO₂ Avoided (kg)"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#co2Gradient)"
              />
              <Area
                type="monotone"
                dataKey="wasteDiverted"
                name="Waste Diverted (kg)"
                stroke="#14b8a6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#wasteGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waste Category Breakdown Progress Bar Grid */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Diverted Waste Material Composition
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center space-x-2 text-slate-900 dark:text-white">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name} Waste</span>
                </span>
                <span className="text-slate-500">
                  {cat.weightKg} kg ({cat.value}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Milestone Goal */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-300 uppercase">Next Impact Milestone</p>
            <p className="text-sm font-black text-white">Reach 50 kg CO₂ Avoided (Climate Hero Badge)</p>
            <p className="text-[11px] text-slate-300">You are {Math.round((estCo2SavedKg / 50) * 100)}% of the way there!</p>
          </div>
        </div>

        <div className="w-full sm:w-36 shrink-0 space-y-1 text-right">
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
              style={{ width: `${Math.min(100, (estCo2SavedKg / 50) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-amber-300">{estCo2SavedKg} / 50 kg</span>
        </div>
      </div>

    </div>
  );
};
