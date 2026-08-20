import React, { useState } from 'react';
import { SmartBin, WasteCategory } from '../types';
import { Search, Filter, RefreshCw, AlertTriangle, CheckCircle2, Battery, Thermometer, Radio, Zap, SlidersHorizontal, RotateCcw, BarChart2 } from 'lucide-react';

interface SmartBinMonitoringViewProps {
  bins: SmartBin[];
  onCollectBin: (binId: string) => void;
  onSimulateIoT: () => void;
  isSimulating: boolean;
}

export const SmartBinMonitoringView: React.FC<SmartBinMonitoringViewProps> = ({
  bins,
  onCollectBin,
  onSimulateIoT,
  isSimulating
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fillRangeFilter, setFillRangeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories: string[] = [
    'ALL',
    'Organic',
    'Plastic',
    'Paper',
    'Glass',
    'Metal',
    'E-Waste',
    'Hazardous',
    'Mixed Recyclables'
  ];

  const filteredBins = bins.filter((b) => {
    // 1. Status Filter
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CRITICAL' && b.status === 'Critical') ||
      (statusFilter === 'ALMOST_FULL' && b.status === 'Almost Full') ||
      (statusFilter === 'NORMAL' && b.status === 'Normal');

    // 2. Fill Range Filter
    let matchesFill = true;
    if (fillRangeFilter === 'CRITICAL_90') {
      matchesFill = b.fillLevel >= 90;
    } else if (fillRangeFilter === 'HIGH_75_89') {
      matchesFill = b.fillLevel >= 75 && b.fillLevel < 90;
    } else if (fillRangeFilter === 'MEDIUM_50_74') {
      matchesFill = b.fillLevel >= 50 && b.fillLevel < 75;
    } else if (fillRangeFilter === 'LOW_0_49') {
      matchesFill = b.fillLevel < 50;
    }

    // 3. Waste Stream Category Filter
    const matchesCategory =
      categoryFilter === 'ALL' || b.wasteType.toLowerCase() === categoryFilter.toLowerCase();

    // 4. Search Filter
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesFill && matchesCategory && matchesSearch;
  });

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'ALL' ||
    fillRangeFilter !== 'ALL' ||
    categoryFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setFillRangeFilter('ALL');
    setCategoryFilter('ALL');
  };

  const avgFillLevel = filteredBins.length > 0
    ? Math.round(filteredBins.reduce((acc, b) => acc + b.fillLevel, 0) / filteredBins.length)
    : 0;

  return (
    <div id="smart-bin-monitoring-container" className="max-w-6xl mx-auto py-6 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>IoT Sensor Telemetry Grid</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Smart Bin Monitoring
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onSimulateIoT}
            disabled={isSimulating}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Updating Telematics...' : 'Simulate Live IoT Sensor Ping'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Criteria Filter Controls Panel */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        
        {/* Row 1: Search + Quick Stats + Reset */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by bin ID (e.g. BIN-104), location, or address..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Matching Bins: <strong className="text-emerald-600 dark:text-emerald-400">{filteredBins.length}</strong> / {bins.length}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Avg Fill: <strong className="text-emerald-600 dark:text-emerald-400">{avgFillLevel}%</strong>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold text-xs flex items-center space-x-1 hover:bg-red-100 dark:hover:bg-red-900 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Detailed Filter Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Status Severity</span>
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'CRITICAL', label: 'Critical' },
                { id: 'ALMOST_FULL', label: 'Almost Full' },
                { id: 'NORMAL', label: 'Normal' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`py-1.5 rounded-xl font-extrabold text-[10px] transition-all cursor-pointer ${
                    statusFilter === st.id
                      ? st.id === 'CRITICAL'
                        ? 'bg-red-600 text-white shadow-sm'
                        : st.id === 'ALMOST_FULL'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : st.id === 'NORMAL'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fill Range Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-500" />
              <span>Fill Percentage Range</span>
            </label>
            <select
              value={fillRangeFilter}
              onChange={(e) => setFillRangeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Fill Levels (0% - 100%)</option>
              <option value="CRITICAL_90">Critical Overflow (≥ 90%)</option>
              <option value="HIGH_75_89">High Capacity (75% - 89%)</option>
              <option value="MEDIUM_50_74">Moderate Level (50% - 74%)</option>
              <option value="LOW_0_49">Low Level (&lt; 50%)</option>
            </select>
          </div>

          {/* Waste Stream Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Filter className="w-3 h-3 text-blue-500" />
              <span>Waste Category Stream</span>
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Waste Categories' : cat}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Smart Bins Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBins.map((bin) => {
          const statusBadge = bin.status === 'Critical' ? 'bg-red-500 text-white' : bin.status === 'Almost Full' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white';
          return (
            <div key={bin.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white">
                    {bin.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${statusBadge}`}>
                    {bin.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{bin.name}</h3>
                  <p className="text-[11px] text-slate-500">{bin.address}</p>
                </div>

                {/* Fill Level Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Fill Level</span>
                    <span className="text-slate-900 dark:text-white">{bin.fillLevel}% ({Math.round(bin.capacityLiters * (bin.fillLevel / 100))}L)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bin.status === 'Critical' ? 'bg-red-500' : bin.status === 'Almost Full' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>

                {/* Sensor telemetry */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span>Stream: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{bin.wasteType}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span>Overflow AI: </span>
                    <span className="font-bold text-amber-600">{bin.predictedOverflowHours}h</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Last pick: {bin.lastCollectionTime}</span>
                <button
                  onClick={() => onCollectBin(bin.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Collect Bin
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
