"use client";

import React, { useState } from "react";
import { MatchCriteria, ResourceCategory, ResourceCondition } from "@/types";
import { extractKeywords } from "@/lib/matching-engine";
import { Search, Sparkles, MapPin, Calendar, HelpCircle } from "lucide-react";

interface MatchingEngineFormProps {
  onSearch: (criteria: MatchCriteria) => void;
  isLoading?: boolean;
}

const PRESET_QUERIES = [
  { label: "Graphing Calculator", text: "TI-84 Graphing Calculator for Calculus", cat: "Electronics" },
  { label: "Algorithms Textbook", text: "Introduction to Algorithms CLRS CS301", cat: "Books & Notes" },
  { label: "Lab Safety Kit", text: "Cotton Lab Coat & Splash Goggles", cat: "Lab Equipment" },
  { label: "Arduino IoT Board", text: "Arduino Uno starter kit with breadboard", cat: "Electronics" },
];

export function MatchingEngineForm({ onSearch, isLoading }: MatchingEngineFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [neededFrom, setNeededFrom] = useState("");
  const [neededUntil, setNeededUntil] = useState("");
  const [preferredCondition, setPreferredCondition] = useState<ResourceCondition | "">("");
  const [campusLocation, setCampusLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = extractKeywords(description);
    onSearch({
      targetCategory: category || undefined,
      targetKeywords: keywords.length > 0 ? keywords : ["resource"],
      requestedFrom: neededFrom || undefined,
      requestedUntil: neededUntil || undefined,
      preferredCondition: (preferredCondition as ResourceCondition) || undefined,
      campusLocation: campusLocation || undefined,
    });
  };

  const applyPreset = (preset: typeof PRESET_QUERIES[0]) => {
    setDescription(preset.text);
    setCategory(preset.cat);
    const keywords = extractKeywords(preset.text);
    onSearch({
      targetCategory: preset.cat,
      targetKeywords: keywords,
      requestedFrom: neededFrom || undefined,
      requestedUntil: neededUntil || undefined,
      preferredCondition: (preferredCondition as ResourceCondition) || undefined,
      campusLocation: campusLocation || undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-[#12281e] rounded-3xl border border-forest-900/15 dark:border-forest-800 shadow-elevated p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-100 dark:bg-forest-900 text-forest-900 dark:text-lime-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
          <span>Rule-Based Match Engine</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Post or Search a Need — Find Matches Instantly
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          Enter what you need for your courses, lab, or campus activities. Our transparent algorithm scores candidate listings across category, title, availability window, and campus zone.
        </p>
      </div>

      {/* Preset quick test chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Try sample student needs:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 bg-forest-50 dark:bg-forest-900/40 hover:bg-forest-100 dark:hover:bg-forest-900 text-forest-900 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-forest-900/10 dark:border-forest-800 transition-colors"
            >
              + {p.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main query description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Describe What You Need <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Graphing calculator for multivariable calculus midterm or CLRS algorithms book..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-forest-900/15 dark:border-forest-800 bg-slate-50/50 dark:bg-[#0c1f17] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-subtle"
            />
          </div>
        </div>

        {/* 4-Column Criteria Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#0c1f17] text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Any Category</option>
              <option value="Books & Notes">Books & Notes</option>
              <option value="Electronics">Electronics</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Stationery">Stationery</option>
              <option value="Decor & Events">Decor & Events</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campus Pickup Zone
            </label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                placeholder="e.g. Library, Quad"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#0c1f17] text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Needed From */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Needed From
            </label>
            <input
              type="date"
              value={neededFrom}
              onChange={(e) => setNeededFrom(e.target.value)}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#0c1f17] text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Needed Until */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Return Expected By
            </label>
            <input
              type="date"
              value={neededUntil}
              onChange={(e) => setNeededUntil(e.target.value)}
              className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#0c1f17] text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>{isLoading ? "Analyzing Matches..." : "Compute Campus Matches"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
