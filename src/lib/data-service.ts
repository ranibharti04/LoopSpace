import {
  ContentReport,
  ImpactTransaction,
  Notification,
  Profile,
  RequestStatus,
  Resource,
  ResourceCategory,
  ResourceCondition,
  ResourceRequest,
  ResourceStatus,
  SharingType,
} from "@/types";
import { DEMO_IMPACT_HISTORY, DEMO_NOTIFICATIONS, DEMO_PROFILES, DEMO_REQUESTS, DEMO_RESOURCES } from "./demo-data";
import { calculateEstimatedSavings, computeBadges, POINT_RULES } from "./impact-engine";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";

// In-memory / browser state store for demo mode
let localResources: Resource[] = [...DEMO_RESOURCES];
let localRequests: ResourceRequest[] = [...DEMO_REQUESTS];
let localNotifications: Notification[] = [...DEMO_NOTIFICATIONS];
let localImpact: ImpactTransaction[] = [...DEMO_IMPACT_HISTORY];
let localProfiles: Profile[] = [...DEMO_PROFILES];

export interface ResourceFilterParams {
  query?: string;
  category?: ResourceCategory | "all";
  sharingType?: SharingType | "all";
  condition?: ResourceCondition | "all";
  status?: ResourceStatus | "all";
  sortBy?: "newest" | "popularity" | "title";
  limit?: number;
}

/**
 * Fetch all resources with optional filtering and sorting
 */
export async function getResources(filters?: ResourceFilterParams): Promise<Resource[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase
        .from("resources")
        .select("*, owner:profiles(id, full_name, avatar_url, college_name, department, impact_points)");

      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters?.sharingType && filters.sharingType !== "all") {
        query = query.eq("sharing_type", filters.sharingType);
      }
      if (filters?.condition && filters.condition !== "all") {
        query = query.eq("condition", filters.condition);
      }
      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters?.sortBy === "popularity") {
        query = query.order("views_count", { ascending: false });
      } else if (filters?.sortBy === "title") {
        query = query.order("title", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as unknown as Resource[];
      }
    } catch {
      // Fallback to local memory if network or Supabase tables are being created
    }
  }

  // Demo fallback query
  let result = [...localResources];

  if (filters?.category && filters.category !== "all") {
    result = result.filter((r) => r.category === filters.category);
  }
  if (filters?.sharingType && filters.sharingType !== "all") {
    result = result.filter((r) => r.sharing_type === filters.sharingType);
  }
  if (filters?.condition && filters.condition !== "all") {
    result = result.filter((r) => r.condition === filters.condition);
  }
  if (filters?.status && filters.status !== "all") {
    result = result.filter((r) => r.status === filters.status);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }

  if (filters?.sortBy === "popularity") {
    result.sort((a, b) => b.views_count - a.views_count);
  } else if (filters?.sortBy === "title") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

/**
 * Get resource by ID and increment view count
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("resources")
        .select("*, owner:profiles(id, full_name, avatar_url, college_name, department, phone, is_phone_public, impact_points)")
        .eq("id", id)
        .single();

      if (!error && data) {
        // Increment view count asynchronously
        Promise.resolve(supabase.rpc("increment_resource_views", { resource_id: id })).catch(() => {});
        return data as unknown as Resource;
      }
    } catch {
      // Fallback
    }
  }

  const found = localResources.find((r) => r.id === id);
  if (found) {
    found.views_count += 1;
    return found;
  }
  return null;
}

/**
 * Create a new resource
 */
export async function createResource(
  newResource: Omit<Resource, "id" | "created_at" | "updated_at" | "views_count">
): Promise<Resource> {
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("resources")
      .insert({
        ...newResource,
        views_count: 0,
      })
      .select("*, owner:profiles(*)")
      .single();

    if (error) {
      throw new Error(`Failed to create resource: ${error.message}`);
    }
    return data as unknown as Resource;
  }

  const id = `res-${Date.now()}`;
  const owner = localProfiles.find((p) => p.id === newResource.owner_id) || localProfiles[0];
  const created: Resource = {
    ...newResource,
    id,
    views_count: 0,
    created_at: timestamp,
    updated_at: timestamp,
    owner,
  };

  localResources.unshift(created);
  return created;
}

/**
 * Update resource listing
 */
export async function updateResource(
  id: string,
  updates: Partial<Resource>,
  userId: string
): Promise<Resource> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("resources")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("owner_id", userId)
      .select("*, owner:profiles(*)")
      .single();

    if (error) {
      throw new Error(`Failed to update resource: ${error.message}`);
    }
    return data as unknown as Resource;
  }

  const index = localResources.findIndex((r) => r.id === id && r.owner_id === userId);
  if (index === -1) {
    throw new Error("Resource not found or unauthorized.");
  }

  const updated: Resource = {
    ...localResources[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  localResources[index] = updated;
  return updated;
}

/**
 * Delete a resource
 */
export async function deleteResource(id: string, userId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id)
      .eq("owner_id", userId);

    if (error) throw new Error(error.message);
    return true;
  }

  const initialLength = localResources.length;
  localResources = localResources.filter((r) => !(r.id === id && r.owner_id === userId));
  return localResources.length < initialLength;
}

/**
 * Submit a borrowing or exchange request
 */
export async function createResourceRequest(
  req: Omit<ResourceRequest, "id" | "created_at" | "updated_at">
): Promise<ResourceRequest> {
  if (req.requester_id === req.owner_id) {
    throw new Error("You cannot request your own resource.");
  }

  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createClient();

    // Check if there is already an active request overlapping or pending
    const { data: existing } = await supabase
      .from("resource_requests")
      .select("id")
      .eq("resource_id", req.resource_id)
      .eq("requester_id", req.requester_id)
      .in("status", ["pending", "accepted", "borrowed"]);

    if (existing && existing.length > 0) {
      throw new Error("You already have an active request for this item.");
    }

    const { data, error } = await supabase
      .from("resource_requests")
      .insert({ ...req, status: "pending" })
      .select("*, resource:resources(*), requester:profiles(*), owner:profiles(*)")
      .single();

    if (error) throw new Error(error.message);

    // Create in-app notification for owner
    await supabase.from("notifications").insert({
      user_id: req.owner_id,
      title: "New Request Received",
      message: `Someone requested to borrow your item.`,
      type: "request_new",
      link: "/dashboard/requests",
    });

    return data as unknown as ResourceRequest;
  }

  // Demo fallback
  const id = `req-${Date.now()}`;
  const resource = localResources.find((r) => r.id === req.resource_id);
  const requester = localProfiles.find((p) => p.id === req.requester_id) || localProfiles[0];
  const owner = localProfiles.find((p) => p.id === req.owner_id) || localProfiles[1];

  const newReq: ResourceRequest = {
    ...req,
    id,
    resource,
    requester,
    owner,
    status: "pending",
    created_at: timestamp,
    updated_at: timestamp,
  };

  localRequests.unshift(newReq);

  // Add demo notification
  localNotifications.unshift({
    id: `notif-${Date.now()}`,
    user_id: req.owner_id,
    title: "New Request Received",
    message: `${requester.full_name} submitted a request for "${resource?.title || "your item"}".`,
    type: "request_new",
    link: "/dashboard/requests",
    is_read: false,
    created_at: timestamp,
  });

  return newReq;
}

/**
 * Transition request workflow status
 */
export async function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  notes?: { pickupNotes?: string; returnNotes?: string },
  actorId?: string
): Promise<ResourceRequest> {
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const updatePayload: Record<string, unknown> = {
      status: newStatus,
      updated_at: timestamp,
    };
    if (notes?.pickupNotes) updatePayload.pickup_notes = notes.pickupNotes;
    if (notes?.returnNotes) updatePayload.return_notes = notes.returnNotes;

    const { data, error } = await supabase
      .from("resource_requests")
      .update(updatePayload)
      .eq("id", requestId)
      .select("*, resource:resources(*), requester:profiles(*), owner:profiles(*)")
      .single();

    if (error) throw new Error(error.message);

    const updated = data as unknown as ResourceRequest;

    // Synchronize resource status with request status
    if (newStatus === "borrowed" && updated.resource_id) {
      await supabase
        .from("resources")
        .update({ status: "borrowed" })
        .eq("id", updated.resource_id);
    } else if (newStatus === "completed" && updated.resource_id) {
      const isDonation = updated.resource?.sharing_type === "donate";
      await supabase
        .from("resources")
        .update({ status: isDonation ? "completed" : "available" })
        .eq("id", updated.resource_id);

      // Award impact points
      await awardPointsForCompletedExchange(updated);
    }

    return updated;
  }

  // Demo fallback
  const index = localRequests.findIndex((r) => r.id === requestId);
  if (index === -1) throw new Error("Request not found.");

  const req = localRequests[index];
  req.status = newStatus;
  req.updated_at = timestamp;
  if (notes?.pickupNotes) req.pickup_notes = notes.pickupNotes;
  if (notes?.returnNotes) req.return_notes = notes.returnNotes;

  // Sync resource status
  if (req.resource) {
    if (newStatus === "borrowed") {
      req.resource.status = "borrowed";
    } else if (newStatus === "completed") {
      req.resource.status = req.resource.sharing_type === "donate" ? "completed" : "available";
      awardPointsForCompletedExchange(req);
    }
  }

  // Notify opposite participant
  const targetUserId = actorId === req.owner_id ? req.requester_id : req.owner_id;
  localNotifications.unshift({
    id: `notif-${Date.now()}`,
    user_id: targetUserId,
    title: `Request Status Updated: ${newStatus.replace("_", " ").toUpperCase()}`,
    message: `Status updated for "${req.resource?.title || "your item"}".`,
    type: newStatus === "completed" ? "exchange_complete" : "request_status",
    link: "/dashboard/requests",
    is_read: false,
    created_at: timestamp,
  });

  return req;
}

/**
 * Safe reward handler: awards points exactly once per activity
 */
async function awardPointsForCompletedExchange(req: ResourceRequest) {
  if (!req.resource) return;

  const type = req.resource.sharing_type;
  let activityType: ImpactTransaction["activity_type"] = "loan_completed";
  let basePoints: number = POINT_RULES.loan_completed.points;

  if (type === "donate") {
    activityType = "donation_completed";
    basePoints = POINT_RULES.donation_completed.points;
  } else if (type === "exchange") {
    activityType = "exchange_completed";
    basePoints = POINT_RULES.exchange_completed.points;
  } else if (type === "request") {
    activityType = "need_fulfilled";
    basePoints = POINT_RULES.need_fulfilled.points;
  }

  const { co2Kg, costSaved } = calculateEstimatedSavings(req.resource.category, req.resource.quantity);

  // In demo mode, update local owner profile and transactions
  const owner = localProfiles.find((p) => p.id === req.owner_id);
  if (owner) {
    owner.impact_points += basePoints;
    localImpact.unshift({
      id: `imp-${Date.now()}`,
      user_id: owner.id,
      points: basePoints,
      activity_type: activityType,
      resource_id: req.resource_id,
      request_id: req.id,
      description: `Completed ${type} of ${req.resource.title}`,
      co2_saved_kg: co2Kg,
      money_saved_estimate: costSaved,
      created_at: new Date().toISOString(),
    });
  }
}

/**
 * Fetch all user requests (sent & received)
 */
export async function getUserRequests(userId: string): Promise<{
  sent: ResourceRequest[];
  received: ResourceRequest[];
}> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("resource_requests")
        .select("*, resource:resources(*), requester:profiles(*), owner:profiles(*)")
        .or(`requester_id.eq.${userId},owner_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (data) {
        const all = data as unknown as ResourceRequest[];
        return {
          sent: all.filter((r) => r.requester_id === userId),
          received: all.filter((r) => r.owner_id === userId),
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    sent: localRequests.filter((r) => r.requester_id === userId),
    received: localRequests.filter((r) => r.owner_id === userId),
  };
}

/**
 * Fetch notifications for user
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) return data as Notification[];
    } catch {
      // Fallback
    }
  }

  return localNotifications.filter((n) => n.user_id === userId);
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notifId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", notifId);
  }
  const notif = localNotifications.find((n) => n.id === notifId);
  if (notif) notif.is_read = true;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
  }
  localNotifications.forEach((n) => {
    if (n.user_id === userId) n.is_read = true;
  });
}

/**
 * Get impact metrics and leaderboard
 */
export async function getImpactOverview(userId?: string) {
  let userPoints = 0;
  let transactions: ImpactTransaction[] = [];
  const profiles = [...localProfiles];

  if (userId) {
    const prof = profiles.find((p) => p.id === userId);
    userPoints = prof?.impact_points || 0;
    transactions = localImpact.filter((i) => i.user_id === userId);
  }

  const badges = computeBadges(userPoints);
  const leaderboard = profiles.sort((a, b) => b.impact_points - a.impact_points);

  // Calculate platform totals
  const totalCo2Kg = localImpact.reduce((sum, item) => sum + item.co2_saved_kg, 0);
  const totalMoneySaved = localImpact.reduce((sum, item) => sum + item.money_saved_estimate, 0);
  const totalShared = localRequests.filter((r) => r.status === "completed").length;

  return {
    userPoints,
    badges,
    transactions,
    leaderboard,
    platformStats: {
      totalCo2Kg: Number(totalCo2Kg.toFixed(1)),
      totalMoneySaved,
      totalShared,
    },
  };
}

/**
 * Submit listing report
 */
export async function submitReport(
  reporterId: string,
  resourceId: string,
  reason: string
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from("reports").insert({
      reporter_id: reporterId,
      resource_id: resourceId,
      reason,
      status: "pending",
    });
    return !error;
  }
  return true;
}
