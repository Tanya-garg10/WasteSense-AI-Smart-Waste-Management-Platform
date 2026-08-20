import React from 'react';
import { UserRole } from '../types';
import { User, Truck, ShieldAlert, ArrowRight, Check } from 'lucide-react';

interface RoleSelectionViewProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNavigate: (tab: string) => void;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({
  currentRole,
  onSelectRole,
  onNavigate
}) => {
  const roles: { role: UserRole; title: string; desc: string; icon: React.ReactNode; color: string; defaultTab: string; features: string[] }[] = [
    {
      role: 'citizen',
      title: 'Citizen',
      desc: 'Scan waste with AI vision, report overflowing bins or illegal dumping, view nearby bins, and earn Eco Points.',
      icon: <User className="w-8 h-8 text-emerald-600" />,
      color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
      defaultTab: 'citizen_dash',
      features: ['AI Waste Scanner', 'Citizen Reporting Form', 'Nearby Smart Bin Map', 'Eco Gamification Leaderboard']
    },
    {
      role: 'collector',
      title: 'Collection Driver',
      desc: 'View assigned high-priority bins, execute optimized truck collection routes, and update bin pickup status.',
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
      defaultTab: 'collector_dash',
      features: ['Priority Pickups List', 'Optimized Route Navigation', '1-Click Bin Collection Logger', 'Truck Load Meter']
    },
    {
      role: 'admin',
      title: 'Municipality Admin',
      desc: 'Monitor full city smart bin fleet, inspect AI overflow predictions, analyze dumping hotspots, and track CO₂ impact.',
      icon: <ShieldAlert className="w-8 h-8 text-purple-600" />,
      color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
      defaultTab: 'municipality_dash',
      features: ['Citywide Fleet Analytics', 'Time-Series Overflow AI', 'Hotspot Heatmap Reports', 'CO₂ Environmental Impact']
    }
  ];

  return (
    <div id="role-selection-container" className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Choose Demo Persona
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Experience WasteSense AI from three key municipal perspectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((r) => {
          const isSelected = currentRole === r.role;
          return (
            <div
              key={r.role}
              onClick={() => {
                onSelectRole(r.role);
                onNavigate(r.defaultTab);
              }}
              className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-xl ${
                isSelected
                  ? `${r.color} shadow-lg ring-2 ring-emerald-500/40 scale-102`
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                    {r.icon}
                  </div>
                  {isSelected && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {r.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {r.desc}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key View Capabilities</p>
                  {r.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                <span>Switch to {r.title} View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
