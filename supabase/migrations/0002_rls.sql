-- Row Level Security policies for PrintNest.
--
-- Strategy:
-- * Server-side mutations go through the service role (bypasses RLS).
-- * Anonymous reads are allowed only for published storefront content.
-- * Authenticated artists can read/write their own data via the dashboard
--   when the app uses the user's JWT (anon client + RLS).

alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_variants enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.ai_generations enable row level security;
alter table public.store_analytics_events enable row level security;

-- users: only the user can read their own row
drop policy if exists "users self read" on public.users;
create policy "users self read" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users self update" on public.users;
create policy "users self update" on public.users
  for update using (auth.uid() = id);

-- stores
drop policy if exists "stores owner all" on public.stores;
create policy "stores owner all" on public.stores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "stores public read" on public.stores;
create policy "stores public read" on public.stores
  for select using (is_published = true);

-- artworks
drop policy if exists "artworks owner all" on public.artworks;
create policy "artworks owner all" on public.artworks
  for all using (
    exists (
      select 1 from public.stores s
      where s.id = artworks.store_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.stores s
      where s.id = artworks.store_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "artworks public read" on public.artworks;
create policy "artworks public read" on public.artworks
  for select using (
    is_published = true
    and exists (
      select 1 from public.stores s
      where s.id = artworks.store_id and s.is_published = true
    )
  );

-- variants
drop policy if exists "variants owner all" on public.artwork_variants;
create policy "variants owner all" on public.artwork_variants
  for all using (
    exists (
      select 1 from public.artworks a
      join public.stores s on s.id = a.store_id
      where a.id = artwork_variants.artwork_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.artworks a
      join public.stores s on s.id = a.store_id
      where a.id = artwork_variants.artwork_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "variants public read" on public.artwork_variants;
create policy "variants public read" on public.artwork_variants
  for select using (
    exists (
      select 1 from public.artworks a
      join public.stores s on s.id = a.store_id
      where a.id = artwork_variants.artwork_id
        and a.is_published = true
        and s.is_published = true
    )
  );

-- customers, orders, order_items: only owner of the store
drop policy if exists "customers owner all" on public.customers;
create policy "customers owner all" on public.customers
  for all using (
    exists (
      select 1 from public.stores s
      where s.id = customers.store_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.stores s
      where s.id = customers.store_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "orders owner all" on public.orders;
create policy "orders owner all" on public.orders
  for all using (
    exists (
      select 1 from public.stores s
      where s.id = orders.store_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.stores s
      where s.id = orders.store_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "order_items owner all" on public.order_items;
create policy "order_items owner all" on public.order_items
  for all using (
    exists (
      select 1 from public.orders o
      join public.stores s on s.id = o.store_id
      where o.id = order_items.order_id and s.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.orders o
      join public.stores s on s.id = o.store_id
      where o.id = order_items.order_id and s.user_id = auth.uid()
    )
  );

-- ai generations
drop policy if exists "ai_generations owner all" on public.ai_generations;
create policy "ai_generations owner all" on public.ai_generations
  for all using (
    store_id is null or exists (
      select 1 from public.stores s
      where s.id = ai_generations.store_id and s.user_id = auth.uid()
    )
  );

-- analytics events: writes are open (storefront is public), owner reads
drop policy if exists "analytics owner read" on public.store_analytics_events;
create policy "analytics owner read" on public.store_analytics_events
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = store_analytics_events.store_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "analytics public insert" on public.store_analytics_events;
create policy "analytics public insert" on public.store_analytics_events
  for insert with check (
    exists (
      select 1 from public.stores s
      where s.id = store_analytics_events.store_id and s.is_published = true
    )
  );
