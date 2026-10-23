export type ResourceCategory =
  | 'Books & Notes'
  | 'Lab Equipment'
  | 'Electronics'
  | 'Sports & Fitness'
  | 'Stationery'
  | 'Decor & Events'
  | 'Other';

export type SharingType = 'lend' | 'donate' | 'exchange' | 'request';

export type ResourceCondition = 'new' | 'like_new' | 'good' | 'usable';

export type ResourceStatus =
  | 'available'
  | 'reserved'
  | 'borrowed'
  | 'completed'
  | 'unavailable';

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'ready_for_pickup'
  | 'borrowed'
  | 'return_requested'
  | 'returned'
  | 'completed';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  college_name: string;
  department: string;
  phone?: string;
  is_phone_public: boolean;
  impact_points: number;
  role: UserRole;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  sharing_type: SharingType;
  condition: ResourceCondition;
  quantity: number;
  images: string[];
  pickup_location: string;
  available_from?: string; // YYYY-MM-DD
  available_until?: string; // YYYY-MM-DD
  owner_id: string;
  owner?: Partial<Profile>;
  status: ResourceStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceRequest {
  id: string;
  resource_id: string;
  resource?: Resource;
  requester_id: string;
  requester?: Partial<Profile>;
  owner_id: string;
  owner?: Partial<Profile>;
  status: RequestStatus;
  request_message?: string;
  needed_from?: string;
  needed_until?: string;
  pickup_notes?: string;
  return_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type:
    | 'request_new'
    | 'request_status'
    | 'pickup_ready'
    | 'return_reminder'
    | 'exchange_complete'
    | 'badge_earned'
    | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ImpactTransaction {
  id: string;
  user_id: string;
  points: number;
  activity_type:
    | 'loan_completed'
    | 'donation_completed'
    | 'exchange_completed'
    | 'need_fulfilled';
  resource_id?: string;
  request_id?: string;
  description: string;
  co2_saved_kg: number;
  money_saved_estimate: number;
  created_at: string;
}

export interface Review {
  id: string;
  request_id: string;
  reviewer_id: string;
  reviewer?: Partial<Profile>;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reporter?: Partial<Profile>;
  resource_id?: string;
  resource?: Partial<Resource>;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  admin_notes?: string;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin?: Partial<Profile>;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// Creative Feature: Matching Engine Types
export interface MatchCriteria {
  targetCategory?: string;
  targetKeywords: string[];
  requestedFrom?: string;
  requestedUntil?: string;
  preferredCondition?: ResourceCondition;
  preferredType?: SharingType;
  campusLocation?: string;
}

export interface MatchScoreBreakdown {
  categoryScore: number;       // max 35
  keywordSimilarityScore: number; // max 30
  dateAvailabilityScore: number;  // max 15
  conditionScore: number;      // max 10
  locationScore: number;       // max 10
  totalScore: number;          // max 100
  reasons: string[];
}

export type MatchTier = 'Excellent Match' | 'Good Match' | 'Possible Match';

export interface MatchResult {
  resource: Resource;
  score: number;
  tier: MatchTier;
  breakdown: MatchScoreBreakdown;
}

// Impact badges
export interface ImpactBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  minPoints: number;
  unlocked: boolean;
}
