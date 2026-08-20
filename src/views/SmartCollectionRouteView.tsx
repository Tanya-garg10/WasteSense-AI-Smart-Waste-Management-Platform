import React from 'react';
import { OptimizedRoute, RouteStop } from '../types';
import { Route, Truck, CheckCircle2, AlertTriangle, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface SmartCollectionRouteViewProps {
  route: OptimizedRoute;
  onCollectBin: (binId: string) => void;
  onNavigate: (tab: string) => void;
}

export const SmartCollectionRouteView: React.FC<SmartCollectionRouteViewProps> = ({
  route,
  onCollectBin,
  onNavigate
}) => {
  return (
    <div id="smart-collection-route-container" className="max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Route Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white font-black flex items-center justify-center shadow-lg">
              <Route className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 text-blue-300 font-bold text-[10px] uppercase border border-blue-400/30">
                  {route.routeId}
                </span>
                <span className="text-xs text-emerald-300 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AI TSP Route Optimization Engine</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Recommended Collection Route
              </h2>
              <p className="text-xs text-slate-300">
                Prioritized by fill level, overflow time prediction, and shortest road distance.
              </p>
            </div>
          </div>

          {/* Metric Highlight Box */}
          <div className="p-4 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-center shrink-0">
            <p className="text-[10px] font-bold text-emerald-300 uppercase">Route Savings Metric</p>
            <p className="text-2xl font-black text-emerald-400">18.4% Distance Saved</p>
            <p className="text-[10px] text-slate-300">Saves ~{route.co2SavedKg} kg CO₂ fuel emissions</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Turn-By-Turn Route Stops List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Optimized Pickup Sequence ({route.stops.length} Stops)
            </h3>
            <span className="text-xs font-bold text-slate-500">Est. Total: {route.estimatedTotalMinutes} mins</span>
          </div>

          <div className="space-y-3">
            {route.stops.map((stop: RouteStop) => (
              <div
                key={stop.binId}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                    #{stop.stopNumber}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{stop.binCode}</span>
                      <span className="px-2 py-0.5 rounded-md bg-red-500 text-white font-black text-[10px]">
                        {stop.fillLevel}% Full
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        Overflow in {stop.predictedOverflowHours}h
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{stop.binName}</p>
                    <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{stop.address}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 mb-1">~{stop.estWasteKg} kg waste</span>
                  <button
                    onClick={() => onCollectBin(stop.binId)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Pickup</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Path Visualizer Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>GPS Route Path Map</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300">
                Live Waypoints
              </span>
            </div>

            {/* Path Visual Representation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Depot Start: Municipal Garage #01</span>
              </div>

              {route.stops.map((st, i) => (
                <div key={st.binId} className="flex items-center space-x-2 pl-4 border-l-2 border-blue-500/50 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="truncate">Stop #{st.stopNumber}: {st.binCode} ({st.fillLevel}%)</span>
                </div>
              ))}

              <div className="flex items-center space-x-2 text-slate-300 pt-1">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>End: Eco Waste Processing Plant</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Total Route Distance:</span>
                <span className="text-emerald-400">{route.totalDistanceKm} km</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Est. Driving Time:</span>
                <span className="text-emerald-400">{route.estimatedTotalMinutes} mins</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
