"use client";

import React, { useState } from "react";
import { Resource } from "@/types";
import { useAuth } from "@/context/auth-context";
import { createResourceRequest } from "@/lib/data-service";
import { formatDate } from "@/lib/utils";
import { X, Calendar, AlertCircle, CheckCircle2, Clock, Send } from "lucide-react";
import Link from "next/link";

interface RequestModalProps {
  resource: Resource;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RequestModal({ resource, onClose, onSuccess }: RequestModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [neededFrom, setNeededFrom] = useState(resource.available_from || "");
  const [neededUntil, setNeededUntil] = useState(resource.available_until || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isOwner = user && user.id === resource.owner_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please sign in or switch to a demo persona to submit a request.");
      return;
    }

    if (isOwner) {
      setError("You cannot submit a request for your own listed resource.");
      return;
    }

    if (neededFrom && neededUntil && new Date(neededUntil) < new Date(neededFrom)) {
      setError("The return date cannot be earlier than the start date.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createResourceRequest({
        resource_id: resource.id,
        requester_id: user.id,
        owner_id: resource.owner_id,
        status: "pending",
        needed_from: neededFrom || undefined,
        needed_until: neededUntil || undefined,
        request_message: message,
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#12281e] w-full max-w-lg rounded-2xl shadow-elevated border border-forest-900/10 dark:border-forest-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-forest-800 bg-slate-50 dark:bg-forest-900/40">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Request Resource
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct connection with campus peer
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Request Sent Successfully!
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                The resource owner has been notified. You can track pickup details, status updates, and milestones directly in your dashboard.
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                <Link
                  href="/dashboard/requests"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                >
                  View My Requests
                </Link>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 dark:border-forest-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-forest-900/30"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Summary */}
              <div className="p-3.5 bg-forest-50/60 dark:bg-forest-900/30 rounded-xl border border-forest-900/10 dark:border-forest-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resource.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {resource.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pickup: {resource.pickup_location}
                  </p>
                </div>
              </div>

              {/* Owner Warning if self */}
              {isOwner && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    You are the owner of this listing. To test the borrowing workflow, switch to another persona using the top-right persona switcher!
                  </span>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Needed From
                  </label>
                  <input
                    type="date"
                    value={neededFrom}
                    onChange={(e) => setNeededFrom(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Return Expected By
                  </label>
                  <input
                    type="date"
                    value={neededUntil}
                    onChange={(e) => setNeededUntil(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Message to Owner */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message to Owner (Course, Purpose, Pickup Time)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I need this for my upcoming midterms/project. I can pick it up at the library..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 dark:border-forest-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-forest-900/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(isOwner)}
                  className="px-5 py-2 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Send Request"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
