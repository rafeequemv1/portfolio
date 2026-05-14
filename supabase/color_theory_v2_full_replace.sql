-- Color theory course v2: intro chapter + hue_wheel on every chapter + tetradic row in harmony lab (app)
-- Safe to re-run: replaces chapters for slug color-theory-scientific-images only.

update public.courses c
set
  description = 'Six short lessons with interactive labs: an introduction to using color theory as a toolkit, then context and contrast, HSL thinking, harmony presets (including tetradic), complements with unequal-area layouts, and accessibility plus print habits—all with a hue ring in every chapter so the wheel stays in view.',
  updated_at = now()
where c.slug = 'color-theory-scientific-images';

delete from public.course_chapters where course_id = (select id from public.courses where slug = 'color-theory-scientific-images');

insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)
values
  (
    'c0c0c000-0002-4000-8000-00000000d000'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Introduction: how to think about color theory',
    0,
    jsonb_build_array(
    jsonb_build_object('id','ct-0001','type','text','text',$z00001$Welcome. If you have ever stared at a color picker and hoped the right answer would appear, you are in good company. Color for figures is not a single magic setting. It is a small bundle of habits: notice context, know what job each color is doing, and check your choices the way you would check a Western blot ladder.

In this short course we treat color theory as a practical toolkit. The ideas come from centuries of painters and print designers, then they get adapted for screens, journals, and posters. A harmony name is not a guarantee of beauty. It is a pattern on the color wheel that suggests relationships between hues. Whether that pattern helps your figure still depends on lightness, saturation, and how much of each color you let onto the page.

You will also bump into a basic truth: not everyone agrees on one universal wheel. Pigment mixing, light on a monitor, and ink on paper each favor slightly different primaries. That is fine. What matters is consistency inside your project and kindness to readers, including those who see hue differently than you do.

Below is the same hue ring you will see at the start of every lesson. Spin it, click it, and notice how quickly your eye anchors on a single accent when everything else calms down. The lessons that follow connect this ring to contrast tricks, HSL controls, harmony presets, complements, and finally accessibility plus print.$z00001$),
    jsonb_build_object('id','ct-0002','type','color_lab','preset','hue_wheel'),
    jsonb_build_object('id','ct-0003','type','text','text',$z00002$Three ideas to carry through the whole course, in plain language.

First, match the harmony to the function you need. Some pairings shout for attention; others whisper a family resemblance. Pick on purpose, not because a preset looked trendy in isolation.

Second, lean on lightness and saturation, not hue alone. Hue tells you which family a trace belongs to; lightness tells the eye what to read first when someone prints in gray; saturation is often the volume knob for large fields.

Third, vary how much of each color you use. A strong accent can do more work in a thin stripe than in a half-page flood. When you are ready, go to the next chapter for the classic simultaneous-contrast demo and why your neutrals need a real background.$z00002$)
  ),
    now()
  ),
  (
    'c0c0c000-0002-4000-8000-00000000d001'::uuid,
    (select id from public.courses where slug = 'color-theory-scientific-images'),
    'Contrast, context, and illusions',
    1,
    jsonb_build_array(
    jsonb_build_object('id','ct-0101','type','text','text',$z00003$Readers judge a panel long before they read every label. Color is already grouping regions, pushing one trace forward, and telling a subconscious story about what is background versus signal. When colors fight, people often feel uneasy without being able to name the reason.

The least glamorous step is also the most important: place your swatches on the surface the figure will really use. A legend that looked crisp on an empty artboard can fall apart on cream paper, a dark slide template, or a busy heatmap. Practice on the wrong stage and you rehearse the wrong show.

Use the hue ring below the same way in every chapter: pick a hue, then imagine it as a thin accent line or a large field. That imagination step matters because large saturated areas behave very differently from small glyphs.$z00003$),
    jsonb_build_object('id','ct-0102','type','color_lab','preset','hue_wheel'),
    jsonb_build_object('id','ct-0103','type','html','html',$z00004$<div style='font-family:system-ui,Segoe UI,sans-serif;font-size:14px;line-height:1.5;color:#1e293b'>
  <p style='margin:0 0 10px;font-weight:600'>Simultaneous contrast</p>
  <p style='margin:0 0 14px;color:#475569'>Both inner squares use the same fill: <code style='background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px'>#6b7280</code>. Only the surround changes. Many people still read them as different shades.</p>
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
  <p style='margin:14px 0 0;font-size:12px;color:#64748b'>Park important neutrals on a strip of your real background before you lock the file.</p>
</div>$z00004$,'css',''),
    jsonb_build_object('id','ct-0104','type','text','text',$z00005$The gray squares in the embed are identical on the page. Your visual system still compares them to their neighbors. That is why pathway neutrals and pastel fills shift when the surround changes.

Try a five-minute drill on your own file. Duplicate one panel, nudge only the background warmer in one copy and cooler in another, and leave the data colors untouched. If a legend label suddenly feels too loud or too shy, you have learned something useful without touching your statistics at all.$z00005$)
  ),
    now()
  ),
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
  ),
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
  ),
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
  ),
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