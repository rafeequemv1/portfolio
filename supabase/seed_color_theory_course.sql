-- Seed: "Color theory for scientific images" (published short course).
-- Run in Supabase SQL editor (or `psql`) against your project DB.
-- Re-run safe: upserts course by slug, replaces chapters for that course.
--
-- Current production shape: 6 lessons (intro + five topics), hue ring in every chapter, tetradic row in the harmony lab UI.
-- To match that from repo: run `node scripts/generateColorTheoryV2Sql.cjs` then execute `supabase/color_theory_v2_full_replace.sql`
-- (or apply the same statements from your CI). The INSERT block below is the older 5-chapter seed; replace it if you want seeds identical to production.

insert into public.courses (
  id,
  title,
  slug,
  description,
  published,
  display_order,
  category,
  offer_enabled,
  offer_title,
  offer_body,
  offer_cta_label,
  offer_cta_url,
  updated_at
)
values (
  'c0c0c000-0001-4000-8000-00000000c001'::uuid,
  'Color theory for scientific images',
  'color-theory-scientific-images',
  'Build publication-ready palettes: contrast on real backgrounds, HSL intuition, harmony presets, complements for callouts, and warm/cool balance—with interactive color labs and HTML examples.',
  true,
  15,
  'Color & design',
  false,
  null,
  null,
  null,
  null,
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  published = excluded.published,
  display_order = excluded.display_order,
  category = excluded.category,
  offer_enabled = excluded.offer_enabled,
  updated_at = now();

delete from public.course_chapters
where course_id = (select id from public.courses where slug = 'color-theory-scientific-images');

insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)
values
  (
    'c0c0c000-0002-4000-8000-00000000d001'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Contrast, context, and illusions',
    0,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'ct-0101',
        'type', 'text',
        'text',
        'Editors and readers judge your figure in seconds. Color is not only ''decoration''—it encodes meaning, separates conditions, and guides the eye. Before picking palettes, anchor every choice in context: poster vs print, projector vs PDF, light vs dark mode.' || chr(10) || chr(10) || 'The first pitfall is trusting a swatch on a blank artboard. Always place colors on the background you will ship: white journal page, dark slide template, or muted graphical abstract panel.'
      ),
      jsonb_build_object(
        'id', 'ct-0102',
        'type', 'html',
        'html',
        $htmlc$
<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:14px;line-height:1.45;color:#1e293b">
  <p style="margin:0 0 10px;font-weight:600">Simultaneous contrast</p>
  <p style="margin:0 0 14px;color:#475569">Both inner squares use the same fill: <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px">#6b7280</code>. The surround changes how light they appear.</p>
  <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start">
    <div style="background:#ffffff;padding:14px;border:1px solid #e2e8f0;border-radius:10px;width:min(100%,160px);text-align:center">
      <div style="height:76px;width:76px;margin:10px auto;background:#6b7280;border-radius:8px"></div>
      <span style="font-size:12px;color:#64748b">On white</span>
    </div>
    <div style="background:#0f172a;padding:14px;border:1px solid #334155;border-radius:10px;width:min(100%,160px);text-align:center">
      <div style="height:76px;width:76px;margin:10px auto;background:#6b7280;border-radius:8px"></div>
      <span style="font-size:12px;color:#94a3b8">On near-black</span>
    </div>
  </div>
  <p style="margin:14px 0 0;font-size:12px;color:#64748b">Takeaway: sample key neutrals directly on your final background layer.</p>
</div>
        $htmlc$,
        'css', ''
      ),
      jsonb_build_object(
        'id', 'ct-0103',
        'type', 'text',
        'text',
        'Try this on your next figure: duplicate a panel, swap only the background tint (+5% yellow vs +5% blue), and check whether legend colors still feel balanced. Small shifts often matter more than changing the accent hue.'
      )
    ),
    now()
  ),
  (
    'c0c0c000-0002-4000-8000-00000000d002'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Hue, saturation, and lightness (HSL)',
    1,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'ct-0201',
        'type', 'text',
        'text',
        'HSL separates hue (wheel position), saturation (chroma), and lightness (luminance). For scientific art it is often easier than RGB because you can hold hue steady while tuning readability (lightness) or muting a competing element (saturation).' || chr(10) || chr(10) || 'Use the interactive ring below: click to sample a hue, then nudge sliders. This mirrors how many vector tools expose color when you need consistent families across panels.'
      ),
      jsonb_build_object('id', 'ct-0202', 'type', 'color_lab', 'preset', 'hue_wheel'),
      jsonb_build_object(
        'id', 'ct-0203',
        'type', 'text',
        'text',
        'Rule of thumb for print: very saturated large fields can look ''electric'' on coated stock; reserve full saturation for small glyphs, arrows, and sparse highlights. On screens, the same saturation may read softer—still test at 100% zoom in the journal PDF width.'
      )
    ),
    now()
  ),
  (
    'c0c0c000-0002-4000-8000-00000000d003'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Harmonies for multi-panel figures',
    2,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'ct-0301',
        'type', 'text',
        'text',
        'When one canvas holds pathways, microscopy, and a small chart, unrelated hues can feel chaotic. Harmony presets are training wheels: triads give balanced energy; analogous schemes feel cohesive; split complements give punch without the harshness of a pure complement pair on every element.' || chr(10) || chr(10) || 'Rotate the base hue in the lab and imagine mapping A/B/C to ''control / treatment / rescue'' or ''input / enzyme / product''.'
      ),
      jsonb_build_object('id', 'ct-0302', 'type', 'color_lab', 'preset', 'harmonies'),
      jsonb_build_object(
        'id', 'ct-0303',
        'type', 'text',
        'text',
        'HTML/CSS embeds (next chapter shows complements) are ideal for static diagrams: legend mockups, safe margins, and print crop marks—anything that should match journal CSS constraints without JavaScript.'
      )
    ),
    now()
  ),
  (
    'c0c0c000-0002-4000-8000-00000000d004'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Complements and focal accents',
    3,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'ct-0401',
        'type', 'text',
        'text',
        'Complementary hues sit opposite on the wheel. Used sparingly, they create focal contrast: a single orange vesicle on a teal cytosol, or a crimson KO track on a blue Western schematic. Overused, they vibrate and fatigue readers.' || chr(10) || chr(10) || 'Pair complements with unequal area: one dominates as background or neutrals; the accent carries meaning.'
      ),
      jsonb_build_object('id', 'ct-0402', 'type', 'color_lab', 'preset', 'complementary'),
      jsonb_build_object(
        'id', 'ct-0403',
        'type', 'html',
        'html',
        $htmlp$
<div style="font-family:system-ui,sans-serif;font-size:13px;color:#0f172a">
  <p style="margin:0 0 8px;font-weight:600">Unequal areas template</p>
  <div style="display:flex;border-radius:10px;overflow:hidden;border:1px solid #cbd5e1;max-width:420px">
    <div style="flex:2;background:#0ea5e9;color:#f8fafc;padding:14px;font-size:12px">Dominant cool field (large)</div>
    <div style="flex:1;background:#f97316;color:#1c1917;padding:14px;font-size:12px;font-weight:600">Warm accent (small)</div>
  </div>
  <p style="margin:10px 0 0;font-size:12px;color:#475569">Swap hex values with your lab above—keep the proportion, not the literal colors.</p>
</div>
        $htmlp$,
        'css', ''
      )
    ),
    now()
  ),
  (
    'c0c0c000-0002-4000-8000-00000000d005'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Accessibility, temperature, and shipping',
    4,
    jsonb_build_array(
      jsonb_build_object(
        'id', 'ct-0501',
        'type', 'text',
        'text',
        'Red–green-only encoding is the classic accessibility failure in heatmaps and pathway arrows. Prefer luminance steps, patterned fills, or direct labels. When you must use hue, combine it with lightness separation so the figure still reads in grayscale.' || chr(10) || chr(10) || 'The HTML sample approximates a ''bad vs better'' heatmap legend using only divs—no scripts.'
      ),
      jsonb_build_object(
        'id', 'ct-0502',
        'type', 'html',
        'html',
        $htmla$
<div style="font-family:system-ui,sans-serif;font-size:12px;color:#334155">
  <p style="margin:0 0 8px;font-weight:600">Categorical heatmap strip (schematic)</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <div>
      <p style="margin:0 0 4px;font-size:11px;color:#b91c1c">Risky: hue only</p>
      <div style="display:flex;height:28px;border-radius:6px;overflow:hidden;width:180px">
        <div style="flex:1;background:#22c55e"></div>
        <div style="flex:1;background:#ef4444"></div>
        <div style="flex:1;background:#84cc16"></div>
      </div>
    </div>
    <div>
      <p style="margin:0 0 4px;font-size:11px;color:#15803d">Better: hue + lightness</p>
      <div style="display:flex;height:28px;border-radius:6px;overflow:hidden;width:180px">
        <div style="flex:1;background:#166534"></div>
        <div style="flex:1;background:#facc15"></div>
        <div style="flex:1;background:#0f766e"></div>
      </div>
    </div>
  </div>
  <p style="margin:10px 0 0;font-size:11px;color:#64748b">Validate with a grayscale preview in your tool and with a color-blind simulator before submission.</p>
</div>
        $htmla$,
        'css', ''
      ),
      jsonb_build_object('id', 'ct-0503', 'type', 'color_lab', 'preset', 'temperature'),
      jsonb_build_object(
        'id', 'ct-0504',
        'type', 'text',
        'text',
        'Print vs screen: RGB designs convert to CMYK with gamut clipping—neon cyans and electric magentas are common casualties. Reserve a final PDF proof for print covers and journal figure guidelines.' || chr(10) || chr(10) || 'Checklist: (1) swatches on real background, (2) harmony or complement with restraint, (3) luminance-safe encoding, (4) proof in grayscale, (5) PDF print check if applicable.'
      )
    ),
    now()
  );
