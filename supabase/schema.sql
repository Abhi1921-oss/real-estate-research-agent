-- ==============================================================================
-- REAL ESTATE RESEARCH SAAS - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & DOMAINS
do $$
begin
  if not exists (select 1 from pg_type where typname = 'subscription_tier') then
    create type subscription_tier as enum ('free', 'pro', 'agency');
  end if;
end$$;

-- 3. USERS TABLE (Linked to auth.users)
-- Stores subscription tier, subscribed cities, and monthly usage limits.
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  plan_tier subscription_tier not null default 'free',
  cities_subscribed text[] not null default array['pune']::text[],
  reports_used_this_month integer not null default 0,
  reset_date timestamptz not null default (now() + interval '1 month'),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  agency_name text default '',
  agency_logo_url text default '',
  agency_phone text default '',
  agency_rera_id text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. REPORTS TABLE
-- Stores agent output cached by city + date.
-- Prevents duplicate agent executions when multiple subscribers query the same city.
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  city text not null,
  report_date date not null default current_date,
  content text not null, -- Full markdown summary
  market_data jsonb default '{}'::jsonb, -- Raw structured micro-market data
  policy_data jsonb default '{}'::jsonb, -- Repo rates, MahaRERA/UP-RERA rules
  generated_at timestamptz not null default now(),
  constraint unique_city_date unique (city, report_date)
);

-- 5. USAGE EVENTS TABLE
-- Tracks every user generation/API call for analytics and Stripe metered billing.
create table if not exists public.usage_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  event_type text not null, -- 'report_generated', 'report_viewed', 'api_request'
  city text not null,
  metadata jsonb default '{}'::jsonb,
  timestamp timestamptz not null default now()
);

-- 6. INDEXES FOR PERFORMANCE
create index if not exists idx_users_plan_tier on public.users(plan_tier);
create index if not exists idx_reports_city_date on public.reports(city, report_date desc);
create index if not exists idx_usage_events_user_time on public.usage_events(user_id, timestamp desc);

-- 7. PLAN TIER LIMITS VALIDATION TRIGGER
-- Ensures users can never subscribe to more cities than their plan tier permits:
-- Free: 1 city
-- Pro: 3 cities
-- Agency: Unlimited
create or replace function public.enforce_tier_city_limits()
returns trigger as $$
declare
  city_count integer;
begin
  city_count := coalesce(array_length(new.cities_subscribed, 1), 0);
  
  if new.plan_tier = 'free' and city_count > 1 then
    raise exception 'Free plan is limited to 1 subscribed city.';
  elsif new.plan_tier = 'pro' and city_count > 3 then
    raise exception 'Pro plan is limited to 3 subscribed cities.';
  end if;

  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_enforce_tier_city_limits on public.users;
create trigger tr_enforce_tier_city_limits
  before insert or update of cities_subscribed, plan_tier on public.users
  for each row execute function public.enforce_tier_city_limits();

-- 8. AUTO-PROVISION NEW USER FROM AUTH
-- When a user signs up with Supabase Auth, automatically create their SaaS profile.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, plan_tier, cities_subscribed, reports_used_this_month, reset_date)
  values (
    new.id,
    coalesce(new.email, ''),
    'free',
    array['pune']::text[],
    0,
    now() + interval '1 month'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 9. MONTHLY USAGE RESET FUNCTION
-- Can be called via pg_cron or scheduled FastAPI cron to reset quotas
create or replace function public.reset_expired_monthly_quotas()
returns void as $$
begin
  update public.users
  set reports_used_this_month = 0,
      reset_date = now() + interval '1 month'
  where reset_date <= now();
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.reports enable row level security;
alter table public.usage_events enable row level security;

-- USERS TABLE POLICIES:
-- 1. Users can select only their own profile
create policy "Users can view their own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- 2. Users can update their subscribed cities (plan limit enforced by trigger)
create policy "Users can update their own subscribed cities"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Service role has full administrative access (for Stripe webhooks & backend API)
create policy "Service role has full access to users"
  on public.users
  for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');

-- REPORTS TABLE POLICIES:
-- 1. Users can view reports for cities they are subscribed to
create policy "Users can view reports for subscribed cities"
  on public.reports
  for select
  using (
    auth.role() = 'authenticated' and (
      exists (
        select 1 from public.users u
        where u.id = auth.uid()
          and (
            reports.city = any(u.cities_subscribed)
            or u.plan_tier = 'agency' -- Agency tier can view all cities
          )
      )
    )
  );

-- 2. Only backend service role or agent generator can insert/update reports
create policy "Service role can manage reports"
  on public.reports
  for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');

-- USAGE EVENTS POLICIES:
-- 1. Users can view their own usage history
create policy "Users can view their own usage events"
  on public.usage_events
  for select
  using (auth.uid() = user_id);

-- 2. Authenticated users or backend can insert their usage events
create policy "Users or backend can insert usage events"
  on public.usage_events
  for insert
  with check (
    auth.uid() = user_id
    or auth.jwt() ->> 'role' = 'service_role'
  );

-- 3. Service role full access on usage events
create policy "Service role full access on usage events"
  on public.usage_events
  for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
