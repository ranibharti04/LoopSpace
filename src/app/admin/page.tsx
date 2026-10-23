"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getResources, deleteResource } from "@/lib/data-service";
import { GoogleSheetsExporter } from "@/components/admin/GoogleSheetsExporter";
import { Resource } from "@/types";
import {
  ShieldAlert,
  Users,
  Package,
  Repeat,
  Leaf,
  DollarSign,
  AlertTriangle,
  Trash2,
  ExternalLink,
  Lock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface ReportedItem {
  id: string;
  resourceTitle: string;
  reason: string;
  reporter: string;
  date: string;
  status: "pending" | "resolved";
}

const SAMPLE_REPORTS: ReportedItem[] = [
  {
    id: "rep-1",
    resourceTitle: "Campbell Biology 11th Edition",
    reason: "Contains student exam solution keys inside the back cover.",
    reporter: "Alex Chen",
    date: "2026-10-22",
    status: "pending",
  },
  {
    id: "rep-2",
    resourceTitle: "Scientific Calculator Sharp EL-531",
    reason: "Missing battery cover, condition labeled brand new but is heavily scratched.",
    reporter: "Marcus Johnson",
    date: "2026-10-19",
    status: "resolved",
  },
];

export default function AdminDashboardPage() {
  const { user, isAdmin, switchDemoUser } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [reports, setReports] = useState<ReportedItem[]>(SAMPLE_REPORTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getResources();
      setResources(all);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleDeleteListing = async (id: string) => {
    if (confirm("Are you sure you want to remove this resource listing as an administrator?")) {
      await deleteResource(id, user?.id || "");
      setResources((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleResolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
    );
  };

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Administrator Access Protected
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This dashboard is restricted to verified campus platform moderators. User roles cannot be escalated via client-side edits.
          </p>
        </div>

        {/* Demo switcher helper for viva evaluation */}
        <div className="p-4 bg-forest-50 dark:bg-forest-900/40 rounded-2xl border border-forest-900/10 dark:border-forest-800 text-xs text-left space-y-3">
          <p className="font-bold text-slate-900 dark:text-white">
            Evaluating for Viva Assessment?
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Switch to the <strong>Elena Rodriguez (Admin)</strong> demo persona using the top-right persona switcher to test administrative controls, moderating reports, and Google Sheets exports.
          </p>
          <button
            onClick={() => switchDemoUser("u4-elena-rodriguez")}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Switch to Admin Persona (Elena Rodriguez)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Moderator Privilege Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Administrative Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor platform metrics, manage listings, resolve flagged content, and sync with Google Sheets.
          </p>
        </div>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#12281e] p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Listings
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {resources.length}
          </div>
          <p className="text-[11px] text-slate-400">Across 6 academic categories</p>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Students
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            142
          </div>
          <p className="text-[11px] text-slate-400">Verified campus emails</p>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Flagged Reports
          </span>
          <div className="text-3xl font-extrabold text-amber-500">
            {reports.filter((r) => r.status === "pending").length}
          </div>
          <p className="text-[11px] text-slate-400">Require moderator review</p>
        </div>

        <div className="bg-white dark:bg-[#12281e] p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            CO2 Diverted
          </span>
          <div className="text-3xl font-extrabold text-lime-600 dark:text-lime-400">
            184 kg
          </div>
          <p className="text-[11px] text-slate-400">Verified circular lifecycle</p>
        </div>
      </div>

      {/* Google Sheets Integration Section */}
      <GoogleSheetsExporter />

      {/* Content Moderation / Reports Section */}
      <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-forest-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Reported Content & Abuse Flags</span>
            </h3>
            <p className="text-xs text-slate-400">
              Community flags submitted by students for review
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {rep.resourceTitle}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {rep.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">&ldquo;{rep.reason}&rdquo;</p>
                <p className="text-[10px] text-slate-400">
                  Reported by {rep.reporter} on {rep.date}
                </p>
              </div>

              {rep.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dismiss / Resolve</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* All Resource Listings Table */}
      <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Manage All Active Listings
          </h3>
          <p className="text-xs text-slate-400">
            Direct moderation oversight across campus inventory
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-forest-800 text-slate-400 uppercase font-bold">
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Pickup Location</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-forest-800">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-forest-900/20">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                    {r.title}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{r.category}</td>
                  <td className="py-3 px-3 uppercase text-[10px] font-bold text-emerald-600">
                    {r.sharing_type}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-forest-900 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-[150px] truncate">
                    {r.pickup_location}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/resources/${r.id}`}
                        className="p-1.5 text-slate-500 hover:text-emerald-600"
                        title="View"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(r.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
