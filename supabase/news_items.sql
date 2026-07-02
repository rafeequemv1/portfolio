-- Run in Supabase SQL editor: site news for home page + dashboard CRUD.

create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  thumbnail_url text,
  thumbnail_source_kind text,
  thumbnail_source_id text,
  published_at date not null default current_date,
  display_order integer not null default 0,
  is_published boolean not null default true,
  link_kind text not null default 'external',
  link_target text,
  link_url text,
  created_at timestamptz not null default now()
);

create index if not exists news_items_published_order_idx
  on public.news_items (is_published, display_order asc, published_at desc);

alter table public.news_items enable row level security;

drop policy if exists "news_items_select_public" on public.news_items;
create policy "news_items_select_public"
  on public.news_items for select
  to anon, authenticated
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "news_items_insert_auth" on public.news_items;
create policy "news_items_insert_auth"
  on public.news_items for insert
  to authenticated
  with check (true);

drop policy if exists "news_items_update_auth" on public.news_items;
create policy "news_items_update_auth"
  on public.news_items for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "news_items_delete_auth" on public.news_items;
create policy "news_items_delete_auth"
  on public.news_items for delete
  to authenticated
  using (true);
