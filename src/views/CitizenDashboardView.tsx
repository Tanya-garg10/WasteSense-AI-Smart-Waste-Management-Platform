import React, { useState, useEffect } from 'react';
import { UserProfile, SmartBin, CitizenReport, WeeklyChallenge, AppNotification } from '../types';
import {
  ScanLine,
  MapPin,
  AlertCircle,
  Award,
  Plus,
  ArrowRight,
  Flame,
  ThumbsUp,
  Sparkles,
  ChevronRight,
  Lightbulb,
  Shuffle,
  Share2,
  Check,
  GraduationCap,
  Leaf,
  QrCode,
  Bell,
  Truck,
  Clock,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';
import { BinQrScannerModal } from '../components/BinQrScannerModal';

interface RecyclingTip {
  id: string;
  category: string;
  title: string;
  content: string;
  impactStat: string;
  badgeColor: string;
}

const RECYCLING_EDUCATIONAL_TIPS: RecyclingTip[] = [
  {
    id: '1',
    category: 'Plastic Waste',
    title: 'Rinse Before Binning Plastic Containers',
    content: 'Leftover food residue on plastic containers can contaminate an entire recycling batch. Give bottles, yogurt pots, and jars a quick water rinse before tossing them into the Blue Bin!',
    impactStat: 'Prevents 20kg of clean recyclables from being sent to landfills.',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
  },
  {
    id: '2',
    category: 'E-Waste',
    title: 'Old Smartphones Contain Precious Gold & Copper',
    content: '1 ton of smartphones contains up to 100 times more gold than a ton of raw gold ore! Never throw electronics into regular household trash — bring them to dedicated e-waste collection bins.',
    impactStat: 'Recycling 1 million phones saves electricity for 3,700 homes annually.',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
  },
  {
    id: '3',
    category: 'Organic Waste',
    title: 'Composting Diverts Potent Methane Emissions',
    content: 'Food waste rotting in oxygen-deprived landfills produces methane gas, a greenhouse gas 28x more potent than CO2. Composting organic waste creates nutrient-rich soil instead.',
    impactStat: '1 kg of composted food waste prevents 2.5 kg of atmospheric CO2 equivalent.',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
  },
  {
    id: '4',
    category: 'Paper & Cardboard',
    title: 'Greasy Pizza Boxes Cannot Be Recycled as Paper',
    content: 'Oil and grease soak into paper fibers, preventing them from bonding during repulping. Tear off the clean top lid for paper recycling, and throw the greasy bottom into organic waste!',
    impactStat: 'Saves clean paper recycling pulp batches from oil contamination.',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
  },
  {
    id: '5',
    category: 'Glass Material',
    title: 'Glass is 100% Infinitely Recyclable',
    content: 'Glass can be melted down and remade into new bottles infinitely without losing quality or purity. A recycled glass bottle can return to store shelves in as little as 30 days.',
    impactStat: 'Recycling 1 glass bottle saves energy to power a 100W light bulb for 4 hours.',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
  },
  {
    id: '6',
    category: 'Metal & Aluminum',
    title: 'Aluminum Cans Can Be Recycled Forever',
    content: 'Recycling aluminum uses 95% less energy than producing new metal from raw bauxite ore. Over 75% of all aluminum ever produced in human history is still in active use today!',
    impactStat: 'Recycling 1 aluminum can saves enough energy to run a TV for 3 hours.',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
  },
  {
    id: '7',
    category: 'Hazardous Waste',
    title: 'Keep Household Batteries Out of Standard Bins',
    content: 'Li-ion and alkaline batteries crushed inside garbage trucks can cause dangerous fires. Store used batteries safely in a dry box and drop them off at designated battery drop-off hubs.',
    impactStat: 'Prevents toxic heavy metals like Cadmium and Lead from contaminating groundwater.',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800'
  }
];

interface CitizenDashboardViewProps {
  user: UserProfile;
  bins: SmartBin[];
  reports: CitizenReport[];
  challenges: WeeklyChallenge[];
  notifications?: AppNotification[];
  onNavigate: (tab: string) => void;
  onUpvoteReport: (reportId: string) => void;
  onOpenNotifications?: () => void;
  onMarkNotificationRead?: (id: string) => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  user,
  bins,
  reports,
  challenges,
  notifications = [],
  onNavigate,
  onUpvoteReport,
  onOpenNotifications,
  onMarkNotificationRead
}) => {
  // Recycling Education Tip State
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);

  // QR Code Scanner Modal State
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Pick a random tip on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * RECYCLING_EDUCATIONAL_TIPS.length);
    setCurrentTipIndex(randomIndex);
  }, []);

  const handleNextRandomTip = () => {
    let newIndex = Math.floor(Math.random() * RECYCLING_EDUCATIONAL_TIPS.length);
    if (newIndex === currentTipIndex) {
      newIndex = (currentTipIndex + 1) % RECYCLING_EDUCATIONAL_TIPS.length;
    }
    setCurrentTipIndex(newIndex);
    setIsCopied(false);
  };

  const currentTip = RECYCLING_EDUCATIONAL_TIPS[currentTipIndex];

  const handleCopyTip = () => {
    const shareText = `♻️ Recycling Tip (${currentTip.category}): ${currentTip.title} - ${currentTip.content} Learn more on WasteSense AI!`;
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div id="citizen-dashboard-container" className="space-y-6 pb-8">
      
      {/* Bin QR Scanner Modal */}
      <BinQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        bins={bins}
        onNavigateToReport={(code) => onNavigate('report_issue')}
        onNavigateToMap={(binId) => onNavigate('nearby_map')}
      />

      {/* Citizen Welcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-emerald-400 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Citizen Level {Math.floor(user.points / 100) + 1}
                </span>
                <span className="flex items-center space-x-1 text-xs text-amber-300 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{user.streakDays} Day Streak!</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Welcome back, {user.name}!
              </h2>
              <p className="text-xs text-slate-300">
                You have completed {user.scansCompleted} waste scans and earned {user.points} Eco Points.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer relative"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Alerts</span>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsQrScannerOpen(true)}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Scan Bin QR</span>
            </button>

            <button
              onClick={() => onNavigate('scanner')}
              className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Waste AI (+25 pts)</span>
            </button>

            <button
              onClick={() => onNavigate('report_issue')}
              className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Live Notifications & Expiry Alerts Section */}
      <div id="citizen-notifications-banner" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Real-time Citizen Dispatch System
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {notifications.filter((n) => !n.read).length} Actionable Alerts
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Reported Bin Collections & Expiring Challenges
              </h3>
            </div>
          </div>

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center space-x-1 transition-all cursor-pointer"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Bin Pickup Confirmation Alerts */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Reported Bin Collections
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] font-extrabold">
                Live Service
              </span>
            </div>

            {notifications.filter((n) => n.type === 'bin_collected').length > 0 ? (
              <div className="space-y-2">
                {notifications
                  .filter((n) => n.type === 'bin_collected')
                  .slice(0, 2)
                  .map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (onMarkNotificationRead) onMarkNotificationRead(notif.id);
                        onNavigate('nearby_map');
                      }}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900 shadow-xs cursor-pointer hover:border-emerald-400 transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{notif.title}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No reported bin pickups pending confirmation.
              </p>
            )}
          </div>

          {/* Card 2: Recycling Challenges Nearing Expiry */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Challenges Nearing Expiry
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-300" />
                <span>Expiring Soon</span>
              </span>
            </div>

            {challenges.filter((c) => c.daysRemaining <= 2 && !c.isCompleted).length > 0 ? (
              <div className="space-y-2">
                {challenges
                  .filter((c) => c.daysRemaining <= 2 && !c.isCompleted)
                  .slice(0, 2)
                  .map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => onNavigate('gamification')}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900 shadow-xs cursor-pointer hover:border-amber-400 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>{ch.title}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[10px]">
                          {ch.daysRemaining}d left
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Progress: {ch.currentProgress} / {ch.targetCount}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{ch.rewardPoints} pts</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All your active recycling challenges have ample time remaining!
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Recycling Education & Daily Fact Card */}
      <div id="recycling-education-section" className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950 border border-emerald-500/30 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Community Learning Hub
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-[10px] text-emerald-300 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Daily Eco Fact #{currentTip.id}</span>
                </span>
              </div>
              <h3 className="text-lg font-black text-white">Recycling Education Spotlight</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNextRandomTip}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="View another randomized recycling tip"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Discover Random Fact</span>
            </button>

            <button
              onClick={handleCopyTip}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Share tip text"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Share Tip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tip Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${currentTip.badgeColor}`}>
                {currentTip.category}
              </span>
              <span className="text-xs text-amber-400 font-extrabold flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Did You Know?</span>
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">
              {currentTip.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTip.content}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-500/30 flex flex-col justify-between space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-1.5 text-emerald-400 text-xs font-bold">
              <Leaf className="w-4 h-4" />
              <span>Environmental Impact</span>
            </div>
            <p className="text-xs font-bold text-white">
              {currentTip.impactStat}
            </p>
            <button
              onClick={() => onNavigate('segregation')}
              className="text-[11px] font-extrabold text-emerald-300 hover:text-white underline flex items-center justify-center lg:justify-start space-x-1 mt-1 cursor-pointer"
            >
              <span>View Full Waste Sorting Guide</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Challenges & Nearby Bins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Weekly Challenges & Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Weekly Challenges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Weekly Challenges</h3>
              </div>
              <button
                onClick={() => onNavigate('gamification')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>View All ({challenges.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {challenges.map((c) => {
                const pct = Math.min(100, Math.round((c.currentProgress / c.targetCount) * 100));
                return (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{c.title}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+{c.rewardPoints} pts</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>Progress: {c.currentProgress} / {c.targetCount}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${c.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Community Reports Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Community Waste Reports</h3>
              </div>
              <button
                onClick={() => onNavigate('report_issue')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>+ Submit Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reports.slice(0, 4).map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        rep.category === 'Overflowing Bin' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {rep.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{rep.timestamp}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{rep.locationName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{rep.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center space-x-1.5">
                      <img src={rep.reporterAvatar} alt={rep.reporterName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[10px] text-slate-500 font-medium">{rep.reporterName}</span>
                    </div>

                    <button
                      onClick={() => onUpvoteReport(rep.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1 transition-all"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rep.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Nearby Bins Widget & Quick Map Launcher */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Nearby Smart Bins</h3>
              </div>
              <button
                onClick={() => onNavigate('nearby_map')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Map View
              </button>
            </div>

            <div className="space-y-3">
              {bins.slice(0, 4).map((b) => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{b.code}</p>
                      <p className="text-[10px] text-slate-500">{b.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      b.status === 'Critical' ? 'bg-red-500 text-white' : b.status === 'Almost Full' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {b.fillLevel}% Full
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        b.status === 'Critical' ? 'bg-red-500' : b.status === 'Almost Full' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${b.fillLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsQrScannerOpen(true)}
                className="py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center space-x-1 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Scanner</span>
              </button>

              <button
                onClick={() => onNavigate('nearby_map')}
                className="py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Map View</span>
              </button>
            </div>
          </div>

          {/* Quick Segregation Guide Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold">Unsure how to segregate?</h4>
            </div>
            <p className="text-xs text-slate-200">
              Check our simple visual color-coded guide or upload a photo to let Gemini AI tell you exactly which bin to use!
            </p>
            <button
              onClick={() => onNavigate('segregation')}
              className="w-full py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-emerald-100 cursor-pointer"
            >
              View Segregation Guide
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
