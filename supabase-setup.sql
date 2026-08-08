-- ============================================================================
--  AKYOTO SECURE — Supabase setup script
--  Run this once, top to bottom, in a fresh Supabase project's SQL Editor
--  (Project → SQL Editor → New query → paste this whole file → Run)
--  It creates every table the app needs, locks them down with Row Level
--  Security, sets up a storage bucket for product images, and wires up an
--  is_admin flag so you can promote your own account to the admin panel.
--  NO dummy/sample products are inserted — the shop starts empty.
-- ============================================================================

-- Extensions -------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. USER PROFILES
--    One row per auth user. is_admin controls access to /admin.
-- ============================================================================
create table if not exists public.user_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2. PRODUCTS
-- ============================================================================
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text default '',
  price           numeric(10,2) not null check (price >= 0),
  image_url       text default '',
  category        text not null,
  stock           integer not null default 0 check (stock >= 0),
  sku             text not null unique,
  weight          text default '',
  min_order_qty   integer not null default 1 check (min_order_qty >= 1),
  brand           text default '',
  warranty        text default '',
  specifications  jsonb not null default '{}'::jsonb,
  features        text[] default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.products enable row level security;

-- Anyone (including logged-out visitors) can browse products
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- Only admins can create/edit/delete products
create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 3. ORDERS + ORDER ITEMS
-- ============================================================================
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  total             numeric(10,2) not null check (total >= 0),
  status            text not null default 'pending'
                      check (status in ('pending','processing','shipped','delivered','cancelled')),
  shipping_address  jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  product_id  uuid references public.products (id) on delete set null,
  quantity    integer not null check (quantity > 0),
  price       numeric(10,2) not null check (price >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid()
             or exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true))
    )
  );

create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ============================================================================
-- 4. QUOTE REQUESTS  (from the Contact / Get a Quote form)
-- ============================================================================
create table if not exists public.quote_requests (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text not null,
  company_name  text default '',
  message       text default '',
  products      jsonb not null default '[]'::jsonb,
  status        text not null default 'pending'
                  check (status in ('pending','quoted','accepted','declined')),
  created_at    timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

-- Anyone (including anonymous visitors) can submit a quote request
create policy "Anyone can submit a quote request"
  on public.quote_requests for insert
  with check (true);

-- Only admins can view / manage quote requests
create policy "Admins can view quote requests"
  on public.quote_requests for select
  using (
    exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can update quote requests"
  on public.quote_requests for update
  using (
    exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- ============================================================================
-- 5. BLOG POSTS
-- ============================================================================
create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  excerpt     text default '',
  content     text default '',
  author      text default 'Akyoto Team',
  published   boolean not null default false,
  image_url   text default '',
  created_at  timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Published posts are publicly readable"
  on public.blog_posts for select
  using (published = true or exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true));

create policy "Admins can manage blog posts"
  on public.blog_posts for all
  using (exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true));

-- ============================================================================
-- 6. STORAGE — bucket for product images, used by the admin panel uploader
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can update product images"
  on storage.objects for update
  using (
    bucket_id = 'products'
    and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "Admins can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- ============================================================================
-- 7. ADMIN ACCESS — handled OUTSIDE Supabase now
-- ============================================================================
-- The /admin panel no longer uses Supabase auth or the is_admin column
-- above at all. Access is gated purely by two values in your .env.local:
--
--   ADMIN_PASSWORD=choose_a_strong_password
--   ADMIN_SESSION_SECRET=a_long_random_string
--
-- Visiting /admin redirects to /admin-login, which checks the password
-- against ADMIN_PASSWORD and, on success, sets an httpOnly cookie. All
-- admin reads/writes (products, orders, quotes, image uploads) then run
-- through Next.js API routes using the Supabase SERVICE ROLE key — which
-- bypasses the RLS policies above entirely — so nothing in this database
-- needs to know who the admin is. The is_admin column on user_profiles is
-- kept only in case you want it for something else later; it's unused by
-- the admin panel.
--
-- You'll also need to add your service role key (Supabase dashboard →
-- Project Settings → API → service_role key) to .env.local as:
--   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
-- Never expose this key to the browser — it must never get a NEXT_PUBLIC_
-- prefix, and it's only read inside server-side API routes.

-- ============================================================================
-- Done. No sample/dummy products were inserted — add real products from
-- the /admin panel (/admin-login) once your .env.local values are set.
-- ============================================================================
