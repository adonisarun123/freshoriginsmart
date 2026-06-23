-- ============================================================================
-- 0009 — Rich product detail data (from Fresh Origins Product Portfolio)
--   * Enriches products.description with structured JSON the PDP renders
--   * Adds the new "Protein & Fibre Chapati Atta" product
--   * Refreshes ingredient composition (with functional roles) + nutrition
--   * Adds 250g/500g/1kg variants + inventory per the portfolio pack plan
--
-- All nutrition is status 'estimated' (prototype-stage; spec + portfolio note).
-- Idempotent: safe to re-run (deletes child rows it owns before reinserting).
-- ============================================================================

-- ── New product: Protein & Fibre Chapati Atta ───────────────────────────────
insert into products
  (id, name, slug, short_description, product_type, status, featured,
   is_wheat_free, is_gluten_free, is_vegan, no_added_sugar, no_maida,
   preparation_time_minutes, storage_instructions, allergen_information,
   suitability_text, seo_title, seo_description, published_at)
values
  ('aaaaaaaa-0000-0000-0000-000000000006', 'Protein & Fibre Chapati Atta',
   'protein-and-fibre-chapati-atta',
   'Whole wheat, traditional millets and roasted pulses for soft everyday chapatis.',
   'mix', 'active', false,
   false, false, true, true, true, 20,
   'Store in a cool, dry place away from sunlight, heat and moisture. Reseal tightly after every use. A high-barrier pack is recommended as millet and flaxseed fats can oxidise.',
   'Contains wheat and gluten. Not suitable for people with coeliac disease or those requiring a gluten-free diet. May contain traces from shared facility equipment.',
   E'Families seeking more nutritious chapatis\nFitness-focused consumers\nVegetarians\nWeight-conscious adults\nThose wanting familiar wheat chapatis with added millets and pulses',
   'Protein & Fibre Chapati Atta – Whole Wheat, Millets & Roasted Pulses',
   'Shop Protein & Fibre Chapati Atta — whole wheat with millets, roasted pulses and flax for softer, higher-fibre everyday chapatis. Delivery in Bangalore and Hosur.',
   now())
on conflict (slug) do nothing;

-- Map chapati atta to category + health goals
insert into product_categories (product_id, category_id)
select 'aaaaaaaa-0000-0000-0000-000000000006', id from categories where slug = 'ready-to-cook-mixes'
on conflict do nothing;

insert into product_health_goals (product_id, health_goal_id, relevance_summary, display_order)
select 'aaaaaaaa-0000-0000-0000-000000000006', id,
  'Whole wheat combined with millets and roasted pulses raises the protein and fibre of a familiar everyday chapati.', 1
from health_goals where slug = 'protein-and-fibre'
on conflict do nothing;

-- Variants for chapati atta (500 g / 1 kg) + inventory
insert into product_variants (id, product_id, sku, title, weight_value, weight_unit, mrp_paise, selling_price_paise, sort_order)
values
  ('bbbbbbbb-0000-0000-0000-000000000061', 'aaaaaaaa-0000-0000-0000-000000000006', 'PFC-500', '500 g', 500, 'g', 18500, 17500, 1),
  ('bbbbbbbb-0000-0000-0000-000000000062', 'aaaaaaaa-0000-0000-0000-000000000006', 'PFC-1000', '1 kg', 1000, 'g', 34000, 31500, 2)
on conflict (sku) do nothing;

insert into inventory (variant_id, available_quantity, reserved_quantity, low_stock_threshold)
values
  ('bbbbbbbb-0000-0000-0000-000000000061', 30, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000062', 18, 0, 10)
on conflict (variant_id) do nothing;

-- Add 250 g / 1 kg variants to the original launch products (portfolio pack plan)
insert into product_variants (id, product_id, sku, title, weight_value, weight_unit, mrp_paise, selling_price_paise, sort_order)
values
  -- Metabolic Balance Khichdi: 250 g + 1 kg (500 g already seeded)
  ('bbbbbbbb-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'MBK-250', '250 g', 250, 'g', 14500, 13500, 0),
  ('bbbbbbbb-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 'MBK-1000', '1 kg', 1000, 'g', 49000, 44000, 2),
  -- Adai Mix: 250 g (500 g style already seeded as 400 g)
  ('bbbbbbbb-0000-0000-0000-000000000021', 'aaaaaaaa-0000-0000-0000-000000000002', 'PFA-250', '250 g', 250, 'g', 14000, 14000, 0),
  -- Kanji Mix: 250 g
  ('bbbbbbbb-0000-0000-0000-000000000031', 'aaaaaaaa-0000-0000-0000-000000000003', 'HGK-250', '250 g', 250, 'g', 15500, 15500, 0),
  -- Roti Mix: 1 kg
  ('bbbbbbbb-0000-0000-0000-000000000041', 'aaaaaaaa-0000-0000-0000-000000000004', 'GRM-1000', '1 kg', 1000, 'g', 54000, 50000, 2)
on conflict (sku) do nothing;

insert into inventory (variant_id, available_quantity, reserved_quantity, low_stock_threshold)
values
  ('bbbbbbbb-0000-0000-0000-000000000011', 30, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000012', 20, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000021', 25, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000031', 20, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000041', 15, 0, 10)
on conflict (variant_id) do nothing;

-- ── Structured PDP content (products.description JSON) ───────────────────────
-- Shape consumed by the product detail page:
-- { positioning, why, benefits[], cooking[{title, steps[]}], cookingNotes[],
--   fopClaims[], faq[{q,a}] }

update products set description = $json$
{
  "positioning": "A balanced everyday khichdi blend made with three millets and moong dal for families seeking a higher-fibre alternative to conventional white-rice khichdi.",
  "why": "Made with barnyard, foxtail and little millets plus split moong dal, this khichdi is a practical, fibre-forward one-pot meal — a better grain choice that keeps the familiar khichdi experience intact.",
  "benefits": [
    "Made with three traditional millets",
    "Plant protein from moong dal",
    "Higher fibre than ordinary rice khichdi",
    "No added sugar",
    "Convenient one-pot meal",
    "Works with vegetables and greens",
    "Familiar Indian meal format"
  ],
  "cooking": [
    {"title": "Pressure-cooker method", "steps": [
      "Add 60 g of the khichdi mix to the pressure cooker.",
      "Add about 180–210 ml water (more for a softer consistency).",
      "Add salt to taste; optionally add vegetables, spinach, coriander or a teaspoon of ghee.",
      "Pressure-cook for about 3 whistles.",
      "Let the pressure release naturally, stir and rest 3–5 minutes.",
      "Serve with curd, vegetables, pickle or a protein side."
    ]},
    {"title": "Open-pot method", "steps": [
      "Add one measure of mix to about three measures of water.",
      "Bring to a boil, cover and simmer on low for 15–18 minutes.",
      "Stir occasionally, adding hot water if needed, until grains and dal are soft."
    ]}
  ],
  "cookingNotes": [
    "For seniors, use more water and cook to a softer consistency.",
    "Vegetables add volume, flavour and make the meal more complete."
  ],
  "fopClaims": ["Three-Millet & Moong Khichdi", "High Fibre*", "Source of Plant Protein*", "No Added Sugar", "Ready-to-Cook"],
  "faq": [
    {"q": "Is this a diabetic product?", "a": "No. It is a higher-fibre, blood-sugar-conscious everyday khichdi made with whole millets and moong dal. It is a food, not a treatment for any condition."},
    {"q": "How much protein and fibre per serving?", "a": "Approximately 8.1 g protein and 6.5 g fibre per 60 g serving, based on indicative prototype values pending lab validation."},
    {"q": "Can I add vegetables?", "a": "Yes — vegetables, spinach and greens work well and make the meal more complete."}
  ]
}
$json$::jsonb
where slug = 'metabolic-balance-khichdi';

update products set description = $json$
{
  "positioning": "A wholesome savoury breakfast and dinner mix combining millets, traditional red rice, pulses and flaxseed for protein, fibre and fullness.",
  "why": "Five grains, two pulses and flaxseed in one batter — a plant-protein-rich, higher-fibre alternative to refined-flour breakfasts, in the familiar form of adai and chilla.",
  "benefits": [
    "Five grains, two pulses and flaxseed",
    "Plant-protein-rich breakfast format",
    "Higher fibre than refined-flour breakfasts",
    "No maida",
    "For adai, chilla and savoury pancakes",
    "Customise with vegetables",
    "Familiar, convenient Indian format"
  ],
  "cooking": [
    {"title": "Standard adai", "steps": [
      "Add 60 g of mix to a bowl.",
      "Add about 90–110 ml water gradually into a thick, pourable batter (optionally a tablespoon or two of curd).",
      "Rest the batter for 15–20 minutes.",
      "Add chopped onion, coriander, carrot, spinach or green chilli if you like; salt to taste.",
      "Heat and lightly grease a tawa; pour and spread into a thick adai.",
      "Cook on medium until the edges firm up, then flip and cook through.",
      "Serve hot with chutney, curd or sambar."
    ]},
    {"title": "Softer pancake", "steps": [
      "Use slightly more water and optional curd; keep the batter medium-thick.",
      "Cook smaller pancakes on medium-low heat, covering briefly on the first side."
    ]}
  ],
  "cookingNotes": [
    "The mix is coarsely milled, not a fine flour — batter hydration varies a little with flaxseed.",
    "For a higher-protein meal, serve with curd, paneer, eggs or a dal-based chutney."
  ],
  "fopClaims": ["Protein & Fibre Millet Adai", "Five Grains, Two Pulses & Flaxseed", "High Fibre*", "Source of Plant Protein*", "No Maida", "Ready-to-Cook"],
  "faq": [
    {"q": "What can I make with it?", "a": "Adai, chilla and savoury vegetable pancakes. It customises well with chopped vegetables."},
    {"q": "Does it contain maida?", "a": "No. It is made from millets, pulses, red rice and flaxseed — no refined flour."},
    {"q": "Is it a weight-loss product?", "a": "No. It is a protein- and fibre-forward food that can fit a balanced, satiety-focused diet — not a weight-loss treatment."}
  ]
}
$json$::jsonb
where slug = 'protein-and-fibre-adai-mix';

update products set description = $json$
{
  "positioning": "A comforting porridge blend of traditional red rice, black rice, millets, green gram and flaxseed for everyday fibre and grain diversity — sweet or savoury.",
  "why": "Heritage red and black rice with kodo and little millets and green gram make a soft, fibre-rich kanji that suits everyday breakfasts and senior-friendly meals.",
  "benefits": [
    "Traditional red rice and black rice",
    "Millet and pulse combination",
    "High-fibre positioning*",
    "Sweet or savoury preparation",
    "Soft format suited to seniors",
    "No maida, no added sugar in the base"
  ],
  "cooking": [
    {"title": "Savoury kanji", "steps": [
      "Add 60 g of mix to a pan or pressure cooker with about 300–360 ml water and salt to taste.",
      "Pressure-cook for ~3 whistles, or simmer covered for 20–25 minutes.",
      "Stir, adding hot water for a thinner consistency; cool slightly.",
      "Add curd or buttermilk after slight cooling if desired; garnish with coriander or roasted cumin."
    ]},
    {"title": "Breakfast porridge", "steps": [
      "Cook 60 g with ~300 ml water until soft.",
      "Add milk or plant-based milk after the grains are cooked; stir until smooth.",
      "Top with nuts, seeds or fresh fruit; sweeten lightly only if needed."
    ]},
    {"title": "Senior-friendly soft porridge", "steps": [
      "Use about 360–420 ml water for 60 g and pressure-cook until very soft.",
      "Mash or blend lightly if required; adjust seasoning to dietary needs."
    ]}
  ],
  "cookingNotes": [
    "Black rice may slightly darken the finished porridge.",
    "Cooking time varies with rice variety and milling size."
  ],
  "fopClaims": ["Heritage High-Fibre Kanji*", "Red Rice, Black Rice & Millets", "Five-Grain Blend", "No Added Sugar", "Sweet or Savoury", "Ready-to-Cook"],
  "faq": [
    {"q": "Sweet or savoury?", "a": "Both. Cook savoury with seasoning and curd, or as a breakfast porridge with milk and fruit."},
    {"q": "Is it suitable for elders?", "a": "Yes — cook with more water to a soft consistency. It is a gentle, fibre-rich porridge format."},
    {"q": "Does it heal the gut?", "a": "No. It is a fibre-rich traditional porridge, not a treatment for any digestive condition."}
  ]
}
$json$::jsonb
where slug = 'heritage-gut-fibre-kanji-mix';

update products set description = $json$
{
  "positioning": "A wheat-free roti mix of jowar, bajra, traditional red rice, protein-rich pulses, tapioca, psyllium and flaxseed for practical everyday gluten-free flatbreads.",
  "why": "Single-millet rotis are notoriously hard to roll. This blend combines millets, rice, pulses and natural binders so wheat-free, gluten-free* flatbreads roll and cook more easily.",
  "benefits": [
    "Wheat-free formulation",
    "Gluten-free positioning*",
    "Millet and pulse based",
    "High-fibre potential*",
    "Source of plant protein*",
    "No maida, no added sugar",
    "Rolls more easily than ordinary single-millet rotis"
  ],
  "cooking": [
    {"title": "Standard gluten-free roti", "steps": [
      "Add 120 g of roti mix to a heat-safe bowl.",
      "Heat about 135–150 ml water until hot, then add gradually while mixing with a spoon (optionally a teaspoon of oil).",
      "Cool until safe to handle, then knead gently into a smooth dough; rest 10–15 minutes.",
      "Divide into four; dust lightly with rice flour and roll gently (repair edge cracks with damp fingers).",
      "Cook on a properly heated tawa, turning when the first side firms up.",
      "Press gently with a cloth to encourage partial puffing; serve immediately or keep insulated."
    ]},
    {"title": "Soft-wrap variation", "steps": [
      "Use slightly more water and roll a little thicker.",
      "Cook on medium heat, brush lightly with oil, then stack and cover immediately."
    ]}
  ],
  "cookingNotes": [
    "Hot water is important for hydration and binding.",
    "Rice flour is for dusting only; the roti may partially puff (it will not puff like wheat)."
  ],
  "fopClaims": ["Millets, Traditional Rice & Pulses", "Wheat-Free", "Gluten-Free*", "High Fibre*", "Source of Plant Protein*", "No Maida", "Ready-to-Cook"],
  "faq": [
    {"q": "Why hot water?", "a": "Hot water hydrates the psyllium and starches so the dough binds and rolls without cracking. Knead once it is cool enough to handle."},
    {"q": "Is it truly gluten-free?", "a": "The recipe is wheat-free. A gluten-free claim depends on compliant sourcing, controlled processing and final testing — we mark the claim with an asterisk until that is in place."},
    {"q": "Will it puff like wheat roti?", "a": "It may partially puff. It is designed to roll and cook well, not to mimic wheat-gluten puffing."}
  ]
}
$json$::jsonb
where slug = 'gluten-free-protein-and-fibre-roti-mix';

update products set description = $json$
{
  "positioning": "A soft, familiar everyday chapati flour of whole wheat, pulses, millets, flaxseed and psyllium — more protein and fibre without a brittle dough.",
  "why": "Most multigrain attas trade softness for nutrition. This blend keeps a whole-wheat base for easy rolling and puffing while roasted pulses and millets raise protein and fibre.",
  "benefits": [
    "Familiar wheat-chapati experience",
    "Millets and pulses in an everyday staple",
    "Higher protein and fibre than refined flour",
    "No maida",
    "For chapati, phulka, paratha and thepla",
    "Rolls softer than a fully gluten-free mix"
  ],
  "cooking": [
    {"title": "Standard chapati", "steps": [
      "Add 180 g of atta to a bowl.",
      "Add about 120–135 ml lukewarm water gradually and knead for 5–6 minutes.",
      "Cover and rest the dough for 15–20 minutes, then divide into six.",
      "Roll using minimal dry flour and cook on a hot tawa.",
      "Turn when bubbles appear; finish over direct flame if desired.",
      "Store cooked chapatis in an insulated container to retain softness."
    ]}
  ],
  "cookingNotes": [
    "This blend absorbs more water than ordinary atta — add water gradually; the dough should be soft, not sticky.",
    "Too much dry flour while rolling can make the chapati drier."
  ],
  "fopClaims": ["Whole Wheat, Millets & Roasted Pulses", "High Fibre*", "Source of Plant Protein*", "No Maida", "Soft Everyday Multigrain Chapatis"],
  "faq": [
    {"q": "Does it contain gluten?", "a": "Yes. It contains wheat and gluten and is not suitable for coeliac disease or a gluten-free diet. For a wheat-free option, see our Gluten-Free Roti Mix."},
    {"q": "Will the chapatis stay soft?", "a": "Yes — flax and psyllium help retain moisture. Knead a soft dough, rest it, and store cooked chapatis insulated."},
    {"q": "What can I make?", "a": "Chapati, phulka, paratha and thepla."}
  ]
}
$json$::jsonb
where slug = 'protein-and-fibre-chapati-atta';

-- ── Ingredient composition with functional roles ────────────────────────────
-- Use display_name_override to carry the functional role for the PDP, and
-- percentage for the composition bar. Reset each product's rows first.

-- Shared ingredient rows (created if missing)
insert into ingredients (common_name, allergen_flag) values
  ('Barnyard millet', false), ('Foxtail millet', false), ('Little millet', false),
  ('Proso millet', false), ('Kodo millet', false), ('Pearl millet (bajra)', false),
  ('Finger millet (ragi)', false), ('Jowar (sorghum)', false),
  ('Split moong dal', true), ('Green gram', true), ('Black gram (urad)', true),
  ('Roasted Bengal gram', true), ('Sprouted green gram flour', true), ('Horse gram', true),
  ('Traditional red rice', false), ('Black rice', false),
  ('Flaxseed', false), ('Psyllium husk', false), ('Tapioca starch', false),
  ('Whole wheat atta', true), ('Fenugreek seeds', false),
  ('Spices & seasoning', false)
on conflict do nothing;

-- Helper: clear then insert composition for a product
-- Metabolic Balance Khichdi
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000001';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000001', id, p, o, role from (values
  ('Barnyard millet', 30::numeric, 1, 'Fibre-rich millet base'),
  ('Foxtail millet', 25, 2, 'Traditional grain, texture & fibre'),
  ('Little millet', 20, 3, 'Grain diversity & fibre'),
  ('Split moong dal', 20, 4, 'Plant protein, texture & satiety'),
  ('Fenugreek seeds', 2, 5, 'Traditional functional ingredient & flavour'),
  ('Spices & seasoning', 3, 6, 'Cumin, black pepper, turmeric & ginger')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Protein & Fibre Adai Mix
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000002';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000002', id, p, o, role from (values
  ('Proso millet', 25::numeric, 1, 'Millet base & protein contribution'),
  ('Foxtail millet', 20, 2, 'Fibre, texture & traditional grain value'),
  ('Kodo millet', 15, 3, 'Fibre & grain diversity'),
  ('Green gram', 15, 4, 'Plant protein & satiety'),
  ('Black gram (urad)', 10, 5, 'Protein, binding & adai texture'),
  ('Traditional red rice', 10, 6, 'Heritage positioning, colour & texture'),
  ('Flaxseed', 3, 7, 'Fibre, healthy fats & moisture retention'),
  ('Spices & seasoning', 2, 8, 'Cumin, chilli & curry-leaf powder')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Heritage Gut-Fibre Kanji Mix
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000003';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000003', id, p, o, role from (values
  ('Traditional red rice', 25::numeric, 1, 'Heritage grain base, colour & fibre'),
  ('Kodo millet', 20, 2, 'Fibre & grain diversity'),
  ('Little millet', 20, 3, 'Fibre & mild taste'),
  ('Black rice', 15, 4, 'Premium heritage positioning & colour'),
  ('Green gram', 15, 5, 'Plant protein & meal balance'),
  ('Flaxseed', 3, 6, 'Fibre, healthy fats & texture'),
  ('Spices & seasoning', 2, 7, 'Dry ginger, cumin & ajwain')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Gluten-Free Protein & Fibre Roti Mix
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000004';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000004', id, p, o, role from (values
  ('Jowar (sorghum)', 25::numeric, 1, 'Main millet base & mild flavour'),
  ('Roasted Bengal gram', 20, 2, 'Protein, fibre & flavour'),
  ('Pearl millet (bajra)', 15, 3, 'Fibre, minerals & traditional grain value'),
  ('Sprouted green gram flour', 15, 4, 'Plant protein & differentiation'),
  ('Traditional red rice', 12, 5, 'Dough handling & lighter texture'),
  ('Tapioca starch', 7, 6, 'Flexibility, softness & less cracking'),
  ('Psyllium husk', 4, 7, 'Binding, water retention & rolling support'),
  ('Flaxseed', 2, 8, 'Fibre, healthy fats & water retention')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Protein & Fibre Chapati Atta
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000006';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000006', id, p, o, role from (values
  ('Whole wheat atta', 55::numeric, 1, 'Gluten structure, softness, rolling & puffing'),
  ('Roasted Bengal gram', 15, 2, 'Protein, fibre & roasted flavour'),
  ('Sprouted green gram flour', 10, 3, 'Plant protein & differentiation'),
  ('Pearl millet (bajra)', 8, 4, 'Fibre & traditional grain positioning'),
  ('Finger millet (ragi)', 5, 5, 'Fibre, colour & millet diversity'),
  ('Horse gram', 4, 6, 'Protein & traditional functional-food story'),
  ('Flaxseed', 2, 7, 'Fibre, healthy fats & moisture retention'),
  ('Psyllium husk', 1, 8, 'Water binding & softness support')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- ── Nutrition facts (indicative; per 100 g + per 60 g serving) ───────────────
delete from nutrition_facts where product_id in (
  'aaaaaaaa-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000002',
  'aaaaaaaa-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000004',
  'aaaaaaaa-0000-0000-0000-000000000006');

insert into nutrition_facts
  (product_id, serving_size_value, serving_size_unit, servings_per_pack,
   energy_kcal_100g, energy_kcal_serving, protein_g_100g, protein_g_serving,
   carbohydrate_g_100g, dietary_fibre_g_100g, dietary_fibre_g_serving,
   fat_g_100g, status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 60, 'g', 8, 326, 195, 13.5, 8.1, 63.5, 10.9, 6.5, 3.2, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 60, 'g', 6, 349, 209, 14.3, 8.6, 64.5, 9.3, 5.6, 3.6, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 60, 'g', 7, 354, 213, 10.7, 6.4, 68.1, 8.6, 5.2, 4.3, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 60, 'g', 8, 353, 212, 13.7, 8.2, 68.7, 12.2, 7.3, 4.2, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000006', 60, 'g', 8, 351, 211, 14.8, 8.9, 67.3, 11.6, 6.9, 3.6, 'estimated');
