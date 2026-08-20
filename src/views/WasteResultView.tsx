import React from 'react';
import { WasteClassificationResult } from '../types';
import {
  CheckCircle2,
  ScanLine,
  Award,
  Sparkles,
  ArrowRight,
  Info,
  Leaf,
  Recycle,
  Trash2,
  RotateCcw,
  MapPin
} from 'lucide-react';

interface WasteResultViewProps {
  result: WasteClassificationResult;
  imagePreviewUrl?: string;
  onScanAnother: () => void;
  onNavigate: (tab: string) => void;
}

export const WasteResultView: React.FC<WasteResultViewProps> = ({
  result,
  imagePreviewUrl,
  onScanAnother,
  onNavigate
}) => {
  // Bin badge styling
  const binStyles: Record<string, { bg: string; text: string; border: string; binHex: string }> = {
    Green: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600', binHex: '#10b981' },
    Blue: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700', binHex: '#2563eb' },
    Yellow: { bg: 'bg-amber-500', text: 'text-slate-950', border: 'border-amber-600', binHex: '#f59e0b' },
    Red: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700', binHex: '#dc2626' },
    Grey: { bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-800', binHex: '#334155' }
  };

  const style = binStyles[result.recommendedBinColor] || binStyles.Blue;

  return (
    <div id="waste-result-container" className="max-w-3xl mx-auto py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                  AI Classified
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{result.pointsEarned || 25} Eco Points Earned!</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {result.itemTitle || `${result.detectedCategory} Item`}
              </h2>
            </div>
          </div>

          <button
            onClick={onScanAnother}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Item</span>
          </button>
        </div>
      </div>

      {/* Main Segregation Recommendation Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Recommended Bin Large Visual Display */}
        <div className={`p-6 rounded-3xl ${style.bg} ${style.text} shadow-lg space-y-3 relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-black/20 text-xs font-bold uppercase tracking-wider">
              Segregation Action
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20">
              {result.confidence}% AI Confidence
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black">
            Put this in the {result.recommendedBinName}
          </h3>

          <p className="text-sm font-medium text-white/90">
            “{result.shortInstructions}”
          </p>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Left: Environmental Reasoning */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Why this bin? (Smart Segregation Assistant)
            </h4>
            
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {result.detailedReasoning}
            </p>

            {/* Recyclability & CO2 Impact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Recyclability Score</p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{result.recyclabilityScore}%</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <p className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase">Est. CO₂ Reduced</p>
                <p className="text-2xl font-black text-teal-700 dark:text-teal-400 mt-0.5">{result.co2SavedKgEstimate} kg</p>
              </div>
            </div>
          </div>

          {/* Right: Uploaded Image + Nearby Bins CTA */}
          <div className="space-y-4">
            {imagePreviewUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 max-h-48 flex items-center justify-center">
                <img src={imagePreviewUrl} alt="Scanned waste" className="max-h-48 object-contain" />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">Find Nearby {result.recommendedBinColor} Bins</h5>
              </div>
              <p className="text-[11px] text-slate-500">
                Locate the closest verified smart bin equipped with IoT fill sensors.
              </p>
              <button
                onClick={() => onNavigate('nearby_map')}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1"
              >
                <span>Open Nearby Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating 'Scan Another' Quick Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          id="floating-scan-another-btn"
          onClick={onScanAnother}
          className="px-5 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center space-x-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-emerald-300 ring-4 ring-emerald-500/20 cursor-pointer group"
          title="Scan another waste item using AI camera"
        >
          <RotateCcw className="w-5 h-5 text-slate-950 group-hover:-rotate-90 transition-transform duration-300" />
          <span className="tracking-tight">Scan Another Item</span>
        </button>
      </div>

    </div>
  );
};
