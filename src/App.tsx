import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, SmartBin, CitizenReport, WeeklyChallenge, LeaderboardUser, Badge, MunicipalityAnalytics, OptimizedRoute, WasteClassificationResult, AppNotification } from './types';
import { INITIAL_USER, INITIAL_BINS, INITIAL_REPORTS, INITIAL_CHALLENGES, LEADERBOARD, INITIAL_BADGES, INITIAL_ANALYTICS, INITIAL_OPTIMIZED_ROUTE, INITIAL_NOTIFICATIONS } from './mockData';
import { Navbar } from './components/Navbar';
import { NotificationCenter } from './components/NotificationCenterModal';
import { LandingPage } from './views/LandingPage';
import { RoleSelectionView } from './views/RoleSelectionView';
import { CitizenDashboardView } from './views/CitizenDashboardView';
import { AIWasteScannerView } from './views/AIWasteScannerView';
import { WasteResultView } from './views/WasteResultView';
import { SmartSegregationAssistantView } from './views/SmartSegregationAssistantView';
import { ReportWasteProblemView } from './views/ReportWasteProblemView';
import { NearbyBinsMapView } from './views/NearbyBinsMapView';
import { GamificationView } from './views/GamificationView';
import { CollectorDashboardView } from './views/CollectorDashboardView';
import { SmartCollectionRouteView } from './views/SmartCollectionRouteView';
import { MunicipalityDashboardView } from './views/MunicipalityDashboardView';
import { SmartBinMonitoringView } from './views/SmartBinMonitoringView';
import { PredictionAnalyticsView } from './views/PredictionAnalyticsView';
import { ProfileView } from './views/ProfileView';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userRole, setUserRole] = useState<UserRole>('citizen');

  // Persistent Theme state (light / dark) stored in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('wastesense_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('wastesense_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };
  
  // App state from backend / initial state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [analytics, setAnalytics] = useState<MunicipalityAnalytics | null>(null);
  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // AI Classification result state
  const [lastScanResult, setLastScanResult] = useState<WasteClassificationResult | null>(null);
  const [lastScanImagePreview, setLastScanImagePreview] = useState<string | undefined>(undefined);

  // Simulation loading state
  const [isSimulatingIoT, setIsSimulatingIoT] = useState(false);

  // Fetch initial data from Express backend with safe client fallback
  const fetchInitialData = async () => {
    try {
      const fetchJson = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Non-JSON response for ${url}`);
        }
        return res.json();
      };

      const [u, b, r, ch, l, bd, a, rt, n] = await Promise.all([
        fetchJson('/api/user').catch(() => ({ success: true, user: INITIAL_USER })),
        fetchJson('/api/bins').catch(() => ({ success: true, bins: INITIAL_BINS })),
        fetchJson('/api/reports').catch(() => ({ success: true, reports: INITIAL_REPORTS })),
        fetchJson('/api/challenges').catch(() => ({ success: true, challenges: INITIAL_CHALLENGES })),
        fetchJson('/api/leaderboard').catch(() => ({ success: true, leaderboard: LEADERBOARD })),
        fetchJson('/api/badges').catch(() => ({ success: true, badges: INITIAL_BADGES })),
        fetchJson('/api/analytics').catch(() => ({ success: true, analytics: INITIAL_ANALYTICS })),
        fetchJson('/api/routes/optimized').catch(() => ({ success: true, route: INITIAL_OPTIMIZED_ROUTE })),
        fetchJson('/api/notifications').catch(() => ({ success: true, notifications: INITIAL_NOTIFICATIONS }))
      ]);

      if (u.user) setUser(u.user);
      if (b.bins) setBins(b.bins);
      if (r.reports) setReports(r.reports);
      if (ch.challenges) setChallenges(ch.challenges);
      if (l.leaderboard) setLeaderboard(l.leaderboard);
      if (bd.badges) setBadges(bd.badges);
      if (a.analytics) setAnalytics(a.analytics);
      if (rt.route) setRoute(rt.route);
      if (n.notifications) setNotifications(n.notifications);
    } catch (err) {
      console.warn('Network issue fetching data, applying fallback data:', err);
      setUser(INITIAL_USER);
      setBins(INITIAL_BINS);
      setReports(INITIAL_REPORTS);
      setChallenges(INITIAL_CHALLENGES);
      setLeaderboard(LEADERBOARD);
      setBadges(INITIAL_BADGES);
      setAnalytics(INITIAL_ANALYTICS);
      setRoute(INITIAL_OPTIMIZED_ROUTE);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Notification handlers
  const handleMarkNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: 'all' })
      });
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  // Role selection change handler
  const handleSelectRole = (newRole: UserRole) => {
    setUserRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  // AI classification complete handler
  const handleClassificationComplete = (result: WasteClassificationResult, imagePreviewUrl?: string) => {
    setLastScanResult(result);
    setLastScanImagePreview(imagePreviewUrl);
    
    // Add points to user
    if (user) {
      setUser({
        ...user,
        points: user.points + (result.pointsEarned || 25),
        scansCompleted: user.scansCompleted + 1
      });
    }

    setActiveTab('result');
  };

  // Mark bin collected handler
  const handleCollectBin = async (binId: string) => {
    try {
      const res = await fetch(`/api/bins/${binId}/collect`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.bin) {
        setBins(prev => prev.map(b => b.id === binId ? data.bin : b));
        const newNotif: AppNotification = data.notification || {
          id: `notif-${Date.now()}`,
          type: 'bin_collected',
          title: `Reported Bin ${data.bin.code} Collected!`,
          message: `Municipal Sanitation Truck emptied bin ${data.bin.code} (${data.bin.name}). Thank you for reporting! +50 Eco Points awarded.`,
          timestamp: 'Just now',
          read: false,
          actionTab: 'citizen_dash',
          binCode: data.bin.code
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } catch (err) {
      console.error('Error marking bin collected:', err);
    }
  };

  // Upvote report handler
  const handleUpvoteReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.report) {
        setReports(prev => prev.map(r => r.id === reportId ? data.report : r));
      }
    } catch (err) {
      console.error('Error upvoting report:', err);
    }
  };

  // Report submitted handler
  const handleReportSubmitted = (newReport: CitizenReport) => {
    setReports(prev => [newReport, ...prev]);
    if (user) {
      setUser({
        ...user,
        points: user.points + 50
      });
    }
  };

  // Claim challenge reward handler
  const handleClaimChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        if (user) {
          setUser({ ...user, points: user.points + c.rewardPoints });
        }
        return { ...c, isCompleted: true };
      }
      return c;
    }));
  };

  // Simulate IoT sensor update handler
  const handleSimulateIoT = async () => {
    setIsSimulatingIoT(true);
    try {
      const res = await fetch('/api/bins/simulate-iot', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.bins) {
        setBins(data.bins);
      }
    } catch (err) {
      console.error('Error simulating IoT sensor telemetry:', err);
    } finally {
      setIsSimulatingIoT(false);
    }
  };

  // Launch demo scenario handler
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleLaunchDemoScenario = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/demo/launch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (data.user) setUser(data.user);
        if (data.bins) setBins(data.bins);
        if (data.reports) setReports(data.reports);
      }
    } catch (err) {
      console.error('Error launching demo scenario:', err);
    } finally {
      setIsDemoLoading(false);
      setActiveTab('citizen_dash');
    }
  };

  // Reset demo state handler
  const handleResetDemoData = async () => {
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      await fetchInitialData();
      setActiveTab('citizen_dash');
    } catch (err) {
      console.error('Error resetting demo data:', err);
    }
  };

  if (!user || !analytics || !route) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-slate-300">Initializing WasteSense AI Core Platform...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Main Navigation Bar */}
      <Navbar
        currentRole={userRole}
        userRole={userRole}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        user={user}
        userPoints={user.points}
        onLaunchDemo={handleLaunchDemoScenario}
        isDemoLoading={isDemoLoading}
        unreadNotificationCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* Notification Center Modal */}
      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigate={setActiveTab}
      />

      {/* Primary Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Landing Page View */}
        {activeTab === 'landing' && (
          <LandingPage onNavigate={setActiveTab} />
        )}

        {/* Role Selection View */}
        {activeTab === 'roles' && (
          <RoleSelectionView
            currentRole={userRole}
            onSelectRole={handleSelectRole}
            onNavigate={setActiveTab}
          />
        )}

        {/* Citizen Dashboard View */}
        {activeTab === 'citizen_dash' && (
          <CitizenDashboardView
            user={user}
            bins={bins}
            reports={reports}
            challenges={challenges}
            notifications={notifications}
            onNavigate={setActiveTab}
            onUpvoteReport={handleUpvoteReport}
            onOpenNotifications={() => setIsNotificationModalOpen(true)}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        )}

        {/* AI Waste Scanner View */}
        {activeTab === 'scanner' && (
          <AIWasteScannerView
            onClassificationComplete={handleClassificationComplete}
            onNavigate={setActiveTab}
          />
        )}

        {/* Waste Classification Result View */}
        {activeTab === 'result' && lastScanResult && (
          <WasteResultView
            result={lastScanResult}
            imagePreviewUrl={lastScanImagePreview}
            onScanAnother={() => setActiveTab('scanner')}
            onNavigate={setActiveTab}
          />
        )}

        {/* Smart Segregation Assistant View */}
        {activeTab === 'segregation' && (
          <SmartSegregationAssistantView onNavigate={setActiveTab} />
        )}

        {/* Report Waste Problem View */}
        {activeTab === 'report_issue' && (
          <ReportWasteProblemView
            onReportSubmitted={handleReportSubmitted}
            onNavigate={setActiveTab}
          />
        )}

        {/* Nearby Bins Map View */}
        {activeTab === 'nearby_map' && (
          <NearbyBinsMapView
            bins={bins}
            reports={reports}
            analytics={analytics}
            onNavigate={setActiveTab}
          />
        )}

        {/* Gamification & Leaderboard View */}
        {activeTab === 'gamification' && (
          <GamificationView
            user={user}
            leaderboard={leaderboard}
            badges={badges}
            challenges={challenges}
            onClaimChallenge={handleClaimChallenge}
          />
        )}

        {/* Collector Dashboard View */}
        {activeTab === 'collector_dash' && (
          <CollectorDashboardView
            bins={bins}
            route={route}
            onCollectBin={handleCollectBin}
            onNavigate={setActiveTab}
          />
        )}

        {/* Smart Collection Route View */}
        {activeTab === 'smart_route' && (
          <SmartCollectionRouteView
            route={route}
            onCollectBin={handleCollectBin}
            onNavigate={setActiveTab}
          />
        )}

        {/* Municipality Admin Dashboard View */}
        {activeTab === 'municipality_dash' && (
          <MunicipalityDashboardView
            analytics={analytics}
            bins={bins}
            reports={reports}
            onNavigate={setActiveTab}
          />
        )}

        {/* Smart Bin Monitoring View */}
        {activeTab === 'bin_monitoring' && (
          <SmartBinMonitoringView
            bins={bins}
            onCollectBin={handleCollectBin}
            onSimulateIoT={handleSimulateIoT}
            isSimulating={isSimulatingIoT}
          />
        )}

        {/* Prediction Analytics View */}
        {activeTab === 'prediction_analytics' && (
          <PredictionAnalyticsView
            bins={bins}
            onNavigate={setActiveTab}
          />
        )}

        {/* User Profile / Settings View */}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            badges={badges}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onResetDemoData={handleResetDemoData}
            onNavigate={setActiveTab}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            WasteSense AI — Smart Waste Management Platform
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Problem → AI Detection → Smart Decision → Action → Impact</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
