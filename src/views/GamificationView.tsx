import React, { useState } from 'react';
import { UserProfile, LeaderboardUser, Badge, WeeklyChallenge } from '../types';
import { Award, Trophy, Sparkles, CheckCircle2, ShieldCheck, Flame, Medal, Star, Share2, ExternalLink } from 'lucide-react';
import { SocialShareModal } from '../components/SocialShareModal';

interface GamificationViewProps {
  user: UserProfile;
  leaderboard: LeaderboardUser[];
  badges: Badge[];
  challenges: WeeklyChallenge[];
  onClaimChallenge: (challengeId: string) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  user,
  leaderboard,
  badges,
  challenges,
  onClaimChallenge
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedBadgeToShare, setSelectedBadgeToShare] = useState<Badge | null>(null);

  const handleOpenShareModal = (badge?: Badge) => {
    setSelectedBadgeToShare(badge || null);
    setIsShareModalOpen(true);
  };

  return (
    <div id="gamification-container" className="max-w-5xl mx-auto py-6 space-y-6">
      
      {/* User Stats Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-2xl shadow-lg shrink-0">
              <Trophy className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  City Rank #{user.rank}
                </span>
                <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{user.streakDays} Day Active Streak</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Eco Rewards & Citizen Leaderboard
              </h2>
              <p className="text-xs text-slate-300">
                Earn Eco Points for verified AI waste scans and reporting community dumping issues.
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center w-full md:w-auto">
              <p className="text-[10px] font-bold text-slate-300 uppercase">Total Eco Balance</p>
              <p className="text-3xl font-black text-amber-400">{user.points} pts</p>
            </div>

            {/* Social Sharing CTA Button */}
            <button
              id="open-social-share-banner-btn"
              onClick={() => handleOpenShareModal()}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Impact on Twitter & LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Challenges & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Challenges */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Weekly Challenges</h3>
          </div>

          <div className="space-y-3">
            {challenges.map((c) => {
              const pct = Math.min(100, Math.round((c.currentProgress / c.targetCount) * 100));
              const canClaim = c.currentProgress >= c.targetCount && !c.isCompleted;

              return (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{c.title}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+{c.rewardPoints} pts</span>
                  </div>

                  <p className="text-xs text-slate-500">{c.description}</p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Progress: {c.currentProgress} / {c.targetCount}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${c.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {canClaim && (
                    <button
                      onClick={() => onClaimChallenge(c.id)}
                      className="mt-2 w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm cursor-pointer"
                    >
                      Claim +{c.rewardPoints} Points Reward!
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Earned Badges Showcase */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Citizen Badges Showcase</h3>
            </div>
            <button
              id="share-all-badges-btn"
              onClick={() => handleOpenShareModal()}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Showcase</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`relative p-3.5 rounded-2xl border text-center space-y-2 transition-all group ${
                  b.isUnlocked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white hover:border-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-50 grayscale'
                }`}
              >
                {b.isUnlocked && (
                  <button
                    id={`share-badge-btn-${b.id}`}
                    onClick={() => handleOpenShareModal(b)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-white/80 dark:bg-slate-800/80 text-emerald-600 hover:bg-emerald-500 hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
                    title={`Share ${b.title} Badge`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center font-bold ${
                  b.isUnlocked ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  <Medal className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">{b.title}</p>
                  <p className="text-[9px] text-slate-500 line-clamp-2 mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Citywide Leaderboard */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Citywide Citizen Leaderboard</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Updated live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2 px-3">Rank</th>
                <th className="py-2 px-3">Citizen</th>
                <th className="py-2 px-3">Scans</th>
                <th className="py-2 px-3">Reports</th>
                <th className="py-2 px-3 text-right">Eco Points</th>
                <th className="py-2 px-3 text-center">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((lb) => (
                <tr
                  key={lb.rank}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    lb.isCurrentUser ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold">
                    <span className={`px-2 py-0.5 rounded-md ${
                      lb.rank === 1 ? 'bg-amber-400 text-slate-950' : lb.rank === 2 ? 'bg-slate-300 text-slate-900' : lb.rank === 3 ? 'bg-amber-600 text-white' : 'text-slate-500'
                    }`}>
                      #{lb.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <img src={lb.avatar} alt={lb.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-slate-900 dark:text-white">{lb.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{lb.scansCount}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{lb.reportsCount}</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">{lb.points} pts</td>
                  <td className="py-3 px-3 text-center">
                    {lb.isCurrentUser ? (
                      <button
                        onClick={() => handleOpenShareModal()}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer"
                        title="Share your leaderboard position"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={user}
        badges={badges}
        initialSelectedBadge={selectedBadgeToShare}
      />

    </div>
  );
};
