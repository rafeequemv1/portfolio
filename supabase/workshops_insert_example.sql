-- Example: insert workshops into `public.workshops` (same columns as Dashboard → Workshop events).
-- Use AFTER your site is deployed so these paths resolve, OR upload images to the `workshop-gallery`
-- bucket and paste the public URLs instead.
-- If you add a row here that duplicates a `site-*` entry in `data/siteWorkshops.ts`, remove that
-- static entry to avoid two cards for the same event.

-- CDRI (thumbnail + session screenshot — order matches app card)
/*
INSERT INTO public.workshops (title, date, location, description, status, image_urls)
VALUES (
  'Science Video Production Workshop at CDRI, Lucknow',
  '2024-06-01',
  'Lucknow, India',
  'Hybrid session on planning, shooting, and editing short-form science video.',
  'Past',
  ARRAY[
    'https://YOUR_PRODUCTION_DOMAIN/portfolio/cdri-video-lucknow/card-thumb.webp',
    'https://YOUR_PRODUCTION_DOMAIN/portfolio/cdri-video-lucknow/01-hybrid-session.webp'
  ]::text[]
);
*/

-- Kiel 3D illustration (online Meet)
/*
INSERT INTO public.workshops (title, date, location, description, status, image_urls)
VALUES (
  '3D Scientific Illustration Workshop at Kiel University',
  '2025-04-10',
  'Kiel, Germany (online)',
  'Remote workshop on 3D scientific illustration with graduate researchers.',
  'Past',
  ARRAY[
    'https://YOUR_PRODUCTION_DOMAIN/portfolio/kiel-3d-sci-illust/card-thumb.webp',
    'https://YOUR_PRODUCTION_DOMAIN/portfolio/kiel-3d-sci-illust/01-meet-grid-10.webp',
    'https://YOUR_PRODUCTION_DOMAIN/portfolio/kiel-3d-sci-illust/02-meet-grid-9.webp'
  ]::text[]
);
*/
