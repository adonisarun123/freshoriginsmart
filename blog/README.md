# Fresh Origins — Learn / Blog Content Pack

17 SEO-ready blog posts for `/learn/[article-slug]`, written to the Fresh Origins verbal brand guidelines (§6–8) and article-fields spec (§23.2).

## Compliance notes (read before publishing)
- All posts use **Level A** (factual) and **Level C** (contextual wellness) language only. No Level D medical claims (cure/treat/reverse/lower cholesterol/etc.).
- Every post carries the standard **"food, not medicine"** disclaimer.
- Frontmatter includes `author`, `reviewer`, `reviewer_credential`, `reviewed_at`, `next_review_at`, `references`, `health_goal_tags`, `product_links`. **Reviewer names/dates are placeholders (`TBD`)** — a qualified nutritionist/dietitian must complete expert review and fill these before the CMS status moves to `published`.
- Each post has an inline **branded SVG illustration** (usable now) and a **`PHOTO SLOT`** block with art direction + alt text, per photography spec (§14), to be replaced with real photography later.

## Index, SEO & assets
- `article-schema.json` — 17 `Article` JSON-LD objects keyed by slug (inject as `<script type="application/ld+json">`).
- `og/{slug}.png` — 17 branded Open Graph images (1200×630). Deploy to `/public/og/` so they resolve at `freshoriginsmart.com/og/{slug}.png` (matches the `image` field in `article-schema.json`).

## Index & SEO
- `_learn-index.md` — the `/learn` landing page grouping all 17 posts into four clusters, with links to matching `/shop` and `/products` pages.
- `seo-metadata.md` — human-readable meta titles, descriptions, secondary keywords, and the internal-linking map.
- `seo-metadata.json` — machine-readable metadata for `generateMetadata()` + internal-linking map (validated; all links resolve).

## Posts

### Millets deep-dive
1. `millet-foxtail.md` — Foxtail Millet (Thinai / Kangni)
2. `millet-barnyard.md` — Barnyard Millet (Kuthiraivali / Sanwa)
3. `millet-little.md` — Little Millet (Samai / Kutki)
4. `millet-kodo.md` — Kodo Millet (Varagu / Kodra)
5. `millet-proso.md` — Proso Millet (Panivaragu / Chena)
6. `millet-jowar-sorghum.md` — Jowar / Sorghum
7. `millet-bajra-pearl.md` — Bajra / Pearl Millet

### Traditional rice
8. `rice-traditional-red.md` — Traditional Red Rice
9. `rice-black.md` — Black Rice
10. `rice-brown-heritage.md` — Brown & Heritage Rice

### Ready-to-cook blends
11. `blend-metabolic-balance-khichdi.md` — Metabolic Balance Khichdi
12. `blend-protein-fibre-adai.md` — Protein & Fibre Adai Mix
13. `blend-heritage-gut-fibre-kanji.md` — Heritage Gut-Fibre Kanji Mix
14. `blend-gluten-free-roti-mix.md` — Gluten-Free Protein & Fibre Roti Mix

### How-to pillars
15. `howto-white-rice-to-millets.md` — Switching from White Rice to Millets
16. `howto-pairing-grains-pulses.md` — Pairing Grains and Pulses
17. `howto-fibre-rich-meal-planning.md` — Fibre-Rich Meal Planning
