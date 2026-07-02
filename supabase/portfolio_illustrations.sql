-- Portfolio illustrations (standalone artwork, separate from publication figures).

create table if not exists public.portfolio_illustrations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  related_link text,
  image_urls text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_illustrations_display_order_idx
  on public.portfolio_illustrations (display_order asc, created_at desc);

alter table public.portfolio_illustrations enable row level security;

drop policy if exists "portfolio_illustrations_select_public" on public.portfolio_illustrations;
create policy "portfolio_illustrations_select_public"
  on public.portfolio_illustrations for select
  to anon, authenticated
  using (true);

drop policy if exists "portfolio_illustrations_insert_auth" on public.portfolio_illustrations;
create policy "portfolio_illustrations_insert_auth"
  on public.portfolio_illustrations for insert
  to authenticated
  with check (true);

drop policy if exists "portfolio_illustrations_update_auth" on public.portfolio_illustrations;
create policy "portfolio_illustrations_update_auth"
  on public.portfolio_illustrations for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "portfolio_illustrations_delete_auth" on public.portfolio_illustrations;
create policy "portfolio_illustrations_delete_auth"
  on public.portfolio_illustrations for delete
  to authenticated
  using (true);
