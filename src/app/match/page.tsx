"use client";

import React, { useEffect, useState } from "react";
import { MatchCriteria, MatchResult, Resource } from "@/types";
import { getResources } from "@/lib/data-service";
import { findMatchingResources } from "@/lib/matching-engine";
import { MatchingEngineForm } from "@/components/matching/MatchingEngineForm";
import { MatchResultCard } from "@/components/matching/MatchResultCard";
import { Sparkles, ShieldCheck, SearchCheck, CheckCircle2 } from "lucide-react";

export default function MatchingPage() {
  const [candidateResources, setCandidateResources] = useState<Resource[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isComputing, setIsComputing] = useState(false);

  useEffect(() => {
    async function loadCandidates() {
      const all = await getResources();
      setCandidateResources(all);

      // Run an initial default demo match for instant exploration
      const initialMatches = findMatchingResources(all, {
        targetKeywords: ["calculator", "graphing", "math", "calculus"],
        targetCategory: "Electronics",
      });
      setResults(initialMatches);
      setHasSearched(true);
    }
    loadCandidates();
  }, []);

  const handleSearch = (criteria: MatchCriteria) => {
    setIsComputing(true);
    setHasSearched(true);

    // Simulate snappy deterministic computation
    setTimeout(() => {
      const matched = findMatchingResources(candidateResources, criteria, 25);
      setResults(matched);
      setIsComputing(false);
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-900/5 dark:bg-forest-900/60 border border-forest-900/15 dark:border-forest-700 text-forest-900 dark:text-emerald-300 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
          <span>Zero-Cost Campus Circular Matching</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Need–Offer Matching Engine
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Post what you need for class, project, or campus life. Our transparent multi-attribute algorithm evaluates category, descriptions, dates, and campus pickup spots to surface the best available matches.
        </p>
      </div>

      {/* Interactive Criteria Form */}
      <MatchingEngineForm onSearch={handleSearch} isLoading={isComputing} />

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-forest-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Computed Matches ({results.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by overall multi-attribute compatibility score (max 100%)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Deterministic & Transparent Scoring</span>
          </div>
        </div>

        {results.length === 0 && hasSearched ? (
          <div className="text-center py-12 bg-white dark:bg-[#12281e] rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-8 space-y-3 max-w-md mx-auto">
            <SearchCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No High-Confidence Matches Found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try broadening your keywords or removing specific date bounds to discover more candidate listings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((res) => (
              <MatchResultCard key={res.resource.id} result={res} />
            ))}
          </div>
        )}
      </div>

      {/* Transparency Note */}
      <div className="bg-forest-50/70 dark:bg-forest-900/30 rounded-2xl p-5 border border-forest-900/10 dark:border-forest-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>How Matching Scores Are Calculated:</span>
        </p>
        <p className="leading-relaxed">
          Each candidate resource is scored out of 100 points: Category Match (35 pts), Title & Keyword Semantic Overlap (30 pts), Availability Window Alignment (15 pts), Condition Compatibility (10 pts), and Campus Zone Proximity (10 pts). Results scoring 75+ earn the <strong>Excellent Match</strong> tier, 50-74 earn <strong>Good Match</strong>, and 25-49 earn <strong>Possible Match</strong>.
        </p>
      </div>
    </div>
  );
}
