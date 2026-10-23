"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getImpactOverview } from "@/lib/data-service";
import { BADGE_DEFINITIONS, POINT_RULES } from "@/lib/impact-engine";
import { formatDate } from "@/lib/utils";
import {
  Sparkles,
  Trophy,
  Award,
  Leaf,
  DollarSign,
  Repeat,
  HeartHandshake,
  Recycle,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { ImpactBadge, ImpactTransaction, Profile } from "@/types";

export default function ImpactPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    userPoints: number;
    badges: ImpactBadge[];
    transactions: ImpactTransaction[];
    leaderboard: Profile[];
    platformStats: { totalCo2Kg: number; totalMoneySaved: number; totalShared: number };
  } | null>(null);

  useEffect(() => {
    async function load() {
      const overview = await getImpactOverview(user?.id);
      setData(overview);
    }
    load();
  }, [user]);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return Sparkles;
      case "HeartHandshake": return HeartHandshake;
      case "Recycle": return Recycle;
      case "Trophy": return Trophy;
      default: return Award;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-lime-100 dark:bg-forest-900 text-forest-900 dark:text-lime-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
          <span>Loop Impact Gamification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Campus Circular Impact
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Celebrate reuse. Earn points whenever you lend, donate, or exchange items with peers, and unlock campus circular economy badges.
        </p>
      </div>

      {/* User Impact Summary Card */}
      <div className="bg-forest-900 text-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-forest-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <Trophy className="w-8 h-8 text-lime-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                My Contribution
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user?.full_name || "Campus Student"}
              </h2>
              <p className="text-xs text-slate-300">
                {user?.department || "State University"}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-4xl sm:text-5xl font-black text-lime-400 tracking-tight">
              {data?.userPoints || 0}
            </div>
            <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
              Loop Impact Points
            </span>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              {data?.transactions.length || 0}
            </p>
            <p className="text-xs text-emerald-300 font-medium">Verified Exchanges Completed</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              ~{data?.transactions.reduce((acc, t) => acc + t.co2_saved_kg, 0).toFixed(1) || 0} kg
            </p>
            <p className="text-xs text-emerald-300 font-medium">Estimated CO2 Emissions Avoided</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              ${data?.transactions.reduce((acc, t) => acc + t.money_saved_estimate, 0) || 0}
            </p>
            <p className="text-xs text-emerald-300 font-medium">Estimated Student Dollars Saved</p>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Achievement Badges
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Milestones earned through verified campus sharing activities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.badges.map((badge) => {
            const Icon = getBadgeIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  badge.unlocked
                    ? "bg-white dark:bg-[#12281e] border-emerald-500/40 shadow-card"
                    : "bg-slate-50 dark:bg-forest-950/40 border-slate-200 dark:border-forest-900 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      badge.unlocked
                        ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-200 dark:bg-forest-900 text-slate-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-forest-900 text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{badge.minPoints} pts</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column: Leaderboard & Activity History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Community Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#12281e] p-6 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-forest-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Campus Leaderboard</span>
              </h3>
              <p className="text-xs text-slate-400">Top student resource champions</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              Fall 2026
            </span>
          </div>

          <div className="space-y-3">
            {data?.leaderboard.map((item, index) => {
              const isCurrentUser = user && item.id === user.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isCurrentUser
                      ? "bg-forest-100/70 dark:bg-forest-900/50 border border-forest-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-forest-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center text-xs font-bold ${
                        index === 0
                          ? "text-amber-500"
                          : index === 1
                          ? "text-slate-400"
                          : index === 2
                          ? "text-amber-700"
                          : "text-slate-400"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.avatar_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.full_name} {isCurrentUser && "(You)"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{item.department}</p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                    {item.impact_points} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Personal Contribution History (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12281e] p-6 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-forest-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Impact History
            </h3>
            <p className="text-xs text-slate-400">
              Verified transactions recorded in your circular profile
            </p>
          </div>

          {data?.transactions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No transactions recorded yet. Complete your first loan or donation to earn points!
            </p>
          ) : (
            <div className="space-y-3">
              {data?.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-forest-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{formatDate(tx.created_at)}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        ~{tx.co2_saved_kg} kg CO2 avoided
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-emerald-700 dark:text-lime-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                    +{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transparent Methodology Explainer */}
      <div className="bg-slate-50 dark:bg-forest-900/30 rounded-2xl p-6 border border-slate-200 dark:border-forest-800 space-y-3 text-xs text-slate-600 dark:text-slate-300">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Point Rules & Carbon Benchmark Methodology</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {Object.entries(POINT_RULES).map(([key, rule]) => (
            <div key={key} className="p-3 bg-white dark:bg-[#0c1f17] rounded-xl border border-slate-200 dark:border-forest-700">
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-lime-400">
                +{rule.points} Points
              </span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{rule.label}</p>
              <p className="text-[11px] text-slate-400 mt-1">{rule.description}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
          <strong>Defensible Methodology:</strong> Carbon savings (kg CO2) and financial savings ($) are derived from EPA paper lifecycle averages for textbooks (~2.7 kg CO2 / $45) and consumer electronics manufacturing data for graphing calculators and microcontrollers (~14 kg CO2 / $70). All values are transparently estimated to illustrate campus circular benefits.
        </p>
      </div>
    </div>
  );
}
