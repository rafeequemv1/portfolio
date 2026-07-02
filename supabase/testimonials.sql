-- Testimonials for About page carousel — dashboard CRUD.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_org text,
  quote text,
  content_type text not null default 'quote',
  source_url text,
  image_url text,
  link_url text,
  link_label text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_published_order_idx
  on public.testimonials (is_published, display_order asc, created_at desc);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_select_public" on public.testimonials;
create policy "testimonials_select_public"
  on public.testimonials for select
  to anon, authenticated
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "testimonials_insert_auth" on public.testimonials;
create policy "testimonials_insert_auth"
  on public.testimonials for insert
  to authenticated
  with check (true);

drop policy if exists "testimonials_update_auth" on public.testimonials;
create policy "testimonials_update_auth"
  on public.testimonials for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "testimonials_delete_auth" on public.testimonials;
create policy "testimonials_delete_auth"
  on public.testimonials for delete
  to authenticated
  using (true);
