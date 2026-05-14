insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)
values
  (
    'c0c0c000-0002-4000-8000-00000000d004'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Complements and focal accents',
    4,
    jsonb_build_array(
    jsonb_build_object('id','ct-0401','type','text','text',$z00010$Complementary hues sit roughly opposite on the wheel. That relationship is powerful because our attention loves hue contrast. Used with care, a complement can highlight one vesicle, one knockout band, or one pathway step without rebuilding your entire palette. Used as two equal neon slabs, the same pair can fatigue people quickly.

Think of complements as emphasis tools, not wallpaper. A calm cool field with a small warm accent is a familiar pattern because it matches how we scan: large context, small signal.

The wheel below is your anchor; the dedicated complement widget under it keeps saturation and lightness aligned in a simple way so you can rehearse pairs before you paste hex codes into your real layout.$z00010$),
    jsonb_build_object('id','ct-0402','type','color_lab','preset','hue_wheel'),
    jsonb_build_object('id','ct-0403','type','color_lab','preset','complementary'),
    jsonb_build_object('id','ct-0404','type','html','html',$z00011$<div style='font-family:system-ui,sans-serif;font-size:13px;line-height:1.45;color:#0f172a'>
  <p style='margin:0 0 8px;font-weight:600'>Unequal areas, same harmony</p>
  <p style='margin:0 0 10px;color:#475569'>Large cool field, small warm accent. Match the story to your complement lab above.</p>
  <div style='display:flex;border-radius:10px;overflow:hidden;border:1px solid #cbd5e1;max-width:420px'>
    <div style='flex:2;background:#0ea5e9;color:#f8fafc;padding:14px;font-size:12px;line-height:1.35'>Dominant cool area (most of the canvas)</div>
    <div style='flex:1;background:#f97316;color:#1c1917;padding:14px;font-size:12px;line-height:1.35;font-weight:600'>Warm accent (small, intentional)</div>
  </div>
</div>$z00011$,'css',''),
    jsonb_build_object('id','ct-0405','type','text','text',$z00012$If a complement feels harsh, try shrinking the loud color first before you change the hue. Unequal area is often the first fix, not a new picker session.

When you like a pair, park the swatches on your actual background and squint. If the relationship still reads, you are ready for the closing chapter on accessibility, temperature cues, and print.$z00012$)
  ),
    now()
  );