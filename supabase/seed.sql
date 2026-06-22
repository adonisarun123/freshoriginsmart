-- ============================================================================
-- Seed data — Fresh Origins launch catalogue (illustrative; replace with final)
-- Prices in paise. Nutrition status kept 'estimated' until lab-validated.
-- ============================================================================

-- ── Categories ──────────────────────────────────────────────────────────────
insert into categories (id, name, slug, description, status, sort_order) values
  ('11111111-0000-0000-0000-000000000001', 'Millets', 'millets', 'Whole grains, flours and blends.', 'active', 1),
  ('11111111-0000-0000-0000-000000000002', 'Traditional Rice', 'traditional-rice', 'Red, black, brown and regional varieties.', 'active', 2),
  ('11111111-0000-0000-0000-000000000003', 'Ready-to-Cook Mixes', 'ready-to-cook-mixes', 'Khichdi, adai, kanji and roti mixes.', 'active', 3);

-- ── Health goals (launch with strong pages first, spec §21.5) ───────────────
insert into health_goals (id, name, slug, summary, status, icon, sort_order) values
  ('22222222-0000-0000-0000-000000000001', 'Protein & Fibre', 'protein-and-fibre', 'Everyday products designed around pulses, whole grains, and fibre-rich ingredients.', 'published', 'protein-fibre', 1),
  ('22222222-0000-0000-0000-000000000002', 'Gut Health', 'gut-health', 'Comforting, fibre-forward formats for a digestive-wellness routine.', 'published', 'gut-health', 2),
  ('22222222-0000-0000-0000-000000000003', 'Blood-Sugar-Conscious Eating', 'blood-sugar-conscious-eating', 'Whole-grain meal options for blood-sugar-conscious meal planning.', 'published', 'blood-sugar', 3),
  ('22222222-0000-0000-0000-000000000004', 'Senior Nutrition', 'senior-nutrition', 'Simple, nourishing, easy-to-prepare meal formats for everyday use.', 'published', 'senior', 4);

-- ── Sourcing region + expert (placeholders until onboarded) ─────────────────
insert into sourcing_regions (id, name, slug, state, description, status) values
  ('33333333-0000-0000-0000-000000000001', 'Karnataka Drylands', 'karnataka-drylands', 'Karnataka', 'Rainfed millet cultivation across dryland farms.', 'active');

insert into experts (id, name, slug, qualification, bio, areas_of_review, status) values
  ('44444444-0000-0000-0000-000000000001', '[Registered Dietitian name]', 'reviewer-rd', 'RD', 'Reviews educational content for nutritional accuracy. Profile shown after formal onboarding.', array['Protein & Fibre','Gut Health','Senior Nutrition'], 'draft');

-- ── Products ────────────────────────────────────────────────────────────────
insert into products
  (id, name, slug, short_description, product_type, status, featured,
   is_wheat_free, is_gluten_free, is_vegan, no_added_sugar, no_maida,
   preparation_time_minutes, storage_instructions, allergen_information,
   suitability_text, seo_title, seo_description, published_at)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Metabolic Balance Khichdi', 'metabolic-balance-khichdi',
   'Millet and moong blend for an easy, fibre-forward meal.', 'mix', 'active', true,
   true, false, true, true, true, 18,
   'Store in a cool, dry place away from direct sunlight. Reseal after opening.',
   'Contains pulses. Manufactured in a facility that also handles cereals containing gluten and tree nuts.',
   'May suit families seeking higher-fibre staples and protein-conscious vegetarians.',
   'Metabolic Balance Khichdi – Millet & Moong Blend',
   'Shop Metabolic Balance Khichdi, made with millets and moong dal. View nutrition, preparation, storage, allergens, and delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Protein & Fibre Adai Mix', 'protein-and-fibre-adai-mix',
   'Multi-grain savoury pancake mix with millets, pulses, and flaxseed.', 'mix', 'active', true,
   true, false, true, true, true, 20,
   'Store in a cool, dry place. Reseal after opening.',
   'Contains pulses and flaxseed. Manufactured in a facility that also handles gluten and tree nuts.',
   'May suit protein-conscious vegetarians and families wanting savoury breakfasts.',
   'Protein & Fibre Adai Mix – Millet & Pulse Pancake Mix',
   'Shop Protein & Fibre Adai Mix with millets, pulses and flaxseed. Nutrition, preparation, allergens, and delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Heritage Gut-Fibre Kanji Mix', 'heritage-gut-fibre-kanji-mix',
   'Red rice, black rice, millets, and green gram in a comforting porridge blend.', 'mix', 'active', true,
   true, false, true, true, true, 30,
   'Store in a cool, dry place. Reseal after opening.',
   'Contains pulses. Manufactured in a facility that also handles gluten and tree nuts.',
   'May suit people seeking comforting, fibre-forward meals and senior-friendly formats.',
   'Heritage Gut-Fibre Kanji Mix – Five-Grain Porridge Blend',
   'Shop Heritage Gut-Fibre Kanji Mix with red rice, black rice, millets and green gram. Nutrition, preparation, allergens, delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Gluten-Free Protein & Fibre Roti Mix', 'gluten-free-protein-and-fibre-roti-mix',
   'Wheat-free millet, rice, and pulse flour blend for everyday flatbreads.', 'mix', 'active', true,
   true, true, true, true, true, 15,
   'Store in a cool, dry place. Reseal after opening.',
   'Contains pulses. Gluten-free claim subject to validated cross-contamination control and final testing.',
   'May suit people choosing wheat-free or gluten-free flatbread options.',
   'Gluten-Free Protein & Fibre Roti Mix – Millet & Pulse Flour',
   'Shop Gluten-Free Protein & Fibre Roti Mix. Wheat-free millet, rice and pulse flour blend. Nutrition, allergens, delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'Traditional Rice — Variety Pack', 'traditional-rice-variety-pack',
   'Red, black, and brown regional rice with origin and cooking ratio details.', 'rice', 'active', false,
   true, false, true, true, true, null,
   'Store in a cool, dry, airtight container.',
   'May contain traces from shared facility equipment.',
   'May suit households exploring traditional whole-grain rice varieties.',
   'Traditional Rice Variety Pack – Red, Black & Brown Rice',
   'Shop a Traditional Rice variety pack with red, black and brown rice. Origin, cooking ratios, and delivery in Bangalore and Hosur.',
   now());

-- product ↔ category
insert into product_categories (product_id, category_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002');

-- product ↔ health goal (documented relevance, spec §21.4)
insert into product_health_goals (product_id, health_goal_id, relevance_summary, display_order) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Millet and moong dal in a one-pot meal with fibre and plant protein per serving.', 1),
  ('aaaaaaaa-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', 'Whole-grain millet base for blood-sugar-conscious meal planning.', 2),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Combines millets and pulses in one savoury batter — a direct grain-plus-pulse pairing.', 1),
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', 'Comforting, fibre-forward porridge that fits a digestive-wellness routine.', 1),
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', 'Soft, easy-to-prepare format suited to senior meal routines.', 2),
  ('aaaaaaaa-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'Millet, rice and pulse flours combined for a fibre-forward everyday flatbread.', 1);

-- ── Variants + inventory ────────────────────────────────────────────────────
insert into product_variants (id, product_id, sku, title, weight_value, weight_unit, mrp_paise, selling_price_paise, sort_order) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'MBK-500', '500 g', 500, 'g', 27500, 24500, 1),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'PFA-400', '400 g', 400, 'g', 22000, 22000, 1),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', 'HGK-450', '450 g', 450, 'g', 26000, 26000, 1),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000004', 'GRM-500', '500 g', 500, 'g', 28500, 28500, 1),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000005', 'TRV-1000', '1 kg', 1000, 'g', 19000, 19000, 1);

insert into inventory (variant_id, available_quantity, reserved_quantity, low_stock_threshold) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 48, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000002', 32, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000003', 6, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000004', 40, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000005', 25, 0, 10);

-- ── Nutrition (estimated; not shown publicly until 'approved') ───────────────
insert into nutrition_facts
  (product_id, serving_size_value, serving_size_unit, servings_per_pack,
   energy_kcal_100g, energy_kcal_serving, protein_g_100g, protein_g_serving,
   carbohydrate_g_100g, total_sugars_g_100g, dietary_fibre_g_100g, dietary_fibre_g_serving,
   fat_g_100g, sodium_mg_100g, status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 60, 'g', 8,
   358, 215, 13.6, 8.2, 62.0, 1.1, 9.4, 5.6, 3.2, 12, 'estimated');

-- ── Ingredients + composition (Metabolic Balance Khichdi) ───────────────────
insert into ingredients (id, common_name, allergen_flag) values
  ('cccccccc-0000-0000-0000-000000000001', 'Foxtail millet', false),
  ('cccccccc-0000-0000-0000-000000000002', 'Barnyard millet', false),
  ('cccccccc-0000-0000-0000-000000000003', 'Split moong dal', true),
  ('cccccccc-0000-0000-0000-000000000004', 'Spices (curry leaves, cumin, turmeric, rock salt)', false);

insert into product_ingredients (product_id, ingredient_id, percentage, label_order) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', 35, 1),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', 25, 2),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000003', 30, 3),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000004', 10, 4);

-- ── Delivery zones + pincodes (Bangalore & Hosur) ───────────────────────────
insert into delivery_zones (id, name, city, delivery_charge_paise, free_delivery_threshold_paise, min_days, max_days, active) values
  ('dddddddd-0000-0000-0000-000000000001', 'Bangalore Central', 'Bangalore', 4900, 59900, 2, 3, true),
  ('dddddddd-0000-0000-0000-000000000002', 'Hosur', 'Hosur', 5900, 59900, 3, 4, true);

insert into delivery_pincodes (pincode, zone_id, active) values
  ('560001', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560038', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560066', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560078', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560102', 'dddddddd-0000-0000-0000-000000000001', true),
  ('635109', 'dddddddd-0000-0000-0000-000000000002', true),
  ('635126', 'dddddddd-0000-0000-0000-000000000002', true);

-- ── Recipe + article (published examples) ───────────────────────────────────
insert into recipes (id, title, slug, summary, prep_time_minutes, cook_time_minutes, servings, meal_occasion, status, published_at,
  ingredients, instructions, nutrition_estimate, allergen_text)
values
  ('eeeeeeee-0000-0000-0000-000000000001', 'Vegetable Millet Khichdi Bowl', 'vegetable-millet-khichdi-bowl',
   'A comforting one-pot bowl made with Metabolic Balance Khichdi and everyday vegetables.', 10, 18, 3, 'Lunch', 'published', now(),
   '[{"item":"Metabolic Balance Khichdi mix","qty":"1 cup"},{"item":"Water","qty":"3 cups"},{"item":"Mixed vegetables","qty":"1 cup"},{"item":"Ghee or oil","qty":"1 tbsp"}]'::jsonb,
   '["Rinse the mix until water runs clear.","Heat ghee, add cumin and ginger.","Add vegetables and saute.","Add mix, water and salt.","Pressure cook 3-4 whistles.","Rest 5 minutes and serve."]'::jsonb,
   '{"energy_kcal":260,"protein_g":9,"fibre_g":6,"fat_g":6}'::jsonb,
   'Contains pulses; may contain gluten and tree nuts depending on garnish.');

insert into recipe_products (recipe_id, product_id) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001');

insert into articles (id, title, slug, summary, status, published_at, reviewer_id, reviewed_at, health_goal_tags,
  body, references_json)
values
  ('ffffffff-0000-0000-0000-000000000001', 'How to transition from white rice to millets', 'white-rice-to-millets',
   'A practical, expert-reviewed guide to gradually introducing millets alongside white rice.', 'published', now(),
   '44444444-0000-0000-0000-000000000001', now(), array['Millets','Whole grains','Blood-sugar-conscious'],
   '[{"h2":"Start with dishes you already make"},{"p":"Begin with one familiar dish and swap part of the rice for millets."}]'::jsonb,
   '[{"label":"Whole grains and dietary fibre guidance","note":"placeholder"}]'::jsonb);

-- ── Sample enquiry + newsletter (for admin views) ───────────────────────────
insert into enquiries (enquiry_type, name, organisation, email, city, message, status) values
  ('retail', 'Sample Retailer', 'Green Grocer', 'retailer@example.com', 'Bangalore', 'Interested in stocking ready-to-cook mixes.', 'new'),
  ('distributor', 'Sample Distributor', 'South Foods', 'dist@example.com', 'Hosur', 'Territory enquiry for Hosur.', 'new');
