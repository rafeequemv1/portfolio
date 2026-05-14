-- Superseded by `color_theory_v2_full_replace.sql` (six chapters, intro, hue_wheel every lesson, tetradic in harmony lab).
-- Kept for reference; prefer `node scripts/generateColorTheoryV2Sql.cjs` then run the generated `color_theory_v2_full_replace.sql`.
update public.courses c
set
  description =
    'A friendly, plain-language walk through color for journal figures, slides, and posters. You will learn how your eye really responds to hue and contrast, how to build palettes that stay readable in print and on screen, and how to avoid the mistakes that quietly weaken otherwise excellent data.',
  updated_at = now()
where c.slug = 'color-theory-scientific-images';

update public.course_chapters ch
set
  content_blocks = jsonb_build_array(
    jsonb_build_object(
      'id',
      'ct-0101',
      'type',
      'text',
      'text',
      $T01$
You opened this course because color in scientific figures can feel fuzzy one minute and painfully picky the next. That is normal. You are not supposed to be born with an intuitive color wheel. You are supposed to learn a small set of habits that match how human vision actually works, and then reuse those habits every time you build a panel.

When someone skims your paper or your slide deck, color is already doing part of the argument for you. It tells the eye what belongs together, what is background, and what deserves a first look. When colors fight each other, readers often lose confidence before they can explain why. When colors cooperate, the same figure feels calmer and more authoritative, even if the underlying data never changed.

So we begin in the least glamorous place, and it is also the most important place. We begin on the real surface your figure will live on. A legend that looked perfect on an empty artboard can look tired once it sits on cream paper, or on a dark keynote template, or on top of a busy heatmap. If you only judge swatches in isolation, you are practicing under the wrong lights. From here on, think in terms of context first and pretty palettes second.
      $T01$
    ),
    jsonb_build_object('id', 'ct-0102', 'type', 'html', 'html', $H01$
<div style='font-family:system-ui,Segoe UI,sans-serif;font-size:14px;line-height:1.5;color:#1e293b'>
  <p style='margin:0 0 10px;font-weight:600'>A quick look at simultaneous contrast</p>
  <p style='margin:0 0 14px;color:#475569'>Both inner squares use the same fill: <code style='background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px'>#6b7280</code>. Only the surround changes. Many people still describe the two squares as different shades.</p>
  <div style='display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start'>
    <div style='background:#ffffff;padding:14px;border:1px solid #e2e8f0;border-radius:10px;width:min(100%,168px);text-align:center'>
      <div style='height:76px;width:76px;margin:10px auto;background:#6b7280;border-radius:8px'></div>
      <span style='font-size:12px;color:#64748b'>On white</span>
    </div>
    <div style='background:#0f172a;padding:14px;border:1px solid #334155;border-radius:10px;width:min(100%,168px);text-align:center'>
      <div style='height:76px;width:76px;margin:10px auto;background:#6b7280;border-radius:8px'></div>
      <span style='font-size:12px;color:#94a3b8'>On near-black</span>
    </div>
  </div>
  <p style='margin:14px 0 0;font-size:12px;color:#64748b'>This is why you should park important neutrals on a strip of your final background before you freeze the file.</p>
</div>
      $H01$,
      'css',
      ''
    ),
    jsonb_build_object(
      'id',
      'ct-0103',
      'type',
      'text',
      'text',
      $T02$
What you just saw is not a party trick. It is a daily reason why pathway grays, pastel fills, and even supposedly safe blues can shift when they meet the rest of your layout. Your brain compares neighboring areas constantly. That comparison changes how light or heavy a color feels, even when the numbers in the hex code never budged.

Here is a small exercise you can repeat for years. Take a figure that is almost finished and duplicate one panel. Change only the surrounding background by a gentle amount, maybe a touch warmer in one copy and a touch cooler in another. Do not touch the data layer yet. Then ask a simple question: do the legend colors still feel balanced in every version? If one label suddenly reads as too loud or too shy, you have learned something valuable without arguing with your statistics at all.

You do not need to memorize every optical illusion in the literature. You only need the habit that follows from them. Context comes first, and the decorative color wheel comes second. In the next lesson we will talk about hue, saturation, and lightness in everyday language, and you will get a ring you can click so those ideas stop floating in your head and start behaving on a screen you control.
      $T02$
    )
  ),
  updated_at = now()
from
  public.courses c
where
  ch.course_id = c.id
  and c.slug = 'color-theory-scientific-images'
  and ch.position = 0;

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
