import React, { useState } from 'react';
import { SmartBin, CitizenReport, MunicipalityAnalytics } from '../types';
import {
  MapPin,
  Search,
  Filter,
  AlertTriangle,
  Battery,
  Thermometer,
  Clock,
  Navigation,
  Flame,
  Eye,
  EyeOff,
  Zap,
  Layers,
  ShieldAlert,
  Truck,
  Info,
  Sliders,
  Maximize2,
  TrendingUp,
  ThumbsUp,
  Crosshair,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface NearbyBinsMapViewProps {
  bins: SmartBin[];
  reports?: CitizenReport[];
  analytics?: MunicipalityAnalytics | null;
  onNavigate: (tab: string) => void;
}

export type HeatmapLayerMode =
  | 'BINS'
  | 'HEATMAP_DUMPING'
  | 'HEATMAP_OVERFLOW'
  | 'HEATMAP_COMBINED';

interface HeatmapDataPoint {
  id: string;
  type: 'dumping' | 'overflow';
  title: string;
  locationName: string;
  lat: number;
  lng: number;
  intensity: number; // 0.1 to 1.0
  reportCount?: number;
  upvotes?: number;
  fillLevel?: number;
  description: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  binCode?: string;
  predictedOverflowHours?: number;
}

export const NearbyBinsMapView: React.FC<NearbyBinsMapViewProps> = ({
  bins,
  reports = [],
  analytics,
  onNavigate
}) => {
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(bins[0] || null);
  const [selectedHotspot, setSelectedHotspot] = useState<HeatmapDataPoint | null>(null);
  const [activeLayer, setActiveLayer] = useState<HeatmapLayerMode>('HEATMAP_COMBINED');
  const [heatmapRadius, setHeatmapRadius] = useState<number>(55);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDistrictGrid, setShowDistrictGrid] = useState<boolean>(true);
  const [showPinOverlay, setShowPinOverlay] = useState<boolean>(true);

  // Geographic Bounding Box for San Francisco area map normalization
  const minLat = 37.755;
  const maxLat = 37.805;
  const minLng = -122.465;
  const maxLng = -122.385;

  const projectCoords = (lat: number, lng: number) => {
    const xPct = Math.max(8, Math.min(92, ((lng - minLng) / (maxLng - minLng)) * 80 + 10));
    const yPct = Math.max(8, Math.min(92, ((maxLat - lat) / (maxLat - minLat)) * 80 + 10));
    return { xPct, yPct };
  };

  // Compile Heatmap Data Points
  const dumpingHotspotsPoints: HeatmapDataPoint[] = [
    // Primary Citizen Reports of dumping
    ...reports
      .filter((r) => r.category === 'Illegal Dumping' || r.category === 'Uncollected Garbage')
      .map((r) => ({
        id: `h-rep-${r.id}`,
        type: 'dumping' as const,
        title: `Illegal Dumping Cluster (${r.category})`,
        locationName: r.locationName,
        lat: r.lat,
        lng: r.lng,
        intensity: Math.min(1.0, 0.4 + (r.upvotes || 0) * 0.025),
        reportCount: r.upvotes ? Math.floor(r.upvotes / 3) + 1 : 1,
        upvotes: r.upvotes,
        description: r.description,
        riskLevel: (r.upvotes && r.upvotes > 20 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low'
      })),

    // Additional Municipal Analytics dumping hotspots
    {
      id: 'h-hotspot-1',
      type: 'dumping',
      title: '7th Street Alleyway Dumping Hotspot',
      locationName: '7th St & Brannan St Alleyway',
      lat: 37.7711,
      lng: -122.4102,
      intensity: 0.95,
      reportCount: 12,
      upvotes: 34,
      description: 'Persistent overnight dumping of bulky furniture, mattresses, and construction debris.',
      riskLevel: 'High'
    },
    {
      id: 'h-hotspot-2',
      type: 'dumping',
      title: 'University Quad Rear Service Lot',
      locationName: '2200 University Ave Rear Yard',
      lat: 37.7620,
      lng: -122.4310,
      intensity: 0.78,
      reportCount: 7,
      upvotes: 18,
      description: 'Frequent unmonitored commercial dumping of cardboard boxes and electronics.',
      riskLevel: 'Medium'
    },
    {
      id: 'h-hotspot-3',
      type: 'dumping',
      title: 'Industrial Docks Gate 4',
      locationName: 'Pier 70 Industrial Gate',
      lat: 37.7650,
      lng: -122.3980,
      intensity: 0.88,
      reportCount: 9,
      upvotes: 27,
      description: 'Hazardous waste barrels and chemical packaging reported near storm drain.',
      riskLevel: 'High'
    }
  ];

  const overflowHotspotPoints: HeatmapDataPoint[] = bins
    .filter((b) => b.fillLevel >= 70)
    .map((b) => ({
      id: `h-bin-${b.id}`,
      type: 'overflow',
      title: `High-Density Overflow Risk (${b.code})`,
      locationName: `${b.name} (${b.address})`,
      lat: b.lat,
      lng: b.lng,
      intensity: Math.min(1.0, (b.fillLevel / 100) * 0.9 + (b.priorityScore / 100) * 0.1),
      fillLevel: b.fillLevel,
      binCode: b.code,
      predictedOverflowHours: b.predictedOverflowHours,
      description: `IoT sensor detects ${b.fillLevel}% fill level. Estimated overflow in ${b.predictedOverflowHours} hours.`,
      riskLevel: b.status === 'Critical' ? 'High' : 'Medium'
    }));

  const allHeatPoints: HeatmapDataPoint[] = [
    ...(activeLayer === 'HEATMAP_DUMPING' || activeLayer === 'HEATMAP_COMBINED' ? dumpingHotspotsPoints : []),
    ...(activeLayer === 'HEATMAP_OVERFLOW' || activeLayer === 'HEATMAP_COMBINED' ? overflowHotspotPoints : [])
  ];

  const filteredBins = bins.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status.toUpperCase() === filterStatus;
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const highRiskDumpingCount = dumpingHotspotsPoints.filter((h) => h.riskLevel === 'High').length;
  const criticalOverflowCount = bins.filter((b) => b.fillLevel >= 85).length;
  const peakHazardScore = Math.min(
    99,
    Math.round((highRiskDumpingCount * 18) + (criticalOverflowCount * 15) + 32)
  );

  return (
    <div id="nearby-bins-container" className="max-w-7xl mx-auto py-6 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Smart Urban Waste GIS Telematics</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Nearby Bins & Hotspot Heatmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time IoT sensors and citizen intelligence visualizing dumping clusters and overflow risks.
          </p>
        </div>

        {/* Heatmap Layer Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs">
          <button
            onClick={() => setActiveLayer('HEATMAP_COMBINED')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeLayer === 'HEATMAP_COMBINED'
                ? 'bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>Combined Risk Heatmap</span>
          </button>

          <button
            onClick={() => setActiveLayer('HEATMAP_DUMPING')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeLayer === 'HEATMAP_DUMPING'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
            <span>Illegal Dumping</span>
          </button>

          <button
            onClick={() => setActiveLayer('HEATMAP_OVERFLOW')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeLayer === 'HEATMAP_OVERFLOW'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overflow Risk</span>
          </button>

          <button
            onClick={() => setActiveLayer('BINS')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeLayer === 'BINS'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bins Only</span>
          </button>
        </div>
      </div>

      {/* Top Telematics & Hazard Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              Dumping Clusters
            </p>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400">
              {dumpingHotspotsPoints.length} Active Hotspots
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              Overflow Hazard Bins
            </p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">
              {criticalOverflowCount} Critical Nodes
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              Urban Hazard Index
            </p>
            <p className="text-xl font-black text-red-600 dark:text-red-400">
              {peakHazardScore} / 100
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              IoT Sensor Status
            </p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              100% Online
            </p>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Visual Map Container */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-950 border border-slate-800 p-5 relative min-h-[520px] flex flex-col justify-between overflow-hidden shadow-2xl select-none">
          
          {/* Map Grid Gridlines background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          {/* District Road Grid Overlay SVG lines */}
          {showDistrictGrid && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 stroke-slate-700 stroke-[1.5] stroke-dasharray-[4_4]">
              {/* Horizontal arterial roads */}
              <line x1="0%" y1="25%" x2="100%" y2="25%" />
              <line x1="0%" y1="50%" x2="100%" y2="50%" />
              <line x1="0%" y1="75%" x2="100%" y2="75%" />
              {/* Vertical arterial avenues */}
              <line x1="20%" y1="0%" x2="20%" y2="100%" />
              <line x1="45%" y1="0%" x2="45%" y2="100%" />
              <line x1="70%" y1="0%" x2="70%" y2="100%" />

              {/* District Labels */}
              <text x="22%" y="15%" fill="#94a3b8" fontSize="10" fontWeight="bold">DOWNTOWN CIVIC CENTER</text>
              <text x="72%" y="20%" fill="#94a3b8" fontSize="10" fontWeight="bold">FINANCIAL QUARTER</text>
              <text x="12%" y="82%" fill="#94a3b8" fontSize="10" fontWeight="bold">GREENWAY PARK ZONE</text>
              <text x="48%" y="78%" fill="#94a3b8" fontSize="10" fontWeight="bold">EDUCATION & TECH HUB</text>
            </svg>
          )}

          {/* Top Map Toolbar / Controls */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs text-white shadow-lg">
            
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-xs">SF Metro Waste Density GIS</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-amber-400 font-bold">
                {activeLayer === 'BINS'
                  ? 'Standard Bins'
                  : activeLayer === 'HEATMAP_DUMPING'
                  ? 'Illegal Dumping Heatmap'
                  : activeLayer === 'HEATMAP_OVERFLOW'
                  ? 'Overflow Heatmap'
                  : 'Combined Heatmap Mode'}
              </span>
            </div>

            {/* Heatmap Customization Sliders & Toggles */}
            <div className="flex items-center space-x-3 text-xs">
              {activeLayer !== 'BINS' && (
                <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-300">Spread:</span>
                  <input
                    type="range"
                    min="35"
                    max="95"
                    value={heatmapRadius}
                    onChange={(e) => setHeatmapRadius(Number(e.target.value))}
                    className="w-16 accent-amber-500 cursor-pointer"
                    title="Heatmap aura radius"
                  />
                  <span className="text-[10px] font-mono text-amber-400">{heatmapRadius}px</span>
                </div>
              )}

              <button
                onClick={() => setShowPinOverlay(!showPinOverlay)}
                className={`px-2.5 py-1 rounded-xl border text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer ${
                  showPinOverlay
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Toggle bin pin markers on map"
              >
                {showPinOverlay ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>Pins</span>
              </button>

              <button
                onClick={() => setShowDistrictGrid(!showDistrictGrid)}
                className={`px-2.5 py-1 rounded-xl border text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer ${
                  showDistrictGrid
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Toggle district gridlines"
              >
                <Layers className="w-3 h-3" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Interactive Heatmap Canvas Overlay Stage */}
          <div className="relative z-10 my-4 min-h-[380px] w-full flex-1 rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-950/60">
            
            {/* 1. THERMAL HEATMAP LAYER (Radial Gradient Heat Auras) */}
            {activeLayer !== 'BINS' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  {/* Dumping Heat Gradient (Purple -> Magenta -> Red) */}
                  <radialGradient id="dumpingHeatGrad">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#ec4899" stopOpacity="0.60" />
                    <stop offset="70%" stopColor="#ef4444" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                  </radialGradient>

                  {/* Overflow Heat Gradient (Red -> Orange -> Amber) */}
                  <radialGradient id="overflowHeatGrad">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.90" />
                    <stop offset="45%" stopColor="#f97316" stopOpacity="0.65" />
                    <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Render glowing radial heat spots for all active hotspots */}
                {allHeatPoints.map((pt) => {
                  const { xPct, yPct } = projectCoords(pt.lat, pt.lng);
                  const isSelected = selectedHotspot?.id === pt.id;
                  const radius = (heatmapRadius * (0.8 + pt.intensity * 0.5));
                  const gradId = pt.type === 'dumping' ? 'url(#dumpingHeatGrad)' : 'url(#overflowHeatGrad)';

                  return (
                    <g key={pt.id} className="transition-all duration-300">
                      {/* Outer Heat Aura */}
                      <circle
                        cx={`${xPct}%`}
                        cy={`${yPct}%`}
                        r={radius}
                        fill={gradId}
                        className={pt.intensity > 0.8 ? 'animate-pulse' : ''}
                      />

                      {/* Hotspot Core Glowing Ring */}
                      <circle
                        cx={`${xPct}%`}
                        cy={`${yPct}%`}
                        r={isSelected ? 16 : 8}
                        fill={pt.type === 'dumping' ? '#c084fc' : '#f87171'}
                        stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="cursor-pointer pointer-events-auto hover:scale-125 transition-transform"
                        onClick={() => {
                          setSelectedHotspot(pt);
                          setSelectedBin(null);
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* 2. SMART BIN GPS MARKERS LAYER */}
            {showPinOverlay &&
              filteredBins.map((b) => {
                const { xPct, yPct } = projectCoords(b.lat, b.lng);
                const isSelected = selectedBin?.id === b.id;
                const statusColor =
                  b.status === 'Critical'
                    ? 'bg-red-500 text-white border-red-400'
                    : b.status === 'Almost Full'
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-emerald-500 text-slate-950 border-emerald-300';

                return (
                  <div
                    key={b.id}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    onClick={() => {
                      setSelectedBin(b);
                      setSelectedHotspot(null);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 transform hover:scale-125 z-20 ${
                      isSelected ? 'z-40 scale-125 ring-4 ring-emerald-400/50 rounded-xl' : ''
                    }`}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-xl shadow-xl border font-black text-[11px] flex items-center space-x-1 backdrop-blur-md ${statusColor}`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{b.code} ({b.fillLevel}%)</span>
                    </div>
                  </div>
                );
              })}

            {/* 3. HOTSPOT CALLOUT LABELS ON MAP */}
            {allHeatPoints
              .filter((pt) => pt.intensity >= 0.85)
              .map((pt) => {
                const { xPct, yPct } = projectCoords(pt.lat, pt.lng);
                return (
                  <div
                    key={`label-${pt.id}`}
                    style={{ left: `${xPct}%`, top: `${yPct + 5}%` }}
                    onClick={() => {
                      setSelectedHotspot(pt);
                      setSelectedBin(null);
                    }}
                    className="absolute -translate-x-1/2 pointer-events-auto cursor-pointer z-30"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-white font-extrabold text-[9px] border border-amber-500/40 shadow-lg flex items-center space-x-1 whitespace-nowrap hover:bg-amber-500 hover:text-slate-950 transition-colors">
                      <Flame className="w-2.5 h-2.5 text-amber-400" />
                      <span>{pt.locationName.split(',')[0]}</span>
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Map Footer Legend & Filter Status */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-4">
              <span className="font-extrabold text-white">Heat Legend:</span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                <span>Illegal Dumping</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Critical Overflow (&gt;85%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /><span>Medium Risk</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bin / street..."
                className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white text-[11px] outline-none"
              />
            </div>
          </div>

        </div>

        {/* Selected Bin or Hotspot Telematics Inspection Card */}
        <div className="space-y-4">
          
          {/* Case 1: Inspecting Selected Illegal Dumping / Overflow Hotspot */}
          {selectedHotspot ? (
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-500/40 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{selectedHotspot.type === 'dumping' ? 'Illegal Dumping Cluster' : 'Overflow Danger Zone'}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  selectedHotspot.riskLevel === 'High' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {selectedHotspot.riskLevel} Risk
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{selectedHotspot.title}</h3>
                <p className="text-xs text-amber-300 font-bold mt-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedHotspot.locationName}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                {selectedHotspot.description}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-bold">Heat Intensity</p>
                  <p className="font-black text-amber-400 text-sm">
                    {Math.round(selectedHotspot.intensity * 100)}% Density
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-[10px] text-slate-400 font-bold">
                    {selectedHotspot.type === 'dumping' ? 'Citizen Reports' : 'Bin Fill Level'}
                  </p>
                  <p className="font-black text-purple-400 text-sm">
                    {selectedHotspot.type === 'dumping'
                      ? `${selectedHotspot.upvotes || 12} Upvotes`
                      : `${selectedHotspot.fillLevel}% Capacity`}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onNavigate('report_issue')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Report Additional Dumping Here</span>
                </button>

                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Clear Hotspot Focus
                </button>
              </div>
            </div>
          ) : selectedBin ? (
            /* Case 2: Inspecting Selected Smart Bin */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white">
                  {selectedBin.code}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    selectedBin.status === 'Critical'
                      ? 'bg-red-500 text-white'
                      : selectedBin.status === 'Almost Full'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {selectedBin.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedBin.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedBin.address}</p>
              </div>

              {/* Fill Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Fill Capacity</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{selectedBin.fillLevel}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBin.status === 'Critical'
                        ? 'bg-red-500'
                        : selectedBin.status === 'Almost Full'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedBin.fillLevel}%` }}
                  />
                </div>
              </div>

              {/* Telematics stats */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 font-bold">Waste Stream</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedBin.wasteType}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 font-bold">Overflow AI Estimate</p>
                  <p className="font-bold text-amber-600 dark:text-amber-400">
                    In {selectedBin.predictedOverflowHours} hrs
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">IoT Battery</p>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedBin.batteryPct}%</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Temperature</p>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedBin.temperatureC}°C</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('scanner')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Scan Waste Item For This Bin
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              Select a bin or heatmap spot on the map to inspect telematics.
            </div>
          )}

          {/* Quick Hotspot Directory List */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
              <span>Hotspot Risk Directory</span>
              <span className="text-[10px] text-amber-500">{dumpingHotspotsPoints.length} Zones</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {dumpingHotspotsPoints.map((h) => (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHotspot(h);
                    setSelectedBin(null);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedHotspot?.id === h.id
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white text-[11px]">{h.locationName}</p>
                    <p className="text-[10px] text-slate-400">{h.upvotes || 8} Community Upvotes</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      h.riskLevel === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                    }`}
                  >
                    {h.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
