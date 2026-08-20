import React from 'react';
import {
  ScanLine,
  BarChart3,
  Truck,
  Sparkles,
  Recycle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Clock
} from 'lucide-react';
import { ImpactChainWidget } from '../components/ImpactChainWidget';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onLaunchDemo: () => void;
  isDemoLoading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onLaunchDemo,
  isDemoLoading
}) => {
  return (
    <div id="landing-page-container" className="space-y-8 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-emerald-500/30 shadow-2xl">
        
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Platform Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Smart Waste Management Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Turn Waste Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Intelligence.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            AI-powered waste segregation, smart collection, and predictive waste management for cleaner, sustainable communities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              id="hero-cta-scanner"
              onClick={() => onNavigate('scanner')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <ScanLine className="w-5 h-5" />
              <span>Try AI Waste Scanner</span>
            </button>

            <button
              id="hero-cta-dashboard"
              onClick={() => onNavigate('municipality_dash')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5 text-emerald-300" />
              <span>Explore Live Dashboard</span>
            </button>

            <button
              id="hero-cta-demo"
              onClick={onLaunchDemo}
              disabled={isDemoLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className={`w-5 h-5 ${isDemoLoading ? 'animate-spin' : ''}`} />
              <span>{isDemoLoading ? 'Loading Demo...' : 'Launch Demo Mode'}</span>
            </button>
          </div>

          {/* Visual Representation of Smart Bins + AI Analytics + Routes */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Vision Scanner</h4>
                  <p className="text-[10px] text-slate-400">Instant segregation & bin recommendation</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Classifies waste into 8 categories (Organic, Plastic, Paper, Glass, E-Waste) with 96%+ accuracy.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Overflow Analytics</h4>
                  <p className="text-[10px] text-slate-400">Predictive IoT fill monitoring</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                AI predicts when Bin #104 will overflow in 6h 42m, preventing street spillage before it happens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Truck Routing</h4>
                  <p className="text-[10px] text-slate-400">18.4% Distance Saved</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Optimizes collection routes based on criticality, reducing fuel usage and municipal carbon footprint.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* System Architecture Pipeline Widget */}
      <ImpactChainWidget onNavigateTab={onNavigate} />

      {/* Core Problem & Solution Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Problem Card */}
        <div className="p-6 rounded-3xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>The Problem</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Inefficient Urban Waste Systems
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Poor segregation at source contaminates recyclable streams.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Overflowing street bins cause public health & pest hazards.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Garbage trucks follow static, inefficient daily pickup routes.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Lack of citizen engagement and rewards for clean habits.</span>
            </li>
          </ul>
        </div>

        {/* The WasteSense AI Solution Card */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>The WasteSense AI Solution</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Connected Intelligent Ecosystem
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Gemini AI Vision scanner provides simple visual bin instructions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>IoT fill level sensors + AI time-series overflow prediction.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Dynamic route optimization saves 18.4% fuel & travel distance.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Gamified citizen rewards, badges, and verified issue reporting.</span>
            </li>
          </ul>
        </div>

      </section>

      {/* Live Impact Ticker Stats */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Real-Time Municipal Environmental Impact Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">128.4 Tons</p>
            <p className="text-xs text-slate-500 font-medium mt-1">CO₂ Emissions Prevented</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">94.2%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Collection Route Efficiency</p>
          </div>
          <div>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-400">148 Bins</p>
            <p className="text-xs text-slate-500 font-medium mt-1">IoT Smart Monitored Fleet</p>
          </div>
          <div>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400">4,850 Pts</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Citizen Eco Rewards Awarded</p>
          </div>
        </div>
      </section>

    </div>
  );
};
