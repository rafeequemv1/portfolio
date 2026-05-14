update public.course_chapters ch
set
  content_blocks = jsonb_build_array(
    jsonb_build_object(
      'id',
      'ct-0501',
      'type',
      'text',
      'text',
      $T41$
Color choices are not only aesthetic choices. They are communication choices. One of the most common failures in scientific figures is encoding categories with red and green alone, because a meaningful slice of readers will not distinguish those hues the way you expect. The fix is usually not to avoid color entirely. The fix is to add separation in lightness, add texture or pattern, add direct labels, or combine cues so the figure still reads in grayscale.

You do not have to become an accessibility expert overnight. You do have to adopt a few non-negotiable checks. Preview your figure in grayscale. If two conditions collapse into the same gray blob, your readers will struggle even if they have typical color vision under poor lighting. Ask a colleague to read the legend without the main panel in view. If they hesitate, your legend may be asking for more contrast or clearer grouping.

The small schematic below is only a cartoon, but it captures a useful instinct. A strip that varies only in hue can look lively on a monitor and still fail as a code. A strip that varies in hue and lightness tends to survive compression, printing, and tired eyes much more often.
      $T41$
    ),
    jsonb_build_object('id', 'ct-0502', 'type', 'html', 'html', $H41$
<div style='font-family:system-ui,sans-serif;font-size:12px;line-height:1.45;color:#334155'>
  <p style='margin:0 0 8px;font-weight:600'>Categorical strip (schematic)</p>
  <div style='display:flex;gap:10px;flex-wrap:wrap'>
    <div>
      <p style='margin:0 0 4px;font-size:11px;color:#b91c1c'>Riskier: hue only</p>
      <div style='display:flex;height:28px;border-radius:6px;overflow:hidden;width:180px'>
        <div style='flex:1;background:#22c55e'></div>
        <div style='flex:1;background:#ef4444'></div>
        <div style='flex:1;background:#84cc16'></div>
      </div>
    </div>
    <div>
      <p style='margin:0 0 4px;font-size:11px;color:#15803d'>Stronger: hue plus lightness steps</p>
      <div style='display:flex;height:28px;border-radius:6px;overflow:hidden;width:180px'>
        <div style='flex:1;background:#166534'></div>
        <div style='flex:1;background:#facc15'></div>
        <div style='flex:1;background:#0f766e'></div>
      </div>
    </div>
  </div>
  <p style='margin:10px 0 0;font-size:11px;color:#64748b'>Use this as a reminder, not a law. Real palettes should still be tested on your real backgrounds.</p>
</div>
      $H41$,
      'css',
      ''
    ),
    jsonb_build_object('id', 'ct-0503', 'type', 'color_lab', 'preset', 'temperature'),
    jsonb_build_object(
      'id',
      'ct-0504',
      'type',
      'text',
      'text',
      $T42$
Warm colors often read as energetic, metabolic, or urgent in Western visual culture, while cool colors often read as structural, clinical, or calm. Those associations are not universal across every culture on Earth, but they show up often enough in biomedical graphics that it is worth noticing your own defaults. The temperature lab below is a simple strip you can use as a gut check. If your figure is shouting warm everywhere, ask whether that matches the biology story. If everything is icy blue, ask whether you accidentally drained human warmth from a story that needs a heartbeat.

When you move from RGB on a monitor to ink on paper, remember that gamut clipping is real. Neon cyans and electric magentas are common casualties in CMYK conversion. If your figure will be printed on a cover or as a full-page plate, budget time for a print proof rather than trusting a screen alone.

Here is a closing checklist you can keep beside your desk. First, place key swatches on the real background. Second, choose harmony or contrast with restraint and clear roles. Third, separate categories with lightness, not hue alone. Fourth, preview in grayscale. Fifth, run a print or PDF check when the destination is paper. You have now walked the main arc of color theory for scientific images in human language. The next time you open a color picker, you are not guessing. You are choosing with context, proportion, and kindness in mind.
      $T42$
    )
  ),
  updated_at = now()
from
  public.courses c
where
  ch.course_id = c.id
  and c.slug = 'color-theory-scientific-images'
  and ch.position = 4;
