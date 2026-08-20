import React from 'react';
import { SmartBin, OptimizedRoute } from '../types';
import { Truck, CheckCircle2, AlertTriangle, Route, MapPin, Clock, ArrowRight } from 'lucide-react';

interface CollectorDashboardViewProps {
  bins: SmartBin[];
  route: OptimizedRoute;
  onCollectBin: (binId: string) => void;
  onNavigate: (tab: string) => void;
}

export const CollectorDashboardView: React.FC<CollectorDashboardViewProps> = ({
  bins,
  route,
  onCollectBin,
  onNavigate
}) => {
  const priorityBins = bins.filter(b => b.fillLevel >= 70).sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div id="collector-dashboard-container" className="space-y-6 pb-8">
      
      {/* Driver Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white font-black flex items-center justify-center shadow-lg">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 text-blue-300 font-bold text-[10px] uppercase border border-blue-400/30">
                  Truck #TRUCK-04
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On Duty — Officer Robert Vance</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Collector Dispatch Dashboard
              </h2>
              <p className="text-xs text-slate-300">
                {priorityBins.length} high-priority smart bins require servicing along your optimized collection route.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('smart_route')}
            className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 shrink-0"
          >
            <Route className="w-4 h-4" />
            <span>Open Smart Optimized Route (18% Saved)</span>
          </button>
        </div>
      </div>

      {/* Grid: Priority Pickups & Route Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Pickups List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Priority Bins</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              {priorityBins.length} Bins Over 70%
            </span>
          </div>

          <div className="space-y-3">
            {priorityBins.map((b, idx) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-black text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{b.code}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      b.status === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {b.fillLevel}% Full
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.name}</p>
                  <p className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{b.address}</span>
                  </p>
                </div>

                <button
                  onClick={() => onCollectBin(b.id)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Collected</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Truck Capacity & Quick Route Stat */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Truck Capacity Meter</h3>
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Payload Load</span>
                <span className="text-blue-600 dark:text-blue-400">68% (1.4 / 2.0 Tons)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
                <Route className="w-4 h-4 text-blue-600" />
                <span>AI Route Savings</span>
              </div>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-400">18.4% Distance Saved</p>
              <p className="text-[11px] text-slate-500">
                Recommended route avoids 3 empty bins and saves 14.8 kg CO₂ per shift.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
