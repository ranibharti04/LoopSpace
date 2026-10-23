"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/data-service";
import { Notification } from "@/types";
import { formatDate } from "@/lib/utils";
import { Bell, CheckCheck, ExternalLink, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setIsLoading(true);
      const notifs = await getUserNotifications(user.id);
      setNotifications(notifs);
      setIsLoading(false);
    }
    load();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-forest-800">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-forest-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            <span>In-App Notifications</span>
          </h1>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="self-start sm:self-auto px-3.5 py-1.5 border border-slate-200 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-900/40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#12281e] rounded-3xl border border-slate-200 dark:border-forest-800 p-6 space-y-2 text-slate-500 text-xs">
            <Bell className="w-8 h-8 mx-auto text-slate-400" />
            <p>No new notifications right now. Activity on your listings will appear here!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !n.is_read
                  ? "bg-white dark:bg-[#12281e] border-emerald-500/40 shadow-subtle"
                  : "bg-slate-50/60 dark:bg-forest-950/30 border-slate-100 dark:border-forest-900 opacity-75"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  {formatDate(n.created_at)}
                </span>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="px-3 py-1.5 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
