# Adding product photos

The app shows a real packshot on the shop cards, product page, and cart when a
product has an `image_url`. Products without one fall back to the brand SVG
illustration automatically — so nothing breaks if an image is missing.

Images live in a **public Supabase Storage bucket** called `product-images`.
The database stores just the file name (e.g. `metabolic-balance-khichdi.png`);
the app builds the full public URL from `NEXT_PUBLIC_SUPABASE_URL` at render time.

## One-time: create the bucket

1. Supabase dashboard → **Storage** → **New bucket**.
2. Name it exactly `product-images`.
3. Turn **Public bucket** ON (so images load without auth). Create.

## Upload the 4 packshots

Drag the 4 files into the bucket. **File names must match exactly** (lowercase,
`.png`):

| Product (slug)                              | File name to upload                          |
| ------------------------------------------- | -------------------------------------------- |
| Metabolic Balance Khichdi                   | `metabolic-balance-khichdi.png`              |
| Protein & Fibre Adai Mix                    | `protein-and-fibre-adai-mix.png`             |
| Gluten-Free Protein & Fibre Roti Mix        | `gluten-free-protein-and-fibre-roti-mix.png` |
| Heritage Gut-Fibre Kanji Mix                | `heritage-gut-fibre-kanji-mix.png`           |

> If you upload with different names, either rename them to match the table, or
> change the `image_url` value for that product (see below).

## Tell the database which file belongs to which product

Run migration **`0010_product_images.sql`** once (Supabase → SQL Editor → paste
the file contents → Run). It adds the `image_url` column and sets the 4 values
above. If you've already run the full `setup_all.sql`, it now includes 0010 too.

## Verifying

Open `https://<your-project-ref>.supabase.co/storage/v1/object/public/product-images/metabolic-balance-khichdi.png`
in a browser — you should see the image. Then reload the live site; the 4
products will show photos, the other 2 keep the illustration until you add theirs.

## Adding more later

1. Upload `your-file.png` to the `product-images` bucket.
2. In SQL Editor: `update products set image_url = 'your-file.png' where slug = '<product-slug>';`

That's it — no redeploy needed, since images are served from Storage, not the app.
