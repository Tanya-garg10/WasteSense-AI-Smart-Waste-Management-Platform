export type WasteCategory =
  | 'Organic'
  | 'Plastic'
  | 'Paper'
  | 'Glass'
  | 'Metal'
  | 'E-Waste'
  | 'Hazardous'
  | 'Other';

export type BinStatus = 'Normal' | 'Almost Full' | 'Critical';

export type BinColor = 'Green' | 'Blue' | 'Yellow' | 'Red' | 'Grey';

export interface WasteClassificationResult {
  detectedCategory: WasteCategory;
  confidence: number; // e.g. 94.5
  recommendedBinColor: BinColor;
  recommendedBinName: string;
  shortInstructions: string;
  detailedReasoning: string;
  recyclabilityScore: number; // 0 - 100
  co2SavedKgEstimate: number;
  pointsEarned: number;
  itemId?: string;
  itemTitle?: string;
}

export interface SmartBin {
  id: string;
  code: string; // e.g. "BIN-104"
  name: string; // e.g. "Central Park North Entrance"
  address: string;
  lat: number;
  lng: number;
  wasteType: WasteCategory | 'Mixed Recyclables';
  fillLevel: number; // 0 - 100%
  lastCollectionTime: string; // e.g. "2 hours ago"
  status: BinStatus;
  capacityLiters: number;
  batteryPct: number;
  temperatureC: number;
  gasLevelPpm: number;
  dailyIncreasePct: number; // e.g. 12.5% per day
  predictedOverflowHours: number; // e.g. 6.7 hours
  priorityScore: number; // 0 - 100
}

export type ReportCategory =
  | 'Overflowing Bin'
  | 'Illegal Dumping'
  | 'Uncollected Garbage'
  | 'Damaged Bin';

export type ReportStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface CitizenReport {
  id: string;
  category: ReportCategory;
  status: ReportStatus;
  locationName: string;
  lat: number;
  lng: number;
  description: string;
  photoUrl: string;
  timestamp: string;
  reporterName: string;
  reporterAvatar: string;
  upvotes: number;
  binCode?: string;
}

export interface RouteStop {
  stopNumber: number;
  binId: string;
  binCode: string;
  binName: string;
  address: string;
  lat: number;
  lng: number;
  fillLevel: number;
  predictedOverflowHours: number;
  priorityScore: number;
  estimatedPickTimeMinutes: number;
  estWasteKg: number;
  isCompleted?: boolean;
}

export interface OptimizedRoute {
  routeId: string;
  truckId: string;
  driverName: string;
  totalBins: number;
  totalDistanceKm: number;
  distanceSavedPercent: number; // e.g. 18.4%
  estimatedTotalMinutes: number;
  co2SavedKg: number;
  stops: RouteStop[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // e.g. 'Leaf', 'ShieldCheck', 'Trophy', 'Zap'
  unlockedAt?: string;
  isUnlocked: boolean;
  category: 'Segregation' | 'Reporting' | 'Community' | 'Mastery';
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  currentProgress: number;
  targetCount: number;
  isCompleted: boolean;
  daysRemaining: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  scansCount: number;
  reportsCount: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}

export interface MunicipalityAnalytics {
  totalBinsCount: number;
  criticalBinsCount: number;
  almostFullBinsCount: number;
  pendingReportsCount: number;
  resolvedReportsCount: number;
  collectionEfficiencyPct: number;
  totalCo2SavedTons: number;
  wasteCategoryBreakdown: { category: WasteCategory; percentage: number; tons: number }[];
  overflowTrends: { day: string; predictedOverflows: number; actualOverflows: number }[];
  dumpingHotspots: { zoneName: string; reportsCount: number; riskLevel: 'High' | 'Medium' | 'Low' }[];
}

export type UserRole = 'citizen' | 'collector' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  points: number;
  rank: number;
  scansCompleted: number;
  reportsSubmitted: number;
  badges: Badge[];
  streakDays: number;
}

export type NotificationType =
  | 'bin_collected'
  | 'challenge_expiring'
  | 'report_upvoted'
  | 'system_alert';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionTab?: string;
  binCode?: string;
  challengeId?: string;
  reportId?: string;
}
