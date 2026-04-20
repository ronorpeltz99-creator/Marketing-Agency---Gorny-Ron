-- ==========================================
-- Marketing Agency Platform Schema
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Organizations (Multi-tenant Root)
create table if not exists public.organizations (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    slug text unique not null,
    billing_plan text default 'free' check (billing_plan in ('free', 'pro', 'enterprise'))
);

-- Profiles (Extends Supabase Auth Users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text,
    avatar_url text,
    organization_id uuid references public.organizations(id) on delete set null,
    role text default 'member' check (role in ('admin', 'member', 'owner'))
);

-- Stores (Shopify / E-commerce connections)
create table if not exists public.stores (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id uuid references public.organizations(id) on delete cascade not null,
    name text not null,
    shopify_domain text unique not null,
    access_token text, -- Encrypt this in a real production environment
    status text default 'active' check (status in ('active', 'disconnected', 'pending'))
);

-- Products (Imported from stores)
create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    store_id uuid references public.stores(id) on delete cascade not null,
    shopify_product_id text,
    title text not null,
    description text,
    price numeric(12, 2),
    currency text default 'USD',
    image_url text,
    status text default 'draft' check (status in ('draft', 'active', 'archived'))
);

-- Campaigns (Meta/Ads management)
create table if not exists public.campaigns (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id uuid references public.organizations(id) on delete cascade not null,
    store_id uuid references public.stores(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete set null,
    name text not null,
    meta_campaign_id text,
    status text default 'paused' check (status in ('active', 'paused', 'archived', 'completed')),
    daily_budget numeric(12, 2),
    performance_metrics jsonb default '{}'::jsonb
);

-- Active Tests (Turbo Pipeline Runs)
create table if not exists public.active_tests (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    product_url text not null,
    daily_budget numeric(12, 2) not null,
    status text default 'IDLE' check (status in ('IDLE', 'SCRAPING', 'SOURCING', 'BUILDING_STORE', 'GENERATING_CREATIVES', 'LAUNCHING_ADS', 'ACTIVE', 'COMPLETED', 'FAILED')),
    metadata jsonb default '{}'::jsonb
);

-- api_keys (Secure storage for service credentials)
create table if not exists public.api_keys (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id uuid references public.organizations(id) on delete cascade not null,
    service_name text not null, -- e.g., 'shopify_token', 'meta_token', 'fal_ai_key'
    encrypted_key text not null,
    unique(organization_id, service_name)
);

-- 3. ROW LEVEL SECURITY (RLS)

-- Enable RLS on all tables
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.campaigns enable row level security;
alter table public.api_keys enable row level security;
alter table public.active_tests enable row level security;

-- 4. POLICIES

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

-- Organizations: Users can view the organization they belong to
create policy "Users can view their organization" on public.organizations
    for select using (
        id in (
            select organization_id from public.profiles where profiles.id = auth.uid()
        )
    );

-- Stores: Users can access stores in their organization
create policy "Users can access stores in organization" on public.stores
    for all using (
        organization_id in (
            select organization_id from public.profiles where profiles.id = auth.uid()
        )
    );

-- Products: Users can access products in their organization's stores
create policy "Users can access products in organization" on public.products
    for all using (
        store_id in (
            select id from public.stores where organization_id in (
                select organization_id from public.profiles where profiles.id = auth.uid()
            )
        )
    );

-- Campaigns: Users can access campaigns in their organization
create policy "Users can access campaigns in organization" on public.campaigns
    for all using (
        organization_id in (
            select organization_id from public.profiles where profiles.id = auth.uid()
        )
    );

-- Api Keys: Users can access keys in their organization
create policy "Users can access keys in organization" on public.api_keys
    for all using (
        organization_id in (
            select organization_id from public.profiles where profiles.id = auth.uid()
        )
    );

-- Active Tests: For now, allowed for all authenticated users (can be narrowed later)
create policy "Authenticated users can access tests" on public.active_tests
    for all using (auth.role() = 'authenticated');

-- 5. FUNCTIONS & TRIGGERS

-- Function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_updated_at_profiles before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_stores before update on public.stores for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_products before update on public.products for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_campaigns before update on public.campaigns for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_api_keys before update on public.api_keys for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_active_tests before update on public.active_tests for each row execute procedure public.handle_updated_at();

-- Function to automatically create a profile and organization on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, avatar_url, role)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'member');
    return new;
end;
$$ language plpgsql;
