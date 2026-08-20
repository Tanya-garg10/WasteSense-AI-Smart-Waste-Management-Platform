import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import {
  Share2,
  X,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Award,
  Trophy,
  Flame,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Globe,
  Leaf,
  Send
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  badges: Badge[];
  initialSelectedBadge?: Badge | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  user,
  badges,
  initialSelectedBadge = null
}) => {
  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  
  const [shareType, setShareType] = useState<'impact' | 'badge'>(
    initialSelectedBadge ? 'badge' : 'impact'
  );
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(
    initialSelectedBadge || unlockedBadges[0] || badges[0] || null
  );
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculated Impact Stats
  const co2SavedKg = (user.scansCompleted * 1.85).toFixed(1);
  const wasteDivertedKg = (user.scansCompleted * 2.4).toFixed(1);

  // Template generators
  const getImpactShareText = () => {
    return (
      customMessage ||
      `🌱 I'm making an environmental impact with WasteSense AI!\n` +
      `🏆 City Rank: #${user.rank}\n` +
      `⚡ Eco Points: ${user.points} pts\n` +
      `🔍 AI Scans: ${user.scansCompleted} items categorized\n` +
      `🔥 Active Streak: ${user.streakDays} Days\n` +
      `♻️ ~${co2SavedKg}kg CO₂ emissions avoided!\n\n` +
      `Join me in building a cleaner, smarter city! 🌍 #WasteSense #GreenTech #Sustainability #SmartCities`
    );
  };

  const getBadgeShareText = () => {
    const badgeName = selectedBadge ? selectedBadge.title : 'Eco Champion';
    return (
      customMessage ||
      `🎉 Just unlocked the "${badgeName}" badge on WasteSense AI!\n` +
      `🏅 Category: ${selectedBadge?.category || 'Recycling'}\n` +
      `📜 "${selectedBadge?.description || 'Promoting municipal waste segregation'}"\n\n` +
      `Total Eco Balance: ${user.points} pts | Rank #${user.rank}\n` +
      `Let's keep our urban spaces clean and sustainable! 🌿 #WasteSense #EcoRewards #CircularEconomy`
    );
  };

  const currentShareText = shareType === 'impact' ? getImpactShareText() : getBadgeShareText();

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(currentShareText);
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    // LinkedIn post sharing intent URL
    const text = encodeURIComponent(currentShareText);
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="social-share-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Community Gamification & Outreach
              </span>
              <h3 className="text-lg font-black text-white">Share Eco Achievements & Impact</h3>
            </div>
          </div>

          <button
            id="close-social-share-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Share Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              id="share-type-impact-tab"
              onClick={() => {
                setShareType('impact');
                setCustomMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                shareType === 'impact'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-200 dark:border-slate-800'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>Environmental Impact Stats</span>
            </button>

            <button
              id="share-type-badge-tab"
              onClick={() => {
                setShareType('badge');
                setCustomMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                shareType === 'badge'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-200 dark:border-slate-800'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Earned Badge Showcase</span>
            </button>
          </div>

          {/* Badge Selection Sub-Menu (if Badge Share Type) */}
          {shareType === 'badge' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Select Badge to Highlight:</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {unlockedBadges.length} Unlocked
                </span>
              </label>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {badges.map((b) => {
                  const isSelected = selectedBadge?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (b.isUnlocked) {
                          setSelectedBadge(b);
                          setCustomMessage('');
                        }
                      }}
                      disabled={!b.isUnlocked}
                      className={`px-3 py-2 rounded-2xl border text-xs font-bold shrink-0 flex items-center space-x-2 transition-all cursor-pointer ${
                        !b.isUnlocked
                          ? 'opacity-40 grayscale cursor-not-allowed bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          : isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <Award className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-emerald-500'}`} />
                      <span>{b.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Post Graphic Preview Card */}
          <div className="relative p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white border border-emerald-500/30 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div>
                  <p className="text-xs font-extrabold text-white">{user.name}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">@WasteSense Citizen • Rank #{user.rank}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-[10px] uppercase flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Verified Impact</span>
              </span>
            </div>

            {/* Dynamic Card Content */}
            {shareType === 'impact' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1 text-center">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Eco Points</p>
                  <p className="text-lg font-black text-amber-400">{user.points}</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">AI Scans</p>
                  <p className="text-lg font-black text-emerald-400">{user.scansCompleted}</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">CO₂ Avoided</p>
                  <p className="text-lg font-black text-teal-300">~{co2SavedKg} kg</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Day Streak</p>
                  <p className="text-lg font-black text-amber-300">{user.streakDays}d 🔥</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-amber-400 tracking-wider">
                    {selectedBadge?.category || 'Achievement'} Badge Unlocked
                  </span>
                  <h4 className="text-sm font-black text-white">{selectedBadge?.title || 'Eco Champion'}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{selectedBadge?.description}</p>
                </div>
              </div>
            )}

            {/* Editable Post Text Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-300 flex items-center justify-between">
                <span>Post Caption Preview:</span>
                <span className="text-[10px] text-slate-400 font-normal">Editable text</span>
              </label>
              <textarea
                value={currentShareText}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-emerald-200 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

          </div>

          {/* Social Platform Action Buttons */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Post Directly to Social Media
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Share to Twitter (X) */}
              <button
                id="share-to-twitter-btn"
                onClick={handleShareTwitter}
                className="py-3 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer border border-slate-800 group"
              >
                <Twitter className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>Post to Twitter (X)</span>
              </button>

              {/* Share to LinkedIn */}
              <button
                id="share-to-linkedin-btn"
                onClick={handleShareLinkedIn}
                className="py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer group"
              >
                <Linkedin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Share to LinkedIn</span>
              </button>

              {/* Copy Caption to Clipboard */}
              <button
                id="copy-share-caption-btn"
                onClick={handleCopyText}
                className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
