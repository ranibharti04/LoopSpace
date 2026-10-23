"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getResources, getUserRequests, deleteResource } from "@/lib/data-service";
import { Resource, ResourceRequest } from "@/types";
import { RequestsWorkflowManager } from "@/components/dashboard/RequestsWorkflowManager";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import {
  Package,
  Inbox,
  Send,
  Sparkles,
  Clock,
  ArrowRight,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Trash2,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "listings">("received");
  const [myListings, setMyListings] = useState<Resource[]>([]);
  const [sentRequests, setSentRequests] = useState<ResourceRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ResourceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setIsLoading(true);

      const allResources = await getResources();
      const userListings = allResources.filter((r) => r.owner_id === user.id);
      setMyListings(userListings);

      const reqs = await getUserRequests(user.id);
      setSentRequests(reqs.sent);
      setReceivedRequests(reqs.received);

      setIsLoading(false);
    }
    loadDashboard();
  }, [user]);

  const handleDeleteListing = async (id: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to delete this resource listing?")) {
      await deleteResource(id, user.id);
      setMyListings((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const completedCount =
    sentRequests.filter((r) => r.status === "completed").length +
    receivedRequests.filter((r) => r.status === "completed").length;

  const borrowedCount = sentRequests.filter(
    (r) => r.status === "borrowed" || r.status === "return_requested"
  ).length;

  const lendingCount = receivedRequests.filter(
    (r) => r.status === "borrowed" || r.status === "return_requested"
  ).length;

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Personal Sharing Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-bold text-slate-800 dark:text-slate-200">{user?.full_name}</span>. Manage your campus exchanges and track returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/match"
            className="px-4 py-2 border border-forest-900/15 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-900/40 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
            <span>Need Matcher</span>
          </Link>

          <Link
            href="/resources/create"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Item</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-[#12281e] p-4 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Active Listings
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {myListings.length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-4 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Requests Received
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{receivedRequests.length}</span>
            {pendingReceivedCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                {pendingReceivedCount} new
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-4 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Requests Sent
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {sentRequests.length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-4 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Completed Loops
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-lime-400">
            {completedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-4 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Currently Borrowed
          </span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {borrowedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-4 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Currently Lending
          </span>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {lendingCount}
          </div>
        </div>
      </div>

      {/* Pending Actions Alert Banner if any pending requests */}
      {pendingReceivedCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-medium">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              You have <strong>{pendingReceivedCount}</strong> pending request(s) awaiting your approval.
            </span>
          </div>
          <button
            onClick={() => setActiveTab("received")}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm self-start sm:self-auto"
          >
            Review Requests
          </button>
        </div>
      )}

      {/* Recharts Analytics Overview */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Platform Activity & Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly completed shares and resource categories
          </p>
        </div>
        <OverviewCharts />
      </div>

      {/* Main Workflow Tabs Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-forest-800 pb-3">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "received"
                ? "bg-forest-900 text-white dark:bg-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-forest-900/40"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Requests Received ({receivedRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "sent"
                ? "bg-forest-900 text-white dark:bg-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-forest-900/40"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Requests Sent ({sentRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "listings"
                ? "bg-forest-900 text-white dark:bg-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-forest-900/40"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>
        </div>

        {/* Tab 1: Requests Received */}
        {activeTab === "received" && (
          <div className="space-y-4">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#12281e] rounded-2xl border border-slate-200 dark:border-forest-800 p-6 text-xs text-slate-500">
                You haven&apos;t received any requests yet. Listed resources will appear here when peers request them.
              </div>
            ) : (
              receivedRequests.map((req) => (
                <RequestsWorkflowManager
                  key={req.id}
                  request={req}
                  currentUserId={user?.id || ""}
                  onStatusUpdated={(updated) => {
                    setReceivedRequests((prev) =>
                      prev.map((r) => (r.id === updated.id ? updated : r))
                    );
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* Tab 2: Requests Sent */}
        {activeTab === "sent" && (
          <div className="space-y-4">
            {sentRequests.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#12281e] rounded-2xl border border-slate-200 dark:border-forest-800 p-6 text-xs text-slate-500">
                You haven&apos;t submitted any requests yet. Browse resources or use the Need Matcher to find items!
              </div>
            ) : (
              sentRequests.map((req) => (
                <RequestsWorkflowManager
                  key={req.id}
                  request={req}
                  currentUserId={user?.id || ""}
                  onStatusUpdated={(updated) => {
                    setSentRequests((prev) =>
                      prev.map((r) => (r.id === updated.id ? updated : r))
                    );
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* Tab 3: My Listings */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {myListings.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#12281e] rounded-2xl border border-slate-200 dark:border-forest-800 p-6 space-y-3">
                <p className="text-xs text-slate-500">You haven&apos;t created any listings yet.</p>
                <Link
                  href="/resources/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Your First Listing</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myListings.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 p-4 flex gap-4 items-center justify-between shadow-subtle"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={res.images?.[0] || ""} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/resources/${res.id}`} className="hover:underline">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {res.title}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-slate-500">{res.category} • {res.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/resources/${res.id}`}
                        className="p-2 text-slate-500 hover:text-forest-900 dark:hover:text-white rounded-lg"
                        title="View listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(res.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
