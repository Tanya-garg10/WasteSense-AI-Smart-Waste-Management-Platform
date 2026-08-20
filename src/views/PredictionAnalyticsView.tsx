import React from 'react';
import { SmartBin } from '../types';
import { Clock, TrendingUp, AlertCircle, ShieldCheck, Zap, ArrowRight, Truck } from 'lucide-react';

interface PredictionAnalyticsViewProps {
  bins: SmartBin[];
  onNavigate: (tab: string) => void;
}

export const PredictionAnalyticsView: React.FC<PredictionAnalyticsViewProps> = ({ bins, onNavigate }) => {
  const atRiskBins = bins.filter(b => b.predictedOverflowHours <= 6).sort((a, b) => a.predictedOverflowHours - b.predictedOverflowHours);

  return (
    <div id="prediction-analytics-container" className="max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/30 text-purple-300 font-bold text-[10px] uppercase border border-purple-400/30">
                  Time-Series Predictive AI
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>LSTM Fill-Rate Model Active</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Bin Overflow AI Analytics
              </h2>
              <p className="text-xs text-slate-300">
                Predicting waste fill rates 12 hours in advance using historical collection logs & citizen foot-traffic density.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('smart_route')}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-2 shrink-0"
          >
            <Truck className="w-4 h-4" />
            <span>Generate Dispatch Route</span>
          </button>
        </div>
      </div>

      {/* Recommended Predictive Actions */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3">
        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>AI Dispatch Recommendation:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          “Dispatch Truck #TRUCK-04 to Civic Center Sector between 13:00 and 15:00. This action will prevent <strong className="text-amber-600 dark:text-amber-400">{atRiskBins.length} imminent overflows</strong> and eliminate citizen complaint calls.”
        </p>
      </div>

      {/* At Risk Bins List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>At-Risk Bins (Predicted Overflow &lt;6 Hours)</span>
          </h3>
          <span className="text-xs font-bold text-red-500">{atRiskBins.length} Bins Flagged</span>
        </div>

        <div className="space-y-3">
          {atRiskBins.map((bin) => (
            <div key={bin.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{bin.code}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-[10px]">
                    Current: {bin.fillLevel}%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Overflow in {bin.predictedOverflowHours}h</span>
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{bin.name}</p>
                <p className="text-[10px] text-slate-500">{bin.address}</p>
              </div>

              <button
                onClick={() => onNavigate('collector_dash')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center space-x-1"
              >
                <span>Dispatch Truck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
