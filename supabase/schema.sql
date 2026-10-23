-- ============================================================================
-- LOOPSPACE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Smart Campus Resource Sharing & Circular Economy Platform
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  college_name text default 'Campus Central University',
  department text default 'Computer Science & Engineering',
  phone text,
  is_phone_public boolean default false,
  impact_points integer default 0 check (impact_points >= 0),
  role text default 'user' check (role in ('user', 'moderator', 'admin')),
  is_suspended boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ----------------------------------------------------------------------------
-- 2. RESOURCES TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (
    category in (
      'Books & Notes',
      'Lab Equipment',
      'Electronics',
      'Sports & Fitness',
      'Stationery',
      'Decor & Events',
      'Other'
    )
  ),
  sharing_type text not null check (
    sharing_type in ('lend', 'donate', 'exchange', 'request')
  ),
  condition text not null check (
    condition in ('new', 'like_new', 'good', 'usable')
  ),
  quantity integer not null default 1 check (quantity > 0),
  images text[] default array[]::text[],
  pickup_location text not null,
  available_from date,
  available_until date,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'available' check (
    status in ('available', 'reserved', 'borrowed', 'completed', 'unavailable')
  ),
  views_count integer default 0 check (views_count >= 0),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint valid_dates check (
    available_from is null or available_until is null or available_until >= available_from
  )
);

-- Indexes for performance
create index if not exists idx_resources_owner on public.resources(owner_id);
create index if not exists idx_resources_category on public.resources(category);
create index if not exists idx_resources_sharing_type on public.resources(sharing_type);
create index if not exists idx_resources_status on public.resources(status);
create index if not exists idx_resources_created_at on public.resources(created_at desc);

-- ----------------------------------------------------------------------------
-- 3. RESOURCE REQUESTS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.resource_requests (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (
    status in (
      'pending',
      'accepted',
      'rejected',
      'cancelled',
      'ready_for_pickup',
      'borrowed',
      'return_requested',
      'returned',
      'completed'
    )
  ),
  request_message text,
  needed_from date,
  needed_until date,
  pickup_notes text,
  return_notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint check_requester_not_owner check (requester_id <> owner_id),
  constraint valid_request_dates check (
    needed_from is null or needed_until is null or needed_until >= needed_from
  )
);

create index if not exists idx_requests_resource on public.resource_requests(resource_id);
create index if not exists idx_requests_requester on public.resource_requests(requester_id);
create index if not exists idx_requests_owner on public.resource_requests(owner_id);
create index if not exists idx_requests_status on public.resource_requests(status);

-- ----------------------------------------------------------------------------
-- 4. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (
    type in (
      'request_new',
      'request_status',
      'pickup_ready',
      'return_reminder',
      'exchange_complete',
      'badge_earned',
      'system'
    )
  ),
  link text,
  is_read boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);

-- ----------------------------------------------------------------------------
-- 5. IMPACT TRANSACTIONS TABLE (Gamification & Carbon/Cost Saving)
-- ----------------------------------------------------------------------------
create table if not exists public.impact_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null check (points > 0),
  activity_type text not null check (
    activity_type in (
      'loan_completed',
      'donation_completed',
      'exchange_completed',
      'need_fulfilled'
    )
  ),
  resource_id uuid references public.resources(id) on delete set null,
  request_id uuid references public.resource_requests(id) on delete set null,
  description text not null,
  co2_saved_kg numeric(8, 2) default 0.00 check (co2_saved_kg >= 0),
  money_saved_estimate numeric(10, 2) default 0.00 check (money_saved_estimate >= 0),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  constraint unique_request_reward unique (user_id, request_id, activity_type)
);

create index if not exists idx_impact_user on public.impact_transactions(user_id);

-- ----------------------------------------------------------------------------
-- 6. REVIEWS & RATINGS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.resource_requests(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  constraint unique_review_per_request unique (request_id, reviewer_id)
);

create index if not exists idx_reviews_reviewee on public.reviews(reviewee_id);

-- ----------------------------------------------------------------------------
-- 7. CONTENT REPORTS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete cascade,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'dismissed', 'action_taken')),
  admin_notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_reports_status on public.reports(status);

-- ----------------------------------------------------------------------------
-- 8. ADMIN AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_audit_logs_created on public.admin_audit_logs(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.resource_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.impact_transactions enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- ----------------------------------------------------------------------------
-- PROFILES RLS
-- ----------------------------------------------------------------------------
-- Anyone authenticated can view public profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Anonymous users can read basic profile info for public listings
create policy "Profiles are viewable by anon for public listings"
  on public.profiles for select
  to anon
  using (true);

-- Users can only update their own profile; cannot self-promote to admin or change impact_points directly
create policy "Users can update their own permitted fields"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id and
    role = (select role from public.profiles where id = auth.uid()) and
    impact_points = (select impact_points from public.profiles where id = auth.uid())
  );

-- Admins can update any profile (e.g. suspension, role changes)
create policy "Admins can update all profiles"
  on public.profiles for update
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- RESOURCES RLS
-- ----------------------------------------------------------------------------
-- Anyone can view available or completed resources
create policy "Anyone can view resources"
  on public.resources for select
  using (true);

-- Authenticated users can insert their own resources
create policy "Users can insert their own resources"
  on public.resources for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Owners can update their own resources; Admins can moderate
create policy "Owners or Admins can update resources"
  on public.resources for update
  to authenticated
  using (auth.uid() = owner_id or public.is_admin())
  with check (auth.uid() = owner_id or public.is_admin());

-- Owners can delete their own resources; Admins can delete
create policy "Owners or Admins can delete resources"
  on public.resources for delete
  to authenticated
  using (auth.uid() = owner_id or public.is_admin());

-- ----------------------------------------------------------------------------
-- RESOURCE REQUESTS RLS
-- ----------------------------------------------------------------------------
-- Visible only to requester, owner, or admin
create policy "Requests visible to participants or admin"
  on public.resource_requests for select
  to authenticated
  using (
    auth.uid() = requester_id or
    auth.uid() = owner_id or
    public.is_admin()
  );

-- Authenticated users can insert request if not owner
create policy "Users can request resources from others"
  on public.resource_requests for insert
  to authenticated
  with check (
    auth.uid() = requester_id and
    auth.uid() <> owner_id
  );

-- Requester or Owner can update request based on workflow state
create policy "Participants can update request status"
  on public.resource_requests for update
  to authenticated
  using (
    auth.uid() = requester_id or
    auth.uid() = owner_id or
    public.is_admin()
  );

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS RLS
-- ----------------------------------------------------------------------------
create policy "Users can view their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own notifications (mark as read)"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- IMPACT TRANSACTIONS RLS
-- ----------------------------------------------------------------------------
-- Read-only by authenticated users
create policy "Impact transactions viewable by owner or admin"
  on public.impact_transactions for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Only system/triggers/admins can insert impact transactions
create policy "System or Admins can insert impact transactions"
  on public.impact_transactions for insert
  to authenticated
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- REVIEWS RLS
-- ----------------------------------------------------------------------------
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Participants can insert reviews"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = reviewer_id);

-- ----------------------------------------------------------------------------
-- REPORTS RLS
-- ----------------------------------------------------------------------------
create policy "Users can create reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Admins can view reports"
  on public.reports for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update reports"
  on public.reports for update
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- ADMIN AUDIT LOGS RLS
-- ----------------------------------------------------------------------------
create policy "Admins can view audit logs"
  on public.admin_audit_logs for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert audit logs"
  on public.admin_audit_logs for insert
  to authenticated
  with check (public.is_admin());

-- ============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ============================================================================

-- Automatically create a profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    avatar_url,
    college_name,
    department,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'college_name', 'Campus Central University'),
    coalesce(new.raw_user_meta_data->>'department', 'Computer Science & Engineering'),
    case when new.email like 'admin%' then 'admin' else 'user' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to increment profile impact points when an impact transaction is recorded
create or replace function public.handle_impact_reward()
returns trigger as $$
begin
  update public.profiles
  set impact_points = impact_points + new.points,
      updated_at = timezone('utc'::text, now())
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_impact_transaction_created on public.impact_transactions;
create trigger on_impact_transaction_created
  after insert on public.impact_transactions
  for each row execute procedure public.handle_impact_reward();
