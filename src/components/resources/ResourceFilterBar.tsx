"use client";

import React from "react";
import { ResourceCategory, ResourceCondition, ResourceStatus, SharingType } from "@/types";
import { ResourceFilterParams } from "@/lib/data-service";
import { Search, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";

interface ResourceFilterBarProps {
  filters: ResourceFilterParams;
  onChange: (filters: ResourceFilterParams) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalCount: number;
}

const CATEGORIES: { label: string; value: ResourceCategory | "all" }[] = [
  { label: "All Items", value: "all" },
  { label: "Books & Notes", value: "Books & Notes" },
  { label: "Electronics", value: "Electronics" },
  { label: "Lab Equipment", value: "Lab Equipment" },
  { label: "Sports & Fitness", value: "Sports & Fitness" },
  { label: "Stationery", value: "Stationery" },
  { label: "Decor & Events", value: "Decor & Events" },
];

export function ResourceFilterBar({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: ResourceFilterBarProps) {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, query: e.target.value });
  };

  const handleCategoryChange = (category: ResourceCategory | "all") => {
    onChange({ ...filters, category });
  };

  const handleClear = () => {
    onChange({
      query: "",
      category: "all",
      sharingType: "all",
      condition: "all",
      status: "all",
      sortBy: "newest",
    });
  };

  const isFiltered =
    Boolean(filters.query) ||
    filters.category !== "all" ||
    filters.sharingType !== "all" ||
    filters.condition !== "all" ||
    filters.status !== "all";

  return (
    <div className="space-y-4">
      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.query || ""}
            onChange={handleQueryChange}
            placeholder="Search textbooks, calculators, lab coats, badminton rackets..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-forest-900/15 dark:border-forest-800 bg-white dark:bg-[#12281e] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ ...filters, query: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Sorters */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <select
            value={filters.sortBy || "newest"}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-forest-900/15 dark:border-forest-800 bg-white dark:bg-[#12281e] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="popularity">Sort: Most Popular</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-xl border border-forest-900/15 dark:border-forest-800 bg-white dark:bg-[#12281e] p-1 shadow-sm">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-forest-900 text-white dark:bg-emerald-600"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-forest-900 text-white dark:bg-emerald-600"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = (filters.category || "all") === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-subtle ${
                isSelected
                  ? "bg-forest-900 text-white dark:bg-emerald-600 dark:text-white"
                  : "bg-white dark:bg-[#12281e] text-slate-700 dark:text-slate-300 hover:bg-forest-50 dark:hover:bg-forest-900/40 border border-forest-900/10 dark:border-forest-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filters:</span>
        </div>

        {/* Sharing Type Filter */}
        <select
          value={filters.sharingType || "all"}
          onChange={(e) => onChange({ ...filters, sharingType: e.target.value as any })}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#12281e] text-slate-700 dark:text-slate-300 shadow-sm"
        >
          <option value="all">Type: All Sharing Modes</option>
          <option value="lend">Lend Temporarily</option>
          <option value="donate">Giveaway (Free)</option>
          <option value="exchange">Exchange / Swap</option>
          <option value="request">Seeking / Request</option>
        </select>

        {/* Condition Filter */}
        <select
          value={filters.condition || "all"}
          onChange={(e) => onChange({ ...filters, condition: e.target.value as any })}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#12281e] text-slate-700 dark:text-slate-300 shadow-sm"
        >
          <option value="all">Condition: Any</option>
          <option value="new">Brand New</option>
          <option value="like_new">Like New</option>
          <option value="good">Good Condition</option>
          <option value="usable">Usable</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status || "all"}
          onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-forest-800 bg-white dark:bg-[#12281e] text-slate-700 dark:text-slate-300 shadow-sm"
        >
          <option value="all">Status: All</option>
          <option value="available">Available Now</option>
          <option value="borrowed">Currently Borrowed</option>
          <option value="reserved">Reserved</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        {/* Total count indicator */}
        <div className="ml-auto text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{totalCount}</span> items
        </div>
      </div>
    </div>
  );
}
