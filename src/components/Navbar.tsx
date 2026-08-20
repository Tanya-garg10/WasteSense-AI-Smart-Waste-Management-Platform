import React from 'react';
import { UserRole, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Recycle,
  User,
  ShieldAlert,
  Truck,
  Award,
  Sparkles,
  MapPin,
  BarChart3,
  Search,
  ScanLine,
  Activity,
  Layers,
  ChevronDown,
  Bell
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole;
  userRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  user?: UserProfile;
  userPoints?: number;
  onLaunchDemo?: () => void;
  isDemoLoading?: boolean;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole: propCurrentRole,
  userRole: propUserRole,
  onSelectRole,
  activeTab,
  onNavigate,
  user,
  userPoints,
  onLaunchDemo,
  isDemoLoading = false,
  unreadNotificationCount = 0,
  onOpenNotifications
}) => {
  const { t } = useLanguage();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState(false);

  const activeRole: UserRole = propCurrentRole || propUserRole || 'citizen';

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    citizen: { label: 'Citizen', icon: <User className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' },
    collector: { label: 'Collector Driver', icon: <Truck className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300' },
    admin: { label: 'Municipality Admin', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300' }
  };

  const activeRoleInfo = roleLabels[activeRole] || roleLabels.citizen;

  return (
    <header id="main-app-header" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Recycle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  WasteSense
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-500 text-white rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Smart Waste Management Platform
              </p>
            </div>
          </div>

          {/* Role Navigation Bar Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-btn-landing"
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            {/* Role specific view tabs */}
            {activeRole === 'citizen' && (
              <>
                <button
                  id="nav-btn-citizen-dash"
                  onClick={() => onNavigate('citizen_dash')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                    activeTab === 'citizen_dash'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  id="nav-btn-scanner"
                  onClick={() => onNavigate('scanner')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    activeTab === 'scanner' || activeTab === 'scan_result'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>AI Scanner</span>
                </button>

                <button
                  id="nav-btn-segregation"
                  onClick={() => onNavigate('segregation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'segregation'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Guide
                </button>

                <button
                  id="nav-btn-report"
                  onClick={() => onNavigate('report_issue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'report_issue'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Report Waste
                </button>

                <button
                  id="nav-btn-nearby-map"
                  onClick={() => onNavigate('nearby_map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    activeTab === 'nearby_map'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Nearby Bins</span>
                </button>

                <button
                  id="nav-btn-gamification"
                  onClick={() => onNavigate('gamification')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    activeTab === 'gamification'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Leaderboard</span>
                </button>
              </>
            )}

            {activeRole === 'collector' && (
              <>
                <button
                  id="nav-btn-collector-dash"
                  onClick={() => onNavigate('collector_dash')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'collector_dash'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Pickups
                </button>

                <button
                  id="nav-btn-route"
                  onClick={() => onNavigate('smart_route')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    activeTab === 'smart_route'
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-200'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Smart Route</span>
                </button>

                <button
                  id="nav-btn-collector-bins"
                  onClick={() => onNavigate('bin_monitoring')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'bin_monitoring'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Bin IoT Grid
                </button>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <button
                  id="nav-btn-admin-dash"
                  onClick={() => onNavigate('municipality_dash')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                    activeTab === 'municipality_dash'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Municipality Analytics</span>
                </button>

                <button
                  id="nav-btn-bin-monitor"
                  onClick={() => onNavigate('bin_monitoring')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'bin_monitoring'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Smart Bins
                </button>

                <button
                  id="nav-btn-predictions"
                  onClick={() => onNavigate('prediction_analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    activeTab === 'prediction_analytics'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  AI Overflow Predictions
                </button>
              </>
            )}
          </nav>

          {/* Right Action Controls: Launch Demo Button, Role Switcher, Notifications, Eco Points, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Notification Bell Button */}
            {onOpenNotifications && (
              <button
                id="nav-notification-bell"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all cursor-pointer"
                title="Citizen Waste Alerts & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Prominent Launch Demo Button */}
            {onLaunchDemo && (
              <button
                id="launch-demo-btn-nav"
                onClick={onLaunchDemo}
                disabled={isDemoLoading}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 border border-amber-300/40"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDemoLoading ? 'animate-spin' : 'animate-bounce'}`} />
                <span>{isDemoLoading ? 'Loading Scenario...' : 'Launch Demo'}</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                id="role-switcher-toggle"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${activeRoleInfo.color}`}
                title="Switch Demo User Role"
              >
                {activeRoleInfo.icon}
                <span className="hidden sm:inline">{activeRoleInfo.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Role Dropdown */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Demo Role
                  </div>

                  <button
                    id="role-opt-citizen"
                    onClick={() => {
                      if (onSelectRole) onSelectRole('citizen');
                      onNavigate('citizen_dash');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      activeRole === 'citizen' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold">Citizen</p>
                        <p className="text-[10px] text-slate-400 font-normal">Scan waste & report issues</p>
                      </div>
                    </div>
                  </button>

                  <button
                    id="role-opt-collector"
                    onClick={() => {
                      if (onSelectRole) onSelectRole('collector');
                      onNavigate('collector_dash');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      activeRole === 'collector' ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-bold">Collector</p>
                        <p className="text-[10px] text-slate-400 font-normal">Pickups & smart route</p>
                      </div>
                    </div>
                  </button>

                  <button
                    id="role-opt-admin"
                    onClick={() => {
                      if (onSelectRole) onSelectRole('admin');
                      onNavigate('municipality_dash');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      activeRole === 'admin' ? 'bg-purple-50 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="font-bold">Municipality Admin</p>
                        <p className="text-[10px] text-slate-400 font-normal">Analytics & IoT bin fleet</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Eco Points Pill */}
            <div
              onClick={() => onNavigate('gamification')}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer hover:scale-105 transition-transform"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{user?.points ?? userPoints ?? 525} pts</span>
            </div>

            {/* Profile Avatar Button */}
            <button
              id="user-profile-nav-btn"
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500 hover:ring-2 hover:ring-emerald-400 transition-all"
            >
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={user?.name || 'User Profile'} className="w-full h-full object-cover" />
            </button>

          </div>

        </div>
      </div>
      
      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-2 px-2 text-[10px] font-bold">
        <button
          onClick={() => onNavigate('landing')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'landing' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <Layers className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('scanner')}
          className="flex flex-col items-center space-y-0.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200"
        >
          <ScanLine className="w-4 h-4" />
          <span>Scanner</span>
        </button>

        <button
          onClick={() => onNavigate(activeRole === 'admin' ? 'municipality_dash' : activeRole === 'collector' ? 'smart_route' : 'nearby_map')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab.includes('dash') || activeTab.includes('map') || activeTab.includes('route') ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          {activeRole === 'admin' ? <BarChart3 className="w-4 h-4" /> : activeRole === 'collector' ? <Truck className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          <span>{activeRole === 'admin' ? 'Analytics' : activeRole === 'collector' ? 'Route' : 'Map'}</span>
        </button>

        <button
          onClick={() => onNavigate('gamification')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'gamification' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <Award className="w-4 h-4" />
          <span>Points</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
