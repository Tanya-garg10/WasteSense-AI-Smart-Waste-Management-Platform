import {
  SmartBin,
  CitizenReport,
  Badge,
  WeeklyChallenge,
  LeaderboardUser,
  MunicipalityAnalytics,
  OptimizedRoute,
  UserProfile,
  WasteClassificationResult,
  AppNotification
} from './types';

// Preset sample waste items for demo scanner testing
export interface PresetSampleWaste {
  id: string;
  title: string;
  category: string;
  imageThumbnail: string;
  result: WasteClassificationResult;
}

export const PRESET_SAMPLE_WASTE: PresetSampleWaste[] = [
  {
    id: 'sample-plastic-bottle',
    title: 'PET Water Bottle',
    category: 'Plastic',
    imageThumbnail: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
    result: {
      detectedCategory: 'Plastic',
      confidence: 97.8,
      recommendedBinColor: 'Blue',
      recommendedBinName: 'BLUE Dry Recyclables Bin',
      shortInstructions: 'Empty leftover liquid, crush flat, and keep plastic cap on.',
      detailedReasoning: 'PET (Polyethylene Terephthalate) #1 plastic is 100% recyclable. Removing liquids prevents contamination of paper in mixed recycling streams.',
      recyclabilityScore: 95,
      co2SavedKgEstimate: 0.18,
      pointsEarned: 25,
      itemId: 'sample-plastic-bottle',
      itemTitle: 'Clear Polyethylene Terephthalate Bottle'
    }
  },
  {
    id: 'sample-apple-core',
    title: 'Food Waste / Apple Core',
    category: 'Organic',
    imageThumbnail: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80',
    result: {
      detectedCategory: 'Organic',
      confidence: 96.2,
      recommendedBinColor: 'Green',
      recommendedBinName: 'GREEN Compost / Wet Organic Bin',
      shortInstructions: 'Place directly into compost bin. Do not wrap in non-biodegradable plastic bags.',
      detailedReasoning: 'Organic waste decomposes anaerobically in landfills producing harmful Methane gas. Composting converts it into nutrient-rich soil fertilizer.',
      recyclabilityScore: 100,
      co2SavedKgEstimate: 0.24,
      pointsEarned: 30,
      itemId: 'sample-apple-core',
      itemTitle: 'Fruit Waste / Organic Biomass'
    }
  },
  {
    id: 'sample-cardboard-box',
    title: 'Cardboard Shipping Box',
    category: 'Paper',
    imageThumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    result: {
      detectedCategory: 'Paper',
      confidence: 98.4,
      recommendedBinColor: 'Blue',
      recommendedBinName: 'BLUE Dry Recyclables Bin',
      shortInstructions: 'Remove tape and flatten box before binning to optimize bin volume.',
      detailedReasoning: 'Corrugated cardboard is a high-grade cellulose fiber source that can be recycled up to 7 times into new packaging.',
      recyclabilityScore: 92,
      co2SavedKgEstimate: 0.45,
      pointsEarned: 35,
      itemId: 'sample-cardboard-box',
      itemTitle: 'Corrugated Cardboard Container'
    }
  },
  {
    id: 'sample-soda-can',
    title: 'Aluminum Soda Can',
    category: 'Metal',
    imageThumbnail: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    result: {
      detectedCategory: 'Metal',
      confidence: 99.1,
      recommendedBinColor: 'Blue',
      recommendedBinName: 'BLUE Dry Recyclables Bin',
      shortInstructions: 'Rinse briefly and place in metal recycling. Can be crushed to save space.',
      detailedReasoning: 'Recycling aluminum saves 95% of the energy required to produce raw aluminum from bauxite ore. Infinite recyclability.',
      recyclabilityScore: 98,
      co2SavedKgEstimate: 0.32,
      pointsEarned: 30,
      itemId: 'sample-soda-can',
      itemTitle: 'Aluminum Beverage Beverage Can'
    }
  },
  {
    id: 'sample-battery',
    title: 'Lithium / AA Battery',
    category: 'E-Waste',
    imageThumbnail: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
    result: {
      detectedCategory: 'E-Waste',
      confidence: 94.7,
      recommendedBinColor: 'Red',
      recommendedBinName: 'RED Hazardous / E-Waste Drop Box',
      shortInstructions: 'DO NOT put in normal bins! Tape terminals and drop off at designated municipal E-Waste collection points.',
      detailedReasoning: 'Batteries contain heavy metals (Lithium, Cadmium, Cobalt) that pose fire risks in garbage trucks and leach toxic chemicals into groundwater if landfilled.',
      recyclabilityScore: 85,
      co2SavedKgEstimate: 0.60,
      pointsEarned: 50,
      itemId: 'sample-battery',
      itemTitle: 'Lithium-Ion / Alkaline Cell Battery'
    }
  },
  {
    id: 'sample-glass-jar',
    title: 'Glass Food Jar',
    category: 'Glass',
    imageThumbnail: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=600&q=80',
    result: {
      detectedCategory: 'Glass',
      confidence: 95.9,
      recommendedBinColor: 'Yellow',
      recommendedBinName: 'YELLOW Glass Recycling Container',
      shortInstructions: 'Rinse jar, remove lid (put lid in metal recycling), and place jar in glass bin.',
      detailedReasoning: 'Glass is 100% infinitely recyclable without loss in quality or purity. Melting cullet requires far lower furnace temperatures than raw silica sand.',
      recyclabilityScore: 96,
      co2SavedKgEstimate: 0.28,
      pointsEarned: 30,
      itemId: 'sample-glass-jar',
      itemTitle: 'Clear Flint Glass Jar'
    }
  }
];

export const INITIAL_BINS: SmartBin[] = [
  {
    id: 'bin-104',
    code: 'BIN-104',
    name: 'Metro Plaza Central Station',
    address: '450 Civic Center Blvd, Downtown',
    lat: 37.7749,
    lng: -122.4194,
    wasteType: 'Mixed Recyclables',
    fillLevel: 92,
    lastCollectionTime: '18 hours ago',
    status: 'Critical',
    capacityLiters: 240,
    batteryPct: 88,
    temperatureC: 24.5,
    gasLevelPpm: 180,
    dailyIncreasePct: 22.0,
    predictedOverflowHours: 6.7, // "expected to overflow in 6 hours 42 minutes"
    priorityScore: 98
  },
  {
    id: 'bin-102',
    code: 'BIN-102',
    name: 'Tech District Innovation Hub',
    address: '100 Market St, Financial Quarter',
    lat: 37.7885,
    lng: -122.4012,
    wasteType: 'Plastic',
    fillLevel: 85,
    lastCollectionTime: '14 hours ago',
    status: 'Almost Full',
    capacityLiters: 240,
    batteryPct: 94,
    temperatureC: 22.1,
    gasLevelPpm: 120,
    dailyIncreasePct: 18.5,
    predictedOverflowHours: 9.2,
    priorityScore: 86
  },
  {
    id: 'bin-108',
    code: 'BIN-108',
    name: 'Greenway Park North Gate',
    address: '820 Parkside Ave, Green Belt',
    lat: 37.7695,
    lng: -122.4468,
    wasteType: 'Organic',
    fillLevel: 89,
    lastCollectionTime: '22 hours ago',
    status: 'Critical',
    capacityLiters: 300,
    batteryPct: 76,
    temperatureC: 28.0,
    gasLevelPpm: 240,
    dailyIncreasePct: 25.0,
    predictedOverflowHours: 5.1,
    priorityScore: 94
  },
  {
    id: 'bin-101',
    code: 'BIN-101',
    name: 'City Hall Main Entrance',
    address: '1 Dr Carlton B Goodlett Pl',
    lat: 37.7793,
    lng: -122.4193,
    wasteType: 'Paper',
    fillLevel: 42,
    lastCollectionTime: '4 hours ago',
    status: 'Normal',
    capacityLiters: 180,
    batteryPct: 98,
    temperatureC: 20.2,
    gasLevelPpm: 45,
    dailyIncreasePct: 8.0,
    predictedOverflowHours: 32.0,
    priorityScore: 35
  },
  {
    id: 'bin-105',
    code: 'BIN-105',
    name: 'University Campus Food Court',
    address: '2200 University Ave, Education Zone',
    lat: 37.7612,
    lng: -122.4289,
    wasteType: 'Organic',
    fillLevel: 78,
    lastCollectionTime: '12 hours ago',
    status: 'Almost Full',
    capacityLiters: 300,
    batteryPct: 91,
    temperatureC: 25.8,
    gasLevelPpm: 195,
    dailyIncreasePct: 20.0,
    predictedOverflowHours: 11.4,
    priorityScore: 79
  },
  {
    id: 'bin-109',
    code: 'BIN-109',
    name: 'Harbor Front Ferry Terminal',
    address: 'Pier 1, Embarcadero',
    lat: 37.7955,
    lng: -122.3937,
    wasteType: 'E-Waste',
    fillLevel: 31,
    lastCollectionTime: '1 day ago',
    status: 'Normal',
    capacityLiters: 150,
    batteryPct: 82,
    temperatureC: 19.5,
    gasLevelPpm: 30,
    dailyIncreasePct: 5.0,
    predictedOverflowHours: 58.0,
    priorityScore: 22
  },
  {
    id: 'bin-112',
    code: 'BIN-112',
    name: 'Westside Shopping Galleria',
    address: '3200 Geary Blvd, Westside',
    lat: 37.7812,
    lng: -122.4580,
    wasteType: 'Glass',
    fillLevel: 82,
    lastCollectionTime: '16 hours ago',
    status: 'Almost Full',
    capacityLiters: 240,
    batteryPct: 89,
    temperatureC: 21.0,
    gasLevelPpm: 80,
    dailyIncreasePct: 15.0,
    predictedOverflowHours: 12.8,
    priorityScore: 81
  }
];

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 'rep-301',
    category: 'Overflowing Bin',
    status: 'Pending',
    locationName: 'Metro Plaza Bus Shelter',
    lat: 37.7752,
    lng: -122.4188,
    description: 'Bin #104 is completely full and plastic wrappers are spilling over onto the walkway.',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    timestamp: '25 mins ago',
    reporterName: 'Alex Rivera',
    reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    upvotes: 14,
    binCode: 'BIN-104'
  },
  {
    id: 'rep-302',
    category: 'Illegal Dumping',
    status: 'In Progress',
    locationName: '7th Street Alleyway, South District',
    lat: 37.7711,
    lng: -122.4102,
    description: 'Old sofa mattress, construction timber, and electronics dumped beside building wall.',
    photoUrl: 'https://images.unsplash.com/photo-1611284446314-60a55ac0d494?auto=format&fit=crop&w=600&q=80',
    timestamp: '1 hour ago',
    reporterName: 'Marcus Vance',
    reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    upvotes: 28
  },
  {
    id: 'rep-303',
    category: 'Damaged Bin',
    status: 'Pending',
    locationName: 'Greenway Park Children Playground',
    lat: 37.7688,
    lng: -122.4475,
    description: 'Lid latch is broken and smart sensor housing appears cracked.',
    photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80',
    timestamp: '3 hours ago',
    reporterName: 'Elena Rostova',
    reporterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    upvotes: 9,
    binCode: 'BIN-108'
  },
  {
    id: 'rep-304',
    category: 'Uncollected Garbage',
    status: 'Resolved',
    locationName: 'Market Street Pedestrian Plaza',
    lat: 37.7862,
    lng: -122.4045,
    description: 'Cardboard bundles left uncollected after morning street sweeping.',
    photoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Yesterday',
    reporterName: 'David Chen',
    reporterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    upvotes: 19
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-1',
    title: 'Eco Starter',
    description: 'Completed your first AI waste scan and segregated correctly.',
    iconName: 'Leaf',
    unlockedAt: '3 days ago',
    isUnlocked: true,
    category: 'Segregation'
  },
  {
    id: 'b-2',
    title: 'Waste Warrior',
    description: 'Submitted 5 verified citizen reports for overflowing bins or dumping.',
    iconName: 'ShieldCheck',
    unlockedAt: 'Yesterday',
    isUnlocked: true,
    category: 'Reporting'
  },
  {
    id: 'b-3',
    title: 'Green Champion',
    description: 'Earned 500+ Eco Points and reached Top 10 city rank.',
    iconName: 'Trophy',
    isUnlocked: false,
    category: 'Community'
  },
  {
    id: 'b-4',
    title: 'Zero Waste Hero',
    description: 'Scanned 50 items with 100% proper segregation accuracy.',
    iconName: 'Sparkles',
    isUnlocked: false,
    category: 'Mastery'
  },
  {
    id: 'b-5',
    title: 'Clean Neighborhood Guard',
    description: 'Resolved 3 community dumping alerts in your zip code.',
    iconName: 'MapPin',
    isUnlocked: true,
    unlockedAt: '1 week ago',
    category: 'Reporting'
  }
];

export const INITIAL_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'c-1',
    title: 'Plastic Patrol Challenge',
    description: 'Scan and properly dispose of 5 plastic items this week.',
    rewardPoints: 100,
    currentProgress: 3,
    targetCount: 5,
    isCompleted: false,
    daysRemaining: 4
  },
  {
    id: 'c-2',
    title: 'Community Vigilant',
    description: 'Report or upvote 2 overflowing bins in your area.',
    rewardPoints: 75,
    currentProgress: 2,
    targetCount: 2,
    isCompleted: true,
    daysRemaining: 4
  },
  {
    id: 'c-3',
    title: 'Compost Crusader',
    description: 'Log 3 organic food waste disposals in green bins.',
    rewardPoints: 120,
    currentProgress: 1,
    targetCount: 3,
    isCompleted: false,
    daysRemaining: 4
  }
];

export const LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    points: 1420,
    scansCount: 48,
    reportsCount: 12,
    badgeCount: 8
  },
  {
    rank: 2,
    name: 'Carlos Ruiz',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    points: 1180,
    scansCount: 39,
    reportsCount: 9,
    badgeCount: 6
  },
  {
    rank: 3,
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    points: 950,
    scansCount: 31,
    reportsCount: 7,
    badgeCount: 5
  },
  {
    rank: 4,
    name: 'Alex Rivera (You)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    points: 480,
    scansCount: 18,
    reportsCount: 4,
    badgeCount: 3,
    isCurrentUser: true
  },
  {
    rank: 5,
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    points: 420,
    scansCount: 15,
    reportsCount: 3,
    badgeCount: 3
  },
  {
    rank: 6,
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    points: 390,
    scansCount: 12,
    reportsCount: 5,
    badgeCount: 2
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-901',
  name: 'Alex Rivera',
  email: 'alex.rivera@waste-sense.ai',
  role: 'citizen',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  points: 480,
  rank: 4,
  scansCompleted: 18,
  reportsSubmitted: 4,
  badges: INITIAL_BADGES,
  streakDays: 5
};

export const INITIAL_OPTIMIZED_ROUTE: OptimizedRoute = {
  routeId: 'RT-2026-0819',
  truckId: 'TRUCK-04',
  driverName: 'Officer Robert Vance',
  totalBins: 5,
  totalDistanceKm: 11.4,
  distanceSavedPercent: 18.4, // "Recommended route saves 18% travel distance"
  estimatedTotalMinutes: 42,
  co2SavedKg: 14.8,
  stops: [
    {
      stopNumber: 1,
      binId: 'bin-104',
      binCode: 'BIN-104',
      binName: 'Metro Plaza Central Station',
      address: '450 Civic Center Blvd, Downtown',
      lat: 37.7749,
      lng: -122.4194,
      fillLevel: 92,
      predictedOverflowHours: 6.7,
      priorityScore: 98,
      estimatedPickTimeMinutes: 6,
      estWasteKg: 185
    },
    {
      stopNumber: 2,
      binId: 'bin-108',
      binCode: 'BIN-108',
      binName: 'Greenway Park North Gate',
      address: '820 Parkside Ave, Green Belt',
      lat: 37.7695,
      lng: -122.4468,
      fillLevel: 89,
      predictedOverflowHours: 5.1,
      priorityScore: 94,
      estimatedPickTimeMinutes: 8,
      estWasteKg: 210
    },
    {
      stopNumber: 3,
      binId: 'bin-102',
      binCode: 'BIN-102',
      binName: 'Tech District Innovation Hub',
      address: '100 Market St, Financial Quarter',
      lat: 37.7885,
      lng: -122.4012,
      fillLevel: 85,
      predictedOverflowHours: 9.2,
      priorityScore: 86,
      estimatedPickTimeMinutes: 7,
      estWasteKg: 160
    },
    {
      stopNumber: 4,
      binId: 'bin-112',
      binCode: 'BIN-112',
      binName: 'Westside Shopping Galleria',
      address: '3200 Geary Blvd, Westside',
      lat: 37.7812,
      lng: -122.4580,
      fillLevel: 82,
      predictedOverflowHours: 12.8,
      priorityScore: 81,
      estimatedPickTimeMinutes: 9,
      estWasteKg: 175
    },
    {
      stopNumber: 5,
      binId: 'bin-105',
      binCode: 'BIN-105',
      binName: 'University Campus Food Court',
      address: '2200 University Ave, Education Zone',
      lat: 37.7612,
      lng: -122.4289,
      fillLevel: 78,
      predictedOverflowHours: 11.4,
      priorityScore: 79,
      estimatedPickTimeMinutes: 10,
      estWasteKg: 190
    }
  ]
};

export const INITIAL_ANALYTICS: MunicipalityAnalytics = {
  totalBinsCount: 148,
  criticalBinsCount: 4,
  almostFullBinsCount: 18,
  pendingReportsCount: 7,
  resolvedReportsCount: 64,
  collectionEfficiencyPct: 94.2,
  totalCo2SavedTons: 128.4,
  wasteCategoryBreakdown: [
    { category: 'Organic', percentage: 38, tons: 48.8 },
    { category: 'Plastic', percentage: 26, tons: 33.4 },
    { category: 'Paper', percentage: 18, tons: 23.1 },
    { category: 'Glass', percentage: 10, tons: 12.8 },
    { category: 'Metal', percentage: 5, tons: 6.4 },
    { category: 'E-Waste', percentage: 2, tons: 2.6 },
    { category: 'Hazardous', percentage: 1, tons: 1.3 }
  ],
  overflowTrends: [
    { day: 'Mon', predictedOverflows: 8, actualOverflows: 2 },
    { day: 'Tue', predictedOverflows: 12, actualOverflows: 3 },
    { day: 'Wed', predictedOverflows: 10, actualOverflows: 1 },
    { day: 'Thu', predictedOverflows: 14, actualOverflows: 2 },
    { day: 'Fri', predictedOverflows: 19, actualOverflows: 4 },
    { day: 'Sat', predictedOverflows: 22, actualOverflows: 5 },
    { day: 'Sun', predictedOverflows: 15, actualOverflows: 3 }
  ],
  dumpingHotspots: [
    { zoneName: 'South District Alleyways', reportsCount: 14, riskLevel: 'High' },
    { zoneName: 'Embarcadero Pier Area', reportsCount: 9, riskLevel: 'Medium' },
    { zoneName: 'Greenway Park Outer Perimeter', reportsCount: 6, riskLevel: 'Medium' },
    { zoneName: 'University Quad Rear Lot', reportsCount: 3, riskLevel: 'Low' }
  ]
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'bin_collected',
    title: 'Reported Bin BIN-104 Collected!',
    message: 'Municipal Sanitation Truck #4 has collected and emptied your reported bin BIN-104 (Metro Plaza Central Station). You received +50 Bonus Eco Points!',
    timestamp: '12 mins ago',
    read: false,
    actionTab: 'citizen_dash',
    binCode: 'BIN-104'
  },
  {
    id: 'notif-2',
    type: 'challenge_expiring',
    title: '⚡ Challenge Nearing Expiry!',
    message: 'Your active recycling challenge "Plastic Patrol Warrior" expires in 1 day! Scan 2 more plastic items to claim +150 Eco Points before time runs out.',
    timestamp: '45 mins ago',
    read: false,
    actionTab: 'gamification',
    challengeId: 'ch-1'
  },
  {
    id: 'notif-3',
    type: 'report_upvoted',
    title: 'Community Upvote Received',
    message: 'Your citizen report for "Overflowing Bin" at Market St & 4th Ave received 5 new community upvotes.',
    timestamp: '2 hours ago',
    read: true,
    actionTab: 'citizen_dash',
    reportId: 'rep-101'
  },
  {
    id: 'notif-4',
    type: 'bin_collected',
    title: 'Scheduled Pickup Complete',
    message: 'Smart Bin BIN-102 at City Hall Park East was emptied and sensor reset to 0% fill level.',
    timestamp: 'Yesterday',
    read: true,
    actionTab: 'nearby_map',
    binCode: 'BIN-102'
  }
];
