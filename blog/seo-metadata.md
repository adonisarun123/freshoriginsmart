# Fresh Origins — Blog SEO Metadata & Internal-Linking Map

Reference for the 17 `/learn/[article-slug]` posts. Machine-readable version: `seo-metadata.json`.

**Conventions**
- Meta titles are given **without** a brand suffix and kept ≤ ~55 characters so `generateMetadata()` can append `" | Fresh Origins"` and stay near the ~60-char display limit. If your template doesn't append the brand, add it manually where it fits.
- Meta descriptions are ≤ ~155 characters, contain the primary keyword, and carry no health/medical claims (Level A/C only).
- Canonical path for every article is `/learn/{slug}`.
- Internal links follow a **hub-and-spoke** model: articles link sideways to related articles and *up* to commerce pages (category `/shop/...`, product `/products/...`) and, where relevant, `/health-goals/...`.

---

## 1. Meta titles & descriptions

| # | Slug (`/learn/…`) | Primary keyword | Meta title (≤55) | Meta description (≤155) |
|---|---|---|---|---|
| 1 | `millet-foxtail` | foxtail millet (thinai) | Foxtail Millet (Thinai): Taste, Cooking & Uses | Foxtail millet (thinai/kangni) is a mild, quick-cooking traditional grain. How it tastes, how to cook it, and how to use it in everyday meals. |
| 2 | `millet-barnyard` | barnyard millet (kuthiraivali) | Barnyard Millet (Kuthiraivali): Cooking & Uses | Barnyard millet (sanwa/kuthiraivali) is a fast-cooking, fibre-forward millet. How it tastes, how to cook it soft, and where to use it. |
| 3 | `millet-little` | little millet (samai) | Little Millet (Samai): Taste, Cooking & Uses | Little millet (samai/kutki) cooks a lot like rice — soft, mild and versatile. A guide to its taste, cooking method and everyday uses. |
| 4 | `millet-kodo` | kodo millet (varagu) | Kodo Millet (Varagu): Taste, Cooking & Uses | Kodo millet (varagu/kodra) is a hardy, high-fibre grain with an earthy taste. How to soak, cook and use it in porridges and one-pot meals. |
| 5 | `millet-proso` | proso millet (panivaragu) | Proso Millet (Panivaragu): Cooking & Uses | Proso millet (panivaragu/barri) is a quick-cooking grain with a protein edge. How it tastes, how to cook it fluffy, and how to use it. |
| 6 | `millet-jowar-sorghum` | jowar / sorghum | Jowar (Sorghum): Flour, Roti & How to Cook It | Jowar (sorghum) is the grain behind jowar roti and bhakri. How its gluten-free flour behaves, how to make soft rotis, and how to use it. |
| 7 | `millet-bajra-pearl` | bajra / pearl millet | Bajra (Pearl Millet): Flour, Roti & Cooking | Bajra (pearl millet) is the robust grain behind winter bhakri and rotla. How its flour works, how to make soft bajra roti, and how to use it. |
| 8 | `rice-traditional-red` | traditional red rice | Traditional Red Rice: Taste, Cooking & Uses | Traditional red rice keeps its reddish bran for a nutty bite and more fibre. Varieties, cooking ratios and how to use red rice every day. |
| 9 | `rice-black` | black rice | Black Rice: Taste, Cooking & How to Use It | Black rice cooks to a striking deep purple with a nutty, chewy bite. Where it comes from, how to soak and cook it, and how to use it. |
| 10 | `rice-brown-heritage` | brown rice / rice polishing | Brown & Heritage Rice: Polishing, Bran & Bite | Brown and lightly polished heritage rice keep more bran than white rice. Understand polishing, cooking, and choosing rice with intent. |
| 11 | `metabolic-balance-khichdi` | millet khichdi mix | Metabolic Balance Khichdi: Millet & Moong Meal | Inside our Metabolic Balance Khichdi — three millets and moong dal for an easy, fibre-forward one-pot meal. Ingredients, cooking, serving ideas. |
| 12 | `protein-fibre-adai-mix` | adai mix / millet adai | Protein & Fibre Adai Mix: Savoury Pancake | Inside our Protein & Fibre Adai Mix — millets, pulses, red rice and flax for a hearty adai. Full ingredients, how to make the batter, serving ideas. |
| 13 | `heritage-gut-fibre-kanji-mix` | kanji mix / rice porridge | Heritage Gut-Fibre Kanji Mix: Grain Porridge | Inside our Heritage Gut-Fibre Kanji Mix — red rice, black rice, millets and green gram in a comforting porridge. Ingredients and how to cook it. |
| 14 | `gluten-free-protein-fibre-roti-mix` | gluten-free roti mix | Gluten-Free Roti Mix: Soft Wheat-Free Rotis | Inside our Gluten-Free Protein & Fibre Roti Mix — millets, pulse flours and binders for soft wheat-free rotis. Ingredients and how to make them. |
| 15 | `switching-from-white-rice-to-millets` | how to switch to millets | How to Switch from White Rice to Millets | A gentle, practical guide to adding millets to a rice kitchen — where to start, a mixing-ratio ladder, cooking tips, and winning the family over. |
| 16 | `pairing-grains-and-pulses` | grains and pulses / complete protein | Grains + Pulses: Balanced Vegetarian Meals | Why khichdi, dal-chawal and idli pair grains with pulses — how the combination builds a more balanced plant-protein plate, with everyday examples. |
| 17 | `fibre-rich-meal-planning` | fibre-rich Indian meals | Fibre-Rich Meal Planning for Indian Kitchens | What dietary fibre is and a simple way to build more into everyday Indian meals — with a full-day and 7-day fibre-forward framework. |

---

## 2. Secondary keywords (per article)

- **millet-foxtail:** thinai recipe, kangni millet, korra, foxtail millet cooking, wheat-free grain
- **millet-barnyard:** sanwa millet, kuthiraivali, samvat rice, fast-cooking millet
- **millet-little:** samai rice, kutki millet, little millet pongal, rice alternative
- **millet-kodo:** varagu rice, kodra, high-fibre millet, kodo millet kanji
- **millet-proso:** panivaragu, barri millet, proso millet upma, protein millet
- **millet-jowar-sorghum:** jowar roti, cholam, bhakri, gluten-free flour, jowar flour
- **millet-bajra-pearl:** bajra roti, kambu, sajje, bajra rotla, pearl millet flour
- **rice-traditional-red:** matta rice, red rice benefits, unpolished rice, red rice cooking
- **rice-black:** chak-hao, forbidden rice, purple rice, black rice kheer
- **rice-brown-heritage:** unpolished rice, semi-polished rice, brown rice vs white, rice polishing
- **metabolic-balance-khichdi:** millet khichdi, ready-to-cook khichdi, moong dal khichdi, one-pot meal
- **protein-fibre-adai-mix:** adai recipe, millet adai, protein pancake, adai mix
- **heritage-gut-fibre-kanji-mix:** kanji recipe, rice porridge, savoury kanji, millet kanji
- **gluten-free-protein-fibre-roti-mix:** gluten-free roti, millet roti mix, wheat-free flatbread, multigrain roti
- **switching-from-white-rice-to-millets:** millets for beginners, millet vs rice, how to cook millets
- **pairing-grains-and-pulses:** complete protein vegetarian, dal chawal nutrition, grain pulse combination
- **fibre-rich-meal-planning:** high fibre Indian diet, fibre foods India, soluble insoluble fibre

---

## 3. Internal-linking map

Each article should link to the related **articles** (sideways) and **commerce/goal pages** (up) below. Reciprocal links are recommended.

| Article | → Related articles (`/learn/…`) | → Commerce / goal pages |
|---|---|---|
| `millet-foxtail` | millet-little, millet-barnyard, switching-from-white-rice-to-millets | /shop/millets, /products/metabolic-balance-khichdi, /products/protein-fibre-adai-mix |
| `millet-barnyard` | millet-foxtail, millet-little, switching-from-white-rice-to-millets | /shop/millets, /products/metabolic-balance-khichdi |
| `millet-little` | millet-foxtail, millet-barnyard, switching-from-white-rice-to-millets | /shop/millets, /products/metabolic-balance-khichdi, /products/heritage-gut-fibre-kanji-mix |
| `millet-kodo` | millet-little, millet-proso, fibre-rich-meal-planning | /shop/millets, /products/protein-fibre-adai-mix, /products/heritage-gut-fibre-kanji-mix |
| `millet-proso` | millet-foxtail, millet-kodo, pairing-grains-and-pulses | /shop/millets, /products/protein-fibre-adai-mix |
| `millet-jowar-sorghum` | millet-bajra-pearl, rice-traditional-red, switching-from-white-rice-to-millets | /shop/millets, /products/gluten-free-protein-fibre-roti-mix |
| `millet-bajra-pearl` | millet-jowar-sorghum, fibre-rich-meal-planning | /shop/millets, /products/gluten-free-protein-fibre-roti-mix |
| `rice-traditional-red` | rice-black, rice-brown-heritage, pairing-grains-and-pulses | /shop/traditional-rice, /products/protein-fibre-adai-mix, /products/heritage-gut-fibre-kanji-mix |
| `rice-black` | rice-traditional-red, rice-brown-heritage | /shop/traditional-rice, /products/heritage-gut-fibre-kanji-mix |
| `rice-brown-heritage` | rice-traditional-red, rice-black, switching-from-white-rice-to-millets, fibre-rich-meal-planning | /shop/traditional-rice |
| `metabolic-balance-khichdi` | millet-barnyard, millet-foxtail, millet-little, switching-from-white-rice-to-millets, fibre-rich-meal-planning | /products/metabolic-balance-khichdi, /shop/ready-to-cook-mixes, /health-goals/protein-fibre, /health-goals/gut-health |
| `protein-fibre-adai-mix` | millet-proso, millet-foxtail, millet-kodo, rice-traditional-red, pairing-grains-and-pulses | /products/protein-fibre-adai-mix, /shop/ready-to-cook-mixes, /health-goals/protein-fibre |
| `heritage-gut-fibre-kanji-mix` | rice-traditional-red, rice-black, millet-kodo, millet-little, fibre-rich-meal-planning | /products/heritage-gut-fibre-kanji-mix, /shop/ready-to-cook-mixes, /health-goals/gut-health, /health-goals/senior-nutrition |
| `gluten-free-protein-fibre-roti-mix` | millet-jowar-sorghum, millet-bajra-pearl, rice-traditional-red | /products/gluten-free-protein-fibre-roti-mix, /shop/ready-to-cook-mixes, /health-goals/protein-fibre |
| `switching-from-white-rice-to-millets` | millet-foxtail, millet-little, millet-barnyard, metabolic-balance-khichdi, fibre-rich-meal-planning | /shop/millets, /shop/ready-to-cook-mixes |
| `pairing-grains-and-pulses` | metabolic-balance-khichdi, protein-fibre-adai-mix, fibre-rich-meal-planning | /shop/ready-to-cook-mixes, /shop/millets |
| `fibre-rich-meal-planning` | switching-from-white-rice-to-millets, pairing-grains-and-pulses, rice-brown-heritage | /shop/ready-to-cook-mixes, /health-goals/gut-health, /health-goals/protein-fibre |

---

## 4. Notes
- **Article slug (`/learn/{slug}`) is distinct from product slug (`/products/{slug}`)** even where they match (the four blends). Keep both routes; interlink them.
- Add `Article` structured data (JSON-LD) per §32 with `author`, `reviewedBy`, and `datePublished` once the reviewer fields are filled — the `schema-markup`/`generate-schema` skill can generate this.
- Set `og:title`/`og:description` from the meta title/description; generate a per-article OG image (the branded SVG can be exported to a 1200×630 PNG).
- Do not publish with `reviewer: TBD`; the meta descriptions avoid claims, but the on-page health content still requires expert sign-off per §8.2.
