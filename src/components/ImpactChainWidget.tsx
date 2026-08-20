import React from 'react';
import { AlertCircle, ScanLine, BrainCircuit, Route, TrendingUp, ArrowRight } from 'lucide-react';

interface ImpactChainWidgetProps {
  onNavigateTab?: (tab: string) => void;
}

export const ImpactChainWidget: React.FC<ImpactChainWidgetProps> = ({ onNavigateTab }) => {
  const [activeStep, setActiveStep] = React.useState(1);

  const steps = [
    {
      id: 1,
      title: '1. PROBLEM',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      tagline: 'Poor Segregation & Overflowing Bins',
      desc: '38% of waste is contaminated due to improper sorting; cities waste 22% fuel on unoptimized collection routes.',
      actionTab: 'report_issue',
      actionText: 'View Citizen Reports'
    },
    {
      id: 2,
      title: '2. AI DETECTION',
      icon: <ScanLine className="w-5 h-5 text-emerald-500" />,
      tagline: 'Gemini Computer Vision Scanner',
      desc: 'Recognizes PET plastic, organic food, paper, e-waste in 0.8s with 96%+ accuracy and instant category labeling.',
      actionTab: 'scanner',
      actionText: 'Try AI Waste Scanner'
    },
    {
      id: 3,
      title: '3. SMART DECISION',
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
      tagline: 'Time-Series Overflow Prediction',
      desc: 'Predicts exact bin overflow hours (e.g. Bin #104 overflowing in 6h 42m) using historical fill rate velocity.',
      actionTab: 'prediction_analytics',
      actionText: 'See AI Predictions'
    },
    {
      id: 4,
      title: '4. ACTION',
      icon: <Route className="w-5 h-5 text-blue-500" />,
      tagline: 'Optimized Smart Truck Routes',
      desc: 'Dynamically orders pickups by fill criticality and proximity, routing trucks only to bins requiring service.',
      actionTab: 'smart_route',
      actionText: 'View Collection Route'
    },
    {
      id: 5,
      title: '5. MEASURABLE IMPACT',
      icon: <TrendingUp className="w-5 h-5 text-amber-500" />,
      tagline: '18% Fuel Savings & CO₂ Reduction',
      desc: '128.4 tons CO₂ saved, 94.2% collection efficiency, and +480 citizen gamification engagement points.',
      actionTab: 'municipality_dash',
      actionText: 'View Municipality Stats'
    }
  ];

  return (
    <div id="impact-chain-section" className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-100 dark:border-slate-800 my-6 transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              System Architecture
            </span>
            <span className="text-xs font-semibold text-slate-500">End-to-End Intelligence Loop</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            PROBLEM → AI DETECTION → SMART DECISION → ACTION → IMPACT
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 md:mt-0 max-w-md">
          Click any stage below to inspect how WasteSense AI transforms raw citizen inputs into municipal actions.
        </p>
      </div>

      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {step.title}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/10">{step.icon}</div>
                </div>

                <h4 className={`text-xs font-bold ${isActive ? 'text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                  {step.tagline}
                </h4>

                <p className={`text-[11px] mt-1.5 line-clamp-3 leading-relaxed ${
                  isActive ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.desc}
                </p>
              </div>

              {onNavigateTab && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTab(step.actionTab);
                  }}
                  className={`mt-3 w-full py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 transition-all ${
                    isActive
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 hover:bg-emerald-100 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
