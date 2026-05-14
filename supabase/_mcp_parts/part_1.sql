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
