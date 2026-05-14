insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)
values
  (
    'c0c0c000-0002-4000-8000-00000000d002'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Hue, saturation, and lightness (HSL)',
    2,
    jsonb_build_array(
    jsonb_build_object('id','ct-0201','type','text','text',$z00006$Most software still shows RGB or hex, and that is fine for copying values into code. For figure decisions, HSL is often kinder because the letters tell you which lever you are pulling. Hue is your position on the wheel. Saturation is how vivid or grayed-out that hue is. Lightness is how close you move toward white or black.

For science figures, many readability issues are really lightness issues in disguise. Two hues can be worlds apart on the wheel and still collapse together in grayscale if their lightness is similar. Saturation is the usual suspect when a background feels like it is buzzing behind thin data lines.

Every lesson opens with the same ring so you never have to hunt for a wheel. Use it here to feel how one hue can look gentle or loud depending on saturation, and how small lightness moves can rescue a label that felt muddy.$z00006$),
    jsonb_build_object('id','ct-0202','type','color_lab','preset','hue_wheel'),
    jsonb_build_object('id','ct-0203','type','text','text',$z00007$When you move from screen to print, remember that big fields of full saturation can look almost neon on coated stock while the same choice feels softer on a monitor. A practical habit is to keep your loudest saturation for arrows, outlines, and key markers, and to let broad backgrounds breathe a little.

If you work with collaborators, try naming edits in HSL words. Instead of make it bluer, say raise lightness so it separates from the navy field, or pull saturation down so the heatmap stops shouting. Shared vocabulary shortens revision loops because everyone is turning the same knobs.$z00007$)
  ),
    now()
  );