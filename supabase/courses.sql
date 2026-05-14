-- Short courses + chapters (JSON content blocks: text, youtube, image).
-- Applied via Supabase migration `create_courses_and_chapters`; keep this file in repo for reference.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_published_display_idx
  on public.courses (published asc, display_order asc, created_at desc);

create table if not exists public.course_chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position integer not null default 0,
  content_blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists course_chapters_course_position_idx
  on public.course_chapters (course_id, position asc);

alter table public.courses enable row level security;
alter table public.course_chapters enable row level security;

drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public"
  on public.courses for select
  to anon
  using (published = true);

drop policy if exists "courses_select_authenticated" on public.courses;
create policy "courses_select_authenticated"
  on public.courses for select
  to authenticated
  using (true);

drop policy if exists "courses_insert_authenticated" on public.courses;
create policy "courses_insert_authenticated"
  on public.courses for insert
  to authenticated
  with check (true);

drop policy if exists "courses_update_authenticated" on public.courses;
create policy "courses_update_authenticated"
  on public.courses for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "courses_delete_authenticated" on public.courses;
create policy "courses_delete_authenticated"
  on public.courses for delete
  to authenticated
  using (true);

drop policy if exists "course_chapters_select_public" on public.course_chapters;
create policy "course_chapters_select_public"
  on public.course_chapters for select
  to anon
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_chapters.course_id and c.published = true
    )
  );

drop policy if exists "course_chapters_select_authenticated" on public.course_chapters;
create policy "course_chapters_select_authenticated"
  on public.course_chapters for select
  to authenticated
  using (true);

drop policy if exists "course_chapters_insert_authenticated" on public.course_chapters;
create policy "course_chapters_insert_authenticated"
  on public.course_chapters for insert
  to authenticated
  with check (true);

drop policy if exists "course_chapters_update_authenticated" on public.course_chapters;
create policy "course_chapters_update_authenticated"
  on public.course_chapters for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "course_chapters_delete_authenticated" on public.course_chapters;
create policy "course_chapters_delete_authenticated"
  on public.course_chapters for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('course-content', 'course-content', true)
on conflict (id) do nothing;

drop policy if exists "course_content_storage_select_public" on storage.objects;
create policy "course_content_storage_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'course-content');

drop policy if exists "course_content_storage_insert_auth" on storage.objects;
create policy "course_content_storage_insert_auth"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'course-content');

drop policy if exists "course_content_storage_update_auth" on storage.objects;
create policy "course_content_storage_update_auth"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'course-content')
  with check (bucket_id = 'course-content');

drop policy if exists "course_content_storage_delete_auth" on storage.objects;
create policy "course_content_storage_delete_auth"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'course-content');
