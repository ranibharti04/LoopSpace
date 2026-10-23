"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Resource } from "@/types";
import { getResourceById, getResources } from "@/lib/data-service";
import { formatDate, getSharingTypeBadge, getStatusBadge } from "@/lib/utils";
import { RequestModal } from "@/components/resources/RequestModal";
import { ResourceCard } from "@/components/resources/ResourceCard";
import {
  MapPin,
  Calendar,
  Eye,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  Flag,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function ResourceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();

  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const item = await getResourceById(id);
      if (item) {
        setResource(item);
        const related = await getResources({ category: item.category });
        setRelatedResources(related.filter((r) => r.id !== item.id).slice(0, 3));
      }
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="w-32 h-6 bg-slate-200 dark:bg-forest-900 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-forest-900 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-forest-900 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-forest-900 rounded w-1/2" />
            <div className="h-24 bg-slate-200 dark:bg-forest-900 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resource Not Found</h2>
        <p className="text-xs text-slate-500">The listing you requested may have been removed or completed.</p>
        <Link
          href="/explore"
          className="inline-flex px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  const typeBadge = getSharingTypeBadge(resource.sharing_type);
  const statusBadge = getStatusBadge(resource.status);
  const isOwner = user && user.id === resource.owner_id;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
      setReportReason("");
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-forest-900 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 dark:bg-forest-900/60 border border-forest-900/10 dark:border-forest-800 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                resource.images && resource.images[activeImageIndex]
                  ? resource.images[activeImageIndex]
                  : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
              }
              alt={resource.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${typeBadge.color}`}>
                {typeBadge.label}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {resource.images && resource.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {resource.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === i
                      ? "border-emerald-600 scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Listing Details & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                {resource.category}
              </span>
              <span className="text-slate-400">•</span>
              <span className="capitalize text-slate-600 dark:text-slate-300 font-medium">
                Condition: {resource.condition.replace("_", " ")}
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>{resource.views_count} views</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {resource.title}
            </h1>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-[#12281e] rounded-2xl p-5 border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Item Overview
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {resource.description}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle flex items-start gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Campus Pickup Spot</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{resource.pickup_location}</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle flex items-start gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Availability Window</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatDate(resource.available_from)} - {formatDate(resource.available_until)}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="p-4 bg-forest-50/70 dark:bg-forest-900/30 rounded-2xl border border-forest-900/10 dark:border-forest-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                {resource.owner?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resource.owner.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {resource.owner?.full_name || "Campus Peer"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {resource.owner?.department || "Student Member"} • {resource.owner?.college_name || "University"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-lime-400 bg-white dark:bg-forest-900 px-2.5 py-1 rounded-full border border-forest-900/10 dark:border-forest-700 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                <span>{resource.owner?.impact_points || 0} pts</span>
              </span>
            </div>
          </div>

          {/* Main Action Bar */}
          <div className="space-y-3 pt-2">
            {resource.status === "available" ? (
              <button
                onClick={() => setRequestModalOpen(true)}
                className="w-full py-3.5 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Request Resource from Owner</span>
              </button>
            ) : (
              <div className="p-3.5 bg-slate-100 dark:bg-forest-900/60 rounded-2xl text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                This item is currently {resource.status}. Check back later or post your need on the Matcher!
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                onClick={() => setReportModalOpen(true)}
                className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report this listing</span>
              </button>
              <span>Listed {formatDate(resource.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Resources Carousel */}
      {relatedResources.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-forest-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Similar in {resource.category}
            </h3>
            <Link
              href={`/explore?category=${encodeURIComponent(resource.category)}`}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedResources.map((rel) => (
              <ResourceCard key={rel.id} resource={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Request Modal */}
      {requestModalOpen && (
        <RequestModal
          resource={resource}
          onClose={() => setRequestModalOpen(false)}
          onSuccess={() => {
            // Reload resource
            getResourceById(resource.id).then((r) => r && setResource(r));
          }}
        />
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#12281e] w-full max-w-md rounded-2xl p-6 space-y-4 shadow-elevated border border-slate-200 dark:border-forest-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Report Resource Listing</span>
            </h3>
            {reportSuccess ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you. Your report has been submitted to campus moderators.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please let us know why this item violates platform sharing guidelines:
                </p>
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g. Prohibited academic material, incorrect description, unavailable item..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-1.5 border rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
