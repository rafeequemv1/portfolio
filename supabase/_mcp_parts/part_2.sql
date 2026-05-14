update public.course_chapters ch
set
  content_blocks = jsonb_build_array(
    jsonb_build_object(
      'id',
      'ct-0201',
      'type',
      'text',
      'text',
      $T11$
Most design tools ask you to think in RGB or hex codes, and that is fine for copying values. For figure making, it often helps to think in HSL instead, because the letters already tell you what you are changing. H stands for hue, which is where you live on the rainbow. S stands for saturation, which is how vivid or grayed-out that hue is. L stands for lightness, which is how close you move toward white or black.

Why does that matter for you as a scientist? Because most readability problems are not solved by finding a different blue. They are solved by separating colors in lightness so the figure still reads when someone prints in grayscale, or by lowering saturation so a big background field stops stealing attention from the data. Hue is the story you tell about category. Lightness is the story you tell about emphasis. Saturation is often the volume knob, and loud is not always better.

When you adjust hue, you are usually saying which family a condition belongs to. When you adjust lightness, you are usually saying what should pop first for a tired reader at midnight. When you adjust saturation, you are often deciding how much drama a large area is allowed to have. Keeping those roles straight saves hours of random slider dragging.
      $T11$
    ),
    jsonb_build_object('id', 'ct-0202', 'type', 'color_lab', 'preset', 'hue_wheel'),
    jsonb_build_object(
      'id',
      'ct-0203',
      'type',
      'text',
      'text',
      $T12$
Use the interactive ring below the way you would use a practice instrument. Click around the ring to sample a hue, then use the sliders to fine-tune. Notice how small lightness moves can rescue a label that felt muddy, and how saturation changes the emotional temperature of the same hue without moving you to a different color family.

When you move from screen to print, remember that large fields of very saturated color can look almost electric on coated paper, while the same choice might feel softer on a monitor. A practical habit is to reserve your highest saturation for small elements such as arrows, outlines, and key glyphs, and to keep broad backgrounds a little calmer. Your future self, standing at a poster session or flipping through a proof PDF, will thank you for that restraint.
      $T12$
    ),
    jsonb_build_object(
      'id',
      'ct-0204',
      'type',
      'text',
      'text',
      $T13$
If you work with collaborators, it also helps to name decisions in HSL language out loud. Instead of saying make it bluer, try raise the lightness so it separates from the navy background, or pull saturation down so the heatmap stops shouting. Shared language reduces revision rounds because everyone is adjusting the same knob on the same problem. In the next lesson we will connect these ideas to harmony, which is just a structured way to pick relatives that look like they belong in one family.
      $T13$
    )
  ),
  updated_at = now()
from
  public.courses c
where
  ch.course_id = c.id
  and c.slug = 'color-theory-scientific-images'
  and ch.position = 1;
