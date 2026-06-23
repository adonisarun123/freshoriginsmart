# Adding product photos

The app shows a real packshot on the shop cards, product page, and cart when a
product has an `image_url`. Products without one fall back to the brand SVG
illustration automatically — so nothing breaks if an image is missing.

Images are hosted on **ImageKit** (`ik.imagekit.io/freshoriginsmart/...`). The
database stores the **full image URL**, and the app uses it directly. (The
resolver also accepts Supabase Storage paths or `/public` paths if you ever
switch hosts.)

## Current 4 packshots

| Product (slug)                          | Image URL                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `metabolic-balance-khichdi`             | `https://ik.imagekit.io/freshoriginsmart/Products/kichdi-fresh-origins.png`  |
| `protein-and-fibre-adai-mix`            | `https://ik.imagekit.io/freshoriginsmart/Products/adai-mix-fresh-origins.png` |
| `gluten-free-protein-and-fibre-roti-mix`| `https://ik.imagekit.io/freshoriginsmart/Products/roti-mix-fresh-origins.png` |
| `heritage-gut-fibre-kanji-mix`          | `https://ik.imagekit.io/freshoriginsmart/Products/kanji-mix-fresh-origins.png`|

These are set by migration **`0010_product_images.sql`** (also folded into
`setup_all.sql`). If the column already exists, just run the four `update`
statements from that file in the Supabase SQL Editor.

## Allowed image host

`next.config.mjs` whitelists `ik.imagekit.io/freshoriginsmart/**` under
`images.remotePatterns`. If you move images to a new host/account, add that host
there too — otherwise `next/image` will refuse to load it.

## Adding more later

1. Upload the file to ImageKit and copy its full URL.
2. In the Supabase SQL Editor:
   `update products set image_url = '<full-url>' where slug = '<product-slug>';`

No redeploy needed for new images on an already-allowed host. (A redeploy *is*
needed if you add a brand-new host to `next.config.mjs`.)
