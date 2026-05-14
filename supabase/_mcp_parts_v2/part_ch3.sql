insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)
values
  (
    'c0c0c000-0002-4000-8000-00000000d003'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Harmonies for multi-panel figures',
    3,
    jsonb_build_array(
    jsonb_build_object('id','ct-0301','type','text','text',$z00008$A single frame often carries a schematic, an inset micrograph, and a compact chart. If each region picks a random favorite hue, the reader meets noise before insight. Harmony, in the everyday sense used here, means choosing hues that relate on purpose so the canvas reads as one designed object.

Presets such as triadic, analogous, split-complementary, and tetradic are training wheels, not laws. They describe angles on the wheel. The harmony panel below includes a tetradic row: four hues spaced like corners of a rectangle. That palette can be rich for illustration, but for dense data it can also get busy fast, so plan breathing room and softer saturation.

Start with the hue ring to pick a base mood, then open the harmony strip to see how relatives rotate with that base. If you can name which swatch maps to control, treatment, or rescue, you are far less likely to choose a hue only because it looked pretty alone.$z00008$),
    jsonb_build_object('id','ct-0302','type','color_lab','preset','hue_wheel'),
    jsonb_build_object('id','ct-0303','type','color_lab','preset','harmonies'),
    jsonb_build_object('id','ct-0304','type','text','text',$z00009$When you translate harmony into layout, keep one family visually dominant across the largest areas and let secondary hues appear in smaller, sharper doses. Harmony is not only which hues you pick; it is how much of each hue the eye has to process at once.

HTML embeds are still a good place to mock legend spacing and margins. Next you will pair complements for focal contrast, again with the wheel in reach.$z00009$)
  ),
    now()
  );