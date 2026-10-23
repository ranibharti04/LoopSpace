"use client";

import React, { useState } from "react";
import { RequestStatus, ResourceRequest } from "@/types";
import { updateRequestStatus } from "@/lib/data-service";
import { formatDate, getRequestStatusBadge, getSharingTypeBadge } from "@/lib/utils";
import {
  Check,
  X,
  PackageCheck,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

interface RequestsWorkflowManagerProps {
  request: ResourceRequest;
  currentUserId: string;
  onStatusUpdated?: (updatedReq: ResourceRequest) => void;
}

export function RequestsWorkflowManager({
  request,
  currentUserId,
  onStatusUpdated,
}: RequestsWorkflowManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pickupNotes, setPickupNotes] = useState(request.pickup_notes || "");
  const [returnNotes, setReturnNotes] = useState(request.return_notes || "");
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUserId === request.owner_id;
  const isRequester = currentUserId === request.requester_id;
  const statusBadge = getRequestStatusBadge(request.status);
  const typeBadge = request.resource ? getSharingTypeBadge(request.resource.sharing_type) : null;

  const handleAction = async (nextStatus: RequestStatus) => {
    try {
      setIsUpdating(true);
      setError(null);
      const updated = await updateRequestStatus(
        request.id,
        nextStatus,
        {
          pickupNotes: pickupNotes || undefined,
          returnNotes: returnNotes || undefined,
        },
        currentUserId
      );

      if (onStatusUpdated) onStatusUpdated(updated);
    } catch (err: any) {
      setError(err.message || "Failed to update request status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Progression Stepper
  const steps: { key: RequestStatus; label: string }[] = [
    { key: "pending", label: "Requested" },
    { key: "accepted", label: "Accepted" },
    { key: "ready_for_pickup", label: "Ready" },
    { key: "borrowed", label: "In Use" },
    { key: "completed", label: "Completed" },
  ];

  const getStepIndex = (status: RequestStatus) => {
    switch (status) {
      case "pending": return 0;
      case "accepted": return 1;
      case "ready_for_pickup": return 2;
      case "borrowed":
      case "return_requested":
      case "returned": return 3;
      case "completed": return 4;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(request.status);

  return (
    <div className="bg-white dark:bg-[#12281e] rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-forest-800">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
          {typeBadge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          Created: {formatDate(request.created_at)}
        </span>
      </div>

      {/* Main Details */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-forest-900 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={request.resource?.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
            {request.resource?.title || "Resource Listing"}
          </h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong>Owner:</strong> {request.owner?.full_name || "Peer"}
            </span>
            <span>
              <strong>Requester:</strong> {request.requester?.full_name || "Peer"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>
                Dates: {formatDate(request.needed_from)} - {formatDate(request.needed_until)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Request Message */}
      {request.request_message && (
        <div className="p-3 bg-slate-50 dark:bg-forest-900/30 rounded-xl border border-slate-100 dark:border-forest-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">Message: </span>
            <span>{request.request_message}</span>
          </div>
        </div>
      )}

      {/* Timeline Steps (if not rejected or cancelled) */}
      {currentIndex >= 0 && (
        <div className="py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-forest-900 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((st, i) => {
              const isPastOrCurrent = i <= currentIndex;
              return (
                <div key={st.key} className="flex flex-col items-center z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      isPastOrCurrent
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-200 dark:bg-forest-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action buttons based on Role and Stage */}
      <div className="pt-2 flex flex-wrap items-center gap-2 justify-end">
        {/* Stage 1: Owner Accepts / Declines */}
        {request.status === "pending" && isOwner && (
          <>
            <button
              onClick={() => handleAction("rejected")}
              disabled={isUpdating}
              className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold"
            >
              Decline
            </button>
            <button
              onClick={() => handleAction("accepted")}
              disabled={isUpdating}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Request</span>
            </button>
          </>
        )}

        {/* Requester can cancel pending request */}
        {request.status === "pending" && isRequester && (
          <button
            onClick={() => handleAction("cancelled")}
            disabled={isUpdating}
            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 dark:hover:bg-forest-900/40 rounded-xl text-xs font-semibold"
          >
            Cancel Request
          </button>
        )}

        {/* Stage 2: Mark Ready for Pickup */}
        {request.status === "accepted" && (
          <button
            onClick={() => handleAction("ready_for_pickup")}
            disabled={isUpdating}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Mark Ready for Pickup</span>
          </button>
        )}

        {/* Stage 3: Item Picked up / Borrowed */}
        {request.status === "ready_for_pickup" && (
          <button
            onClick={() => handleAction("borrowed")}
            disabled={isUpdating}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Confirm Handover / In Use</span>
          </button>
        )}

        {/* Stage 4: Return flow */}
        {request.status === "borrowed" && (
          <button
            onClick={() => handleAction("return_requested")}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Request Return</span>
          </button>
        )}

        {/* Stage 5: Final completion & impact reward */}
        {(request.status === "return_requested" ||
          request.status === "returned" ||
          (request.status === "borrowed" && request.resource?.sharing_type === "donate")) && (
          <button
            onClick={() => handleAction("completed")}
            disabled={isUpdating}
            className="px-4 py-2 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Confirm Completion & Award Impact Points</span>
          </button>
        )}
      </div>
    </div>
  );
}
