import React, { useState } from 'react';
import { AppNotification } from '../types';
import {
  Bell,
  X,
  CheckCheck,
  Truck,
  Flame,
  ThumbsUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Zap,
  Trash2
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onNavigate
}) => {
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'bin_collected' | 'challenge_expiring'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'bin_collected') return n.type === 'bin_collected';
    if (filterType === 'challenge_expiring') return n.type === 'challenge_expiring';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkRead(notif.id);
    if (notif.actionTab) {
      onNavigate(notif.actionTab);
      onClose();
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'bin_collected':
        return (
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Truck className="w-5 h-5 text-emerald-400" />
          </div>
        );
      case 'challenge_expiring':
        return (
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 animate-pulse">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
        );
      case 'report_upvoted':
        return (
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
            <ThumbsUp className="w-5 h-5 text-blue-400" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <AlertCircle className="w-5 h-5 text-purple-400" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="relative p-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-md">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Citizen Alert System
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-[10px] text-emerald-300 font-bold">
                  {unreadCount} Unread Notifications
                </span>
              </div>
              <h3 className="text-lg font-black text-white">Citizen Activity Alerts</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold flex items-center space-x-1 transition-all cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All Alerts ({notifications.length})
          </button>

          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1 ${
              filterType === 'unread'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterType('bin_collected')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1 ${
              filterType === 'bin_collected'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bin Collections</span>
          </button>

          <button
            onClick={() => setFilterType('challenge_expiring')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1 ${
              filterType === 'challenge_expiring'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Expiring Challenges</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications found</p>
              <p className="text-xs text-slate-400">You're all caught up with your citizen waste alerts!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start space-x-3.5 ${
                  !notif.read
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                {getNotificationIcon(notif.type)}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{notif.timestamp}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {notif.message}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Take Action</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>

                    {notif.binCode && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-[10px]">
                        Bin: {notif.binCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">WasteSense AI Automated Citizen Dispatch System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 cursor-pointer"
          >
            Close Alerts
          </button>
        </div>

      </div>
    </div>
  );
};
