update public.courses c
set
  description =
    'A friendly, plain-language walk through color for journal figures, slides, and posters. You will learn how your eye really responds to hue and contrast, how to build palettes that stay readable in print and on screen, and how to avoid the mistakes that quietly weaken otherwise excellent data.',
  updated_at = now()
where c.slug = 'color-theory-scientific-images';
