insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)
values
  (
    'c0c0c000-0002-4000-8000-00000000d005'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Accessibility, temperature, and shipping',
    5,
    jsonb_build_array(
    jsonb_build_object('id','ct-0501','type','text','text',$z00013$Color is part of communication, not only decoration. One common failure is encoding categories with red and green alone, because many readers will not separate those hues the way you expect. The fix is rarely to ban color; it is to add lightness separation, patterns, labels, or redundant cues so the story survives grayscale and common forms of color-vision difference.

You do not have to become an expert overnight. You do need a short checklist: preview in gray, ask a colleague to read the legend without the main panel, and question any legend that only varies hue.

Use the hue ring to remind yourself that two pretty hues can share the same lightness even when they look worlds apart in RGB. Then look at the schematic strips and the warm-cool strip to keep temperature intentional rather than accidental.$z00013$),
    jsonb_build_object('id','ct-0502','type','color_lab','preset','hue_wheel'),
    jsonb_build_object('id','ct-0503','type','html','html',$z00014$<div style='font-family:system-ui,sans-serif;font-size:12px;line-height:1.45;color:#334155'>
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
  <p style='margin:10px 0 0;font-size:11px;color:#64748b'>Still test on your real background and in grayscale.</p>
</div>$z00014$,'css',''),
    jsonb_build_object('id','ct-0504','type','color_lab','preset','temperature'),
    jsonb_build_object('id','ct-0505','type','text','text',$z00015$Warm and cool associations depend on culture and context, but in biomedical graphics you will still see warm cues tied to energy or warning and cool cues tied to structure or calm. Name your defaults so they match the biology story instead of drifting by habit.

When you leave RGB for ink, gamut clipping is real. Electric cyans and magentas are frequent casualties in CMYK conversion. Budget time for a print PDF proof when the destination is paper.

Closing checklist: park swatches on the real background, choose harmony or contrast with clear roles, separate categories with lightness not hue alone, preview in grayscale, and run a print check when it matters. You now have the same wheel in every chapter as a familiar handhold while you apply the rest of the toolkit.$z00015$)
  ),
    now()
  );