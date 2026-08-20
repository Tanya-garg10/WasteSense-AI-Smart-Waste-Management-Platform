import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { User, Award, Flame, RefreshCw, Sun, Moon, Check, Globe, ChevronDown } from 'lucide-react';
import { UserImpactVisualization } from '../components/UserImpactVisualization';
import { useLanguage, LANGUAGE_OPTIONS, Language } from '../context/LanguageContext';

interface ProfileViewProps {
  user: UserProfile;
  badges: Badge[];
  theme?: 'light' | 'dark';
  onToggleTheme?: (theme: 'light' | 'dark') => void;
  onResetDemoData: () => void;
  onNavigate: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  badges,
  theme = 'dark',
  onToggleTheme,
  onResetDemoData,
  onNavigate
}) => {
  const { language, setLanguage, t, currentOption } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div id="profile-view-container" className="max-w-4xl mx-auto py-6 space-y-6">
      
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-3xl object-cover border-4 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] uppercase">
                {t('common.role', 'Role')}: {user.role.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-amber-500 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{user.streakDays} {t('profile.active_streak', 'Day Active Streak')}</span>
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
              {t('profile.eco_points', 'Eco Points')}
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{user.points}</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
            <p className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase">
              {t('profile.ai_scans', 'AI Scans')}
            </p>
            <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5">{user.scansCompleted}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
              {t('profile.city_rank', 'City Rank')}
            </p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">#{user.rank}</p>
          </div>
        </div>

      </div>

      {/* Personal CO2 Savings & Waste Diverted Impact Visualization */}
      <UserImpactVisualization user={user} />

      {/* Badges & Settings Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* NEW: Language & Regional Localization Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('profile.language_section_title', 'Language & Regional Localization')}</span>
            </h3>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              {t('profile.language_saved_notice', 'Persisted in browser context')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t('profile.select_language_label', 'Select Application Language')}
                </p>
                <p className="text-[10px] text-slate-500">
                  {t('profile.language_description', 'Change application user interface text dynamically across English, Spanish, and French.')}
                </p>
              </div>

              {/* Language Selection Dropdown Menu */}
              <div className="relative min-w-[200px]">
                <button
                  id="profile-language-dropdown-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-xs flex items-center justify-between shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{currentOption.flag}</span>
                    <span>{currentOption.nativeName} ({currentOption.code.toUpperCase()})</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-30 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        id={`lang-dropdown-opt-${opt.code}`}
                        onClick={() => {
                          setLanguage(opt.code);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          language === opt.code
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{opt.flag}</span>
                          <span>{opt.nativeName} ({opt.name})</span>
                        </div>
                        {language === opt.code && <Check className="w-4 h-4 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick-Access Interactive Language Option Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    id={`lang-card-btn-${opt.code}`}
                    onClick={() => setLanguage(opt.code)}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{opt.flag}</span>
                      <div className="text-left">
                        <p className="font-black text-xs leading-none">{opt.nativeName}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold mt-0.5">
                          {opt.code}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500 font-bold" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appearance Settings Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('profile.appearance_title', 'Appearance & Interface Theme')}
            </h3>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              {t('profile.appearance_notice', 'Saved in browser storage')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t('profile.color_mode', 'Color Mode Preference')}
                </p>
                <p className="text-[10px] text-slate-500">
                  {t('profile.color_mode_desc', 'Switch between crisp Light mode and high-contrast Dark mode.')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Light Mode Option */}
              <button
                id="theme-toggle-light"
                onClick={() => onToggleTheme?.('light')}
                className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-xs">{t('profile.light_mode', 'Light Mode')}</p>
                    <p className="text-[10px] font-normal opacity-70">{t('profile.light_mode_desc', 'Clean light aesthetic')}</p>
                  </div>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-amber-600 font-bold" />}
              </button>

              {/* Dark Mode Option */}
              <button
                id="theme-toggle-dark"
                onClick={() => onToggleTheme?.('dark')}
                className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-xs">{t('profile.dark_mode', 'Dark Mode')}</p>
                    <p className="text-[10px] font-normal opacity-70">{t('profile.dark_mode_desc', 'Sleek dark canvas')}</p>
                  </div>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-emerald-400 font-bold" />}
              </button>
            </div>
          </div>
        </div>

        {/* Unlocked Badges */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('profile.earned_badges', 'Earned Badges')} ({badges.filter(b => b.isUnlocked).length} / {badges.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.id}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                  b.isUnlocked
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 line-through'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{b.title}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Demo Reset Controls */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('profile.demo_controls', 'Demo State Controls')}
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {t('profile.reset_demo_title', 'Reset Demo Data')}
              </p>
              <p className="text-[10px] text-slate-500">
                {t('profile.reset_demo_desc', 'Restore default smart bin levels, citizen reports, and eco points.')}
              </p>
            </div>
            <button
              onClick={onResetDemoData}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('profile.reset_button', 'Reset State')}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
