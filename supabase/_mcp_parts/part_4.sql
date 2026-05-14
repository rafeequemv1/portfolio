update public.course_chapters ch
set
  content_blocks = jsonb_build_array(
    jsonb_build_object(
      'id',
      'ct-0401',
      'type',
      'text',
      'text',
      $T31$
Complementary colors sit roughly opposite each other on the hue wheel. In figure making, that relationship is powerful because our attention is drawn to contrast. Used with care, a complement can highlight one vesicle, one knockout band, or one pathway step without rewriting your entire palette. Used carelessly, complements vibrate against each other and fatigue readers quickly, especially when large areas sit side by side at full saturation.

Think of complements as emphasis tools, not wallpaper. A common pattern that still reads as professional is to let a cooler tone dominate the background world of the figure, then introduce a warm accent in a smaller region that carries meaning. The eye travels to the accent because the story told by area and hue matches the story you want the data to tell.

You can practice this idea without any new software. Ask yourself what the single most important takeaway is on a panel, and ask whether color is currently helping that takeaway or competing with it. If the answer is competition, try reducing the area of the loud hue before you change the hue itself. Often the first fix is proportion, not a new picker session.
      $T31$
    ),
    jsonb_build_object('id', 'ct-0402', 'type', 'color_lab', 'preset', 'complementary'),
    jsonb_build_object('id', 'ct-0403', 'type', 'html', 'html', $H31$
<div style='font-family:system-ui,sans-serif;font-size:13px;line-height:1.45;color:#0f172a'>
  <p style='margin:0 0 8px;font-weight:600'>Unequal areas, same idea</p>
  <p style='margin:0 0 10px;color:#475569'>Large cool field, small warm accent. Swap the hex values in the lab above; keep the proportion story.</p>
  <div style='display:flex;border-radius:10px;overflow:hidden;border:1px solid #cbd5e1;max-width:420px'>
    <div style='flex:2;background:#0ea5e9;color:#f8fafc;padding:14px;font-size:12px;line-height:1.35'>Dominant cool area (most of the canvas)</div>
    <div style='flex:1;background:#f97316;color:#1c1917;padding:14px;font-size:12px;line-height:1.35;font-weight:600'>Warm accent (small, intentional)</div>
  </div>
</div>
      $H31$,
      'css',
      ''
    ),
    jsonb_build_object(
      'id',
      'ct-0404',
      'type',
      'text',
      'text',
      $T32$
The interactive complement lab lets you pick an accent and see its opposite while keeping saturation and lightness matched in a simple way. That is not a perfect model of every print condition, but it is a fast way to rehearse which color pops forward and which one recedes. When you like a pair, take a screenshot or write down the hex codes, then place them on a strip of your real background and squint. If the relationship still reads, you are ready for the next lesson, where we talk about kindness to readers with different color vision, and about warm versus cool storytelling.
      $T32$
    )
  ),
  updated_at = now()
from
  public.courses c
where
  ch.course_id = c.id
  and c.slug = 'color-theory-scientific-images'
  and ch.position = 3;
