import React from 'react';
import { Leaf, Recycle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

interface SmartSegregationAssistantViewProps {
  onNavigate: (tab: string) => void;
}

export const SmartSegregationAssistantView: React.FC<SmartSegregationAssistantViewProps> = ({ onNavigate }) => {
  const binCategories = [
    {
      colorName: 'GREEN BIN',
      colorClass: 'bg-emerald-600 text-white border-emerald-700',
      title: 'Compost & Wet Organic Waste',
      examples: ['Food scraps & leftovers', 'Apple cores & banana peels', 'Garden leaves & plant clippings', 'Tea bags & coffee grounds'],
      reasoning: 'Put this in the GREEN bin because organic waste undergoes anaerobic decomposition in landfills producing potent Methane gas. Composting turns it into organic soil fertilizer.'
    },
    {
      colorName: 'BLUE BIN',
      colorClass: 'bg-blue-600 text-white border-blue-700',
      title: 'Dry Recyclables (Plastic, Paper, Metal)',
      examples: ['PET water bottles & soda cans', 'Corrugated cardboard boxes', 'Newspapers & office paper', 'Clean aluminum cans'],
      reasoning: 'Put this in the BLUE bin because clean, dry recyclables can be pelletized and remanufactured. Recycling aluminum saves 95% energy vs raw ore.'
    },
    {
      colorName: 'YELLOW BIN',
      colorClass: 'bg-amber-500 text-slate-950 border-amber-600',
      title: 'Glass Containers',
      examples: ['Glass food jars', 'Beverage bottles', 'Cosmetic glass bottles'],
      reasoning: 'Put this in the YELLOW bin because glass is 100% infinitely recyclable without quality loss. Keep broken window glass separate.'
    },
    {
      colorName: 'RED BIN',
      colorClass: 'bg-red-600 text-white border-red-700',
      title: 'E-Waste & Hazardous Materials',
      examples: ['Lithium AA/AAA batteries', 'Broken smartphones & chargers', 'Paint cans & chemicals', 'Fluorescent light bulbs'],
      reasoning: 'Put this in the RED bin because batteries contain Lithium/Cobalt that cause garbage truck fires and leach heavy metals into municipal aquifers.'
    }
  ];

  return (
    <div id="segregation-assistant-container" className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Smart Segregation Assistant</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Visual Waste Segregation Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Simple, clear rules on which bin to choose and why it protects our local environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {binCategories.map((bin, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className={`p-3 rounded-2xl ${bin.colorClass} font-extrabold text-sm uppercase tracking-wider flex items-center justify-between`}>
                <span>{bin.colorName}</span>
                <Recycle className="w-5 h-5 opacity-90" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {bin.title}
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Common Examples:</p>
                <ul className="grid grid-cols-1 gap-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {bin.examples.map((item, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
                <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                  “{bin.reasoning}”
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('scanner')}
              className="mt-2 w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1"
            >
              <span>Scan Item to Verify</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
