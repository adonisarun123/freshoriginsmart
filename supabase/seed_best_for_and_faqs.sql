-- ============================================================================
--  Fresh Origins — "Best for" lines + per-product FAQs for the 4 launch products
-- ----------------------------------------------------------------------------
--  Populates products.description (the structured ProductContent JSON) with:
--    • bestFor : a short one-line "Best for…" hook (PDP + product cards)
--    • faq     : per-product Q&A rendered in the "Product FAQs" accordion
--
--  Safe to re-run: each statement merges the new keys into any existing
--  description JSON via jsonb concatenation (||), so other content keys
--  (why, benefits, cooking, fopClaims, …) are preserved.
--
--  Run with:  psql "$DATABASE_URL" -f supabase/seed_best_for_and_faqs.sql
--  or paste into the Supabase SQL editor.
-- ============================================================================

-- 1) Metabolic Balance Khichdi ------------------------------------------------
update products
set description = coalesce(description, '{}'::jsonb) || jsonb_build_object(
  'bestFor',
    'Families who want an easy, fibre-forward weeknight dinner, cooked just like regular khichdi.',
  'faq', jsonb_build_array(
    jsonb_build_object(
      'q', 'How is this different from regular khichdi?',
      'a', 'It swaps refined staples for a whole millet and moong blend, so you get more fibre* and grain-and-pulse variety while cooking the dish exactly the way you already do. No maida, no added sugar.'),
    jsonb_build_object(
      'q', 'How long does it take to cook?',
      'a', 'About 15–18 minutes in one pot. It also works well in a pressure cooker — see the preparation steps on this page.'),
    jsonb_build_object(
      'q', 'Is it suitable for vegetarians?',
      'a', 'Yes. It is a vegetarian, plant-based blend of millets and moong dal with no added sugar.'),
    jsonb_build_object(
      'q', 'Does it contain gluten?',
      'a', 'It is made to be wheat-free. However, it is manufactured in a facility that also handles cereals containing gluten and tree nuts — please check the allergen line on the pack if you need strict assurance.')
  )
)
where slug = 'metabolic-balance-khichdi';

-- 2) Protein & Fibre Adai Mix -------------------------------------------------
update products
set description = coalesce(description, '{}'::jsonb) || jsonb_build_object(
  'bestFor',
    'Protein-conscious households wanting a savoury, pulse-rich breakfast or tiffin.',
  'faq', jsonb_build_array(
    jsonb_build_object(
      'q', 'What is adai?',
      'a', 'Adai is a traditional South Indian savoury pancake made from a batter of grains and pulses. This mix combines millets, pulses and flaxseed so you can make it without measuring or blending.'),
    jsonb_build_object(
      'q', 'How do I prepare it?',
      'a', 'Mix into a batter, rest briefly, then pan-cook like a dosa or pancake. Full steps are in the preparation section on this page; it is ready in around 20 minutes.'),
    jsonb_build_object(
      'q', 'Why is it described as protein & fibre?',
      'a', 'The pulses contribute protein and the whole grains and flaxseed add fibre*. Exact protein and fibre per serving are shown in the nutrition table on this page.'),
    jsonb_build_object(
      'q', 'Are there any allergens?',
      'a', 'It contains pulses and flaxseed, and is made in a facility that also handles gluten and tree nuts. See the allergen line on the pack.')
  )
)
where slug = 'protein-and-fibre-adai-mix';

-- 3) Heritage Gut-Fibre Kanji Mix ---------------------------------------------
update products
set description = coalesce(description, '{}'::jsonb) || jsonb_build_object(
  'bestFor',
    'Anyone wanting a comforting, fibre-forward porridge that''s simple to prepare.',
  'faq', jsonb_build_array(
    jsonb_build_object(
      'q', 'What is kanji?',
      'a', 'Kanji is a slow-simmered savoury porridge. This blend uses red rice, black rice, millets and green gram for a comforting, fibre-forward bowl.'),
    jsonb_build_object(
      'q', 'Why is it called gut-fibre?',
      'a', 'It is built around fibre-rich* whole grains and pulses in a soft porridge format. The name refers to its fibre content and everyday food choices — not a medical or digestive treatment.'),
    jsonb_build_object(
      'q', 'Is it a soft, easy-to-prepare meal?',
      'a', 'Yes — it cooks down into a soft, slow-simmered porridge, which many families find a simple format for everyday meals. For dietary needs specific to you, please consult a qualified professional.'),
    jsonb_build_object(
      'q', 'How long does it take to cook?',
      'a', 'Around 30 minutes as a slow-simmered porridge. Preparation steps are on this page.')
  )
)
where slug = 'heritage-gut-fibre-kanji-mix';

-- 4) Gluten-Free Protein & Fibre Roti Mix -------------------------------------
update products
set description = coalesce(description, '{}'::jsonb) || jsonb_build_object(
  'bestFor',
    'People choosing wheat-free or gluten-free* flatbreads without giving up everyday rotis.',
  'faq', jsonb_build_array(
    jsonb_build_object(
      'q', 'Is this genuinely gluten-free?',
      'a', 'It is formulated without wheat, using a millet, rice and pulse flour blend. Any gluten-free* claim is subject to validated cross-contamination control and final testing — please check the pack for the confirmed status before relying on it for strict gluten avoidance.'),
    jsonb_build_object(
      'q', 'How do I get the best texture?',
      'a', 'Knead to a smooth dough and roll evenly — the preparation steps on this page explain how to work with a wheat-free blend. Wheat-free flours handle a little differently from maida, so technique makes a difference.'),
    jsonb_build_object(
      'q', 'What flours are in the blend?',
      'a', 'A wheat-free mix of millet, rice and pulse flours — every ingredient is listed in descending order of quantity in the "What''s inside" section. There is no maida.'),
    jsonb_build_object(
      'q', 'Does it contain allergens?',
      'a', 'It contains pulses. See the allergen line on the pack for full details and facility information.')
  )
)
where slug = 'gluten-free-protein-and-fibre-roti-mix';
