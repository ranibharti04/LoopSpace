"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MatchResult } from "@/types";
import { formatDate, getSharingTypeBadge } from "@/lib/utils";
import { CheckCircle2, MapPin, Calendar, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { RequestModal } from "../resources/RequestModal";

interface MatchResultCardProps {
  result: MatchResult;
}

export function MatchResultCard({ result }: MatchResultCardProps) {
  const { resource, score, tier, breakdown } = result;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const typeBadge = getSharingTypeBadge(resource.sharing_type);

  const getTierColor = () => {
    switch (tier) {
      case "Excellent Match":
        return "bg-emerald-500 text-white shadow-emerald-500/20";
      case "Good Match":
        return "bg-teal-600 text-white shadow-teal-600/20";
      case "Possible Match":
        return "bg-amber-600 text-white shadow-amber-600/20";
    }
  };

  return (
    <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/15 dark:border-forest-800 shadow-card hover:shadow-elevated transition-all duration-300 p-5 space-y-4">
      {/* Top Banner: Score & Tier */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-forest-800">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getTierColor()}`}>
            {tier}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {score}% Compatibility Score
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-32 bg-slate-100 dark:bg-forest-950 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-teal-500" : "bg-amber-500"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Resource Main Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-forest-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resource.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {resource.category}
            </span>
          </div>

          <Link href={`/resources/${resource.id}`}>
            <h4 className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-lime-400 transition-colors line-clamp-1">
              {resource.title}
            </h4>
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[200px]">{resource.pickup_location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available {formatDate(resource.available_from)} - {formatDate(resource.available_until)}</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto shrink-0 flex gap-2">
          <button
            onClick={() => setRequestModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
          >
            <span>Request Match</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transparent Match Reasons Collapsible */}
      <div className="pt-2">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-500" />
          <span>{showBreakdown ? "Hide Match Scoring Breakdown" : "Why did this match? (Transparent Scoring)"}</span>
          {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showBreakdown && (
          <div className="mt-3 p-3.5 rounded-xl bg-forest-50/70 dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800 space-y-2 animate-in fade-in text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Scoring Factors Breakdown (Max 100 pts):
            </p>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              {breakdown.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {requestModalOpen && (
        <RequestModal resource={resource} onClose={() => setRequestModalOpen(false)} />
      )}
    </div>
  );
}
