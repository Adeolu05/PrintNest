-- PrintNest core schema
-- Tables: users, stores, artworks, artwork_variants, orders, order_items, customers,
--         ai_generations, store_analytics_events
--
-- Notes:
-- * `users.id` mirrors `auth.users.id` (Supabase Auth) so we can join easily.
-- * Public storefront reads must always filter by `is_published = true`.
-- * Service role bypasses RLS for server-side mutations from API routes.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  auth_provider text default 'email',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  store_name text not null,
  store_slug text not null unique,
  artist_name text not null,
  bio text,
  logo_url text,
  banner_url text,
  theme_id text not null default 'minimal-gallery',
  accent_color text,
  display_mode text not null default 'gallery',
  hero_headline text,
  hero_subheadline text,
  currency text not null default 'NGN',
  country text,
  city text,
  whatsapp_number text not null,
  instagram_url text,
  tiktok_url text,
  x_url text,
  custom_domain text unique,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stores_user_idx on public.stores (user_id);
create index if not exists stores_published_idx on public.stores (is_published);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  title text not null,
  slug text not null,
  short_description text,
  description text,
  ai_description text,
  image_url text not null,
  thumbnail_url text,
  image_width integer,
  image_height integer,
  category text,
  medium text,
  year_created integer,
  tags text[] default '{}',
  base_price numeric(12, 2) not null default 0,
  currency text not null default 'NGN',
  stock_status text not null default 'in_stock',
  is_limited_edition boolean not null default false,
  edition_size integer,
  edition_sold integer not null default 0,
  is_published boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, slug)
);

create index if not exists artworks_store_published_idx
  on public.artworks (store_id, is_published);

create table if not exists public.artwork_variants (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  size_code text not null,
  size_label text,
  width_mm integer,
  height_mm integer,
  paper_type text,
  frame_option text not null default 'No frame',
  price numeric(12, 2) not null default 0,
  stock_quantity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists variants_artwork_idx on public.artwork_variants (artwork_id);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  email text,
  phone text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_store_idx on public.customers (store_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  order_number text not null unique,
  total_amount numeric(12, 2) not null default 0,
  currency text not null default 'NGN',
  payment_method text not null default 'whatsapp',
  payment_status text not null default 'pending',
  order_status text not null default 'new',
  delivery_address text,
  customer_note text,
  whatsapp_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_store_created_idx
  on public.orders (store_id, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  artwork_id uuid references public.artworks(id) on delete set null,
  variant_id uuid references public.artwork_variants(id) on delete set null,
  title_snapshot text not null,
  size_snapshot text,
  frame_snapshot text,
  price_snapshot numeric(12, 2) not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade,
  artwork_id uuid references public.artworks(id) on delete set null,
  generation_type text not null,
  prompt_input jsonb,
  output jsonb,
  tone text,
  model text,
  created_at timestamptz not null default now()
);

create index if not exists ai_generations_store_idx on public.ai_generations (store_id);

create table if not exists public.store_analytics_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  artwork_id uuid references public.artworks(id) on delete set null,
  event_type text not null,
  visitor_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_store_event_idx
  on public.store_analytics_events (store_id, event_type, created_at desc);
