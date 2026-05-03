-- Run in Supabase SQL editor: public talks for About page + dashboard CRUD.
-- Adjust policies if you use a custom admin role.

create table if not exists public.about_talks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  youtube_url text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_talks_display_order_idx
  on public.about_talks (display_order asc, created_at desc);

alter table public.about_talks enable row level security;

drop policy if exists "about_talks_select_public" on public.about_talks;
create policy "about_talks_select_public"
  on public.about_talks for select
  to anon, authenticated
  using (true);

drop policy if exists "about_talks_insert_auth" on public.about_talks;
create policy "about_talks_insert_auth"
  on public.about_talks for insert
  to authenticated
  with check (true);

drop policy if exists "about_talks_update_auth" on public.about_talks;
create policy "about_talks_update_auth"
  on public.about_talks for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "about_talks_delete_auth" on public.about_talks;
create policy "about_talks_delete_auth"
  on public.about_talks for delete
  to authenticated
  using (true);
