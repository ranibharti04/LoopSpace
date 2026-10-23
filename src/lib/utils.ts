import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RequestStatus, ResourceStatus, SharingType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Flexible / Any";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSharingTypeBadge(type: SharingType) {
  switch (type) {
    case "lend":
      return {
        label: "Lend Temporarily",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
      };
    case "donate":
      return {
        label: "Giveaway (Free)",
        color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800",
      };
    case "exchange":
      return {
        label: "Exchange / Swap",
        color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      };
    case "request":
      return {
        label: "Seeking / Request",
        color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
      };
  }
}

export function getStatusBadge(status: ResourceStatus) {
  switch (status) {
    case "available":
      return {
        label: "Available",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300",
      };
    case "reserved":
      return {
        label: "Reserved",
        color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300",
      };
    case "borrowed":
      return {
        label: "Currently Borrowed",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300",
      };
    case "completed":
      return {
        label: "Completed",
        color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
      };
    case "unavailable":
      return {
        label: "Unavailable",
        color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300",
      };
  }
}

export function getRequestStatusBadge(status: RequestStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Pending Owner Review",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
      };
    case "accepted":
      return {
        label: "Request Accepted",
        color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300",
      };
    case "rejected":
      return {
        label: "Declined",
        color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
      };
    case "ready_for_pickup":
      return {
        label: "Ready for Pickup",
        color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300",
      };
    case "borrowed":
      return {
        label: "Item In Use",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300",
      };
    case "return_requested":
      return {
        label: "Return Requested",
        color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
      };
    case "returned":
      return {
        label: "Returned to Owner",
        color: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300",
      };
    case "completed":
      return {
        label: "Successfully Completed",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
      };
  }
}
