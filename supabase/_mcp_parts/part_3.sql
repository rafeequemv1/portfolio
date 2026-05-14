update public.course_chapters ch
set
  content_blocks = jsonb_build_array(
    jsonb_build_object(
      'id',
      'ct-0301',
      'type',
      'text',
      'text',
      $T21$
A single figure often has to carry several stories at once. You might have a schematic, a micrograph, and a small chart in one frame. If every region picks a random favorite color, the reader feels visual noise before they feel insight. Harmony is simply the practice of choosing colors that relate to one another on purpose, so the canvas feels like one intentional object instead of a collage of accidents.

You do not need to invent harmonies from scratch every time. Common presets exist because they work well enough, often enough, to be worth learning. A triadic scheme spaces three strong hues evenly around the wheel, which can feel energetic and balanced when you assign each hue to a clear role. An analogous scheme keeps neighbors on the wheel, which tends to feel calm and cohesive. A split-complementary scheme gives you punch without forcing you to place two harsh opposites everywhere at equal volume.

Think of these presets as training wheels, not laws. The goal is not to win a color-theory exam. The goal is to keep a multi-panel figure readable at a glance while you still have brain space left for the science itself.
      $T21$
    ),
    jsonb_build_object('id', 'ct-0302', 'type', 'color_lab', 'preset', 'harmonies'),
    jsonb_build_object(
      'id',
      'ct-0303',
      'type',
      'text',
      'text',
      $T22$
Open the harmony lab and slowly rotate the base hue. Watch how the triad, analogous, and split-complement swatches move together. Then imagine mapping those swatches to real roles in your own work, such as control, treatment, and rescue, or input, enzyme, and product. If you can name the job each color is doing, you are far less likely to pick a hue simply because it looked pretty in isolation.

When you translate harmony into figure making, one more habit helps. Keep one color family dominant across the largest areas, and let the other hues appear in smaller, sharper doses. Harmony is not only about which hues you pick. It is also about how much of each hue the eye is asked to process at once. If everything competes at full volume, even a correct palette can still feel exhausting.
      $T22$
    ),
    jsonb_build_object(
      'id',
      'ct-0304',
      'type',
      'text',
      'text',
      $T23$
If you use HTML embeds in your lessons or in your own teaching materials, they are a good place to show static layout mockups such as legend spacing or safe margins. Those details belong in the same conversation as harmony, because a cramped legend can make even a thoughtful palette look unprofessional. Next we will talk about complements, which are the loudest tool in the box, and why they work best when you use them gently.
      $T23$
    )
  ),
  updated_at = now()
from
  public.courses c
where
  ch.course_id = c.id
  and c.slug = 'color-theory-scientific-images'
  and ch.position = 2;
