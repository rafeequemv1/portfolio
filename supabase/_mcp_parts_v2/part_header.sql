-- Color theory course v2: intro chapter + hue_wheel on every chapter + tetradic row in harmony lab (app)
-- Safe to re-run: replaces chapters for slug color-theory-scientific-images only.

update public.courses c
set
  description = 'Six short lessons with interactive labs: an introduction to using color theory as a toolkit, then context and contrast, HSL thinking, harmony presets (including tetradic), complements with unequal-area layouts, and accessibility plus print habits—all with a hue ring in every chapter so the wheel stays in view.',
  updated_at = now()
where c.slug = 'color-theory-scientific-images';

delete from public.course_chapters where course_id = (select id from public.courses where slug = 'color-theory-scientific-images');
