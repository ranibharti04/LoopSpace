"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Resource } from "@/types";
import { getResources, ResourceFilterParams } from "@/lib/data-service";
import { ResourceFilterBar } from "@/components/resources/ResourceFilterBar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { SearchX, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialQuery = searchParams.get("query");

  const [filters, setFilters] = useState<ResourceFilterParams>({
    query: initialQuery || "",
    category: (initialCategory as any) || "all",
    sharingType: "all",
    condition: "all",
    status: "all",
    sortBy: "newest",
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    async function fetchFiltered() {
      setIsLoading(true);
      const data = await getResources(filters);
      setResources(data);
      setIsLoading(false);
    }
    fetchFiltered();
  }, [filters]);

  const displayedResources = resources.slice(0, visibleCount);
  const hasMore = visibleCount < resources.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Campus Resources
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse active textbooks, calculators, equipment, and event supplies available for reuse.
          </p>
        </div>

        <Link
          href="/resources/create"
          className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Your Resource</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <ResourceFilterBar
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={resources.length}
      />

      {/* Results Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#12281e] rounded-2xl border border-slate-200 dark:border-forest-800 p-4 h-72 animate-pulse flex flex-col justify-between"
            >
              <div className="w-full h-36 bg-slate-200 dark:bg-forest-900 rounded-xl" />
              <div className="space-y-2 pt-3">
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-forest-900 rounded" />
                <div className="w-1/2 h-3 bg-slate-200 dark:bg-forest-900 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#12281e] rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-forest-50 dark:bg-forest-900/60 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No matching resources found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We couldn&apos;t find any items matching your selected criteria. Try relaxing your filters or use our Need Matcher to post a request to peers!
          </p>
          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() =>
                setFilters({
                  query: "",
                  category: "all",
                  sharingType: "all",
                  condition: "all",
                  status: "all",
                  sortBy: "newest",
                })
              }
              className="px-4 py-2 border border-slate-200 dark:border-forest-700 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-forest-900/40 text-slate-700 dark:text-slate-300"
            >
              Reset Filters
            </button>
            <Link
              href="/match"
              className="px-4 py-2 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Try Need–Offer Matcher</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {displayedResources.map((res) => (
              <ResourceCard key={res.id} resource={res} viewMode={viewMode} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-6 py-2.5 border border-forest-900/20 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-900/40 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors shadow-subtle"
              >
                Load More Resources ({resources.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
          <div className="w-48 h-8 bg-slate-200 dark:bg-forest-900 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-forest-900 rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
