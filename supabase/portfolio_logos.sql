-- Portfolio logo projects: title, description, optional related link, multiple images.

create table if not exists public.portfolio_logos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  related_link text,
  image_urls text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_logos_display_order_idx
  on public.portfolio_logos (display_order asc, created_at desc);

alter table public.portfolio_logos enable row level security;

drop policy if exists "portfolio_logos_select_public" on public.portfolio_logos;
create policy "portfolio_logos_select_public"
  on public.portfolio_logos for select
  to anon, authenticated
  using (true);

drop policy if exists "portfolio_logos_insert_auth" on public.portfolio_logos;
create policy "portfolio_logos_insert_auth"
  on public.portfolio_logos for insert
  to authenticated
  with check (true);

drop policy if exists "portfolio_logos_update_auth" on public.portfolio_logos;
create policy "portfolio_logos_update_auth"
  on public.portfolio_logos for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "portfolio_logos_delete_auth" on public.portfolio_logos;
create policy "portfolio_logos_delete_auth"
  on public.portfolio_logos for delete
  to authenticated
  using (true);

-- Storage bucket for logo images
insert into storage.buckets (id, name, public)
values ('portfolio-logos', 'portfolio-logos', true)
on conflict (id) do nothing;

-- Public can read logo assets
drop policy if exists "portfolio_logos_storage_select_public" on storage.objects;
create policy "portfolio_logos_storage_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio-logos');

-- Authenticated users can upload/update/delete logo assets
drop policy if exists "portfolio_logos_storage_insert_auth" on storage.objects;
create policy "portfolio_logos_storage_insert_auth"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-logos');

drop policy if exists "portfolio_logos_storage_update_auth" on storage.objects;
create policy "portfolio_logos_storage_update_auth"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-logos')
  with check (bucket_id = 'portfolio-logos');

drop policy if exists "portfolio_logos_storage_delete_auth" on storage.objects;
create policy "portfolio_logos_storage_delete_auth"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-logos');
