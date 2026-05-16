-- Run in Supabase SQL editor if journal_covers lacks display_order.
alter table public.journal_covers
  add column if not exists display_order integer not null default 0;

create index if not exists journal_covers_display_order_idx
  on public.journal_covers (display_order asc, created_at desc);
