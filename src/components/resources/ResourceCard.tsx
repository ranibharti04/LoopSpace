"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Resource } from "@/types";
import { formatDate, getSharingTypeBadge, getStatusBadge } from "@/lib/utils";
import { MapPin, Calendar, Eye, ArrowRight, Sparkles, User } from "lucide-react";
import { RequestModal } from "./RequestModal";

interface ResourceCardProps {
  resource: Resource;
  viewMode?: "grid" | "list";
}

export function ResourceCard({ resource, viewMode = "grid" }: ResourceCardProps) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const typeBadge = getSharingTypeBadge(resource.sharing_type);
  const statusBadge = getStatusBadge(resource.status);

  const fallbackImage =
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";
  const displayImage = resource.images && resource.images.length > 0 ? resource.images[0] : fallbackImage;

  if (viewMode === "list") {
    return (
      <div className="group bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle hover:shadow-card transition-all duration-300 p-4 flex flex-col md:flex-row gap-5 items-start md:items-center">
        {/* Thumbnail */}
        <div className="relative w-full md:w-48 h-40 md:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-forest-900/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {resource.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300 capitalize">
              Condition: {resource.condition.replace("_", " ")}
            </span>
            <span className="text-slate-400">•</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
          </div>

          <Link href={`/resources/${resource.id}`} className="block">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
              {resource.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px]">{resource.pickup_location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Available: {formatDate(resource.available_from)} - {formatDate(resource.available_until)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{resource.views_count} views</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full md:w-auto shrink-0 flex md:flex-col gap-2 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-forest-800">
          <Link
            href={`/resources/${resource.id}`}
            className="flex-1 md:flex-initial text-center px-4 py-2 border border-forest-900/15 dark:border-forest-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-forest-50 dark:hover:bg-forest-900/40 transition-colors"
          >
            Details
          </Link>
          {resource.status === "available" && (
            <button
              onClick={() => setRequestModalOpen(true)}
              className="flex-1 md:flex-initial px-4 py-2 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1"
            >
              <span>Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {requestModalOpen && (
          <RequestModal resource={resource} onClose={() => setRequestModalOpen(false)} />
        )}
      </div>
    );
  }

  // Grid Card View
  return (
    <div className="group bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Banner */}
      <div className="relative w-full h-48 bg-slate-100 dark:bg-forest-900/60 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${typeBadge.color}`}>
            {typeBadge.label}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{resource.views_count}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {resource.category}
            </span>
            <span className="capitalize font-medium">
              {resource.condition.replace("_", " ")}
            </span>
          </div>

          <Link href={`/resources/${resource.id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
              {resource.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-forest-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{resource.pickup_location}</span>
          </div>

          {/* Owner details */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-900 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                {resource.owner?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resource.owner.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {resource.owner?.full_name || "Campus Peer"}
              </span>
            </div>

            {resource.status === "available" ? (
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-3 py-1.5 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
              >
                <span>Request</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <Link
                href={`/resources/${resource.id}`}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-forest-900 dark:hover:text-white font-medium text-xs"
              >
                View
              </Link>
            )}
          </div>
        </div>
      </div>

      {requestModalOpen && (
        <RequestModal resource={resource} onClose={() => setRequestModalOpen(false)} />
      )}
    </div>
  );
}
